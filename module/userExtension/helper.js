/**
 * name : userExtension/helper.js
 * author : Akash
 * created-date : 01-feb-2019
 * Description : User extension helper related functionality.
 */

// Dependencies
const userRolesHelper = require(MODULES_BASE_PATH + '/userRoles/helper');
const entityTypesHelper = require(MODULES_BASE_PATH + '/entityTypes/helper');
const entitiesHelper = require(MODULES_BASE_PATH + '/entities/helper');
const shikshalokamGenericHelper = require(ROOT_PATH + '/generics/helpers/shikshalokam');
const elasticSearchData = require(ROOT_PATH + '/generics/helpers/elasticSearch');
const programsHelper = require(MODULES_BASE_PATH + '/programs/helper');
const userService = require(ROOT_PATH + '/generics/services/users');
const kafkaClient = require(ROOT_PATH + '/generics/helpers/kafkaCommunications');
const userExtensionsQueries = require(DB_QUERY_BASE_PATH + '/userExtensions');
/**
 * UserExtensionHelper
 * @class
 */

module.exports = class UserExtensionHelper {

  /**
   * Get profile with entity details
   * @method
   * @name profileWithEntityDetails
   * @param {Object} filterQueryObject - filtered data.
   * @returns {Object}
   */

  static profileWithEntityDetails(filterQueryObject) {
    return new Promise(async (resolve, reject) => {
      try {
        const entityTypesArray = await entityTypesHelper.list(
          {},
          {
            name: 1,
            immediateChildrenEntityType: 1,
          }
        );

        let enityTypeToImmediateChildrenEntityMap = {};

        if (entityTypesArray.length > 0) {
          entityTypesArray.forEach((entityType) => {
            enityTypeToImmediateChildrenEntityMap[entityType.name] =
              entityType.immediateChildrenEntityType && entityType.immediateChildrenEntityType.length > 0
                ? entityType.immediateChildrenEntityType
                : [];
          });
        }

        let queryObject = [
          {
            $match: filterQueryObject,
          },
          {
            $lookup: {
              from: 'entities',
              localField: 'roles.entities',
              foreignField: '_id',
              as: 'entityDocuments',
            },
          },
          {
            $lookup: {
              from: 'userRoles',
              localField: 'roles.roleId',
              foreignField: '_id',
              as: 'roleDocuments',
            },
          },
          {
            $project: {
              externalId: 1,
              roles: 1,
              'roleDocuments._id': 1,
              'roleDocuments.code': 1,
              'roleDocuments.title': 1,
              'entityDocuments._id': 1,
              'entityDocuments.metaInformation.externalId': 1,
              'entityDocuments.metaInformation.name': 1,
              'entityDocuments.groups': 1,
              'entityDocuments.entityType': 1,
              'entityDocuments.entityTypeId': 1,
              improvementProjects: 1,
            },
          },
        ];

        let userExtensionData = await database.models.userExtension.aggregate(queryObject);
        let relatedEntities = [];

        if (userExtensionData[0]) {
          let roleMap = {};

          if (userExtensionData[0].entityDocuments && userExtensionData[0].entityDocuments.length > 0) {
            let projection = [
              entitiesHelper.entitiesSchemaData().SCHEMA_METAINFORMATION + '.externalId',
              entitiesHelper.entitiesSchemaData().SCHEMA_METAINFORMATION + '.name',
              entitiesHelper.entitiesSchemaData().SCHEMA_METAINFORMATION + '.addressLine1',
              entitiesHelper.entitiesSchemaData().SCHEMA_METAINFORMATION + '.addressLine2',
              entitiesHelper.entitiesSchemaData().SCHEMA_METAINFORMATION + '.administration',
              entitiesHelper.entitiesSchemaData().SCHEMA_METAINFORMATION + '.city',
              entitiesHelper.entitiesSchemaData().SCHEMA_METAINFORMATION + '.country',
              entitiesHelper.entitiesSchemaData().SCHEMA_ENTITY_TYPE_ID,
              entitiesHelper.entitiesSchemaData().SCHEMA_ENTITY_TYPE,
            ];

            relatedEntities = await entitiesHelper.relatedEntities(
              userExtensionData[0].entityDocuments[0]._id,
              userExtensionData[0].entityDocuments[0].entityTypeId,
              userExtensionData[0].entityDocuments[0].entityType,
              projection
            );
          }

          if (userExtensionData[0].roleDocuments && userExtensionData[0].roleDocuments.length > 0) {
            userExtensionData[0].roleDocuments.forEach((role) => {
              roleMap[role._id.toString()] = role;
            });
            let entityMap = {};

            userExtensionData[0].entityDocuments.forEach((entity) => {
              entity.metaInformation.childrenCount = 0;
              entity.metaInformation.entityType = entity.entityType;
              entity.metaInformation.entityTypeId = entity.entityTypeId;
              entity.metaInformation.subEntityGroups = new Array();

              Array.isArray(enityTypeToImmediateChildrenEntityMap[entity.entityType]) &&
                enityTypeToImmediateChildrenEntityMap[entity.entityType].forEach((immediateChildrenEntityType) => {
                  if (entity.groups && entity.groups[immediateChildrenEntityType]) {
                    entity.metaInformation.immediateSubEntityType = immediateChildrenEntityType;
                    entity.metaInformation.childrenCount = entity.groups[immediateChildrenEntityType].length;
                  }
                });

              entity.groups &&
                Array.isArray(Object.keys(entity.groups)) &&
                Object.keys(entity.groups).forEach((subEntityType) => {
                  entity.metaInformation.subEntityGroups.push(subEntityType);
                });

              entityMap[entity._id.toString()] = entity;
            });

            for (
              let userExtensionRoleCounter = 0;
              userExtensionRoleCounter < userExtensionData[0].roles.length;
              userExtensionRoleCounter++
            ) {
              if (
                userExtensionData[0].roles[userExtensionRoleCounter]['entities'] &&
                userExtensionData[0].roles[userExtensionRoleCounter].entities.length > 0
              ) {
                for (
                  let userExtenionRoleEntityCounter = 0;
                  userExtenionRoleEntityCounter < userExtensionData[0].roles[userExtensionRoleCounter].entities.length;
                  userExtenionRoleEntityCounter++
                ) {
                  userExtensionData[0].roles[userExtensionRoleCounter].entities[userExtenionRoleEntityCounter] = {
                    _id: entityMap[
                      userExtensionData[0].roles[userExtensionRoleCounter].entities[
                        userExtenionRoleEntityCounter
                      ].toString()
                    ]._id,
                    ...entityMap[
                      userExtensionData[0].roles[userExtensionRoleCounter].entities[
                        userExtenionRoleEntityCounter
                      ].toString()
                    ].metaInformation,
                  };
                }
                roleMap[userExtensionData[0].roles[userExtensionRoleCounter].roleId.toString()].immediateSubEntityType =
                  userExtensionData[0].roles[userExtensionRoleCounter].entities[0] &&
                  userExtensionData[0].roles[userExtensionRoleCounter].entities[0].entityType
                    ? userExtensionData[0].roles[userExtensionRoleCounter].entities[0].entityType
                    : '';
                roleMap[userExtensionData[0].roles[userExtensionRoleCounter].roleId.toString()].entities =
                  userExtensionData[0].roles[userExtensionRoleCounter].entities;
              }
            }
          }

          let aclInformation = await this.roleBasedAclInformation(userExtensionData[0].roles);

          return resolve(
            _.merge(
              _.omit(userExtensionData[0], [
                this.userExtensionSchemaData().USER_EXTENSION_ROLE,
                this.userExtensionSchemaData().USER_EXTENSION_ENTITY_DOCUMENTS,
                this.userExtensionSchemaData().USER_EXTENSION_ROLE_DOCUMENTS,
              ]),
              { roles: _.isEmpty(roleMap) ? [] : Object.values(roleMap) },
              { relatedEntities: relatedEntities },
              { acl: aclInformation }
            )
          );
        } else {
          return resolve({});
        }
      } catch (error) {
        return reject(error);
      }
    });
  }

  /**
   * Bulk create or update user.
   * @method
   * @name bulkCreateOrUpdate
   * @param {Array} userRolesCSVData
   * @param {Object} userDetails -logged in user details.
   * @param {String} userDetails.id -logged in user id.
   * @param {Object} tenantAndOrgInfo -tenant and organization information passed from req.headers
   * @returns {Array}
   */

  static bulkCreateOrUpdate(userRolesCSVData, userDetails, tenantAndOrgInfo) {
    return new Promise(async (resolve, reject) => {
      try {
        let userRolesUploadedData = new Array();
        let aggregateKafkaEventPayloads = [];
        // Pre-fetch all required data
        const allProgramIds = new Set();
        const allUserIds = new Set();

        //iterating through userRolesCSVData to collect all programIds and userIds
        for (const csvRow of userRolesCSVData) {
          const userRole = gen.utils.valueParser(csvRow);

          if (userRole.programs && userRole.programs.length > 0) {
            userRole.programs.forEach((programId) => allProgramIds.add(programId));
          }

          if (userRole.user) {
            allUserIds.add(userRole.user);
          }
        }

        if(Array.from(allProgramIds).length == 0){
          throw {
            status: httpStatusCode.bad_request.status,
            message: messageConstants.apiResponses.PROGRAM_NOT_FOUND,
          };
        }

        // Fetch program data
        /*
        arguments passed to programsHelper.list() are:
        - filter: { externalId: { $in: Array.from(allProgramIds) } }
        - projection: ['_id', 'externalId']
        - sort: ''
        - skip: ''
        - limit: ''
        - tenantAndOrgInfo: tenant and organization information passed from req.headers
        */
        //fetching all programs data based on externalId 
        // this is done to avoid multiple database calls for each program
        const allProgramsData = await programsHelper.list(
          { externalId: { $in: Array.from(allProgramIds) } },
          ['_id', 'externalId'],
          '',
          '',
          '',
          tenantAndOrgInfo
        );

        // Create maps for program IDs and program information
        //programIdMap will map external program IDs to internal MongoDB ObjectIDs
        //programInfoMap will map internal MongoDB ObjectIDs to program information
        //this is made to avoid multiple database calls for each program
        const programIdMap = {};
        const programInfoMap = {}
        const programs = allProgramsData?.data?.data || []

        if(programs.length === 0) {
          throw {
            status: httpStatusCode.bad_request.status,
            message: messageConstants.apiResponses.PROGRAM_NOT_FOUND,
          };
        }

        if(Array.from(allUserIds).length === 0) {
          throw {
            status: httpStatusCode.bad_request.status,
            message: messageConstants.apiResponses.USER_NOT_FOUND,
          };
        }


        for (const program of programs) {
          programIdMap[program.externalId] = program._id;
          programInfoMap[program._id.toString()] = program;
        }

        // Fetch user profiles
        const userProfileMap = {};
        const userProfileResults = await Promise.allSettled(
          Array.from(allUserIds).map((userId) =>
            userService.fetchProfileBasedOnUserIdOrName(tenantAndOrgInfo.tenantId, null, userId)
              .then(result => ({ userId, ...result }))
          )
        );

        for (const result of userProfileResults) {
          if (result.status === messageConstants.common.PROMISE_FULFILLED && result.value.success) {
            userProfileMap[result.value.userId] = result.value.data;
          }
        }

        // Check if any user profiles were found
        // if no user profiles were found, throw an error
        if(Object.keys(userProfileMap).length === 0) {
          throw {
            status: httpStatusCode.bad_request.status,
            message: messageConstants.apiResponses.USER_NOT_FOUND,
          };
        }

        // Fetch user extensions


        const userExtensionDocs = await userExtensionsQueries.userExtensionDocuments(
          { userId: { $in: Object.values(userProfileMap).map((user) => user.id) }, 
            tenantId: tenantAndOrgInfo.tenantId 
          },
          ['userId','programRoleMapping']
        );

 
        const userExtensionMap = {};
        for (const userExtension of userExtensionDocs) {
          userExtensionMap[userExtension.userId] = userExtension;
        }

        // Process each CSV row
        // iterating through userRolesCSVData to process each user role
        outerloop: for (const csvRow of userRolesCSVData) {
          let userRole = gen.utils.valueParser(csvRow);
          userRole['_SYSTEM_ID'] = '';

          try {
            // Validate programs exist
            if (userRole.programs && userRole.programs.length > 0) {
              const programDocumentsArray = userRole.programs.map((p) => programIdMap[p]).filter(Boolean);

              if (programDocumentsArray.length === 0) {
                userRole['_SYSTEM_ID'] = '';
                userRole.status = messageConstants.apiResponses.PROGRAM_NOT_FOUND;
                userRolesUploadedData.push(userRole);
                continue;
              }
            }

            // Validate user exists
            const userProfile = userProfileMap[userRole.user];
            if (!userProfile) {
              userRole['_SYSTEM_ID'] = '';
              userRole.status = messageConstants.apiResponses.USER_NOT_FOUND;
              userRolesUploadedData.push(userRole);
              continue outerloop;
            }

            // Validate platform roles            
            const platform_role_array = userRole.platform_role?.split(',').map(r => r.trim()) || [];
            const orgRoles = userProfile.organizations.flatMap(org => org.roles?.map(r => r.title) || []);
            if (platform_role_array.some(role => !orgRoles.includes(role))) {
                userRole.status = messageConstants.apiResponses.INVALID_ROLE_CODE;
                userRolesUploadedData.push(userRole);
                continue outerloop;
            }

            let existingUser = userExtensionMap[userProfile.id.toString()];
            let user = '';
            const kafkaEventPayloads = [];

            if (!existingUser) {
              if([messageConstants.common.OVERRIDE_OPERATION,messageConstants.common.ADD_OPERATION,messageConstants.common.APPEND_OPERATION].includes(userRole.programOperation)){
              // Create new user extension
              const userInformation = {
                userId: userProfile.id,
                externalId: userRole.user,
                status: messageConstants.common.ACTIVE_STATUS,
                updatedBy: userDetails.userId,
                createdBy: userDetails.userId,
                programRoleMapping: [],
                tenantId:tenantAndOrgInfo.tenantId,
                orgIds:Array.isArray(userProfile.organizations)
                ? userProfile.organizations
                    .filter((org) => org && typeof org.code === 'string')
                    .map((org) => org.code)
                : []
              };

              //if both programOperation and programs are present, we will process the roles for each program
              if (userRole.programOperation && userRole.programs) {
                
                // Check if programs exist in the programIdMap
                for (const program of userRole.programs) {
                  const programId = programIdMap[program];

                  if (!programId) {
                    userRole.status = messageConstants.apiResponses.PROGRAM_NOT_FOUND;
                    userRolesUploadedData.push(userRole);
                    continue outerloop;
                  }

                  const roles = platform_role_array;
                  let entry = userInformation.programRoleMapping.find(
                    (pr) => pr.programId.toString() === programId.toString()
                  );

                  if (!entry) {
                    entry = { programId: programId, roles: [] };
                    userInformation.programRoleMapping.push(entry);
                  }

                  for (const role of roles) {
                    if (!entry.roles.includes(role)) {
                      entry.roles.push(role);
                      // Emit create event for new role
                      kafkaEventPayloads.push(createKafkaPayload(userProfile, programId, role, messageConstants.common.CREATE_EVENT_TYPE));               
                    }
                  }
                }
              }

              user = await userExtensionsQueries.createUserExtensionDocument(userInformation);
              userExtensionMap[user.userId.toString()] = user;

              userRole['_SYSTEM_ID'] = user?._id || '';
              userRole.status = user ? 'Success' : 'Failed to create the user role.';
              userRole._kafkaEventPayloads = kafkaEventPayloads;
              aggregateKafkaEventPayloads.push(...kafkaEventPayloads);
              }
            } else {
              // Update existing user
              let existingUserProgramRoleMapping = [...(existingUser.programRoleMapping || [])];

              if (userRole.programOperation && userRole.programs) {
                for (const program of userRole.programs) {
                  const programId = programIdMap[program];

                  if (!programId) {
                    userRole.status = messageConstants.apiResponses.PROGRAM_NOT_FOUND;
                    userRolesUploadedData.push(userRole);
                    continue outerloop;
                  }

                  const currentRoleInfoIndex = existingUserProgramRoleMapping.findIndex(
                    (pr) => pr.programId.toString() === programId.toString()
                  );

                  const newRoles = platform_role_array;

                  if (userRole.programOperation === messageConstants.common.OVERRIDE_OPERATION) {
                    if (currentRoleInfoIndex !== -1) {
                      const currentRoles = existingUserProgramRoleMapping[currentRoleInfoIndex].roles;

                      // Find roles to remove (exist in current but not in new)
                      const rolesToRemove = currentRoles.filter((role) => !newRoles.includes(role));
                      for (const role of rolesToRemove) {
                        kafkaEventPayloads.push(createKafkaPayload(userProfile, programId, role, messageConstants.common.DELETE_EVENT_TYPE));
                      }

                      // Find roles to add (exist in new but not in current)
                      const rolesToAdd = newRoles.filter((role) => !currentRoles.includes(role));
                      for (const role of rolesToAdd) {
                        kafkaEventPayloads.push(createKafkaPayload(userProfile, programId, role, messageConstants.common.CREATE_EVENT_TYPE));
                      }

                      // Override the roles
                      existingUserProgramRoleMapping[currentRoleInfoIndex].roles = [...newRoles];
                    } else {
                      addNewProgramEntry(userProfile, programId, newRoles,existingUserProgramRoleMapping, kafkaEventPayloads);
                    }
                  } else if (userRole.programOperation === messageConstants.common.ADD_OPERATION || userRole.programOperation === messageConstants.common.APPEND_OPERATION) {
                    if (currentRoleInfoIndex !== -1) {
                      // Add roles to existing program entry
                      const currentRoles = existingUserProgramRoleMapping[currentRoleInfoIndex].roles;

                      for (const role of newRoles) {
                        if (!currentRoles.includes(role)) {
                          existingUserProgramRoleMapping[currentRoleInfoIndex].roles.push(role);
                          kafkaEventPayloads.push(createKafkaPayload(userProfile, programId, role, messageConstants.common.CREATE_EVENT_TYPE));
                        }
                      }
                    } else {
                      // Create new program entry
                      addNewProgramEntry(userProfile, programId, newRoles,existingUserProgramRoleMapping, kafkaEventPayloads);
                    }
                  } else if (userRole.programOperation === messageConstants.common.REMOVE_OPERATION) {
                    if (currentRoleInfoIndex !== -1) {
                      const currentRoles = existingUserProgramRoleMapping[currentRoleInfoIndex].roles;

                      // Remove specified roles
                      const rolesToKeep = currentRoles.filter((role) => !newRoles.includes(role));

                      // Emit delete events for removed roles
                      const rolesToRemove = currentRoles.filter((role) => newRoles.includes(role));
                      for (const role of rolesToRemove) {
                        kafkaEventPayloads.push(createKafkaPayload(userProfile, programId, role, messageConstants.common.DELETE_EVENT_TYPE));
                      }

                      if (rolesToKeep.length === 0) {
                        // Remove entire program entry if no roles left
                        existingUserProgramRoleMapping.splice(currentRoleInfoIndex, 1);
                      } else {
                        // Update with remaining roles
                        existingUserProgramRoleMapping[currentRoleInfoIndex].roles = rolesToKeep;
                      }
                    }
                    // If program doesn't exist, nothing to remove - no error needed
                  }
                }
              }

              // Update user extension document
              const updateQuery = { programRoleMapping: existingUserProgramRoleMapping };
              user = await userExtensionsQueries.updateUserExtensionDocument(
                { _id: existingUser._id, tenantId: tenantAndOrgInfo.tenantId },
                updateQuery,
                {
                  new: true,
                  returnNewDocument: true,
                }
              );
              userExtensionMap[user.userId.toString()] = user;

              userRole['_SYSTEM_ID'] = existingUser._id;
              userRole.status = 'Success';

              userRole._kafkaEventPayloads = kafkaEventPayloads;
              aggregateKafkaEventPayloads.push(...kafkaEventPayloads);
            }

          } catch (error) {
            userRole.status = error && error.message ? error.message : error;
          }

          userRolesUploadedData.push(userRole);
        }

        for(let kafkaEventPayload of aggregateKafkaEventPayloads) {

          let eventObj = {
            "entity": messageConstants.common.PROGRAM,
            "eventType": kafkaEventPayload.eventType,
            "username": kafkaEventPayload.username,
            "userId": kafkaEventPayload.userId,
            "role": kafkaEventPayload.role,
            "meta": {
              "programInformation": {
                "name": programInfoMap[kafkaEventPayload.programId].externalId,
                "externalId": programInfoMap[kafkaEventPayload.programId].externalId,
                "id":kafkaEventPayload.programId.toString()
              }
            }
          }

          kafkaClient.pushProgramOperationEvent(eventObj);
        }


        return resolve(userRolesUploadedData);
      } catch (error) {
        return reject(error);
      }
    });
  }

  /**
   * Get entities for logged in user.
   * @method
   * @name getUserEntities
   * @param {String} [userId = false] -logged in user id.
   * @param {String} userDetails.id -logged in user id.
   * @returns {Array} list of entities
   */

  static getUserEntities(userId = false) {
    return new Promise(async (resolve, reject) => {
      try {
        if (!userId) {
          throw messageConstants.apiResponses.USER_ID_REQUIRED_CHECK;
        }

        let userExtensionDoument = await database.models.userExtension
          .findOne(
            {
              userId: userId,
            },
            { roles: 1 }
          )
          .lean();

        if (!userExtensionDoument) {
          throw {
            status: httpStatusCode.bad_request.status,
            message: messageConstants.apiResponses.USER_EXTENSION_NOT_FOUND,
          };
        }

        let entities = [];

        for (
          let pointerToUserExtension = 0;
          pointerToUserExtension < userExtensionDoument.roles.length;
          pointerToUserExtension++
        ) {
          entities = _.concat(entities, userExtensionDoument.roles[pointerToUserExtension].entities);
        }

        return resolve(entities);
      } catch (error) {
        return reject(error);
      }
    });
  }

  /**
   * Role based acl information
   * @method
   * @name roleBasedAclInformation
   * @param {String} roles - user roles
   * @returns {object}
   */

  static roleBasedAclInformation(roles) {
    return new Promise(async (resolve, reject) => {
      try {
        let aclInformation = {};

        for (let role = 0; role < roles.length; role++) {
          if (!aclInformation[roles[role].code]) {
            aclInformation[roles[role].code] = {};
          }

          if (roles[role].acl) {
            aclInformation[roles[role].code] = roles[role].acl;
          }
        }

        return resolve(aclInformation);
      } catch (error) {
        return reject(error);
      }
    });
  }

  /**
   * user access control list
   * @method
   * @name userAccessControlList
   * @param {String} userId - logged in user id.
   * @returns {object}
   */

  static userAccessControlList(userId) {
    return new Promise(async (resolve, reject) => {
      try {
        if (!userId) {
          throw {
            status: httpStatusCode.bad_request.status,
            message: messageConstants.apiResponses.USER_ID_REQUIRED_CHECK,
          };
        }

        let userExtensionDoument = await database.models.userExtension
          .findOne(
            {
              userId: userId,
            },
            { 'roles.acl': 1 }
          )
          .lean();

        if (!userExtensionDoument) {
          return resolve({
            success: false,
          });
        }

        let acl = {};

        for (
          let pointerToUserExtension = 0;
          pointerToUserExtension < userExtensionDoument.roles.length;
          pointerToUserExtension++
        ) {
          let currentUserRole = userExtensionDoument.roles[pointerToUserExtension];

          if (currentUserRole.acl) {
            let aclKeys = Object.keys(currentUserRole.acl);

            for (let aclKey = 0; aclKey < aclKeys.length; aclKey++) {
              let currentAclKey = aclKeys[aclKey];

              if (!acl[currentAclKey]) {
                acl[currentAclKey] = [];
              }

              if (currentUserRole.acl[aclKeys[aclKey]].tags) {
                acl[currentAclKey] = _.union(acl[currentAclKey], currentUserRole.acl[aclKeys[aclKey]].tags);
              }
            }
          }
        }

        return resolve({
          success: true,
          acl: acl,
        });
      } catch (error) {
        return reject(error);
      }
    });
  }

  /**
   * Get user entity universe by entity type.
   * @method
   * @name getUserEntitiyUniverseByEntityType
   * @param {String} [userId = false] -logged in user id.
   * @param {String} [entityType = false] - entity type.
   * @returns {Array} list of all entities.
   */

  static getUserEntitiyUniverseByEntityType(userId = false, entityType = false) {
    return new Promise(async (resolve, reject) => {
      try {
        if (!userId) {
          throw messageConstants.apiResponses.USER_ID_REQUIRED_CHECK;
        }

        if (!entityType) {
          throw messageConstants.apiResponses.ENTITY_ID_REQUIRED_CHECK;
        }

        let allEntities = new Array();

        let userExtensionEntities = await this.getUserEntities(userId);

        if (!userExtensionEntities.length > 0) {
          resolve(allEntities);
        } else {
          allEntities = userExtensionEntities;
        }

        let entitiesFound = await entitiesHelper.entityDocuments(
          {
            _id: { $in: allEntities },
            entityType: entityType,
          },
          [entitiesHelper.entitiesSchemaData().SCHEMA_ENTITY_OBJECT_ID]
        );

        if (entitiesFound.length > 0) {
          entitiesFound.forEach((eachEntityData) => {
            allEntities.push(eachEntityData._id);
          });
        }

        let findQuery = {
          _id: { $in: userExtensionEntities },
          entityType: { $ne: entityType },
        };

        let groups = entitiesHelper.entitiesSchemaData().SCHEMA_ENTITY_GROUP;
        findQuery[`${groups}.${entityType}`] = { $exists: true };

        let remainingEntities = await entitiesHelper.entityDocuments(findQuery, [`${groups}.${entityType}`]);

        if (remainingEntities.length > 0) {
          remainingEntities.forEach((eachEntityNotFound) => {
            allEntities = _.concat(allEntities, eachEntityNotFound.groups[entityType]);
          });
        }

        return resolve(allEntities);
      } catch (error) {
        return reject(error);
      }
    });
  }

  /**
   * Entities list
   * @method
   * @name entities
   * @param userId - logged in user Id
   * @param entityType - entity type
   * @param pageSize - Page limit
   * @param pageNo - Page No
   * @param search - search data
   * @returns {JSON} List of entities of the given type.
   */

  static entities(userId, entityType, pageSize, pageNo, search) {
    return new Promise(async (resolve, reject) => {
      try {
        let entities = await this.getUserEntities(userId);

        if (!entities.length > 0) {
          throw {
            status: httpStatusCode.bad_request.status,
            message: messageConstants.apiResponses.ENTITY_NOT_FOUND,
          };
        }

        let entitiesFound = await entitiesHelper.entityDocuments(
          {
            _id: { $in: entities },
            entityType: entityType,
          },
          ['_id']
        );

        let allEntities = [];

        if (entitiesFound.length > 0) {
          entitiesFound.forEach((eachEntityData) => {
            allEntities.push(eachEntityData._id);
          });
        }

        let findQuery = {
          _id: { $in: entities },
          entityType: { $ne: entityType },
          [`groups.${entityType}`]: { $exists: true },
        };

        let remainingEntities = await entitiesHelper.entityDocuments(findQuery, [`groups.${entityType}`]);

        if (remainingEntities.length > 0) {
          remainingEntities.forEach((entity) => {
            allEntities = _.concat(allEntities, entity.groups[entityType]);
          });
        }

        if (!allEntities.length > 0) {
          throw {
            status: httpStatusCode.bad_request.status,
            message: messageConstants.apiResponses.ENTITY_NOT_FOUND,
          };
        }

        let queryObject = {
          $match: {
            _id: { $in: allEntities },
          },
        };

        let userAccessControlList = await this.userAccessControlList(userId);

        if (
          userAccessControlList.success &&
          userAccessControlList.acl[entityType] &&
          userAccessControlList.acl[entityType].length > 0
        ) {
          queryObject['$match']['metaInformation.tags'] = {
            $in: userAccessControlList.acl[entityType],
          };
        }

        if (search && search !== '') {
          queryObject['$match']['$or'] = [
            { 'metaInformation.name': new RegExp(search, 'i') },
            { 'metaInformation.externalId': new RegExp('^' + search, 'm') },
            { 'metaInformation.addressLine1': new RegExp(search, 'i') },
            { 'metaInformation.addressLine2': new RegExp(search, 'i') },
          ];
        }

        let skippingValue = pageSize * (pageNo - 1);

        let result = await database.models.entities.aggregate([
          queryObject,
          {
            $project: {
              'metaInformation.externalId': 1,
              'metaInformation.name': 1,
              'metaInformation.addressLine1': 1,
              'metaInformation.addressLine2': 1,
              'metaInformation.administration': 1,
              'metaInformation.city': 1,
              'metaInformation.country': 1,
              entityTypeId: 1,
              entityType: 1,
            },
          },
          {
            $facet: {
              totalCount: [{ $count: 'count' }],
              data: [{ $skip: skippingValue }, { $limit: pageSize }],
            },
          },
          {
            $project: {
              data: 1,
              count: {
                $arrayElemAt: ['$totalCount.count', 0],
              },
            },
          },
        ]);

        return resolve({
          message: messageConstants.apiResponses.USER_EXTENSION_ENTITIES_FETCHED,
          result: result[0].data,
          count: result[0].count ? result[0].count : 0,
        });
      } catch (error) {
        return reject(error);
      }
    });
  }

  /**
   * Default user extension schemas value.
   * @method
   * @name userExtensionSchemaData
   * @returns {JSON} List of default schemas.
   */

  static userExtensionSchemaData() {
    return {
      USER_EXTENSION_ROLE: 'roles',
      USER_EXTENSION_ENTITY_DOCUMENTS: 'entityDocuments',
      USER_EXTENSION_ROLE_DOCUMENTS: 'roleDocuments',
    };
  }

  /**
   * Push user data to elastic search
   * @method
   * @name pushUserToElasticSearch
   * @name userData - created or modified user data.
   * @returns {Object}
   */

  static pushUserToElasticSearch(userData, removeUserFromEntity = {}) {
    return new Promise(async (resolve, reject) => {
      try {
        let userInformation = _.pick(userData, [
          '_id',
          'status',
          'isDeleted',
          'deleted',
          'roles',
          'userId',
          'externalId',
          'updatedBy',
          'createdBy',
          'updatedAt',
          'createdAt',
        ]);

        await elasticSearchData.createOrUpdate(userData.userId, process.env.ELASTICSEARCH_USER_EXTENSION_INDEX, {
          data: userInformation,
        });

        if (userInformation.roles.length > 0) {
          await entitiesHelper.updateUserRolesInEntitiesElasticSearch(userInformation.roles, userInformation.userId);
        }

        if (Object.keys(removeUserFromEntity).length > 0) {
          await entitiesHelper.deleteUserRoleFromEntitiesElasticSearch(
            removeUserFromEntity.entityId,
            removeUserFromEntity.role,
            userInformation.userId
          );
        }

        return resolve({
          success: true,
        });
      } catch (error) {
        return reject(error);
      }
    });
  }

  /**
   * Update userExtension document.
   * @method
   * @name updateUserExtensionDocument
   * @param {Object} query - query to find document
   * @param {Object} updateObject - fields to update
   * @returns {String} - message.
   */

  static updateUserExtensionDocument(query = {}, updateObject = {}) {
    return new Promise(async (resolve, reject) => {
      try {
        if (Object.keys(query).length == 0) {
          throw new Error(messageConstants.apiResponses.POLL_UPDATE_QUERY_REQUIRED);
        }

        if (Object.keys(updateObject).length == 0) {
          throw new Error(messageConstants.apiResponses.UPDATE_OBJECT_REQUIRED);
        }

        let updateResponse = await database.models.userExtension.updateOne(query, updateObject);

        if (updateResponse.nModified == 0) {
          throw new Error(messageConstants.apiResponses.USER_EXTENSION_COULD_NOT_BE_UPDATED);
        }

        return resolve({
          success: true,
          message: messageConstants.apiResponses.USER_EXTENSION_UPDATED,
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
   * find userExtensions
   * @method
   * @name userExtensionDocuments
   * @param {Array} [userExtensionFilter = "all"] - userId ids.
   * @param {Array} [fieldsArray = "all"] - projected fields.
   * @param {Array} [skipFields = "none"] - field not to include
   * @returns {Array} List of Users.
   */

  static userExtensionDocuments(userExtensionFilter = 'all', fieldsArray = 'all', skipFields = 'none') {
    return new Promise(async (resolve, reject) => {
      try {
        let queryObject = userExtensionFilter != 'all' ? userExtensionFilter : {};

        let projection = {};

        if (fieldsArray != 'all') {
          fieldsArray.forEach((field) => {
            projection[field] = 1;
          });
        }

        if (skipFields !== 'none') {
          skipFields.forEach((field) => {
            projection[field] = 0;
          });
        }

        let userDocuments = await database.models.userExtension.find(queryObject, projection).lean();

        return resolve(userDocuments);
      } catch (error) {
        return reject(error);
      }
    });
  }
};

/**
 * Add access control list for user.
 * @method
 * @name aclData
 * @param {Object} userRole
 * @returns {JSON} added acl data inside user roles.
 */

function aclData(userRole) {
  let userRoleKeys = Object.keys(userRole);

  for (let userRoleKey = 0; userRoleKey < userRoleKeys.length; userRoleKey++) {
    let currentRoleKey = userRoleKeys[userRoleKey];

    if (currentRoleKey.startsWith('acl')) {
      if (!userRole['acl']) {
        userRole['acl'] = {};
      }
      let aclData = currentRoleKey.split('_');

      userRole.acl[aclData[1]] = {
        tags: userRole[currentRoleKey].split(','),
      };
      delete userRole[currentRoleKey];
    }
  }
  return userRole;
}

/**
 * Create a Kafka event payload for a user-program-role mapping operation.
 * @method
 * @name createKafkaPayload
 * @param {Object} userProfile - The user profile object containing `id` and `username`.
 * @param {String} programId - The ID of the program being mapped.
 * @param {String} role - The role being assigned or removed.
 * @param {String} eventType - The type of event ('create' or 'delete').
 * @returns {Object} - Kafka event payload.
 */
function createKafkaPayload (userProfile, programId, role, eventType){

  return {
    userId: userProfile.id,
    username: userProfile.username,
    programId: programId,
    role,
    eventType,
  }

}
/**
* Add a new program-role mapping to a user's profile and populate Kafka events.
* @method
* @name addNewProgramEntry
* @param {Object} userProfile - The user profile object containing `id` and `username`.
* @param {String} programId - The ID of the new program being added.
* @param {Array<String>} newRoles - The list of roles to assign under the new program.
* @param {Array<Object>} existingUserProgramRoleMapping - Current program-role mappings to be updated.
* @param {Array<Object>} kafkaEventPayloads - Array to which Kafka event payloads will be pushed.
* @returns {void}
*/
function addNewProgramEntry(userProfile, programId, newRoles,existingUserProgramRoleMapping, kafkaEventPayloads){
  existingUserProgramRoleMapping.push({
    programId: programId,
    roles: [...newRoles],
  });
  // All roles are new, emit create events
  for (const role of newRoles) {
    kafkaEventPayloads.push(createKafkaPayload(userProfile, programId, role, messageConstants.common.CREATE_EVENT_TYPE));
  }
};