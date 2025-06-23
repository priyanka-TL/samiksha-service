/**
 * name : programs/helper.js
 * author : Akash
 * created-date : 20-Jan-2019
 * Description : Programs helper functionality
 */

// Dependencies
const timeZoneDifference = process.env.TIMEZONE_DIFFRENECE_BETWEEN_LOCAL_TIME_AND_UTC;
const validateEntity = process.env.VALIDATE_ENTITIES;
const userService = require(ROOT_PATH + '/generics/services/users');
const programsQueries = require(DB_QUERY_BASE_PATH + '/programs');
const programUsersQueries = require(DB_QUERY_BASE_PATH + '/programUsers');
const entityManagementService = require(ROOT_PATH + '/generics/services/entity-management');

/**
 * ProgramsHelper
 * @class
 */
module.exports = class ProgramsHelper {
  /**
   * List program
   * @method
   * @name list
   * @param {Number} pageNo - page no.
   * @param {Number} pageSize - page size.
   * @param {String} searchText - text to search.
   *  @param {Object} filter - filter.
   *  @param {Array} projection - projection.
   * @param {Object} tenantFilter - tenant filter.
   * @returns {Object} - Programs list.
   */

  static list(filter = {}, projection, pageNo = '', pageSize = '', searchText,tenantFilter) {
    return new Promise(async (resolve, reject) => {
      try {
        let programDocument = [];
        let orgIdArr = [];
        if (tenantFilter.orgId) {
          orgIdArr = Array.isArray(tenantFilter.orgId)
            ? tenantFilter.orgId
            : [tenantFilter.orgId];
        }

        let matchQuery = { status: messageConstants.common.ACTIVE_STATUS,
          tenantId:tenantFilter.tenantId,
          "scope.organizations": {
            "$in": ["ALL", ...orgIdArr]
          },
         };

        if (Object.keys(filter).length > 0) {
          matchQuery = _.merge(matchQuery, filter);
        }

        if (searchText !== '') {
          let searchData = [
            {
              externalId: new RegExp(searchText, 'i'),
            },
            {
              name: new RegExp(searchText, 'i'),
            },
            {
              description: new RegExp(searchText, 'i'),
            }
          ];

          if(matchQuery['$and']){
            matchQuery['$and'].push({ $or: searchData });
          }else{
            matchQuery['$or'] = searchData;
          }

        }

        let sortQuery = {
          $sort: { createdAt: -1 },
        };

        let projection1 = {};

        if (projection && projection.length > 0) {
          projection.forEach((projectedData) => {
            if (projectedData === messageConstants.common.OBEJECT_TYPE) {
              projection1[projectedData] = messageConstants.common.PROGRAM.toLowerCase();
            } else {
              projection1[projectedData] = 1;
            }
          });
        } else {
          projection1 = {
            description: 1,
            externalId: 1,
            isAPrivateProgram: 1,
          };
        }

        let facetQuery = {};
        facetQuery['$facet'] = {};

        facetQuery['$facet']['totalCount'] = [{ $count: 'count' }];

        if (pageSize === '' && pageNo === '') {
          facetQuery['$facet']['data'] = [{ $skip: 0 }];
        } else {
          facetQuery['$facet']['data'] = [{ $skip: pageSize * (pageNo - 1) }, { $limit: pageSize }];
        }

        let projection2 = {};
        projection2['$project'] = {
          data: 1,
          count: {
            $arrayElemAt: ['$totalCount.count', 0],
          },
        };
        programDocument.push({ $match: matchQuery }, sortQuery, { $project: projection1 }, facetQuery, projection2);

        let programDocuments = await programsQueries.getAggregate(programDocument);
        return resolve({
          success: true,
          message: messageConstants.apiResponses.PROGRAM_LIST,
          data: programDocuments[0],
        });
      } catch (error) {
        return resolve({
          success: false,
          message: error.message,
          data: [],
        });
      }
    });
  }

  /**
   * Create program
   * @method
   * @name create
   * @param {Array} data
   * @param {Boolean} checkDate this is true for when its called via API calls
   * @returns {JSON} - create program.
   */

  static create(data, checkDate = false) {
    return new Promise(async (resolve, reject) => {
      try {
        let programData = {
          externalId: data.externalId,
          name: data.name,
          description: data.description,
          owner: data.userId,
          createdBy: data.userId,
          updatedBy: data.userId,
          isDeleted: false,
          status: 'active',
          resourceType: ['Program'],
          language: ['English'],
          keywords: ['keywords 1', 'keywords 2'],
          concepts: [],
          createdFor: data.createdFor,
          rootOrganisations: data.rootOrganisations,
          imageCompression: {
            quality: 10,
          },
          components: [],
          isAPrivateProgram: data.isAPrivateProgram ? data.isAPrivateProgram : false,
          tenantId:data.tenantData.tenantId,
          orgId:data.tenantData.orgId[0]
        };

        // Adding Start and End date in program document
        if (checkDate) {
          if (data.hasOwnProperty('endDate')) {
            data.endDate = gen.utils.getEndDate(data.endDate, timeZoneDifference);
          }
          if (data.hasOwnProperty('startDate')) {
            data.startDate = gen.utils.getStartDate(data.startDate, timeZoneDifference);
          }
        }

        _.assign(programData, {
          ...data,
        });
        programData = _.omit(programData, ['scope', 'userId']);
        //creatind Program document
        let program = await programsQueries.createProgram(programData);

        if (!program._id) {
          throw {
            message: messageConstants.apiResponses.PROGRAM_NOT_CREATED,
          };
        }

        //if scope exits adding scope to programDocument
        if (data.scope) {
          data.scope.organizations = data.tenantData.orgId;
          let programScopeUpdated = await this.setScope(program._id, data.scope);

          if (!programScopeUpdated.success) {
            throw {
              message: messageConstants.apiResponses.SCOPE_NOT_UPDATED_IN_PROGRAM,
            };
          }
        }

        return resolve(program);
      } catch (error) {
        return reject(error);
      }
    });
  }

  /**
   * Update program
   * @method
   * @name update
   * @param {String} programId  - program id.
   * @param {Array} data
   * @param {String} userId
   * @param {Boolean} checkDate -this is true for when its called via API calls
   * @param {Object} tenantData - tenant data
   * @returns {JSON}            - update program.
   */

  static update(programId, data, userId, checkDate = false,tenantData) {
    return new Promise(async (resolve, reject) => {
      try {
        data.updatedBy = userId;
        data.updatedAt = new Date();
        //convert components to objectedIds
        if (data.components && data.components.length > 0) {
          data.components = data.components.map((component) => gen.utils.convertStringToObjectId(component));
        }

        // Updating start and end date
        if (checkDate) {
          if (data.hasOwnProperty('endDate')) {
            data.endDate = gen.utils.getEndDate(data.endDate, timeZoneDifference);
          }
          if (data.hasOwnProperty('startDate')) {
            data.startDate = gen.utils.getStartDate(data.startDate, timeZoneDifference);
          }
        }
        //Find and update the program Document
        let program = await programsQueries.findOneAndUpdate(
          {
            _id: programId,
            tenantId:tenantData.tenantId,
          },
          { $set: _.omit(data, ['scope','tenantId']) },
          { new: true }
        );

        if (!program) {
          throw {
            message: messageConstants.apiResponses.PROGRAM_NOT_UPDATED,
          };
        }
        // If the request body contains scope data, it will be updated as follows
        if (data.scope) {
          if(!data.scope.organizations){
            data.scope.organizations = tenantData.orgId
          }
          let programScopeUpdated = await this.setScope(programId, data.scope);

          if (!programScopeUpdated.success) {
            throw {
              message: messageConstants.apiResponses.SCOPE_NOT_UPDATED_IN_PROGRAM,
            };
          }
        }

        return resolve({
          success: true,
          message: messageConstants.apiResponses.PROGRAMS_UPDATED,
          data: {
            _id: programId,
          },
        });
      } catch (error) {
        return resolve({
          success: false,
          message: error.message,
          data: {},
        });
      }
    });
  }

  /**
   * Add roles in program.
   * @method
   * @name addRolesInScope
   * @param {String} programId - Program Id.
   * @param {Array} roles - roles data.
   * @param {Object} tenantData - tenant data
   * @returns {JSON} - Added roles data.
   */

  static addRolesInScope(programId, roles,tenantData) {
    return new Promise(async (resolve, reject) => {
      try {
        // check if program exits in program collection and also it has scope
        let programData = await programsQueries.programDocuments(
          {
            _id: programId,
            scope: { $exists: true },
            isAPrivateProgram: false,
            tenantId:tenantData.tenantId
          },
          ['_id']
        );

        if (!(programData.length > 0)) {
          return resolve({
            status: httpStatusCode.bad_request.status,
            message: messageConstants.apiResponses.PROGRAM_NOT_FOUND,
          });
        }

        let updateQuery = {};

        // If the request body has roles set to "all", add "all" as a role; otherwise, get the roles from userRoles to update scope.roles
        if (Array.isArray(roles) && roles.length > 0) {
          let programDocumentRecord = await programsQueries.programDocuments({ _id: programId }, ['scope.roles']);
          let currentRoles = programDocumentRecord[0].scope.roles;

          let currentRolesSet = new Set(currentRoles);
          let rolesSet = new Set(roles);

          rolesSet.forEach((role) => {
            if (role != '' && role != 'all') currentRolesSet.add(role);
          });

          currentRoles = Array.from(currentRolesSet);

          // remove the "all" from the scope.roles and update the new roles
          await programsQueries.findOneAndUpdate(
            {
              _id: programId,
            },
            {
              $pull: { 'scope.roles': { code: messageConstants.common.ALL_ROLES } },
            },
            { new: true }
          );

          updateQuery['$addToSet'] = {
            'scope.roles': { $each: currentRoles },
          };
        } else {
          // set  "all" as the roles and update the scope.roles
          if (roles === messageConstants.common.ALL_ROLES) {
            updateQuery['$set'] = {
              'scope.roles': [{ code: messageConstants.common.ALL_ROLES }],
            };
          }
        }

        let updateProgram = await programsQueries.findOneAndUpdate(
          {
            _id: programId,
          },
          updateQuery,
          { new: true }
        );
        if (!updateProgram || !updateProgram._id) {
          throw {
            message: messageConstants.apiResponses.PROGRAM_NOT_UPDATED,
          };
        }

        return resolve({
          message: messageConstants.apiResponses.ROLES_ADDED_IN_PROGRAM,
          success: true,
        });
      } catch (error) {
        return resolve({
          success: false,
          status: error.status ? error.status : httpStatusCode['internal_server_error'].status,
          message: error.message,
        });
      }
    });
  }

  /**
   * Add entities in program.
   * @method
   * @name addEntitiesInScope
   * @param {String} programId - Program Id.
	 * @param {Object} bodyData - body data.
	 * @param {Object} userDetails - User Details
	 * @param {Boolean} organizations - If organizations is Present.
   * @returns {JSON} - Added entities data.
   */

  static addEntitiesInScope(programId, bodyData,userDetails,organizations) {
    return new Promise(async (resolve, reject) => {
      try {
        let tenantId = userDetails.tenantAndOrgInfo.tenantId
				let orgId = userDetails.tenantAndOrgInfo.orgId[0]
        let programData = await programsQueries.programDocuments(
          {
            _id: programId,
            scope: { $exists: true },
            isAPrivateProgram: false,
            tenantId: tenantId,
            orgId: orgId,
          },
          ['_id', 'scope']
        );

        if (!(programData.length > 0)) {
          throw {
            message: messageConstants.apiResponses.PROGRAM_NOT_FOUND,
          };
        }

				 // Build the $addToSet updateObject
         let updateObject = { $addToSet: {} }
         let validationExcludedEntitiesKeys = []
         if (
           userDetails.roles.includes(messageConstants.common.ADMIN_ROLE) ||
           userDetails.roles.includes(messageConstants.common.TENANT_ADMIN)
         ) {
           // Fetch tenant details to validate organization codes
           let tenantDetails = await userService.fetchTenantDetails(tenantId, userDetails.userToken);
           if (tenantDetails.success !== true || !tenantDetails.data || !tenantDetails.data.meta) {
             return resolve({
               success: false,
               message: messageConstants.apiResponses.FAILED_TO_FETCH_TENANT_DETAILS,
             })
           }
           if (
             tenantDetails.data.meta.validationExcludedScopeKeys &&
             Array.isArray(tenantDetails.data.meta.validationExcludedScopeKeys) &&
             tenantDetails.data.meta.validationExcludedScopeKeys.length > 0
           ) {
             // Fetch tenant details (will include valid org codes & validationExcludedScopeKeys)
             validationExcludedEntitiesKeys.push(...tenantDetails.data.meta.validationExcludedScopeKeys);
           }

           if (gen.utils.convertStringToBoolean(organizations)) {
             // Extract all valid organization codes from the tenant's config
             const validOrgCodes = tenantDetails.data.organizations.map((org) => org.code);
 
             // Check if all provided organization codes are valid
             const isValid = bodyData.organizations.every((orgCode) => validOrgCodes.includes(orgCode));
             // If valid, include them in the update object under scope.organizations
             if (isValid) {
               updateObject.$addToSet[`scope.organizations`] = { $each: bodyData.organizations };
             }
           }
         }
 
         // This logic we need to re-look --------------------------------------------
         // if (solutionData[0].scope !== programData[0].scope) {
         // 	let checkEntityInParent = await entitiesService.entityDocuments(
         // 		{
         // 			_id: programData[0].scope.entities,- state
         // 			[`groups.${solutionData[0].scope.entityType}`]: entities,- district
         // 		},
         // 		['_id']
         // 	)
         // 	if (!checkEntityInParent.success) {
         // 		throw {
         // 			message: messageConstants.apiResponses.ENTITY_NOT_EXISTS_IN_PARENT,
         // 		}
         // 	}
         // }
 
         // Extract entities from the request body
         let entities = bodyData.entities
         let groupedEntities = {}
         let keysForValidation = []
         let keysExcluded = []
 
         // Classify keys based on ALL presence or validationExcludedEntitiesKeys
         for (const [entityType, values] of Object.entries(entities)) {
           if (Array.isArray(values) && values.includes(messageConstants.common.ALL_SCOPE_VALUE)) {
             // If "ALL" present, skip validation and directly assign
             groupedEntities[entityType] = [messageConstants.common.ALL_SCOPE_VALUE];
           } else if (validationExcludedEntitiesKeys.includes(entityType)) {
             // Excluded from validation
             groupedEntities[entityType] = values
           } else {
             // Needs validation
             keysForValidation.push(entityType)
           }
         }
 
         // Validate only if needed
         let entitiesToValidate = keysForValidation.flatMap((key) => entities[key])
         if (entitiesToValidate.length > 0) {
          
           let entitiesData = await entityManagementService.entityDocuments(
             {
               _id: { $in: entitiesToValidate },
               tenantId:tenantId,
               orgId:orgId,
             },
             ['_id', 'entityType']
           )
 
           if (!entitiesData.success || !entitiesData.data.length > 0) {
             throw {
               message: messageConstants.apiResponses.ENTITIES_NOT_FOUND,
             }
           }
 
           entitiesData = entitiesData.data
           for (const entity of entitiesData) {
             if (!groupedEntities[entity.entityType]) {
               groupedEntities[entity.entityType] = [];
             }
             groupedEntities[entity.entityType].push(entity._id);
           }
         }
 
         // Construct $addToSet object
         for (const [type, ids] of Object.entries(groupedEntities)) {
           updateObject.$addToSet[`scope.${type}`] = { $each: ids }
         }
         // Handle organizations
         if (Array.isArray(bodyData.organizations)) {
           if (bodyData.organizations.includes(messageConstants.common.ALL_SCOPE_VALUE)) {
             updateObject.$addToSet[`scope.organizations`] = { $each: [messageConstants.common.ALL_SCOPE_VALUE] }
           } else if (gen.utils.convertStringToBoolean(organizations)) {
             const validOrgCodes = tenantDetails.data.organizations.map((org) => org.code);
             const isValid = bodyData.organizations.every((orgCode) => validOrgCodes.includes(orgCode));
             if (isValid) {
               updateObject.$addToSet[`scope.organizations`] = { $each: bodyData.organizations };
             } else {
               return resolve({
                 success: false,
                 message: messageConstants.apiResponses.INVALID_ORGANIZATION,
               });
             }
           }
         }

        let updateProgram = await programsQueries.findOneAndUpdate(
          {
            _id: programId,
          },
          updateObject,
          { new: true }
        );
        if (!updateProgram || !updateProgram._id) {
          throw {
            message: messageConstants.apiResponses.PROGRAM_NOT_UPDATED,
          };
        }

        return resolve({
          message: messageConstants.apiResponses.ENTITIES_ADDED_IN_PROGRAM,
          success: true,
        });
      } catch (error) {
        return resolve({
          success: false,
          status: error.status ? error.status : httpStatusCode['internal_server_error'].status,
          message: error.message,
        });
      }
    });
  }

  /**
   * remove roles in program.
   * @method
   * @name removeRolesInScope
   * @param {String} programId - Program Id.
   * @param {Array} roles - roles data.
   * @param {Object} tenantData - tenant data
   * @returns {JSON} - Added roles data.
   */

  static removeRolesInScope(programId, roles,tenantData) {
    return new Promise(async (resolve, reject) => {
      try {
        let programData = await programsQueries.programDocuments(
          {
            _id: programId,
            scope: { $exists: true },
            isAPrivateProgram: false,
            tenantId:tenantData.tenantId
          },
          ['_id']
        );

        if (!(programData.length > 0)) {
          return resolve({
            status: httpStatusCode.bad_request.status,
            message: messageConstants.apiResponses.PROGRAM_NOT_FOUND,
          });
        }
        // Check if roles array
        if (Array.isArray(roles) && roles.length > 0) {
          let updateProgram = await programsQueries.findOneAndUpdate(
            {
              _id: programId,
            },
            {
              $pull: { 'scope.roles': { $in: roles } },
            },
            { new: true }
          );
          if (!updateProgram || !updateProgram._id) {
            throw {
              message: messageConstants.apiResponses.PROGRAM_NOT_UPDATED,
            };
          }
        } else {
          return resolve({
            status: httpStatusCode.bad_request.status,
            message: messageConstants.apiResponses.INVALID_ROLE_CODE,
          });
        }

        return resolve({
          message: messageConstants.apiResponses.ROLES_REMOVED_IN_PROGRAM,
          success: true,
        });
      } catch (error) {
        return resolve({
          success: false,
          status: error.status ? error.status : httpStatusCode['internal_server_error'].status,
          message: error.message,
        });
      }
    });
  }

  /**
   * remove entities in program scope.
   * @method
   * @name removeEntitiesInScope
   * @param {String} programId - Program Id.
	 * @param {Object} bodyData - body data.
	 * @param {Object} userDetails - User Details
	 * @param {Boolean} organizations - If organizations is Present.
   * @returns {JSON} - Removed entities data.
   */

  static removeEntitiesInScope(programId, bodyData, userDetails, organizations) {
    return new Promise(async (resolve, reject) => {
      try {
        let tenantId = userDetails.tenantAndOrgInfo.tenantId
				let orgId = userDetails.tenantAndOrgInfo.orgId[0]
        let programData = await programsQueries.programDocuments(
          {
            _id: programId,
            scope: { $exists: true },
            isAPrivateProgram: false,
            tenantId: tenantId,
						orgId: orgId,
          },
          ['_id', 'scope.entityType']
        );

        if (!(programData.length > 0)) {
          throw {
            message: messageConstants.apiResponses.PROGRAM_NOT_FOUND,
          };
        }
				// This object will hold the update instruction
				let updateObject = { $pull: {} }
        let validationExcludedEntitiesKeys = []

        if (
          userDetails.roles.includes(messageConstants.common.ADMIN_ROLE) ||
          userDetails.roles.includes(messageConstants.common.TENANT_ADMIN)
        ) {
          let tenantDetails = await userService.fetchTenantDetails(tenantId, userDetails.userToken)
          if (tenantDetails.success !== true || !tenantDetails.data || !tenantDetails.data.meta) {
            return resolve({
              success: false,
              message: messageConstants.apiResponses.FAILED_TO_FETCH_TENANT_DETAILS,
            })
          }

          if (
            tenantDetails.data.meta.validationExcludedScopeKeys &&
            Array.isArray(tenantDetails.data.meta.validationExcludedScopeKeys) &&
            tenantDetails.data.meta.validationExcludedScopeKeys.length > 0
          ) {
            validationExcludedEntitiesKeys.push(...tenantDetails.data.meta.validationExcludedScopeKeys)
          }
          if (Array.isArray(bodyData.organizations)) {
            if (bodyData.organizations.includes(messageConstants.common.ALL_SCOPE_VALUE)) {
              updateObject.$pull[`scope.organizations`] = { $in: [messageConstants.common.ALL_SCOPE_VALUE] }
            } else if (gen.utils.convertStringToBoolean(organizations)) {
              const validOrgCodes = tenantDetails.data.organizations.map((org) => org.code)
              const isValid = bodyData.organizations.every((orgCode) => validOrgCodes.includes(orgCode))
              if (isValid) {
                updateObject.$pull[`scope.organizations`] = { $in: bodyData.organizations }
              } else {
                return resolve({
                  success: false,
                  message: messageConstants.apiResponses.INVALID_ORGANIZATION,
                });
              }
            }
          }
        }

        let entities = bodyData.entities || {};
        let groupedEntities = {}
        let keysForValidation = []
        let keysExcluded = []
        let allEntitiesMap = {}; // Tracks which keys have "ALL" for final pull inclusion
        
        // Separate keys that need validation vs. can skip it
        for (const key of Object.keys(entities)) {
          const values = entities[key];
          if (Array.isArray(values) && values.includes(messageConstants.common.ALL_SCOPE_VALUE)) {
            allEntitiesMap[key] = true; // Mark this to include "ALL" in final pull
          }
        
          if (
            validationExcludedEntitiesKeys &&
            validationExcludedEntitiesKeys.includes(key)
          ) {
            keysExcluded.push(key); // Skip validation for these
          } else {
            keysForValidation.push(key);
          }
        }
        
        // Collect IDs to validate (excluding "ALL")
        let idsToValidate = keysForValidation.flatMap((key) =>
          entities[key].filter((id) => id !== messageConstants.common.ALL_SCOPE_VALUE)
        );
        
        // Validate only if needed
        if (idsToValidate.length > 0) {
          let entitiesData = await entityManagementService.entityDocuments(
            {
              _id: { $in: idsToValidate },
              tenantId:tenantId,
              orgId:orgId,
            },
            ['_id', 'entityType']
          );
        
          if (!entitiesData.success || !entitiesData.data.length > 0) {
            throw {
              message: messageConstants.apiResponses.ENTITIES_NOT_FOUND,
            };
          }
        
          for (const entity of entitiesData.data) {
            if (!groupedEntities[entity.entityType]) {
              groupedEntities[entity.entityType] = [];
            }
            groupedEntities[entity.entityType].push(entity._id);
          }
        }
        
        // Add excluded keys directly
        for (const key of keysExcluded) {
          groupedEntities[key] = entities[key];
        }
        
        // Add back "ALL" where it was originally requested
        for (const key of Object.keys(allEntitiesMap)) {
          if (!groupedEntities[key]) groupedEntities[key] = [];
          if (!groupedEntities[key].includes(messageConstants.common.ALL_SCOPE_VALUE)) {
            groupedEntities[key].unshift(messageConstants.common.ALL_SCOPE_VALUE);
          }
        }
        
        // Build the $pull object
        for (const [type, ids] of Object.entries(groupedEntities)) {
          updateObject.$pull[`scope.${type}`] = { $in: ids };
        }
        
        // Handle organizations
        if (Array.isArray(bodyData.organizations)) {
          if (bodyData.organizations.includes(messageConstants.common.ALL_SCOPE_VALUE)) {
            updateObject.$pull[`scope.organizations`] = { $in: [messageConstants.common.ALL_SCOPE_VALUE] };
          } else if (gen.utils.convertStringToBoolean(organizations)) {
            const validOrgCodes = tenantDetails.data.organizations.map((org) => org.code);
            const isValid = bodyData.organizations.every((orgCode) => validOrgCodes.includes(orgCode));
            if (isValid) {
              updateObject.$pull[`scope.organizations`] = { $in: bodyData.organizations };
            } else {
              return resolve({
                success: false,
                message: messageConstants.apiResponses.INVALID_ORGANIZATIONS,
              });
            }
          }
        }

        let updateProgram = await programsQueries.findOneAndUpdate(
					{
						_id: programId,
					},
					updateObject,
					{ new: true }
				)
        if (!updateProgram || !updateProgram._id) {
          throw {
            message: messageConstants.apiResponses.PROGRAM_NOT_UPDATED,
          };
        }

        return resolve({
          message: messageConstants.apiResponses.ENTITIES_REMOVED_IN_PROGRAM,
          success: true,
        });
      } catch (error) {
        return resolve({
          success: false,
          status: error.status ? error.status : httpStatusCode['internal_server_error'].status,
          message: error.message,
        });
      }
    });
  }

  /**
   * Program details.
   * @method
   * @name details
   * @param {String} programId - Program Id.
   * @param {Object} tenantData - tenant data
   * @returns {Object} - Details of the program.
   */

  static details(programId,tenantData) {
    return new Promise(async (resolve, reject) => {
      try {
        // Get the details or dump of the program based on the programid
        let programData = await programsQueries.programDocuments({
          _id: programId,
          tenantId:tenantData.tenantId
        });

        if (!(programData.length > 0)) {
          return resolve({
            status: httpStatusCode.bad_request.status,
            message: messageConstants.apiResponses.PROGRAM_NOT_FOUND,
          });
        }

        return resolve({
          message: messageConstants.apiResponses.PROGRAMS_FETCHED,
          success: true,
          data: programData[0],
        });
      } catch (error) {
        return resolve({
          success: false,
          status: error.status ? error.status : httpStatusCode['internal_server_error'].status,
          message: error.message,
        });
      }
    });
  }

  /**
   * Program join.
   * @method
   * @name join
   * @param {String} programId - Program Id.
   * @param {Object} data - body data (can include isResourse flag && userRoleInformation).
   * @param {String} userId - Logged in user id.
   * @param {String} userToken - User token
   * @param {String} [appName = ""] - App Name.
   * @param {String} [appVersion = ""] - App Version.
   * @param {Object} tenantData - tenant data
   * @param {Boolean} callConsetAPIOnBehalfOfUser - required to call consent api or not
   * @returns {Object} - Details of the program join.
   */

  static join(programId, data, userId, userToken,appName = '', appVersion = '', callConsetAPIOnBehalfOfUser = false,tenantData) {
    return new Promise(async (resolve, reject) => {
      try {
        let pushProgramUsersDetailsToKafka = false;
        //Using programId fetch program details. Also checking the program status in the query.
        let programData = await programsQueries.programDocuments(
          {
            _id: programId,
            status: messageConstants.common.ACTIVE_STATUS,
            isDeleted: false,
            tenantId:tenantData.tenantId
          },
          ['name', 'externalId', 'requestForPIIConsent', 'rootOrganisations']
        );

        if (!(programData.length > 0)) {
          throw {
            status: httpStatusCode.bad_request.status,
            message: messageConstants.apiResponses.PROGRAM_NOT_FOUND,
          };
        }
        let programUsersData = {};
        let update = {};

        // check if user already joined for program or not
        const programUsersDetails = await programUsersQueries.programUsersDocument(
          {
            userId: userId,
            programId: programId,
          },
          ['_id', 'consentShared']
        );
        // if user not joined for program. we have add more key values to programUsersData
        if (!(programUsersDetails.length > 0)) {
          // Fetch user profile information by calling elevate-user  read api through interface service.
          // !Important check specific fields of userProfile.
          let userProfile = await userService.profile(userId,userToken);
          if (
            !userProfile.success ||
            !userProfile.data
            // !userProfile.data.profileUserTypes ||
            // !(userProfile.data.profileUserTypes.length > 0) ||
            // !userProfile.data.userLocations ||
            // !(userProfile.data.userLocprofileUserTypesations.length > 0)
          ) {
            throw {
              status: httpStatusCode.bad_request.status,
              message: messageConstants.apiResponses.PROGRAM_JOIN_FAILED,
            };
          }
          programUsersData = {
            programId: programId,
            userRoleInformation: data.userRoleInformation,
            userId: userId,
            userProfile: userProfile.data,
            resourcesStarted: false,
          };
          if (appName != '') {
            programUsersData['appInformation.appName'] = appName;
          }
          if (appVersion != '') {
            programUsersData['appInformation.appVersion'] = appVersion;
          }

          //For internal calls add consent using sunbird api
          // if (
          //   callConsetAPIOnBehalfOfUser &&
          //   programData[0].hasOwnProperty('requestForPIIConsent') &&
          //   programData[0].requestForPIIConsent === true
          // ) {
          //   if (!programData[0].rootOrganisations || !(programData[0].rootOrganisations.length > 0)) {
          //     throw {
          //       message: messageConstants.apiResponses.PROGRAM_JOIN_FAILED,
          //       status: httpStatusCode.bad_request.status,
          //     };
          //   }
          //   let userConsentRequestBody = {
          //     request: {
          //       consent: {
          //         status: messageConstants.common.REVOKED,
          //         userId: userProfile.data.id,
          //         consumerId: programData[0].rootOrganisations[0],
          //         objectId: programId,
          //         objectType: messageConstants.common.PROGRAM,
          //       },
          //     },
          //   };
          //   let consentResponse = await userService.setUserConsent(userToken, userConsentRequestBody);

          //   if (!consentResponse.success) {
          //     throw {
          //       message: messageConstants.apiResponses.PROGRAM_JOIN_FAILED,
          //       status: httpStatusCode.bad_request.status,
          //     };
          //   }
          // }
        }

        // if requestForPIIConsent Is false and user not joined program till now then set pushProgramUsersDetailsToKafka = true;
        // if requestForPIIConsent == true and data.consentShared value is true which means user interacted with the consent popup set pushProgramUsersDetailsToKafka = true;
        // if programUsersDetails[0].consentShared === true which means the data is already pushed to Kafka once
        if (
          (programData[0].hasOwnProperty('requestForPIIConsent') &&
            programData[0].requestForPIIConsent === false &&
            !(programUsersDetails.length > 0)) ||
          (programData[0].hasOwnProperty('requestForPIIConsent') &&
            programData[0].requestForPIIConsent === true &&
            data.hasOwnProperty('consentShared') &&
            data.consentShared == true &&
            ((programUsersDetails.length > 0 && programUsersDetails[0].consentShared === false) ||
              !(programUsersDetails.length > 0)))
        ) {
          pushProgramUsersDetailsToKafka = true;
        }

        //create or update query
        const query = {
          programId: programId,
          userId: userId,
        };
        //if a resource is started
        if (data.isResource) {
          programUsersData.resourcesStarted = true;
        }
        //if user interacted with the consent-popup
        if (data.hasOwnProperty('consentShared')) {
          programUsersData.consentShared = data.consentShared;
        }
        update['$set'] = programUsersData;

        // add record to programUsers collection
        let joinProgram = await programUsersQueries.updateProgramUserDocument(query, update, {
          new: true,
          upsert: true,
        });

        if (!joinProgram._id) {
          throw {
            message: messageConstants.apiResponses.PROGRAM_JOIN_FAILED,
            status: httpStatusCode.bad_request.status,
          };
        }

        let joinProgramDetails = joinProgram;

        // if (pushProgramUsersDetailsToKafka) {
        //   joinProgramDetails.programName = programData[0].name;
        //   joinProgramDetails.programExternalId = programData[0].externalId;
        //   joinProgramDetails.requestForPIIConsent =
        //     programData[0].requestForPIIConsent;
        //   //  push programUsers details to kafka
        //   await kafkaProducersHelper.pushProgramUsersToKafka(
        //     joinProgramDetails
        //   );
        // }

        return resolve({
          message: messageConstants.apiResponses.JOINED_PROGRAM,
          success: true,
          data: {
            _id: joinProgram._id,
          },
        });
      } catch (error) {
        return resolve({
          success: false,
          status: error.status ? error.status : httpStatusCode['internal_server_error'].status,
          message: error.message,
        });
      }
    });
  }
  /**
   * set scope in program
   * @method
   * @name setScope
   * @param {String} programId - program id.
   * @param {Object} scopeData - scope data.
   * @param {String} scopeData.entityType - entity type
   * @param {Array} scopeData.entities - entities in scope
   * @param {Array} scopeData.roles - roles in scope
   * @returns {JSON} - Set scope data.
   */

  static setScope(programId, scopeData) {
    return new Promise(async (resolve, reject) => {
      try {
        // Find program document to update or set scope based on program id
        let programData = await programsQueries.programDocuments({ _id: programId }, ['_id']);

        if (!(programData.length > 0)) {
          return resolve({
            status: httpStatusCode.bad_request.status,
            message: messageConstants.apiResponses.PROGRAM_NOT_FOUND,
          });
        }

        let scope = {};
        // check if validate entity on or off
        // if (validateEntity !== messageConstants.common.OFF) {
          let scopeDatas = Object.keys(scopeData);
          let scopeDataIndex = scopeDatas.map((index) => {
            return `scope.${index}`;
          });

          let programIndex = await programsQueries.listIndexesFunc();
          let indexes = programIndex.map((indexedKeys) => {
            return Object.keys(indexedKeys.key)[0];
          });
          let keysNotIndexed = _.differenceWith(scopeDataIndex, indexes);
          if (keysNotIndexed.length > 0) {
            let keysCannotBeAdded = keysNotIndexed.map((keys) => {
              return keys.split('.')[1];
            });
            scopeData = _.omit(scopeData, keysCannotBeAdded);
          }
                  // }

                  const updateObject = {
                    $set: {},
                  }
          
                  // Set the scope in updateObject to the updated scopeData
                  updateObject['$set']['scope'] = scopeData
          
                  // Extract entities from scopeData excluding the 'roles' key
                  const entities = Object.keys(scopeData)
                    .filter((key) => key !== 'roles')
                    .reduce((acc, key) => acc.concat(scopeData[key]), [])
          
                  // Add the entities array to updateObject
                  updateObject.$set.entities = entities
          
                  // Join all keys except 'roles' into a comma-separated string and set it as entityType
                  scopeData['entityType'] = Object.keys(_.omit(scopeData, ['roles'])).join(',')
          
                  // Add the entityType to updateObject
                  updateObject['$set']['entityType'] = scopeData.entityType
          

        //Updating or set scope in program document
        let updateProgram = await programsQueries.findOneAndUpdate(
          {
            _id: programId,
          },
          updateObject,
          { new: true }
        );
        if (!updateProgram._id) {
          throw {
            status: messageConstants.apiResponses.PROGRAM_SCOPE_NOT_ADDED,
          };
        }

        return resolve({
          success: true,
          message: messageConstants.apiResponses.PROGRAM_UPDATED_SUCCESSFULLY,
          data: updateProgram,
        });
      } catch (error) {
        return reject(error);
      }
    });
  }

  /**
   * List of user created programs
   * @method
   * @name userPrivatePrograms
   * @param {String} userId
   * @returns {JSON} - List of programs that user created on app.
   */

  static userPrivatePrograms(userId,pageNo,pageSize,searchText) {
    return new Promise(async (resolve, reject) => {
      try {
        let programsData = await this.list(
					{
						createdBy: userId,
						isAPrivateProgram: true,
					},
					['name', 'externalId', 'description', '_id', 'isAPrivateProgram',"metaInformation"],
          pageNo,
          pageSize,
          searchText
				)
        programsData =programsData.data
        if (!programsData.data.length > 0) {
          return resolve({
            message: messageConstants.apiResponses.PROGRAM_NOT_FOUND,
            result: [],
          });
        }

        return resolve(programsData);
      } catch (error) {
        return reject(error);
      }
    });
  }

  /**
   * Update program document.
   * @method
   * @name updateProgramDocument
   * @param {Object} query - query to find document
   * @param {Object} updateObject - fields to update
   * @returns {String} - message.
   */

  static updateProgramDocument(query = {}, updateObject = {}) {
    return new Promise(async (resolve, reject) => {
      try {
        if (Object.keys(query).length == 0) {
          throw new Error(messageConstants.apiResponses.UPDATE_QUERY_REQUIRED);
        }

        if (Object.keys(updateObject).length == 0) {
          throw new Error(messageConstants.apiResponses.UPDATE_OBJECT_REQUIRED);
        }

        let updateResponse = await programsQueries.findOneAndUpdate(query, updateObject);

        if (updateResponse.nModified == 0) {
          throw new Error(messageConstants.apiResponses.FAILED_TO_UPDATE);
        }

        return resolve({
          success: true,
          message: messageConstants.apiResponses.UPDATED_DOCUMENT_SUCCESSFULLY,
          data: true,
        });
      } catch (error) {
        return resolve({
          success: false,
          message: error.message,
          data: false,
        });
      }
    });
  }

  /**
   * List programs by ids.
   * @method
   * @name listByIds
   * @param {Array} programIds - Program ids.
   * @param {Object} tenantData - tenantData info
   * @returns {Array} List of Programs.
   */

  static listByIds(programIds,tenantData) {
    return new Promise(async (resolve, reject) => {
      try {
        let programsData;

        if (Array.isArray(programIds) && programIds.length > 0) {
          programsData = await this.list(
            {
              _id: { $in: programIds },
            },
            'all',
            ['components', 'imageCompression', 'updatedAt', 'createdAt', 'startDate', 'endDate', 'updatedBy'],
            '',
            '',
            tenantData
          );

          if (!programsData.length > 0) {
            throw {
              status: httpStatusCode['bad_request'].status,
              message: messageConstants.apiResponses.PROGRAM_NOT_FOUND,
            };
          }
        }

        return resolve({
          success: true,
          message: messageConstants.apiResponses.PROGRAM_LIST,
          data: programsData,
        });
      } catch (error) {
        return resolve({
          status: error.status ? error.status : httpStatusCode['internal_server_error'].status,
          success: false,
          message: error.message,
          data: false,
        });
      }
    });
  }

  /**
   * Remove solutions from program.
   * @method
   * @name removeSolutions
   * @param {Array} programId - Program id.
   * @param {Array} solutionIds - Program id.
   * @returns {Array} Update program.
   */

  static removeSolutions(programId, solutionIds) {
    return new Promise(async (resolve, reject) => {
      try {
        let programsData = await this.list({ _id: programId }, ['_id']);

        if (!programsData.length > 0) {
          throw {
            status: httpStatusCode['bad_request'].status,
            message: messageConstants.apiResponses.PROGRAM_NOT_FOUND,
          };
        }

        let updateSolutionIds = solutionIds.map((solutionId) => ObjectId(solutionId));

        let updateSolution = await programsQueries.findOneAndUpdate(
          {
            _id: programId,
          },
          {
            $pull: {
              components: { $in: updateSolutionIds },
            },
          }
        );

        return resolve({
          success: true,
          message: messageConstants.apiResponses.PROGRAM_UPDATED_SUCCESSFULLY,
          data: updateSolution,
        });
      } catch (error) {
        return resolve({
          status: error.status ? error.status : httpStatusCode['internal_server_error'].status,
          success: false,
          message: error.message,
          data: false,
        });
      }
    });
  }

  /**
   * Search programs.
   * @method
   * @name search
   * @param {Object} filteredData - Search programs from filtered data.
   * @param {Number} pageSize - page limit.
   * @param {Number} pageNo - No of the page.
   * @param {Object} projection - Projected data.
   * @returns {Array} List of program document.
   */

  static search(filteredData, pageSize, pageNo, projection, search = '') {
    return new Promise(async (resolve, reject) => {
      try {
        let programDocument = [];

        let projection1 = {};

        if (projection) {
          projection1['$project'] = projection;
        } else {
          projection1['$project'] = {
            name: 1,
            description: 1,
            keywords: 1,
            externalId: 1,
            components: 1,
          };
        }

        if (search !== '') {
          filteredData['$match']['$or'] = [];
          filteredData['$match']['$or'].push(
            {
              name: new RegExp(search, 'i'),
            },
            {
              description: new RegExp(search, 'i'),
            }
          );
        }

        let facetQuery = {};
        facetQuery['$facet'] = {};

        facetQuery['$facet']['totalCount'] = [{ $count: 'count' }];

        facetQuery['$facet']['data'] = [{ $skip: pageSize * (pageNo - 1) }, { $limit: pageSize }];

        let projection2 = {};
        projection2['$project'] = {
          data: 1,
          count: {
            $arrayElemAt: ['$totalCount.count', 0],
          },
        };

        programDocument.push(filteredData, projection1, facetQuery, projection2);

        let programDocuments = await programsQueries.getAggregate(programDocument);

        return resolve(programDocuments);
      } catch (error) {
        return reject(error);
      }
    });
  }
   
  /**
   * List of programs and targeted ones.
   * @method
   * @name targetedPrograms
   * @param {Object} requestedData   - req bidy.
   * @param {String} userId         - logged in user id.
   * @param {Number} pageNo         - Recent page no.
   * @param {Number} pageSize       - Size of page.
   * @param {String} search         - search text.
   * @param {String} [ filter = ""] - filter text.
   * @param {Object} tenantData - tenant data
   * @returns {Object} - Details of the program.
   */
  static targetedPrograms(requestedData, userId, pageSize, pageNo, search, filter,tenantData) {
    return new Promise(async (resolve, reject) => {
      try {
        //fetch the assigned programs for the user
        let assignedPrograms = await this.assignedUserPrograms(userId,tenantData);
        let mergedData = [];
        let programIds = [];
        if (assignedPrograms.success && assignedPrograms.data) {
          mergedData = assignedPrograms.data.data;

          mergedData.forEach((mergeProgramData) => {
            if (mergeProgramData.programId) {
              programIds.push(mergeProgramData.programId);
            }
          });
        }
        let targetedPrograms = {
          success: false,
        };

        let getTargetedProgram = true;

        if (filter === messageConstants.common.DISCOVERED_BY_ME) {
          getTargetedProgram = false;
        }
        // programs based on role and location
        if (getTargetedProgram) {
          targetedPrograms = await this.forUserRoleAndLocation(
            requestedData,
            programIds,
            filter,
            pageSize,
            pageNo,
            search,
            tenantData
          );
        }

        return resolve(getTargetedProgram ? targetedPrograms : assignedPrograms);
      } catch (error) {
        return reject({
          status: error.status || httpStatusCode.internal_server_error.status,
          message: error.message || httpStatusCode.internal_server_error.message,
          errorObject: error,
        });
      }
    });
  }

  /**
   * Assigned programs details.
   * @method
   * @name assignedUserPrograms
   * @param {String} userId         - logged in user id.
   * @param {Object} tenantData - tenant data
   * @returns {Object} - Details of the program.
   */

  static assignedUserPrograms(userId,tenantData) {
    return new Promise(async (resolve, reject) => {
      try {

        let projection =["_id","programId","userId"]
        //Checking for user assigned programs based on userId

        let userAssignedPrograms = await programUsersQueries.programUsersDocument(
          { userId: userId,
            tenantId:tenantData.tenantId
          } ,
          projection// find query
        );

        return resolve({
          success: true,
          message: messageConstants.apiResponses.USER_ASSIGNED_SURVEY_FETCHED,
          data: {
            data: userAssignedPrograms,
            count: userAssignedPrograms.length,
          },
        });
      } catch (error) {
        return resolve({
          success: false,
          status: error.status ? error.status : httpStatusCode['internal_server_error'].status,
          message: error.message,
        });
      }
    });
  }

  static forUserRoleAndLocation(bodyData, programIds, filter, pageSize, pageNo, searchText = '',tenantData) {
    return new Promise(async (resolve, reject) => {
      try {
        //Getting query based on roles and entity
        let queryData = await this.queryBasedOnRoleAndLocation(bodyData);
        if (!queryData.success) {
          return resolve(queryData);
        }
        let matchQuery = queryData.data
        //Check for whether its a privateProgram or not
        if (filter && filter !== '') {
          if (filter === messageConstants.common.CREATED_BY_ME) {
            matchQuery['isAPrivateProgram'] = { $ne: false };
          } else if (filter === messageConstants.common.ASSIGN_TO_ME) {
            matchQuery['isAPrivateProgram'] = false;
          }
        }
        matchQuery['startDate'] ={ $lte: new Date() }
        matchQuery['endDate'] =  { $gte: new Date() }
        matchQuery['tenantId'] = tenantData.tenantId
        //matchQuery['orgIds'] = {$in:['ALL',tenantData.orgId]}
        //adding programIds array to matchQuery
        // matchQuery['_id'] = { $in: programIds };
        let projection = [
          "_id",
          'name',
          'description',
          'externalId',
          'owner',
          'createdBy',
          'status',
          'resourceType',
          "metaInformation"
        ];
        //listing the solution based on type and query
        let targetedPrograms = await this.list(matchQuery, projection, pageNo, pageSize, searchText,tenantData);
        return resolve({
          success: true,
          message: messageConstants.apiResponses.TARGETED_PROGRAM_FETCHED,
          data: targetedPrograms.data,
        });
      } catch (error) {
        return resolve({
          success: false,
          message: error.message,
          data: {},
        });
      }
    });
  }

  /**
   * Auto targeted query field.
   * @method
   * @name queryBasedOnRoleAndLocation
   * @param {String} data - Requested body data.
   * @param {String} type - type of solutions.
   * @returns {JSON} - Auto targeted solutions query.
   */

  static queryBasedOnRoleAndLocation(data, type = '') {
		return new Promise(async (resolve, reject) => {
			try {
				let registryIds = []
				let entityTypes = []
				let filterQuery = {
					isDeleted: false,
				}
				Object.keys(_.omit(data, ['role', 'filter', 'factors', 'type','tenantId','orgId','organizations'])).forEach((key) => {
					data[key] = data[key].split(',')
				})

				// If validate entity set to ON . strict scoping should be applied
				if (validateEntity !== messageConstants.common.OFF) {
					Object.keys(_.omit(data, ['filter', 'role', 'factors', 'type','tenantId','orgId','organizations'])).forEach((requestedDataKey) => {
						registryIds.push(...data[requestedDataKey])
						entityTypes.push(requestedDataKey)
					})
					if (!registryIds.length > 0) {
						throw {
							message: messageConstants.apiResponses.NO_LOCATION_ID_FOUND_IN_DATA,
						}
					}

          /*
          if (!data.role) {
            throw {
              message: messageConstants.apiResponses.USER_ROLES_NOT_FOUND,
            }
          }
          // filterQuery['scope.roles.code'] = {
          //   $in: [messageConstants.common.ALL_ROLES, ...data.role.split(',')],
          // };
          filterQuery['scope.roles'] = {
            $in: [messageConstants.common.ALL_ROLES, ...data.role.split(',')],
          };
          */
          // filterQuery['scope.entities'] = { $in: entities };
          let userRoleInfo = _.omit(data, ['filter', 'factors', 'role', 'type','tenantId','orgId','organizations']);

          let tenantDetails = await userService.fetchPublicTenantDetails(data.tenantId);
					if (!tenantDetails.data || !tenantDetails.data.meta || tenantDetails.success !== true) {
            return resolve({
              success: false,
              message: messageConstants.apiResponses.FAILED_TO_FETCH_TENANT_DETAILS,
            });
          }
          // factors = [ 'professional_role', 'professional_subroles' ]
          let factors
          if (tenantDetails.data.meta.hasOwnProperty('factors') && tenantDetails.data.meta.factors.length > 0) {
            factors = tenantDetails.data.meta.factors;
            let queryFilter = gen.utils.factorQuery(factors,userRoleInfo);
            // append query filter
            filterQuery['$and'] = queryFilter;
          }
          let dataToOmit = ['filter', 'role', 'factors', 'type','tenantId','orgId']
          // factors.append(dataToOmit)

          const finalKeysToRemove = [...new Set([...dataToOmit, ...factors])];

          let locationData = []

          Object.keys(_.omit(data, finalKeysToRemove)).forEach((key) => {
            locationData.push({
              [`scope.${key}`]: { $in: data[key] },
            })
          })

          if(filterQuery['$and']){
            filterQuery['$and'].push({
              $or: locationData,
            });
          }else{
            filterQuery['$or'].push({
              $or: locationData,
            });
          }

          filterQuery['scope.entityType'] = { $in: entityTypes }
        } else {
          // let userRoleInfo = _.omit(data, ['filter', , 'factors', 'role','type']);
          // let userRoleKeys = Object.keys(userRoleInfo);
          // userRoleKeys.forEach((entities) => {
          //   filterQuery['scope.' + entities] = {
          //     $in: userRoleInfo[entities].split(','),
          //   };
          // });

          // Obtain userInfo
          let userRoleInfo = _.omit(data, ['filter', 'factors', 'role', 'type','tenantId','orgId'])
          let userRoleKeys = Object.keys(userRoleInfo)
          let queryFilter = []

          // factors = [ 'professional_role', 'professional_subroles' ]
          // if factors are passed or query has to be build based on the keys passed
          if (data.hasOwnProperty('factors') && data.factors.length > 0) {
            let factors = data.factors
            // Build query based on each key
            factors.forEach((factor) => {
              let scope = 'scope.' + factor
              let values = userRoleInfo[factor]
              if (factor === 'role') {
                queryFilter.push({
                  ['scope.roles']: { $in: [messageConstants.common.ALL_ROLES, ...data.role.split(',')] },
                })
              } else if (!Array.isArray(values)) {
                queryFilter.push({ [scope]: { $in: values.split(',') } });
              } else {
                queryFilter.push({ [scope]: { $in: [...values] } });
              }
            })
            // append query filter
            if(filterQuery['$and']){
              filterQuery['$and'].push({
                $or: queryFilter,
              });
            }else{
              filterQuery['$or'] = queryFilter;
            }
          } else {
            userRoleKeys.forEach((key) => {
              let scope = 'scope.' + key
              let values = userRoleInfo[key]
              if (!Array.isArray(values)) {
                queryFilter.push({ [scope]: { $in: values.split(',') } });
              } else {
                queryFilter.push({ [scope]: { $in: [...values] } });
              }
            })

            if (data.role) {
              queryFilter.push({
                ['scope.roles']: { $in: [messageConstants.common.ALL_ROLES, ...data.role.split(',')] },
              });
            }

						// append query filter
						filterQuery['$and'] = queryFilter
					}
				}

				filterQuery.status = messageConstants.common.ACTIVE_STATUS
				if (type != '') {
					filterQuery.type = type
				}

        delete filterQuery['scope.entityType'];
        filterQuery.tenantId = data.tenantId
        return resolve({
        success: true,
          data: filterQuery,
        })
      } catch (error) {
        return resolve({
          success: false,
          status: error.status ? error.status : httpStatusCode['internal_server_error'].status,
          message: error.message,
          data: {},
        })
      }
    })
  }
}
