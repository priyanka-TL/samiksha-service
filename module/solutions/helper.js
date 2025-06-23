/**
 * name : solutions/helper.js
 * author : Praveen
 * created-date : 13-jul-2024
 * Description : Solution related helper functionality.
 */

//Dependencies
const entitiesHelper = require(MODULES_BASE_PATH + '/entities/helper');
const userExtensionHelper = require(MODULES_BASE_PATH + '/userExtension/helper');
const criteriaHelper = require(MODULES_BASE_PATH + '/criteria/helper');
const userRolesHelper = require(MODULES_BASE_PATH + '/userRoles/helper');
const appsPortalBaseUrl = process.env.APP_PORTAL_BASE_URL + '/';
const programsHelper = require(MODULES_BASE_PATH + '/programs/helper');
const timeZoneDifference = process.env.TIMEZONE_DIFFRENECE_BETWEEN_LOCAL_TIME_AND_UTC;
const surveyHelper = require(MODULES_BASE_PATH + '/surveys/helper');
const observationHelper = require(MODULES_BASE_PATH + '/observations/helper');
const userHelper = require(MODULES_BASE_PATH + '/users/helper');
const improvementProjectService = require(ROOT_PATH + '/generics/services/improvement-project');
const validateEntity = process.env.VALIDATE_ENTITIES;
const programUsersHelper = require(MODULES_BASE_PATH + '/programUsers/helper');
const programsQueries = require(DB_QUERY_BASE_PATH + '/programs');
const solutionsQueries = require(DB_QUERY_BASE_PATH + '/solutions');
const entityManagementService = require(ROOT_PATH + '/generics/services/entity-management');
const userService = require(ROOT_PATH + '/generics/services/users');

/**
 * SolutionsHelper
 * @class
 */
module.exports = class SolutionsHelper {
  /**
   * Create solution.
   * @method
   * @name createSolution
   * @param {Object} solutionData - solution creation data.
   * @param {Boolean} checkDate this is true for when its called via API calls
   * @returns {JSON} solution creation data.
   */

  static createSolution(solutionData, checkDate = false,tenantData) {
    return new Promise(async (resolve, reject) => {
      try {
        //Get the program details to update on the new solution document
        let programData = [];
        //Condition for check solution falls under the program or not
        if (solutionData.programExternalId) {
          programData = await programsQueries.programDocuments(
            {
              externalId: solutionData.programExternalId,
            },
            ['name', 'description', 'scope', 'endDate', 'startDate']
          );
          if (!(programData.length > 0)) {
            throw {
              message: messageConstants.apiResponses.PROGRAM_NOT_FOUND,
            };
          }
          //adding program details to the solution document
          solutionData.programId = programData[0]._id;
          solutionData.programName = programData[0].name;
          solutionData.programDescription = programData[0].description;
        }

        if (solutionData.type == messageConstants.common.COURSE && !solutionData.link) {
          return resolve({
            status: httpStatusCode.bad_request.status,
            message: messageConstants.apiResponses.COURSE_LINK_REQUIRED,
          });
        }
        // if req body has entities adding that to solution document
        if (solutionData.entities && solutionData.entities.length > 0) {
          let entityIds = [];
          let locationData = gen.utils.filterLocationIdandCode(solutionData.entities);
          if (locationData.ids.length > 0) {
            let bodyData = {
              _id: { $in: locationData.codes },
              tenantId: tenantData.tenantId,
              orgIds:{$in:['ALL',tenantData.orgId]}
            };
            let entityData = await entityManagementService.entityDocuments(bodyData);
            if (entityData.success) {
              entityData.data.forEach((entity) => {
                entityIds.push(entity._id);
              });
            }
          }

          // if (locationData.codes.length > 0) {
          //   let filterData = {
          //     externalId: locationData.codes,
          //   };
          //   let schoolDetails = await entityManagementService.locationSearch(filterData);
          //   if (schoolDetails.success) {
          //     let schoolData = schoolDetails.data;
          //     schoolData.forEach((entity) => {
          //       entityIds.push(entity.externalId);
          //     });
          //   }
          // }

          // if (!(entityIds.length > 0)) {
          //   throw {
          //     message: messageConstants.apiResponses.ENTITIES_NOT_FOUND,
          //   };
          // }

          solutionData.entities = entityIds;
        }

        //addding minNoOfSubmissionsRequired in solution documents
        if (
          solutionData.minNoOfSubmissionsRequired &&
          solutionData.minNoOfSubmissionsRequired > messageConstants.common.DEFAULT_SUBMISSION_REQUIRED
        ) {
          if (!solutionData.allowMultipleAssessemts) {
            solutionData.minNoOfSubmissionsRequired = messageConstants.common.DEFAULT_SUBMISSION_REQUIRED;
          }
        }

        solutionData.status = messageConstants.common.ACTIVE_STATUS;

        // adding start and end Date to solution documents
        if (checkDate) {
          if (solutionData.hasOwnProperty('endDate')) {
            solutionData.endDate = gen.utils.getEndDate(solutionData.endDate, timeZoneDifference);
            if (programData.length > 0 && solutionData.endDate > programData[0].endDate) {
              solutionData.endDate = programData[0].endDate;
            }
          }
          if (solutionData.hasOwnProperty('startDate')) {
            solutionData.startDate = gen.utils.getStartDate(solutionData.startDate, timeZoneDifference);
            if (programData.length > 0 && solutionData.startDate < programData[0].startDate) {
              solutionData.startDate = programData[0].startDate;
            }
          }
        }

        solutionData['tenantId'] = tenantData.tenantId;
        solutionData['orgId'] = tenantData.orgId[0];

        if(solutionData['scope']){
          solutionData['scope']['organization'] = tenantData.orgId;
        }


        // create new solution document
        let solutionCreation = await solutionsQueries.createSolution(_.omit(solutionData, ['scope']));

        if (!solutionCreation._id) {
          throw {
            message: messageConstants.apiResponses.SOLUTION_NOT_CREATED,
          };
        }

        // adding solution id to the program components key
        if (solutionData.programExternalId) {
          let updateProgram = await programsQueries.findOneAndUpdate(
            {
              _id: solutionData.programId,
            },
            {
              $addToSet: { components: solutionCreation._id },
            }
          );
        }
        // adding scope to the solution document
        if (!solutionData.excludeScope) {
          let solutionScope = await this.setScope(
            solutionData.programId,
            solutionCreation._id,
            solutionData.scope ? solutionData.scope : {}
          );
        }

        return resolve({
          message: messageConstants.apiResponses.SOLUTION_CREATED,
          data: {
            _id: solutionCreation._id,
          },
        });
      } catch (error) {
        return reject(error);
      }
    });
  }
  /**
   * List of solutions and targeted ones.
   * @method
   * @name targetedSolutions
   * @param {Object} requestedData   - req bidy.
   * @param {String} solutionType   - type of solutions.
   * @param {String} userId         - logged in user id.
   * @param {Number} pageNo         - Recent page no.
   * @param {Number} pageSize       - Size of page.
   * @param {String} search         - search text.
   * @param {String} [ filter = ""] - filter text.
   * @param {String} currentScopeOnly - flag to return records only based on scope
   * @param {String} tenantFilter - tenant data
   * @returns {Object} - Details of the solution.
   */

  static targetedSolutions(
    requestedData,
    solutionType,
    userId,
    pageSize,
    pageNo,
    search,
    filter,
    surveyReportPage = '',
    currentScopeOnly = false,
    tenantFilter,
  ) {
    return new Promise(async (resolve, reject) => {
      try {
         currentScopeOnly =gen.utils.convertStringToBoolean(currentScopeOnly)
        //fetch the assigned solutions for the user
        let assignedSolutions = await this.assignedUserSolutions(
          solutionType,
          userId,
          search,
          filter,
          surveyReportPage,
          tenantFilter
        );

        let totalCount = 0;
        let mergedData = [];
        let solutionIds = [];
        if (assignedSolutions.success && assignedSolutions.data) {
          // Remove observation solutions which for project tasks.

          _.remove(assignedSolutions.data.data, function (solution) {
            return (
              solution.referenceFrom == messageConstants.common.PROJECT &&
              solution.type == messageConstants.common.OBSERVATION
            );
          });

          totalCount =
            assignedSolutions.data.data && assignedSolutions.data.data.length > 0
              ? assignedSolutions.data.data.length
              : totalCount;
          mergedData = assignedSolutions.data.data;

          if (mergedData.length > 0) {
            let programIds = [];

            mergedData.forEach((mergeSolutionData) => {
              if (mergeSolutionData.solutionId) {
                solutionIds.push(mergeSolutionData.solutionId);
              }

              if (mergeSolutionData.programId) {
                programIds.push(mergeSolutionData.programId);
              }
            });

            let programsData = await programsQueries.programDocuments(
              {
                _id: { $in: programIds },
                tenantId: tenantFilter.tenantId
              },
              ['name']
            );

            if (programsData.length > 0) {
              let programs = programsData.reduce((ac, program) => ({ ...ac, [program._id.toString()]: program }), {});

              mergedData = mergedData.map((data) => {
                if (data.programId && programs[data.programId.toString()]) {
                  data.programName = programs[data.programId.toString()].name;
                }
                return data;
              });
            }
          }
        }

        requestedData['filter'] = {};
        if (solutionIds.length > 0 && !currentScopeOnly) {
          requestedData['filter']['skipSolutions'] = solutionIds;
        }

        if (filter && filter !== '') {
          if (filter === messageConstants.common.CREATED_BY_ME) {
            requestedData['filter']['isAPrivateProgram'] = {
              $ne: false,
            };
          } else if (filter === messageConstants.common.ASSIGN_TO_ME) {
            requestedData['filter']['isAPrivateProgram'] = false;
          }
        }

        let targetedSolutions = {
          success: false,
        };

        let getTargetedSolution = true;

        if (filter === messageConstants.common.DISCOVERED_BY_ME) {
          getTargetedSolution = false;
        } else if (gen.utils.convertStringToBoolean(surveyReportPage) === true) {
          getTargetedSolution = false;
        }
        // solutions based on role and location
        if (getTargetedSolution) {
          targetedSolutions = await this.forUserRoleAndLocation(requestedData, solutionType, '', '', '', '', search);
        }

        
        if (targetedSolutions.success) {
					// When targetedSolutions is empty and currentScopeOnly is set to true send empty response
					if (!(targetedSolutions.data.data.length > 0) && currentScopeOnly) {
						return resolve({
							success: true,
							message: messageConstants.apiResponses.TARGETED_SOLUTIONS_FETCHED,
							data: {
								data: targetedSolutions.data.data,
								count: targetedSolutions.data.data.length,
							},
							result: {
								data: targetedSolutions.data.data,
								count: targetedSolutions.data.data.length,
							},
						})
					}
					// When targetedSolutions is not empty alter the response based on the value of currentScopeOnly
					if (targetedSolutions.data.data && targetedSolutions.data.data.length > 0) {
						let filteredTargetedSolutions = []
						targetedSolutions.data.data.forEach((targetedSolution) => {

              targetedSolution.solutionId = targetedSolution._id;
              targetedSolution._id = '';

              if (solutionType !== messageConstants.common.COURSE) {
                targetedSolution['creator'] = targetedSolution.creator ? targetedSolution.creator : '';
              }

              if (solutionType === messageConstants.common.SURVEY) {
                targetedSolution.isCreator = false;
              }

							filteredTargetedSolutions.push(targetedSolution)
              delete targetedSolution.type;
              delete targetedSolution.externalId;

						})
            
						if (currentScopeOnly) {
              filteredTargetedSolutions.forEach((solution) => {
								// Find the corresponding project in mergedData where solutionId matches _id
								const matchingRecord = _.find(mergedData, (record) => {
									return String(record.solutionId) === String(solution.solutionId)
								})

								if (matchingRecord) {
									// Add all keys from the matching project to the solution object
									Object.assign(solution, matchingRecord)
								}
							})

							mergedData = filteredTargetedSolutions
							totalCount = mergedData.length
						} else {
							filteredTargetedSolutions.forEach((solution) => {
								// Check if the solution _id exists in mergedData solutionId
								const existsInMergedData = _.some(mergedData, (record) => {
									return String(record.solutionId) === String(solution.solutionId)
								})

								if (!existsInMergedData) {
									mergedData.push(solution)
								}
							})

              totalCount = mergedData.length;
            }
          }
        }

        if (mergedData.length > 0) {
          let startIndex = pageSize * (pageNo - 1);
          let endIndex = startIndex + pageSize;
          mergedData = mergedData.slice(startIndex, endIndex);
        }

        return resolve({
          success: true,
          message: messageConstants.apiResponses.TARGETED_SOLUTIONS_FETCHED,
          data: {
            data: mergedData,
            count: totalCount,
          },
        });
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
   * Solution details.
   * @method
   * @name assignedUserSolutions
   * @param {String} solutionType   - type of solutions.
   * @param {String} userId         - logged in user id.
   * @param {Number} pageNo         - Recent page no.
   * @param {Number} pageSize       - Size of page.
   * @param {String} search         - search text.
   * @param {String} [ filter = ""] - filter text.
   * @param {Object} tenantFilter - tenantFilter contains tenant information
   * @returns {Object} - Details of the solution.
   */

  static assignedUserSolutions(solutionType, userId, search, filter, surveyReportPage = '',tenantFilter) {
    return new Promise(async (resolve, reject) => {
      try {
        let userAssignedSolutions = {};
        //Checking for user assigned solutions based on solutionType
        if (solutionType === messageConstants.common.OBSERVATION) {
          userAssignedSolutions = await observationHelper.userAssigned(
            userId,
            '', //Page No
            '', //Page Size
            search,
            filter,
            tenantFilter
          );
        } else if (solutionType === messageConstants.common.SURVEY) {
          userAssignedSolutions = await surveyHelper.userAssigned(
            userId,
            '', //Page No
            '', //Page Size
            search,
            filter,
            surveyReportPage,
            tenantFilter
          );
        }
        // else {
        //   userAssignedSolutions =
        //     // Ml-core it will available IN imporovement project service

        //     await improvementProjectService.assignedProjects(userId, search, filter);
        // }

        return resolve(userAssignedSolutions);
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
        let entities = [];
        let entityTypes = [];
        let filterQuery = {
          isReusable: false,
          isDeleted: false,
        };

        Object.keys(_.omit(data, ['role', 'filter', 'factors', 'type','tenantId','orgId','organizations'])).forEach((key) => {
          data[key] = data[key].split(',');
        });
        // If validate entity set to ON . strict scoping should be applied
        if (validateEntity !== messageConstants.common.OFF) {
          // Getting entities and entity types from request body
          Object.keys(_.omit(data, ['filter', 'role', 'factors', 'type','tenantId','orgId','organizations'])).forEach((requestedDataKey) => {
             entities.push(...data[requestedDataKey]);
            // if (requestedDataKey == 'entityType') entityTypes.push(data[requestedDataKey]);
            entityTypes.push(requestedDataKey);
          });
          if (!(entities.length > 0)) {
            throw {
              message: messageConstants.apiResponses.NO_LOCATION_ID_FOUND_IN_DATA,
            };
          }

          /*
          if (!data.role) {
            throw {
              message: messageConstants.apiResponses.USER_ROLES_NOT_FOUND,
            };
          }
          // filterQuery['scope.roles.code'] = {
          //   $in: [messageConstants.common.ALL_ROLES, ...data.role.split(',')],
          // };
          filterQuery['scope.roles'] = {
            $in: [messageConstants.common.ALL_ROLES, ...data.role.split(',')],
          };
          */
          // filterQuery['scope.entities'] = { $in: entities };
          let userRoleInfo = _.omit(data, ['filter', 'factors', 'role', 'type','tenantId','orgId']);

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
            filterQuery['$and'] = queryFilter;
          }
          let dataToOmit = ['filter', 'role', 'factors', 'type','tenantId','orgId']
          // factors.append(dataToOmit)

          const finalKeysToRemove = [...new Set([...dataToOmit, ...factors])];

          let locationData = []

          Object.keys(_.omit(data, finalKeysToRemove)).forEach((key) => {
            locationData.push({
              [`scope.${key}`]: { $in: data[key] },
            });
          });
          
          if(filterQuery['$and']){
            filterQuery['$and'].push({
              $or: locationData,
            });
          }else{
            filterQuery['$or'].push({
              $or: locationData,
            });
          }

          filterQuery['scope.entityType'] = { $in: entityTypes };
          
        } else {
          // let userRoleInfo = _.omit(data, ['filter', , 'factors', 'role','type']);
          // let userRoleKeys = Object.keys(userRoleInfo);
          // userRoleKeys.forEach((entities) => {
          //   filterQuery['scope.' + entities] = {
          //     $in: userRoleInfo[entities].split(','),
          //   };
          // });

          // Obtain userInfo
          let userRoleInfo = _.omit(data, ['filter', 'factors', 'role', 'type','tenantId','orgId']);
          let userRoleKeys = Object.keys(userRoleInfo);
          let queryFilter = [];

          // if factors are passed or query has to be build based on the keys passed
          // factors = [ 'professional_role', 'professional_subroles' ]
          if (data.hasOwnProperty('factors') && data.factors.length > 0) {
            let factors = data.factors;
            // Build query based on each key
            factors.forEach((factor) => {
              let scope = 'scope.' + factor;
              let values = userRoleInfo[factor];
              if (factor === 'role') {
                queryFilter.push({
                  ['scope.roles']: { $in: [messageConstants.common.ALL_ROLES, ...data.role.split(',')] },
                });
              } else if (!Array.isArray(values)) {
                queryFilter.push({ [scope]: { $in: values.split(',') } });
              } else {
                queryFilter.push({ [scope]: { $in: [...values] } });
              }
            });
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
              let scope = 'scope.' + key;
              let values = userRoleInfo[key];

              if (!Array.isArray(values)) {
                queryFilter.push({ [scope]: { $in: values.split(',') } });
              } else {
                queryFilter.push({ [scope]: { $in: [...values] } });
              }
            });

            if (data.role) {
              queryFilter.push({
                ['scope.roles']: { $in: [messageConstants.common.ALL_ROLES, ...data.role.split(',')] },
              });
            }
           if(queryFilter.length>0){
            // append query filter
            filterQuery['$and'] = queryFilter;
           }
          }
        }

        if (type === messageConstants.common.SURVEY) {
          filterQuery['status'] = {
            $in: [messageConstants.common.ACTIVE_STATUS, messageConstants.common.INACTIVE_STATUS],
          };
          let validDate = new Date();
          validDate.setDate(validDate.getDate() - messageConstants.common.DEFAULT_SURVEY_REMOVED_DAY);
          filterQuery['endDate'] = { $gte: validDate };
        } else {
          filterQuery.status = messageConstants.common.ACTIVE_STATUS;
        }

        filterQuery.tenantId = data.tenantId;

        if (data.filter && Object.keys(data.filter).length > 0) {
          let solutionsSkipped = [];

          if (data.filter.skipSolutions) {
            data.filter.skipSolutions.forEach((solution) => {
              solutionsSkipped.push(new ObjectId(solution.toString()));
            });

            data.filter['_id'] = {
              $nin: solutionsSkipped,
            };

            delete data.filter.skipSolutions;
          }

          filterQuery = _.merge(filterQuery, data.filter);
        }

        delete filterQuery['scope.entityType'];
        filterQuery.tenantId = data.tenantId
        return resolve({
          success: true,
          data: filterQuery,
        });
      } catch (error) {
        return resolve({
          success: false,
          status: error.status ? error.status : httpStatusCode['internal_server_error'].status,
          message: error.message,
          data: {},
        });
      }
    });
  }

  /**
   * List of solutions based on role and location.
   * @method
   * @name forUserRoleAndLocation
   * @param {String} bodyData - Requested body data.
   * @param {String} type - solution type.
   * @param {String} subType - solution sub type.
   * @param {String} programId - program Id
   * @param {String} pageSize - Page size.
   * @param {String} pageNo - Page no.
   * @param {String} searchText - search text.
   * @returns {JSON} - List of solutions based on role and location.
   */

  static forUserRoleAndLocation(bodyData, type, subType = '', programId, pageSize, pageNo, searchText = '') {
    return new Promise(async (resolve, reject) => {
      try {
        //Getting query based on roles and entity
        let queryData = await this.queryBasedOnRoleAndLocation(bodyData, type, subType, programId);
        if (!queryData.success) {
          return resolve(queryData);
        }
        let matchQuery = queryData.data;
      
        if (type === '' && subType === '') {
          let targetedTypes = _targetedSolutionTypes();

          matchQuery['$or'] = [];

          targetedTypes.forEach((type) => {
            let singleType = {
              type: type,
            };
            matchQuery['$or'].push(singleType);
          });
        } else {
          if (type !== '') {
            matchQuery['type'] = type;
            if (type === messageConstants.common.SURVEY) {
              const currentDate = new Date();
              currentDate.setDate(currentDate.getDate() - 15);
              matchQuery['endDate'] = { $gte: currentDate };
            } else {
              matchQuery['endDate'] = { $gte: new Date() };
            }
          }

          if (subType !== '') {
            matchQuery['subType'] = subType;
          }
        }

        if (programId !== '') {
          matchQuery['programId'] = new ObjectId(programId);
        }
        //matchQuery['startDate'] = { $lte: new Date() };
        //listing the solution based on type and query
        let targetedSolutions = await this.list(type, subType, matchQuery, pageNo, pageSize, searchText, [
          'name',
          'description',
          'programName',
          'programId',
          'externalId',
          'projectTemplateId',
          'type',
          'language',
          'creator',
          'endDate',
          'link',
          'referenceFrom',
          'entityType',
          'certificateTemplateId',
          "status",
        ]);
        return resolve({
          success: true,
          message: messageConstants.apiResponses.TARGETED_SOLUTIONS_FETCHED,
          data: targetedSolutions.data,
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
   * Set scope in solution
   * @method
   * @name setScope
   * @param {String} programId -  programId.
   * @param {String} solutionId - solution id.
   * @param {Object} scopeData - scope data.
   * @param {String} scopeData.entityType - scope entity type
   * @param {Array} scopeData.entities - scope entities
   * @param {Array} scopeData.roles - roles in scope
   * @returns {JSON} - scope in solution.
   */

  static setScope(programId, solutionId, scopeData) {
    return new Promise(async (resolve, reject) => {
      try {
        // Getting program documents
        let programData;
        if (programId) {
          programData = await programsQueries.programDocuments({ _id: programId }, ['_id', 'scope']);

          if (!(programData.length > 0)) {
            return resolve({
              status: httpStatusCode.bad_request.status,
              message: messageConstants.apiResponses.PROGRAM_NOT_FOUND,
            });
          }
        }
        // Getting solution document to set the scope
        let solutionData = await solutionsQueries.solutionDocuments({ _id: solutionId }, ['_id']);

        if (!(solutionData.length > 0)) {
          return resolve({
            status: httpStatusCode.bad_request.status,
            message: messageConstants.apiResponses.SOLUTION_NOT_FOUND,
          });
        }

        //if program documents has scope update the scope in solution document
        let currentSolutionScope;
        if (programId && programData[0].scope) {
          scopeData = JSON.parse(JSON.stringify(programData[0].scope));
        }
        // if (validateEntity !== messageConstants.common.OFF) {
          // if (Object.keys(scopeData).length > 0) {
          //   if (scopeData.entityType) {
          //     // let bodyData = { type: scopeData.entityType };
          //     let bodyData = { entityType: scopeData.entityType };

          //     let entityTypeData = await entityManagementService.locationSearch(bodyData);
          //     if (entityTypeData.success) {
          //       // currentSolutionScope.entityType = entityTypeData.data[0].type;
          //       currentSolutionScope.entityType = entityTypeData.data[0].entityType;
          //     }
          //   }

          //   if (scopeData.entities && scopeData.entities.length > 0) {
          //     //call learners api for search
          //     let entityIds = [];
          //     let bodyData = {};
          //     let locationData = gen.utils.filterLocationIdandCode(scopeData.entities);

          //     if (locationData.ids.length > 0) {
          //       bodyData = {
          //         // id: locationData.ids
          //         'registryDetails.code': { $in: locationData.ids },
          //         // type: currentSolutionScope.entityType,
          //         entityType: currentSolutionScope.entityType,
          //       };
          //       let entityData = await entityManagementService.locationSearch(bodyData);
          //       if (entityData.success) {
          //         entityData.data.forEach((entity) => {
          //           // entityIds.push(entity.id);
          //           // entityIds.push(entity._id);
          //           entityIds.push(entity.registryDetails.locationId);
          //         });
          //       }
          //     }

          //     // if (locationData.codes.length > 0) {
          //     //   let filterData = {
          //     //     'registryDetails.code': locationData.codes,
          //     //     type: currentSolutionScope.entityType,
          //     //   };
          //     //   let entityDetails = await userService.locationSearch(filterData);

          //     //   if (entityDetails.success) {
          //     //     entityDetails.data.forEach((entity) => {
          //     //       entityIds.push(entity.id);
          //     //     });
          //     //   }
          //     // }

          //     if (!(entityIds.length > 0)) {
          //       return resolve({
          //         status: httpStatusCode.bad_request.status,
          //         message: messageConstants.apiResponses.ENTITIES_NOT_FOUND,
          //       });
          //     }

          //     let entitiesData = [];

          //     // if( currentSolutionScope.entityType !== programData[0].scope.entityType ) {
          //     //   let result = [];
          //     //   let childEntities = await userService.getSubEntitiesBasedOnEntityType(currentSolutionScope.entities, currentSolutionScope.entityType, result);
          //     //   if( childEntities.length > 0 ) {
          //     //     entitiesData = entityIds.filter(element => childEntities.includes(element));
          //     //   }
          //     // } else {
          //     entitiesData = entityIds;
          //     // }

          //     if (!(entitiesData.length > 0)) {
          //       return resolve({
          //         status: httpStatusCode.bad_request.status,
          //         message: messageConstants.apiResponses.SCOPE_ENTITY_INVALID,
          //       });
          //     }

          //     currentSolutionScope.entities = entitiesData;
          //   }
          // }

          // if (scopeData.roles) {
          //   if (Array.isArray(scopeData.roles) && scopeData.roles.length > 0) {
          //     let userRoles = await userRolesHelper.roleDocuments(
          //       {
          //         code: { $in: scopeData.roles },
          //       },
          //       ['_id', 'code'],
          //     );

          //     if (!(userRoles.length > 0)) {
          //       return resolve({
          //         status: httpStatusCode.bad_request.status,
          //         message: messageConstants.apiResponses.INVALID_ROLE_CODE,
          //       });
          //     }

          //     currentSolutionScope['roles'] = userRoles;
          //   } else {
          //     if (scopeData.roles === messageConstants.common.ALL_ROLES) {
          //       currentSolutionScope['roles'] = [
          //         {
          //           code: messageConstants.common.ALL_ROLES,
          //         },
          //       ];
          //     }
          //   }
          // }

          let scopeDatas = Object.keys(scopeData);
          
          let scopeDataIndex = scopeDatas.map((index) => {
            return `scope.${index}`;
          });

          let solutionIndex = await solutionsQueries.listIndexesFunc();

          let indexes = solutionIndex.map((indexedKeys) => {
            return Object.keys(indexedKeys.key)[0];
          });
          let keysNotIndexed = _.differenceWith(scopeDataIndex, indexes);
          if (keysNotIndexed.length > 0) {
            let keysCannotBeAdded = keysNotIndexed.map((keys) => {
              return keys.split('.')[1];
            });
            scopeData = _.omit(scopeData, keysCannotBeAdded);
          }
          const updateObject = {
            $set: {},
          }
          // Assign the scopeData to the scope field in updateObject
				updateObject['$set']['scope'] = scopeData

				// Extract all keys from scopeData except 'roles', and merge their values into a single array
				const entities = Object.keys(scopeData)
					.filter((key) => key !== 'roles')
					.reduce((acc, key) => acc.concat(scopeData[key]), [])

				// Assign the entities array to the entities field in updateObject
				// updateObject.$set.entities = entities

				// Create a comma-separated string of all keys in scopeData except 'roles'
				scopeData['entityType'] = Object.keys(_.omit(scopeData, ['roles'])).join(',')

				// Assign the entityType string to the entityType field in updateObject
				// updateObject['$set']['entityType'] = scopeData.entityType
        // }
        //  else {
        //   currentSolutionScope = scopeData;
        // }
        
        let updateSolution = await solutionsQueries.updateSolutionDocument(
          {
            _id: solutionId,
          },
          updateObject,
          { new: true }
        );
        if (!updateSolution._id) {
          throw {
            status: messageConstants.apiResponses.SOLUTION_SCOPE_NOT_ADDED,
          };
        }
        solutionData = updateSolution;

        return resolve({
          success: true,
          message: messageConstants.apiResponses.SOLUTION_UPDATED,
        });
      } catch (error) {
        return resolve({
          success: false,
        });
      }
    });
  }

  /**
   * Update solution.
   * @method
   * @name update
   * @param {String} solutionId   - solution id.
   * @param {Object} solutionData - solution update data.
   * @param {Boolean} checkDate   -this is true for when its called via API calls\
   * @param {String} userId       - logged in user id.
   * @param {Object} tenantData   - tenant data.
   * @returns {JSON}              -solution updating data.
   */

  static update(solutionId, solutionData, userId, checkDate = false, tenantData) {
    return new Promise(async (resolve, reject) => {
      try {
        let queryObject = {
          _id: solutionId,
          tenantId: tenantData.tenantId
        };

        // Getting solution document to update based on solution id
        let solutionDocument = await solutionsQueries.solutionDocuments(queryObject, ['_id', 'programId']);
        if (!(solutionDocument.length > 0)) {
          return resolve({
            status: httpStatusCode.bad_request.status,
            message: messageConstants.apiResponses.SOLUTION_NOT_FOUND,
          });
        }

        // if solution document has program id and req body has start and end date update the date in both solution and program document as well
        if (
          solutionDocument[0].programId &&
          checkDate &&
          (solutionData.hasOwnProperty('endDate') || solutionData.hasOwnProperty('endDate'))
        ) {
          // getting program document to update start and end date
          let programData = await programsQueries.programDocuments(
            {
              _id: solutionDocument[0].programId,
              tenantId: tenantData.tenantId
            },
            ['_id', 'endDate', 'startDate']
          );
          if (!(programData.length > 0)) {
            throw {
              message: messageConstants.apiResponses.PROGRAM_NOT_FOUND,
            };
          }
          if (solutionData.hasOwnProperty('endDate')) {
            solutionData.endDate = gen.utils.getEndDate(solutionData.endDate, timeZoneDifference);
            if (solutionData.endDate > programData[0].endDate) {
              solutionData.endDate = programData[0].endDate;
            }
          }
          if (solutionData.hasOwnProperty('startDate')) {
            solutionData.startDate = gen.utils.getStartDate(solutionData.startDate, timeZoneDifference);
            if (solutionData.startDate < programData[0].startDate) {
              solutionData.startDate = programData[0].startDate;
            }
          }
        }

        let updateObject = {
          $set: {},
        };

        // condition to update minNoOfSubmissionsRequired in soluton document
        if (
          solutionData.minNoOfSubmissionsRequired &&
          solutionData.minNoOfSubmissionsRequired > messageConstants.common.DEFAULT_SUBMISSION_REQUIRED
        ) {
          if (!solutionData.allowMultipleAssessemts) {
            solutionData.minNoOfSubmissionsRequired = messageConstants.common.DEFAULT_SUBMISSION_REQUIRED;
          }
        }

        
        let solutionUpdateData = solutionData;
        Object.keys(_.omit(solutionUpdateData, ['scope','tenantId','orgId'])).forEach((updationData) => {
          updateObject['$set'][updationData] = solutionUpdateData[updationData];
        });
        updateObject['$set']['updatedBy'] = userId;
        updateObject['$set']['status'] = 'active';
        //updating solution document
        let solutionUpdatedData = await solutionsQueries.updateSolutionDocument(
          {
            _id: solutionDocument[0]._id,
            tenantId: tenantData.tenantId
          },
          updateObject,
          { new: true }
        );
        if (!solutionUpdatedData._id) {
          throw {
            message: messageConstants.apiResponses.SOLUTION_NOT_CREATED,
          };
        }

        // If req body has scope to update for the solution document
        if (solutionData.scope && Object.keys(solutionData.scope).length > 0) {
          
          if(!solutionData.scope.organizations){
            solutionData.scope.organizations = tenantData.orgId
          }

          let solutionScope = await this.setScope(
            solutionUpdatedData.programId,
            solutionUpdatedData._id,
            solutionData.scope
          );

          if (!solutionScope.success) {
            throw {
              message: messageConstants.apiResponses.COULD_NOT_UPDATE_SCOPE,
            };
          }
        }

        return resolve({
          success: true,
          message: messageConstants.apiResponses.SOLUTION_UPDATED,
          data: solutionData,
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
   * find solutions
   * @method
   * @name solutionDocumentsByAggregateQuery
   * @param {Array} query - aggregation query.
   * @returns {Array} List of solutions.
   */

  static solutionDocumentsByAggregateQuery(query = []) {
    return new Promise(async (resolve, reject) => {
      try {
        let solutionDocuments = await solutionsQueries.getAggregate(query);

        return resolve(solutionDocuments);
      } catch (error) {
        return reject(error);
      }
    });
  }

  /**
   * Create solution.
   * @method create
   * @name create
   * @param {Object} data - solution creation data.
   * @returns {JSON} solution creation data.
   */

  static create(data) {
    return new Promise(async (resolve, reject) => {
      try {
        let solutionData = await solutionsQueries.createSolution(data);

        return resolve(solutionData);
      } catch (error) {
        return reject(error);
      }
    });
  }

  /**
   * Check if the solution is rubric driven i.e isRubricDriven flag as true is present
   * in solution or not
   * @method
   * @name checkIfSolutionIsRubricDriven
   * @param {String} solutionId - solution id.
   * @returns {JSON} Solution document.
   */

  static checkIfSolutionIsRubricDriven(solutionId) {
    return new Promise(async (resolve, reject) => {
      try {
        let solutionDocument = await solutionsQueries.solutionDocuments(
          {
            _id: solutionId,
            scoringSystem: {
              $exists: true,
              $ne: '',
            },
            isRubricDriven: true,
          },
          ['scoringSystem']
        );
        return resolve(solutionDocument);
      } catch (error) {
        return reject(error);
      }
    });
  }

  /**
   * Get entity profile fields from solution.
   * @method
   * @name getEntityProfileFields
   * @param {Object} entityProfileFieldsPerEntityTypes - entity profile fields
   * from solution.
   * @returns {Array} entity fields.
   */

  static getEntityProfileFields(entityProfileFieldsPerEntityTypes) {
    let entityFieldArray = [];

    Object.values(entityProfileFieldsPerEntityTypes).forEach((eachEntityProfileFieldPerEntityType) => {
      eachEntityProfileFieldPerEntityType.forEach((eachEntityField) => {
        entityFieldArray.push(eachEntityField);
      });
    });
    return entityFieldArray;
  }

  /**
   * Solution details.
   * @method
   * @name getDetails
   * @param {String} solutionId - Solution Id.
   * @param {Object} tenantData - tenant data.
   * @returns {Object} - Details of the solution.
   */

  static getDetails(solutionId,tenantData) {
    return new Promise(async (resolve, reject) => {
      try {
        let solutionData = await solutionsQueries.solutionDocuments({
          _id: solutionId,
          tenantId: tenantData.tenantId,
          isDeleted: false,
        });

        if (!solutionData.length > 0) {
          return resolve({
            status: httpStatusCode.bad_request.status,
            message: messageConstants.apiResponses.SOLUTION_NOT_FOUND,
          });
        }

        return resolve({
          message: messageConstants.apiResponses.SOLUTION_DETAILS_FETCHED,
          success: true,
          data: solutionData[0],
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
   * Get all sub entity that exists in single parent entity.
   * @method
   * @name allSubGroupEntityIdsByGroupName
   * @param {String} [solutionExternalId = ""] - solution external id.
   * @param {String} [groupName = ""] - entity type name.
   * @returns {Object} all subEntity present in single parent entity .
   */

  static allSubGroupEntityIdsByGroupName(solutionExternalId = '', groupName = '') {
    return new Promise(async (resolve, reject) => {
      try {
        if (solutionExternalId == '' || groupName == '') {
          throw messageConstants.apiResponses.INVALID_PARAMETER;
        }

        let solutionEntities = await solutionsQueries.findOne(
          {
            externalId: solutionExternalId,
          },
          {
            entities: 1,
          }
        );

        let allSubGroupEntityIdToParentMap = {};

        if (!(solutionEntities.entities.length > 0)) {
          return resolve(allSubGroupEntityIdToParentMap);
        }

        let groupType = 'groups.' + groupName;

        let entitiyDocuments = await database.models.entities
          .find(
            {
              _id: {
                $in: solutionEntities.entities,
              },
              [groupType]: { $exists: true },
            },
            {
              'metaInformation.name': 1,
              'metaInformation.externalId': 1,
              [groupType]: 1,
            }
          )
          .lean();

        entitiyDocuments.forEach((entityDocument) => {
          entityDocument.groups[groupName].forEach((eachSubEntity) => {
            allSubGroupEntityIdToParentMap[eachSubEntity.toString()] = {
              parentEntityId: eachSubEntity._id.toString(),
              // parentEntityId: should be entityDocuments._id
              parentEntityName: entityDocument.metaInformation.name ? entityDocument.metaInformation.name : '',
              parentEntityExternalId: entityDocument.metaInformation.externalId
                ? entityDocument.metaInformation.externalId
                : '',
            };
          });
        });

        return resolve(allSubGroupEntityIdToParentMap);
      } catch (error) {
        return reject(error);
      }
    });
  }

  static uploadTheme(modelName, modelId, themes, headerSequence) {
    return new Promise(async (resolve, reject) => {
      try {
        let allCriteriaDocument = await database.models.criteria.find({}, { _id: 1 }).lean();

        let criteriaArray = allCriteriaDocument.map((eachCriteria) => eachCriteria._id.toString());

        let modifiedThemes = [];
        let themeObject = {};
        let csvArray = [];

        // get Array of object with splitted value
        for (let pointerToTheme = 0; pointerToTheme < themes.length; pointerToTheme++) {
          let result = {};
          let csvObject = {};

          csvObject = { ...themes[pointerToTheme] };
          csvObject['status'] = '';
          let themesKey = Object.keys(themes[pointerToTheme]);
          let firstThemeKey = themesKey[0];

          themesKey.forEach((themeKey) => {
            if (themes[pointerToTheme][themeKey] !== '') {
              let themesSplittedArray = themes[pointerToTheme][themeKey].split('###');

              if (themeKey !== 'criteriaInternalId') {
                if (themesSplittedArray.length < 2) {
                  csvObject['status'] = messageConstants.apiResponses.MISSING_NAME_EXTERNALID;
                } else {
                  let name = themesSplittedArray[0] ? themesSplittedArray[0] : '';

                  result[themeKey] = {
                    name: name,
                  };

                  themeObject[themesSplittedArray[0]] = {
                    name: name,
                    label: themeKey,
                    type: firstThemeKey === themeKey ? 'theme' : 'subtheme',
                    externalId: themesSplittedArray[1],
                    weightage: themesSplittedArray[2] ? parseInt(themesSplittedArray[2]) : 0,
                  };
                }
              } else {
                if (criteriaArray.includes(themesSplittedArray[0])) {
                  result[themeKey] = {
                    criteriaId: new ObjectId(themesSplittedArray[0]),
                    weightage: themesSplittedArray[1] ? parseInt(themesSplittedArray[1]) : 0,
                  };
                } else {
                  csvObject['status'] = 'Criteria is not Present';
                }
              }
            }
          });
          csvArray.push(csvObject);
          modifiedThemes.push(result);
        }

        function generateNestedThemes(nestedThemes, headerData) {
          return nestedThemes.reduce((acc, eachFrameworkData) => {
            headerData.reduce((parent, headerKey, index) => {
              if (index === headerData.length - 1) {
                if (!parent['criteriaId']) {
                  parent['criteriaId'] = [];
                }
                parent.criteriaId.push(eachFrameworkData.criteriaInternalId);
              } else {
                if (eachFrameworkData[headerKey] !== undefined) {
                  parent[eachFrameworkData[headerKey].name] = parent[eachFrameworkData[headerKey].name] || {};
                  return parent[eachFrameworkData[headerKey].name];
                } else {
                  return parent;
                }
              }
            }, acc);
            return acc;
          }, {});
        }

        function themeArray(data) {
          return Object.keys(data).map(function (eachDataKey) {
            let eachData = {};

            if (eachDataKey !== 'criteriaId') {
              eachData['name'] = themeObject[eachDataKey].name;
              eachData['type'] = themeObject[eachDataKey].type;
              eachData['label'] = themeObject[eachDataKey].label;
              eachData['externalId'] = themeObject[eachDataKey].externalId;
              eachData['weightage'] = themeObject[eachDataKey].weightage;
            }

            if (data[eachDataKey].criteriaId) eachData['criteria'] = data[eachDataKey].criteriaId;
            if (eachDataKey !== 'criteriaId' && _.isObject(data[eachDataKey])) {
              return _.merge(eachData, data[eachDataKey].criteriaId ? {} : { children: themeArray(data[eachDataKey]) });
            }
          });
        }

        let checkCsvArray = csvArray.every((csvData) => csvData.status === '');

        if (checkCsvArray) {
          csvArray = csvArray.map((csvData) => {
            csvData.status = 'success';
            return csvData;
          });

          let nestedThemeObject = generateNestedThemes(modifiedThemes, headerSequence);

          let themesData = themeArray(nestedThemeObject);

          await database.models[modelName].findOneAndUpdate(
            {
              _id: modelId,
            },
            {
              $set: {
                themes: themesData,
              },
            }
          );
        }

        return resolve(csvArray);
      } catch (error) {
        
        return reject(error);
      }
    });
  }

  /**
   * Set theme rubric expression.
   * @method
   * @name setThemeRubricExpressions
   * @param {Object} currentSolutionThemeStructure
   * @param {Object} themeRubricExpressionData
   * @param {Array} solutionLevelKeys
   * @returns {Object}
   */

  static setThemeRubricExpressions(currentSolutionThemeStructure, themeRubricExpressionData, solutionLevelKeys) {
    return new Promise(async (resolve, reject) => {
      try {
        themeRubricExpressionData = themeRubricExpressionData.map(function (themeRow) {
          themeRow = gen.utils.valueParser(themeRow);
          themeRow.status = messageConstants.apiResponses.THEME_SUBTHEME_FAILED;
          return themeRow;
        });

        const getThemeExpressions = function (externalId, name) {
          return _.find(themeRubricExpressionData, {
            externalId: externalId,
            name: name,
          });
        };

        const updateThemeRubricExpressionData = function (themeRow) {
          const themeIndex = themeRubricExpressionData.findIndex(
            (row) => row.externalId === themeRow.externalId && row.name === themeRow.name
          );

          if (themeIndex >= 0) {
            themeRubricExpressionData[themeIndex] = themeRow;
          }
        };

        const parseAllThemes = function (themes) {
          themes.forEach((theme) => {
            const checkIfThemeIsToBeUpdated = getThemeExpressions(theme.externalId, theme.name);

            if (checkIfThemeIsToBeUpdated) {
              theme.rubric = {
                expressionVariables: {
                  SCORE: `${theme.externalId}.sumOfPointsOfAllChildren()`,
                },
                levels: {},
              };
              solutionLevelKeys.forEach((level) => {
                theme.rubric.levels[level] = {
                  expression: `(${checkIfThemeIsToBeUpdated[level]})`,
                };
              });

              theme.weightage = checkIfThemeIsToBeUpdated.hasOwnProperty('weightage')
                ? Number(Number.parseFloat(checkIfThemeIsToBeUpdated.weightage).toFixed(2))
                : 0;

              checkIfThemeIsToBeUpdated.status = 'Success';

              updateThemeRubricExpressionData(checkIfThemeIsToBeUpdated);
            }
            // else if(!theme.criteria) {
            //   let someRandomValue = themeRubricExpressionData[Math.floor(Math.random()*themeRubricExpressionData.length)];

            //   theme.rubric = {
            //     expressionVariables : {
            //       SCORE : `${theme.externalId}.sumOfPointsOfAllChildren()`
            //     },
            //     levels : {}
            //   }
            //   solutionLevelKeys.forEach(level => {
            //     theme.rubric.levels[level] = {expression: `(${someRandomValue[level]})`}
            //   })

            //   theme.weightage = (someRandomValue.hasOwnProperty('weightage')) ? Number(Number.parseFloat(someRandomValue.weightage).toFixed(2)) : 0

            // }

            if (theme.children && theme.children.length > 0) {
              parseAllThemes(theme.children);
            }
          });
        };

        parseAllThemes(currentSolutionThemeStructure);

        const flatThemes = await this.generateFlatThemeRubricStructure(currentSolutionThemeStructure);

        return resolve({
          themes: currentSolutionThemeStructure,
          csvData: themeRubricExpressionData,
          flattenedThemes: flatThemes,
        });
      } catch (error) {
        return reject(error);
      }
    });
  }

  /**
   * Update criteria weightage in themes.
   * @method
   * @name updateCriteriaWeightageInThemes
   * @param {Object} currentSolutionThemeStructure
   * @param {Array} criteriaWeightageArray
   * @returns {Object}
   */

  static updateCriteriaWeightageInThemes(currentSolutionThemeStructure, criteriaWeightageArray) {
    return new Promise(async (resolve, reject) => {
      try {
        criteriaWeightageArray = criteriaWeightageArray.map(function (criteria) {
          criteria.criteriaId = criteria.criteriaId.toString();
          return criteria;
        });

        const cirteriaWeightToUpdateCount = criteriaWeightageArray.length;

        let criteriaWeightageUpdatedCount = 0;

        const getCriteriaWeightElement = function (criteriaId) {
          return _.find(criteriaWeightageArray, {
            criteriaId: criteriaId.toString(),
          });
        };

        const parseAllThemes = function (themes) {
          themes.forEach((theme) => {
            if (theme.criteria && theme.criteria.length > 0) {
              for (
                let pointerToCriteriaArray = 0;
                pointerToCriteriaArray < theme.criteria.length;
                pointerToCriteriaArray++
              ) {
                let eachCriteria = theme.criteria[pointerToCriteriaArray];
                const checkIfCriteriaIsToBeUpdated = getCriteriaWeightElement(eachCriteria.criteriaId);
                if (checkIfCriteriaIsToBeUpdated) {
                  theme.criteria[pointerToCriteriaArray] = {
                    criteriaId: new ObjectId(checkIfCriteriaIsToBeUpdated.criteriaId),
                    weightage: Number(Number.parseFloat(checkIfCriteriaIsToBeUpdated.weightage).toFixed(2)),
                  };
                  criteriaWeightageUpdatedCount += 1;
                }
              }
            }

            if (theme.children && theme.children.length > 0) {
              parseAllThemes(theme.children);
            }
          });
        };

        parseAllThemes(currentSolutionThemeStructure);

        const flatThemes = await this.generateFlatThemeRubricStructure(currentSolutionThemeStructure);

        if (criteriaWeightageUpdatedCount == cirteriaWeightToUpdateCount) {
          return resolve({
            themes: currentSolutionThemeStructure,
            flattenedThemes: flatThemes,
            success: true,
          });
        } else {
          throw new Error(messageConstants.apiResponses.CRITERIA_WEIGHTAGE_NOT_UPDATED);
        }
      } catch (error) {
        return reject(error);
      }
    });
  }

  /**
   * Generate flat themes rubric structure.
   * @method
   * @name generateFlatThemeRubricStructure
   * @param {Object} solutionThemeStructure
   * @returns {Array}
   */

  static generateFlatThemeRubricStructure(solutionThemeStructure) {
    let flattenThemes = function (themes, hierarchyLevel = 0, hierarchyTrack = [], flatThemes = []) {
      themes.forEach((theme) => {
        if (theme.children) {
          theme.hierarchyLevel = hierarchyLevel;
          theme.hierarchyTrack = hierarchyTrack;

          let hierarchyTrackToUpdate = [...hierarchyTrack];
          hierarchyTrackToUpdate.push(_.pick(theme, ['type', 'label', 'externalId', 'name']));

          flattenThemes(theme.children, hierarchyLevel + 1, hierarchyTrackToUpdate, flatThemes);

          if (!theme.criteria) theme.criteria = new Array();
          if (!theme.immediateChildren) theme.immediateChildren = new Array();

          theme.children.forEach((childTheme) => {
            if (childTheme.criteria) {
              childTheme.criteria.forEach((criteria) => {
                theme.criteria.push(criteria);
              });
            }
            theme.immediateChildren.push(
              _.omit(childTheme, ['children', 'rubric', 'criteria', 'hierarchyLevel', 'hierarchyTrack'])
            );
          });

          flatThemes.push(_.omit(theme, ['children']));
        } else {
          theme.hierarchyLevel = hierarchyLevel;
          theme.hierarchyTrack = hierarchyTrack;

          let hierarchyTrackToUpdate = [...hierarchyTrack];
          hierarchyTrackToUpdate.push(_.pick(theme, ['type', 'label', 'externalId', 'name']));

          let themeCriteriaArray = new Array();

          theme.criteria.forEach((criteria) => {
            themeCriteriaArray.push({
              criteriaId: criteria.criteriaId,
              weightage: criteria.weightage,
            });
          });

          theme.criteria = themeCriteriaArray;

          flatThemes.push(theme);
        }
      });

      return flatThemes;
    };

    let flatThemeStructure = flattenThemes(_.cloneDeep(solutionThemeStructure));

    return flatThemeStructure;
  }

  /**
   * Search solutions.
   * @method
   * @name search
   * @param {Object} filteredData - Search solutions from filtered data.
   * @param {Number} pageSize - page limit.
   * @param {Number} pageNo - No of the page.
   * @param {Object} projection - Projected data.
   * @param {String} search - Search text.
   * @returns {Array} List of solutions document.
   */

  static search(filteredData, pageSize, pageNo, projection, search = '') {
    return new Promise(async (resolve, reject) => {
      try {
        let solutionDocument = [];

        let projection1 = {};

        if (projection) {
          projection1['$project'] = projection;
        } else {
          projection1['$project'] = {
            name: 1,
            description: 1,
            keywords: 1,
            externalId: 1,
            programId: 1,
            entityTypeId: 1,
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

        solutionDocument.push(filteredData, projection1, facetQuery, projection2);

        let solutionDocuments = await solutionsQueries.getAggregate(solutionDocument);

        return resolve(solutionDocuments);
      } catch (error) {
        return reject(error);
      }
    });
  }

  /**
   * Mandatory data for solutions.Required when updating the solutions.
   * @method
   * @name mandatoryField
   * @returns {Object} Mandatory fields data.
   */

  static mandatoryField() {
    let mandatoryFields = {
      type: 'assessment',
      subType: 'institutional',

      status: 'active',

      isDeleted: false,
      isReusable: false,

      roles: {
        projectManagers: {
          acl: {
            entityProfile: {
              editable: ['all'],
              visible: ['all'],
            },
          },
        },
        leadAssessors: {
          acl: {
            entityProfile: {
              editable: ['all'],
              visible: ['all'],
            },
          },
        },
        assessors: {
          acl: {
            entityProfile: {
              editable: ['all'],
              visible: ['all'],
            },
          },
        },
      },

      evidenceMethods: {},
      sections: {},
      registry: [],
      type: 'assessment',
      subType: 'institutional',
      entityProfileFieldsPerEntityTypes: {
        A1: [],
      },
    };

    return mandatoryFields;
  }

  /**
   * Solution templates lists.
   * @method
   * @name templates
   * @param {String} type - type of solution can be observation/institutional/individual/survey
   * @param {string} searchtext - search text based on name,description.keywords.
   * @param {string} limit - Maximum data to return
   * @param {string} page - page no
   * @returns {Array} - Solution templates lists.
   */

  static templates(type, searchText, limit, page, userId, token) {
    return new Promise(async (resolve, reject) => {
      try {
        let matchQuery = {};

        matchQuery['$match'] = {
          isReusable: true,
          status: 'active',
        };

        if (type === messageConstants.common.OBSERVATION || type === messageConstants.common.SURVEY) {
          matchQuery['$match']['type'] = type;
        } else {
          matchQuery['$match']['type'] = messageConstants.common.ASSESSMENT;
          matchQuery['$match']['subType'] = type;
        }

        if (process.env.USE_USER_ORGANISATION_ID_FILTER && process.env.USE_USER_ORGANISATION_ID_FILTER === 'ON') {
          let organisationAndRootOrganisation = await shikshalokamHelper.getUserOrganisation(token, userId);

          matchQuery['$match']['createdFor'] = {
            $in: organisationAndRootOrganisation.createdFor,
          };
        }

        matchQuery['$match']['$or'] = [
          {
            name: new RegExp(searchText, 'i'),
          },
          {
            description: new RegExp(searchText, 'i'),
          },
          {
            keywords: new RegExp(searchText, 'i'),
          },
        ];

        let solutionDocument = await this.search(matchQuery, limit, page, {
          name: 1,
          description: 1,
          externalId: 1,
        });

        if (!solutionDocument[0].count) {
          solutionDocument[0].count = 0;
        }

        return resolve(solutionDocument[0]);
      } catch (error) {
        return reject(error);
      }
    });
  }

  /**
   * Fetch template observation based on solution Id.
   * @method
   * @name details
   * @param {String} solutionId - Solution Id.
   * @param {Object} bodyData - Request body data.
   * @param {String} userId - Logged in user id.
   * @param {Object} tenantFilter - Tenant filter. 
   * @returns {Object} - Details of the solution.
   */

  static details(solutionId, bodyData = {}, userId = '',tenantFilter) {
    return new Promise(async (resolve, reject) => {
      try {

        let solutionData = await solutionsQueries.solutionDocuments({ _id: solutionId, 
          tenantId: tenantFilter.tenantId,
        }, [
          'type',
          'projectTemplateId',
          'programId',
        ]);

        if (!Array.isArray(solutionData) || solutionData.length < 1) {
          return resolve({
            message: messageConstants.apiResponses.SOLUTION_NOT_FOUND,
            result: [],
          });
        }

        solutionData = solutionData[0];
        let templateOrQuestionDetails;
        //this will get wether user is targeted to the solution or not based on user Role Information
        const isSolutionTargeted = await this.isTargetedBasedOnUserProfile(solutionId, bodyData);

        // if (solutionData.type === messageConstants.common.IMPROVEMENT_PROJECT) {
        //   if (!solutionData.projectTemplateId) {
        //     throw {
        //       message: messageConstants.apiResponses.PROJECT_TEMPLATE_ID_NOT_FOUND,
        //     };
        //   }

        //   templateOrQuestionDetails = await improvementProjectService.getTemplateDetail(
        //     solutionData.projectTemplateId,
        //     isSolutionTargeted.result.isATargetedSolution ? false : true,
        //   );
        // }
        if (
          solutionData.type === messageConstants.common.OBSERVATION ||
          solutionData.type === messageConstants.common.SURVEY
        ) {
          templateOrQuestionDetails = await this.questions(solutionData._id);
        } else {
          templateOrQuestionDetails = {
            status: httpStatusCode.ok.status,
            message: messageConstants.apiResponses.SOLUTION_TYPE_INVALID,
            result: {},
          };
        }

        if (solutionData.programId) {
          // add ["rootOrganisations","requestForPIIConsent","programJoined"] values to response. Based on these values front end calls PII consent
          let programData = await programsQueries.programDocuments(
            {
              _id: solutionData.programId,
              tenantId: tenantFilter.tenantId
            },
            ['rootOrganisations', 'requestForPIIConsent', 'name']
          );

          templateOrQuestionDetails.result.rootOrganisations = programData[0].rootOrganisations
            ? programData[0].rootOrganisations[0]
            : '';
          if (programData[0].hasOwnProperty('requestForPIIConsent')) {
            templateOrQuestionDetails.result.requestForPIIConsent = programData[0].requestForPIIConsent;
          }
          // We are passing programId and programName with the response because front end require these values to show program join pop-up in case of survey link flow
          // In 6.0.0 release these values only used for solutions of  type survey in front-end side. But Backend is not adding any restrictions based on solution type.
          // If solution have programId then we will pass below values with the response, irrespective of solution type
          templateOrQuestionDetails.result.programId = solutionData.programId;
          templateOrQuestionDetails.result.programName = programData[0].name;
        }

        //Check data present in programUsers collection.
        //checkForUserJoinedProgramAndConsentShared will returns an object which contain joinProgram and consentShared status
        let programJoinStatus = await programUsersHelper.checkForUserJoinedProgramAndConsentShared(
          solutionData.programId,
          userId
        );
        templateOrQuestionDetails.result.programJoined = programJoinStatus.joinProgram;
        templateOrQuestionDetails.result.consentShared = programJoinStatus.consentShared;

        return resolve(templateOrQuestionDetails);
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
   * Create solution and program from solution templates.
   * @method
   * @name createProgramAndSolutionFromTemplate -
   * @param {String} templateId - solution template id.
   * @param {Object} program
   * @param {String} program._id - program id
   * @param {String} program.name - program name
   * @param {String} userId - Logged in user id.
   * @param {Object} solutionData - new solution creation data
   * @param {Boolean} [isAPrivateProgram = false] - created program is private or not
   * @returns {Object} Created solution and program
   */

  static createProgramAndSolutionFromTemplate(
    templateId,
    // program,
    userId,
    solutionData,
    isAPrivateProgram = false,
    createdFor = []
    // rootOrganisations = []
  ) {
    return new Promise(async (resolve, reject) => {
      try {
        // let dateFormat = gen.utils.epochTime();
        // let programData;

        // if (program._id === "") {
        //   programData = await programsHelper.create({
        //     externalId: program.name
        //       ? program.name + "-" + dateFormat
        //       : solutionData.name + "-" + dateFormat,

        //     description: solutionData.description,
        //     name: program.name ? program.name : solutionData.name,
        //     userId: userId,
        //     isAPrivateProgram: isAPrivateProgram,
        //     createdFor: createdFor,
        //     rootOrganisations: rootOrganisations,
        //   });

        //   program._id = programData._id;
        // }

        let duplicateSolution = await this.importFromSolution(
          templateId,
          // program._id.toString(),
          userId,
          solutionData,
          createdFor
          // rootOrganisations
        );

        return resolve(
          _.pick(duplicateSolution, [
            '_id',
            'externalId',
            'frameworkExternalId',
            'frameworkId',
            // "programExternalId",
            // "programId",
            'entityTypeId',
            'entityType',
            'isAPrivateProgram',
            'entities',
          ])
        );
      } catch (error) {
        return reject(error);
      }
    });
  }

  /**
   * Create a new solution from existing solution.
   * @method
   * @name importFromSolution -
   * @param {String} solutionId - solution id.
   * @param {String} programId - program id.
   * @param {String} userId - logged in user id.
   * @param {Object} data - new solution data.
   * @param {String} isReusable - new solution isReusable value.
   * @param {String} createdFor - createdFor value.
   * @param {Object} entityTypeId - entityTypeId value.
   * @returns {Object} New solution information
   */

  static importFromSolution(
    solutionId,
    programId,
    userId,
    data,
    createdFor = '',
    // rootOrganisations = ""
    tenantData
  ) {
    return new Promise(async (resolve, reject) => {
      try {
        let validateSolutionId = gen.utils.isValidMongoId(solutionId);

        let solutionQuery = {};

        if (validateSolutionId) {
          solutionQuery['_id'] = solutionId;
        } else {
          solutionQuery['externalId'] = solutionId;
        }

        solutionQuery['tenantId'] = tenantData.tenantId;

        let solutionDocument = await solutionsQueries.solutionDocuments(solutionQuery);
        
        if (!solutionDocument[0]) {
          throw {
            message: messageConstants.apiResponses.SOLUTION_NOT_FOUND,
          };
        }
        let newSolutionDocument = _.cloneDeep(solutionDocument[0]);
        let programQuery = {};
        let programDocument;
      if (programId) {
          programQuery[gen.utils.isValidMongoId(programId) ? "_id" : "externalId"] = programId;    
          programDocument = await programsHelper.list(programQuery, [
            "externalId",
            "name",
            "description",
            "isAPrivateProgram",
          ],
          '',
          '',
          '',
          tenantData
        );
          programDocument = programDocument?.data?.data?.[0];
          if (programDocument) {
             Object.assign(newSolutionDocument, {
               programId: programDocument._id,
               programExternalId: programDocument.externalId,
               programName: programDocument.name,
               programDescription: programDocument.description
              });
          }

        }

        let duplicateCriteriasResponse = await criteriaHelper.duplicate(newSolutionDocument.themes,tenantData);

        let criteriaIdMap = {};
        let questionExternalIdMap = {};
        if (
          duplicateCriteriasResponse.success &&
          Object.keys(duplicateCriteriasResponse.data.criteriaIdMap).length > 0
        ) {
          criteriaIdMap = duplicateCriteriasResponse.data.criteriaIdMap;
        }

        if (
          duplicateCriteriasResponse.success &&
          Object.keys(duplicateCriteriasResponse.data.questionExternalIdMap).length > 0
        ) {
          questionExternalIdMap = duplicateCriteriasResponse.data.questionExternalIdMap;
        }

        let updateThemes = function (themes) {
          themes.forEach((theme) => {
            let criteriaIdArray = new Array();
            let themeCriteriaToSet = new Array();
            if (theme.children) {
              updateThemes(theme.children);
            } else {
              criteriaIdArray = theme.criteria;
              criteriaIdArray.forEach((eachCriteria) => {
                eachCriteria.criteriaId = criteriaIdMap[eachCriteria.criteriaId.toString()]
                  ? criteriaIdMap[eachCriteria.criteriaId.toString()]
                  : eachCriteria.criteriaId;
                themeCriteriaToSet.push(eachCriteria);
              });
              theme.criteria = themeCriteriaToSet;
            }
          });
          return true;
        };

        updateThemes(newSolutionDocument.themes);
          // Replace criteria ids in flattend themes key
          if ( newSolutionDocument["flattenedThemes"] && Array.isArray( newSolutionDocument["flattenedThemes"]) && newSolutionDocument["flattenedThemes"].length>0) {
            for (let pointerToFlattenedThemesArray = 0; pointerToFlattenedThemesArray < newSolutionDocument["flattenedThemes"].length; pointerToFlattenedThemesArray++) {
              let theme = newSolutionDocument["flattenedThemes"][pointerToFlattenedThemesArray];
              if(theme.criteria && Array.isArray(theme.criteria) && theme.criteria.length >0) {
                for (let pointerToThemeCriteriaArray = 0; pointerToThemeCriteriaArray < theme.criteria.length; pointerToThemeCriteriaArray++) {
                  let criteria = theme.criteria[pointerToThemeCriteriaArray];
                  if(criteriaIdMap[criteria.criteriaId.toString()]) {
                    newSolutionDocument["flattenedThemes"][pointerToFlattenedThemesArray].criteria[pointerToThemeCriteriaArray].criteriaId = criteriaIdMap[criteria.criteriaId.toString()];
                  }
                }
              }
            }
          }
        let startDate = new Date();
        let endDate = new Date();
        endDate.setFullYear(endDate.getFullYear() + 1);

        if (
          newSolutionDocument['questionSequenceByEcm'] &&
          Object.keys(newSolutionDocument.questionSequenceByEcm).length > 0
        ) {
          Object.keys(newSolutionDocument.questionSequenceByEcm).map((evidence) => {
            Object.keys(newSolutionDocument.questionSequenceByEcm[evidence]).map((section) => {
              let questionExternalIds = newSolutionDocument.questionSequenceByEcm[evidence][section];
              let newQuestionExternalIds = [];
              questionExternalIds.map((questionExternalId) => {
                if (questionExternalIdMap[questionExternalId]) {
                  newQuestionExternalIds.push(questionExternalIdMap[questionExternalId]);
                }
              });
              newSolutionDocument.questionSequenceByEcm[evidence][section] = newQuestionExternalIds;
            });
          });
        }

        if (data.entities && data.entities.length > 0) {
          let entitiesToAdd = await entitiesHelper.validateEntities(data.entities, solutionDocument[0].entityTypeId);

          data.entities = entitiesToAdd.entityIds;
        }

        newSolutionDocument.externalId = data.externalId
          ? data.externalId
          : solutionDocument[0].externalId + '-' + gen.utils.epochTime();

        newSolutionDocument.name = data.name;
        newSolutionDocument.description = data.description;
        newSolutionDocument.author = userId;
        newSolutionDocument.createdBy = userId;
        newSolutionDocument.entities = data.entities;
        newSolutionDocument.parentSolutionId = solutionDocument[0]._id;
        newSolutionDocument.startDate = startDate;
        newSolutionDocument.endDate = endDate;
        newSolutionDocument.createdAt = startDate;
        newSolutionDocument.updatedAt = startDate;
        newSolutionDocument.isAPrivateProgram = false;
        newSolutionDocument.isReusable = false;

        if (data.project) {
          newSolutionDocument['project'] = data.project;
          newSolutionDocument['referenceFrom'] = messageConstants.common.PROJECT;
        }

        if (createdFor !== '') {
          newSolutionDocument.createdFor = createdFor;
        }

        // if (rootOrganisations !== '') {
        //   newSolutionDocument.rootOrganisations = rootOrganisations;
        // }

        let duplicateSolutionDocument = await solutionsQueries.createSolution(_.omit(newSolutionDocument, ['_id']));

        if (duplicateSolutionDocument._id) {
          if (data.scope && Object.keys(data.scope).length > 0) {
            data.scope.organizations = tenantData.orgId

            await this.setScope(
              // newSolutionDocument.programId,
              newSolutionDocument.programId ? newSolutionDocument.programId : '',
              duplicateSolutionDocument._id,
              data.scope
            );
          }

          if (duplicateSolutionDocument.type == messageConstants.common.OBSERVATION) {
            let link = await gen.utils.md5Hash(duplicateSolutionDocument._id + '###' + userId);

            await solutionsQueries.updateSolutionDocument(
              { _id: duplicateSolutionDocument._id },
              { $set: { link: link } }
            );
          }
         if(programDocument){
          let programUpdate= await database.models.programs.updateOne(
            { _id: programDocument._id },
            { $addToSet: { components: duplicateSolutionDocument._id } }
          );
          if (programUpdate.modifiedCount === 0) {
            throw {
              message: messageConstants.apiResponses.PROGRAM_UPDATED_FAILED,
            };
        }
        }

          return resolve(duplicateSolutionDocument);
        } else {
          throw {
            message: messageConstants.apiResponses.ERROR_CREATING_DUPLICATE,
          };
        }
      } catch (error) {
        return reject(error);
      }
    });
  }
  /**
   * Get link by solution id
   * @method
   * @name fetchLink
   * @param {String} solutionId - solution Id.
   * @param {String} appName - app Name.
   * @param {String} userId - user Id.
   * @param {Object} tenantData - tenant data.
   * @param {String} userToken - user token.
   * @returns {Object} - Details of the solution.
   */

  static fetchLink(solutionId, userId, userToken) {
    return new Promise(async (resolve, reject) => {
      try {
        let solutionData = await solutionsQueries.solutionDocuments(
          {
            _id: solutionId,
            isReusable: false,
            isAPrivateProgram: false,
            // Only Super Admin can generate links for all tenant and org
            // tenantId: tenantData.tenantId,
            // orgIds:{ $in: ['ALL', tenantData.orgId] }
          },
          ['link', 'type', 'author', 'tenantId','orgId']
        );

        if (!Array.isArray(solutionData) || solutionData.length === 0) {
          throw {
            message: messageConstants.apiResponses.SOLUTION_NOT_FOUND,
            status: httpStatusCode.bad_request.status,
          };
        }

        const solution = solutionData[0];

        if (!solution.tenantId) {
          throw {
            message: messageConstants.apiResponses.TENANTID_REQUIRED_IN_SOLUTION,
            status: httpStatusCode.bad_request.status,
          };
        }

        let prefix = messageConstants.common.PREFIX_FOR_SOLUTION_LINK;
        let solutionLink = solution?.link;

        if (!solutionLink) {
          solutionLink = await gen.utils.md5Hash(solution._id + '###' + solution.author);
          // update link to the solution documents
          let updateSolution = await this.update(
            solutionId,
            { link: solutionLink },
            userId,
            false,
            //  Only Super Admin can generate links for all tenant and org hence replace tenantData is replcaed with solution tenantData
            {
              tenantId: solution?.tenantId,
              orgId: [solution?.orgId],
            }
          );

          if (!updateSolution?.success) {
            throw {
              message: messageConstants.apiResponses.SOLUTION_NOT_UPDATED,
              status: httpStatusCode.bad_request.status,
            };
          }
        }

        // fetch tenant domain by calling  tenant details API
        let tenantDetailsResponse = await userService.fetchTenantDetails(solution.tenantId, userToken);
        const domains = tenantDetailsResponse?.data?.domains || [];
        // Error handling if API failed or no domains found
        if (!tenantDetailsResponse.success || !Array.isArray(domains) || domains.length === 0) {
          throw {
            status: httpStatusCode.bad_request.status,
            message: messageConstants.apiResponses.DOMAIN_FETCH_FAILED,
          };
        }

        // Collect all verified domains into an array
        let allDomains = domains.filter((domainObj) => domainObj.verified).map((domainObj) => domainObj.domain);

        // Generate link for each domain
        let links = allDomains.map((domain) => {
          return _generateLink(
            `https://${domain}${process.env.APP_PORTAL_DIRECTORY}`,
            prefix,
            solutionLink,
            solutionData[0].type
          );
        });

        return resolve({
          success: true,
          message: messageConstants.apiResponses.LINK_GENERATED,
          result: links,
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
   * Verify solution link
   * @method
   * @name verifyLink
   * @param {String} link - link Id.
   * @param {Object} bodyData - Req Body.
   * @param {String} userId - user Id.
   * @param {String} userToken - user token.
   * @param {Boolean} createProject - create project.
   * @param {Object} tenantData - tenant data.
   * @returns {Object} - Details of the solution.
   */

  static verifyLink(link = '', bodyData = {}, userId = '', userToken = '', createProject = true,tenantData) {
    return new Promise(async (resolve, reject) => {
      try {
        // check solution document is exists and  end date validation
        let verifySolution = await this.verifySolutionDetails(link, userId, userToken,tenantData);

        // Check targeted solution based on role and location
        let checkForTargetedSolution = await this.checkForTargetedSolution(link, bodyData, userId, userToken,tenantData);

        if (!checkForTargetedSolution || Object.keys(checkForTargetedSolution.result).length <= 0) {
          return resolve(checkForTargetedSolution);
        }

        let solutionData = checkForTargetedSolution.result;
        let isSolutionActive = solutionData.status === messageConstants.common.INACTIVE_STATUS ? false : true;
        if (solutionData.type == messageConstants.common.OBSERVATION) {
          // Targeted solution
          if (checkForTargetedSolution.result.isATargetedSolution) {
            let observationDetailFromLink = await observationHelper.details(
              '',
              solutionData.solutionId,
              userId,
              userToken
            );
            if (observationDetailFromLink) {
              checkForTargetedSolution.result['observationId'] =
                observationDetailFromLink._id != '' ? observationDetailFromLink._id : '';
            } else if (!isSolutionActive) {
              throw new Error(messageConstants.apiResponses.LINK_IS_EXPIRED);
            }
          } else {
            if (!isSolutionActive) {
              throw new Error(messageConstants.apiResponses.LINK_IS_EXPIRED);
            }

            // user is not targeted and privateSolutionCreation required
            let privateProgramAndSolutionDetails = await this.privateProgramAndSolutionDetails(
              solutionData, //solution data
              userId, //User Id
              userToken,
              tenantData
            );
            if (!privateProgramAndSolutionDetails.success) {
              throw {
                status: httpStatusCode.bad_request.status,
                message: messageConstants.apiResponses.SOLUTION_PROGRAMS_NOT_CREATED,
              };
            }
            // Replace public solutionId with private solutionId.
            if (privateProgramAndSolutionDetails.result != '') {
              checkForTargetedSolution.result['solutionId'] = privateProgramAndSolutionDetails.result;
            }
          }
        } else if (solutionData.type === messageConstants.common.SURVEY) {
          // Get survey submissions of user
          /**
           * function userServeySubmission 
           * Request:
           * @query :SolutionId -> solutionId
           * @param {userToken} for UserId
           * @response Array of survey submissions
           * example: {
            "success":true,
            "message":"Survey submission fetched successfully",
            "data":[
                {
                    "_id":"62e228eedd8c6d0009da5084",
                    "solutionId":"627dfc6509446e00072ccf78",
                    "surveyId":"62e228eedd8c6d0009da507d",
                    "status":"completed",
                    "surveyInformation":{
                        "name":"Create a Survey (To check collated reports) for 4.9 regression -- FD 380",
                        "description":"Create a Survey (To check collated reports) for 4.9 regression -- FD 380"
                    }
                }
            ]
          }       
           */
          // Targeted solution
          if (checkForTargetedSolution.result.isATargetedSolution) {
            let surveySubmissionDetails = await userHelper.surveySubmissions(userId, solutionData.solutionId);
            let surveySubmissionData = surveySubmissionDetails.data;
            if (surveySubmissionData.length > 0) {
              checkForTargetedSolution.result.submissionId = surveySubmissionData[0]._id
                ? surveySubmissionData[0]._id
                : '';
              checkForTargetedSolution.result.surveyId = surveySubmissionData[0].surveyId
                ? surveySubmissionData[0].surveyId
                : '';
              checkForTargetedSolution.result.submissionStatus = surveySubmissionData[0].status;
            } else if (!isSolutionActive) {
              throw new Error(messageConstants.apiResponses.LINK_IS_EXPIRED);
            }
          } else {
            if (!isSolutionActive) {
              throw new Error(messageConstants.apiResponses.LINK_IS_EXPIRED);
            }

            // user is not targeted and privateSolutionCreation required
            /**
             * function privateProgramAndSolutionDetails
             * Request:
             * @param {solutionData} solution data
             * @response private solutionId
             */

            let privateProgramAndSolutionDetails = await this.privateProgramAndSolutionDetails(
              solutionData,
              userId
            );
            if (!privateProgramAndSolutionDetails.success) {
              throw {
                status: httpStatusCode.bad_request.status,
                message: messageConstants.apiResponses.SOLUTION_PROGRAMS_NOT_CREATED,
              };
            }
            // Replace public solutionId with private solutionId.
            if (privateProgramAndSolutionDetails.result != '') {
              checkForTargetedSolution.result['solutionId'] = privateProgramAndSolutionDetails.result;
            }
          }
        }
       
        delete checkForTargetedSolution.result['status'];
        return resolve(checkForTargetedSolution);
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
   * Verify Solution details.
   * @method
   * @name verifySolutionDetails
   * @param {String} link - link Id.
   * @param {String} userId - user Id.
   * @param {String} userToken - user token.
   * @param {Object} tenantData - tenant data.
   * @returns {Object} - Details of the solution.
   */

  static verifySolutionDetails(link = '', userId = '', userToken = '',tenantData) {
    return new Promise(async (resolve, reject) => {
      try {
        let response = {
          verified: false,
        };

        if (userToken == '') {
          throw new Error(messageConstants.apiResponses.REQUIRED_USER_AUTH_TOKEN);
        }

        if (userId == '') {
          throw new Error(messageConstants.apiResponses.USER_ID_REQUIRED_CHECK);
        }

        let solutionData = await solutionsQueries.solutionDocuments(
          {
            link: link,
            isReusable: false,
            status: {
              $ne: messageConstants.common.INACTIVE_STATUS,
            },
            tenantId: tenantData.tenantId
          },
          ['type', 'status', 'endDate']
        );

        if (!Array.isArray(solutionData) || solutionData.length < 1) {
          return resolve({
            message: messageConstants.apiResponses.INVALID_LINK,
            result: [],
          });
        }

        if (solutionData[0].status !== messageConstants.common.ACTIVE_STATUS) {
          return resolve({
            message: messageConstants.apiResponses.LINK_IS_EXPIRED,
            result: [],
          });
        }
        // if endDate less than current date change solution status to inActive
        if (solutionData[0].endDate && new Date() > new Date(solutionData[0].endDate)) {
          if (solutionData[0].status === messageConstants.common.ACTIVE_STATUS) {
            let updateSolution = await this.update(
              solutionData[0]._id,
              {
                status: messageConstants.common.INACTIVE_STATUS,
              },
              userId,
              false,
              { tenantId: tenantData.tenantId, orgId: [tenantData.orgId] }
            );
          }

          return resolve({
            message: messageConstants.apiResponses.LINK_IS_EXPIRED,
            result: [],
          });
        }

        response.verified = true;
        return resolve({
          message: messageConstants.apiResponses.LINK_VERIFIED,
          result: response,
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
   * Check the user is targeted.
   * @method
   * @name checkForTargetedSolution
   * @param {String} link - link Id.
   * @param {Object} bodyData - Req Body.
   * @param {String} userId - user Id.
   * @param {String} userToken - user token.
   * @param {Object} tenantData - tenant data.
   * @returns {Object} - Details of the solution.
   */

  static checkForTargetedSolution(link = '', bodyData = {}, userId = '', userToken = '',tenantData) {
    return new Promise(async (resolve, reject) => {
      try {
        let response = {
          isATargetedSolution: false,
          link: link,
          tenantId: tenantData.tenantId
        };
        // find the solution document based on the link
        let solutionDetails = await solutionsQueries.solutionDocuments({ link: link }, [
          'type',
          '_id',
          'programId',
          'name',
          'projectTemplateId',
          'programName',
          'status',
        ]);

        bodyData.tenantId = tenantData.tenantId;
        bodyData.orgId = tenantData.orgId;
        let queryData = await this.queryBasedOnRoleAndLocation(bodyData);
        if (!queryData.success) {
          return resolve(queryData);
        }
        queryData.data['link'] = link;
        let matchQuery = queryData.data;
        let solutionData = await solutionsQueries.solutionDocuments(matchQuery, [
          '_id',
          'link',
          'type',
          'programId',
          'name',
          'projectTemplateId',
        ]);
        // Check the user is targeted to the solution or not
        if (!Array.isArray(solutionData) || solutionData.length < 1) {
          response.solutionId = solutionDetails[0]._id;
          response.type = solutionDetails[0].type;
          response.name = solutionDetails[0].name;
          response.programId = solutionDetails[0].programId;
          response.programName = solutionDetails[0].programName;
          response.status = solutionDetails[0].status;

          return resolve({
            success: true,
            message: messageConstants.apiResponses.SOLUTION_NOT_FOUND_OR_NOT_A_TARGETED,
            result: response,
          });
        }

        response.isATargetedSolution = true;
        Object.assign(response, solutionData[0]);
        response.solutionId = solutionData[0]._id;
        response.projectTemplateId = solutionDetails[0].projectTemplateId ? solutionDetails[0].projectTemplateId : '';
        response.programName = solutionDetails[0].programName;
        delete response._id;

        return resolve({
          success: true,
          message: messageConstants.apiResponses.SOLUTION_DETAILS_VERIFIED,
          result: response,
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
   * privateProgramAndSolutionDetails
   * @method
   * @name PrivateProgramAndSolutionDetails
   * @param {Object} solutionData - solution data.
   * @param {String} userId - user Id.
   * @param {Object} tenantData - tenantData
   * @returns {Object} - Details of the private solution.
   */

  static privateProgramAndSolutionDetails(solutionData, userId = '',tenantData) {
    return new Promise(async (resolve, reject) => {
      try {
        // Check if a private program and private solution already exist or not for this user.
        let privateSolutionDetails = await solutionsQueries.solutionDocuments(
          {
            parentSolutionId: solutionData.solutionId,
            author: userId,
            type: solutionData.type,
            isAPrivateProgram: true,
          },
          ['_id', 'programId', 'programName']
        );

        if (!(privateSolutionDetails.length > 0)) {
          // Data for program and solution creation
          let programAndSolutionData = {
            type: messageConstants.common.IMPROVEMENT_PROJECT,
            subType: messageConstants.common.IMPROVEMENT_PROJECT,
            isReusable: false,
            solutionId: solutionData.solutionId,
          };

          if (solutionData.programId && solutionData.programId !== '') {
            programAndSolutionData['programId'] = solutionData.programId;
            programAndSolutionData['programName'] = solutionData.programName;
          }
          // create private program and solution
          let solutionAndProgramCreation = await this.createProgramAndSolution(
            userId,
            programAndSolutionData,
            'true', // create duplicate solution
            tenantData
          );

          if (!solutionAndProgramCreation.success) {
            throw {
              status: httpStatusCode.bad_request.status,
              message: messageConstants.apiResponses.SOLUTION_PROGRAMS_NOT_CREATED,
            };
          }
          return resolve({
            success: true,
            result: solutionAndProgramCreation.result.solution._id,
          });
        } else {
          return resolve({
            success: true,
            result: privateSolutionDetails[0]._id,
          });
        }
      } catch (error) {
        return resolve({
          success: false,
          status: error.status ? error.status : httpStatusCode['internal_server_error'].status,
          message: error.message,
        });
      }
    });
  }

  // moved this function to solutions helper to avoid circular dependency with users/helper
  /**
   * Create user program and solution
   * @method
   * @name createProgramAndSolution
   * @param {string} userId - logged in user Id.
   * @param {object} data - data needed for creation of program.
   * @param {object} solutionData - data needed for creation of solution.
   * @param {Object} tenantData - tenantData information
   * @returns {Array} - Created user program and solution.
   */

  static createProgramAndSolution(userId, data, createADuplicateSolution = '',tenantData) {
    return new Promise(async (resolve, reject) => {
      try {
        let userPrivateProgram = {};
        let dateFormat = gen.utils.epochTime();
        let parentSolutionInformation = {};

        createADuplicateSolution = gen.utils.convertStringToBoolean(createADuplicateSolution);
        //program part
        if (data.programId && data.programId !== '') {
          let filterQuery = {
            _id: data.programId,
          };

          if (createADuplicateSolution === false) {
            filterQuery.createdBy = userId;
          }

          let checkforProgramExist = await programsQueries.programDocuments(filterQuery, 'all', ['__v']);

          if (!(checkforProgramExist.length > 0)) {
            return resolve({
              status: httpStatusCode['bad_request'].status,
              message: messageConstants.apiResponses.PROGRAM_NOT_FOUND,
              result: {},
            });
          }

          if (createADuplicateSolution === true) {
            let duplicateProgram = checkforProgramExist[0];
            duplicateProgram = await _createProgramData(
              duplicateProgram.name,
              duplicateProgram.externalId
                ? duplicateProgram.externalId + '-' + dateFormat
                : duplicateProgram.name + '-' + dateFormat,
              true,
              messageConstants.common.ACTIVE_STATUS,
              duplicateProgram.description,
              userId,
              duplicateProgram.startDate,
              duplicateProgram.endDate,
              userId
            );
            // set rootorganisation from parent program
            if (checkforProgramExist[0].hasOwnProperty('rootOrganisations')) {
              duplicateProgram.rootOrganisations = checkforProgramExist[0].rootOrganisations;
            }
            if (checkforProgramExist[0].hasOwnProperty('requestForPIIConsent')) {
              duplicateProgram.requestForPIIConsent = checkforProgramExist[0].requestForPIIConsent;
            }
            userPrivateProgram = await programsHelper.create(_.omit(duplicateProgram, ['_id', 'components', 'scope']));
          } else {
            userPrivateProgram = checkforProgramExist[0];
          }
        } else {
          /* If the programId is not passed from the front end, we will enter this else block. 
          In this block, we need to provide the necessary basic details to create a new program, Including startDate and endDate.*/
          // Current date
          let startDate = new Date();
          // Add one year to the current date
          let endDate = new Date();
          endDate.setFullYear(endDate.getFullYear() + 1);
          let programData = await _createProgramData(
            data.programName,
            data.programExternalId ? data.programExternalId : data.programName + '-' + dateFormat,
            true,
            messageConstants.common.ACTIVE_STATUS,
            data.programDescription ? data.programDescription : data.programName,
            userId,
            startDate,
            endDate
          );

          if (data.rootOrganisations) {
            programData.rootOrganisations = data.rootOrganisations;
          }

          programData.tenantData = {}
          programData.tenantData.tenantId = tenantData.tenantId;
          programData.tenantData.orgId = tenantData.orgId;
          userPrivateProgram = await programsHelper.create(programData);
        }

        let solutionDataToBeUpdated = {
          programId: userPrivateProgram._id,
          programExternalId: userPrivateProgram.externalId,
          programName: userPrivateProgram.name,
          programDescription: userPrivateProgram.description,
          isAPrivateProgram: userPrivateProgram.isAPrivateProgram,
        };

        //entities
        if (Array.isArray(data.entities) && data.entities && data.entities.length > 0) {
          let entitiesData = [];
          let bodyData = {};

          let locationData = gen.utils.filterLocationIdandCode(data.entities);

          if (locationData.ids.length > 0) {
            bodyData = {
              // id: locationData.ids,
              'registryDetails.code': { $in: locationData.ids },
            };
            let entityData = await entityManagementService.entityDocuments(bodyData);

            if (!entityData.success) {
              return resolve({
                status: httpStatusCode['bad_request'].status,
                message: messageConstants.apiResponses.ENTITY_NOT_FOUND,
                result: {},
              });
            }

            entityData.data.forEach((entity) => {
              entitiesData.push(entity.id);
            });

            solutionDataToBeUpdated['entityType'] = entityData.data[0].type;
          }

          if (locationData.codes.length > 0) {
            let filterData = {
              _id: { $in: locationData.codes },
            };
            let entityDetails = await entityManagementService.entityDocuments(filterData);
            let entityDocuments = entityDetails.data;
            if (!entityDetails.success || !(entityDocuments.length > 0)) {
              return resolve({
                status: httpStatusCode['bad_request'].status,
                message: messageConstants.apiResponses.ENTITY_NOT_FOUND,
                result: {},
              });
            }

            entityDocuments.forEach((entity) => {
              entitiesData.push(entity.id);
            });

            solutionDataToBeUpdated['entityType'] = messageConstants.common.SCHOOL;
          }

          // if (data.type && data.type !== messageConstants.common.IMPROVEMENT_PROJECT) {
          //   solutionDataToBeUpdated['entities'] = entitiesData;
          // }
        }

        //solution part
        let solution = '';
        if (data.solutionId && data.solutionId !== '') {
          let solutionData = await solutionsQueries.solutionDocuments(
            {
              _id: data.solutionId,
            },
            [
              'name',
              'link',
              'type',
              'subType',
              'externalId',
              'description',
              'certificateTemplateId',
              'projectTemplateId',
              'themes',
              'evidenceMethods',
              'sections',
            ]
          );

          if (!(solutionData.length > 0)) {
            return resolve({
              status: httpStatusCode['bad_request'].status,
              message: messageConstants.apiResponses.SOLUTION_NOT_FOUND,
              result: {},
            });
          }

          if (createADuplicateSolution === true) {
            let duplicateSolution = solutionData[0];
            let solutionCreationData = await _createSolutionData(
              duplicateSolution.name,
              duplicateSolution.externalId
                ? duplicateSolution.externalId + '-' + dateFormat
                : duplicateSolution.name + '-' + dateFormat,
              true,
              messageConstants.common.ACTIVE_STATUS,
              duplicateSolution.description,
              userId,
              false,
              duplicateSolution._id,
              duplicateSolution.type,
              duplicateSolution.subType,
              userId,
              duplicateSolution.projectTemplateId,
              duplicateSolution.themes,
              duplicateSolution.evidenceMethods,
              duplicateSolution.sections
            );
            _.merge(duplicateSolution, solutionCreationData);
            _.merge(duplicateSolution, solutionDataToBeUpdated);

            solution = await this.create(_.omit(duplicateSolution, ['_id', 'link']));
            parentSolutionInformation.solutionId = duplicateSolution._id;
            parentSolutionInformation.link = duplicateSolution.link;
          } else {
            if (solutionData[0].isReusable === false) {
              return resolve({
                status: httpStatusCode['bad_request'].status,
                message: messageConstants.apiResponses.SOLUTION_NOT_FOUND,
                result: {},
              });
            }

            solution = await solutionsQueries.updateSolutionDocument(
              {
                _id: solutionData[0]._id,
              },
              {
                $set: solutionDataToBeUpdated,
              },
              {
                new: true,
              }
            );
          }
        } else {
          let externalId, description;
          if (data.solutionName) {
            externalId = data.solutionExternalId ? data.solutionExternalId : data.solutionName + '-' + dateFormat;
            description = data.solutionDescription ? data.solutionDescription : data.solutionName;
          } else {
            externalId = userId + '-' + dateFormat;
            description = userPrivateProgram.programDescription;
          }

          let createSolutionData = await _createSolutionData(
            data.solutionName ? data.solutionName : userPrivateProgram.programName,
            externalId,
            userPrivateProgram.isAPrivateProgram,
            messageConstants.common.ACTIVE_STATUS,
            description,
            '',
            false,
            '',
            data.type ? data.type : messageConstants.common.ASSESSMENT,
            data.subType ? data.subType : messageConstants.common.INSTITUTIONAL,
            userId,
            '',
            data.themes,
            data.evidenceMethods,
            data.sections
          );
          _.merge(solutionDataToBeUpdated, createSolutionData);
          solution = await this.create(solutionDataToBeUpdated);
        }

        if (solution && solution._id) {
          await solutionsQueries.updateSolutionDocument(
            {
              _id: userPrivateProgram._id,
            },
            {
              $addToSet: { components: new ObjectId(solution._id) },
            }
          );
        }

        return resolve({
          success: true,
          message: messageConstants.apiResponses.USER_PROGRAM_AND_SOLUTION_CREATED,
          result: {
            program: userPrivateProgram,
            solution: solution,
            parentSolutionInformation: parentSolutionInformation,
          },
        });
      } catch (error) {
        return reject(error);
      }
    });
  }

  /**
   * Verify solution id
   * @method
   * @name verifySolution
   * @param {String} solutionId - solution Id.
   * @param {String} userId - user Id.
   * @param {Object} bodyData - Req Body.
   * @param {Object} tenantData - tenant data.
   * @returns {Object} - Details of the solution.
   * Takes SolutionId and userRoleInformation as parameters.
   * @return {Object} - {
    "message": "Solution is not targeted to the role",
    "status": 200,
    "result": {
        "isATargetedSolution": false/true,
        "_id": "63987b5d26a3620009a1142d"
    }
  }
   */

  static isTargetedBasedOnUserProfile(solutionId = '', bodyData = {},tenantData) {
    return new Promise(async (resolve, reject) => {
      try {
        let response = {
          isATargetedSolution: false,
          _id: solutionId,
        };
        bodyData.tenantId = tenantData.tenantId;
        bodyData.orgId = tenantData.orgId;
        //get the query based on the roles and locations
        let queryData = await this.queryBasedOnRoleAndLocation(bodyData);
        if (!queryData.success) {
          return resolve(queryData);
        }
        queryData.data['_id'] = solutionId;
        let matchQuery = queryData.data;
        //Check solutions collection based on rolesandLocation query
        let solutionData = await solutionsQueries.solutionDocuments(matchQuery, ['_id', 'type', 'programId', 'name']);

        if (!Array.isArray(solutionData) || solutionData.length < 1) {
          return resolve({
            success: true,
            message: messageConstants.apiResponses.SOLUTION_NOT_FOUND_OR_NOT_A_TARGETED,
            result: response,
          });
        }

        response.isATargetedSolution = true;
        return resolve({
          success: true,
          message: messageConstants.apiResponses.SOLUTION_DETAILS_VERIFIED,
          result: response,
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
   * Add default acl.
   * @method
   * @name addDefaultACL
   * @param {String} solutionId - solution id.
   * @param {Array} allRoles - roles assigned to solution.
   * @returns {Object} Add default acl.
   */

  static addDefaultACL(solutionId, allRoles) {
    return new Promise(async (resolve, reject) => {
      try {
        let roles = {};

        allRoles.map((role) => {
          roles[gen.utils.assessmentRoles()[role]] = {
            acl: {
              entityProfile: {
                visible: ['all'],
                editable: ['all'],
              },
            },
          };
        });

        let solutionRoles = await solutionsQueries.updateSolutionDocument(
          {
            _id: solutionId,
          },
          {
            $set: {
              roles: roles,
            },
          }
        );

        return resolve(solutionRoles);
      } catch (error) {
        return reject(error);
      }
    });
  }

  /**
   * Delete Solution.
   * @method
   * @name deleteSolution
   * @param {String} solutionId - solution Internal id.
   * @param {Object} tenantData - tenant data.
   * @param {String} userId - UserId.
   * @returns {Object} Delete Solution .
   */

  static delete(solutionId = '', userId = '',tenantData) {
    return new Promise(async (resolve, reject) => {
      try {
        if (solutionId == '') {
          throw new Error(messageConstants.apiResponses.SOLUTION_ID_REQUIRED);
        }

        if (userId == '') {
          throw new Error(messageConstants.apiResponses.USER_ID_REQUIRED_CHECK);
        }

        let solutionData = await solutionsQueries.updateSolutionDocument(
          {
            _id: solutionId,
            isAPrivateProgram: true,
            author: userId,
            tenantId: tenantData.tenantId
          },
          {
            $set: { isDeleted: true },
          }
        );

        let reponseMessage = '';

        let result = {};

        if (!solutionData.success || !solutionData.data) {
          reponseMessage = messageConstants.apiResponses.SOLUTION_CANT_DELETE;
        } else {
          reponseMessage = messageConstants.apiResponses.SOLUTION_DELETED;
          result = solutionId;
        }

        return resolve({
          message: reponseMessage,
          result: result,
        });
      } catch (error) {
        return reject(error);
      }
    });
  }

  /**
   * Move To Trash.
   * @method
   * @name moveToTrash
   * @param {String} solutionId - solution Internal id.
   * @param {String} userId - UserId.
   * @returns {Object} Solution .
   */

  static moveToTrash(solutionId = '', userId = '') {
    return new Promise(async (resolve, reject) => {
      try {
        if (solutionId == '') {
          throw new Error(messageConstants.apiResponses.SOLUTION_ID_REQUIRED);
        }

        if (userId == '') {
          throw new Error(messageConstants.apiResponses.USER_ID_REQUIRED_CHECK);
        }

        let solutionData = await solutionsQueries.updateSolutionDocument(
          {
            _id: solutionId,
            isAPrivateProgram: true,
            author: userId,
          },
          {
            $set: { status: messageConstants.common.INACTIVE_STATUS },
          }
        );

        let reponseMessage = '';

        let result = {};

        if (!solutionData.success || !solutionData.data) {
          reponseMessage = messageConstants.apiResponses.SOLUTION_CANT_DELETE;
        } else {
          reponseMessage = messageConstants.apiResponses.SOLUTION_MOVED_TO_TRASH;
          result = solutionId;
        }

        return resolve({
          message: reponseMessage,
          result: result,
        });
      } catch (error) {
        return reject(error);
      }
    });
  }

  /**
   * Restore From Trash.
   * @method
   * @name restoreFromTrash
   * @param {String} solutionId - solution Internal id.
   * @param {String} userId - UserId.
   * @returns {Object} Solution .
   */

  static restoreFromTrash(solutionId = '', userId = '') {
    return new Promise(async (resolve, reject) => {
      try {
        if (solutionId == '') {
          throw new Error(messageConstants.apiResponses.SOLUTION_ID_REQUIRED);
        }

        if (userId == '') {
          throw new Error(messageConstants.apiResponses.USER_ID_REQUIRED_CHECK);
        }

        let solutionData = await solutionsQueries.updateSolutionDocument(
          {
            _id: solutionId,
            isAPrivateProgram: true,
            author: userId,
          },
          {
            $set: { status: messageConstants.common.ACTIVE_STATUS },
          }
        );

        let reponseMessage = '';

        let result = {};

        if (!solutionData.success || !solutionData.data) {
          reponseMessage = messageConstants.apiResponses.SOLUTION_CANT_DELETE;
        } else {
          reponseMessage = messageConstants.apiResponses.SOLUTION_RESTORED_FROM_TRASH;
          result = solutionId;
        }

        return resolve({
          message: reponseMessage,
          result: result,
        });
      } catch (error) {
        return reject(error);
      }
    });
  }

  /**
   * Trash List.
   * @method
   * @name trashList
   * @param {String} userId - UserId.
   * @returns {Object} Solution .
   */

  static trashList(userId = '') {
    return new Promise(async (resolve, reject) => {
      try {
        if (userId == '') {
          throw new Error(messageConstants.apiResponses.USER_ID_REQUIRED_CHECK);
        }

        let trashData = await solutionsQueries.solutionDocuments(
          {
            author: userId,
            isAPrivateProgram: true,
            status: messageConstants.common.INACTIVE_STATUS,
            isDeleted: false,
          },
          ['name']
        );

        return resolve({
          message: messageConstants.apiResponses.SOLUTION_TRASH_LIST_FETCHED,
          result: trashData,
        });
      } catch (error) {
        return reject(error);
      }
    });
  }

  /**
   * Remove From Home Screen.
   * @method
   * @name removeFromHome
   * @param {String} solutionId - solution Internal id.
   * @param {String} userId - UserId.
   * @returns {Object} Delete Solution .
   */

  static removeFromHome(solutionId = '', userId = '') {
    return new Promise(async (resolve, reject) => {
      try {
        if (solutionId == '') {
          throw new Error(messageConstants.apiResponses.SOLUTION_ID_REQUIRED);
        }

        if (userId == '') {
          throw new Error(messageConstants.apiResponses.USER_ID_REQUIRED_CHECK);
        }

        let solutionData = await solutionsQueries.solutionDocuments(
          {
            _id: solutionId,
          },
          ['_id']
        );

        let reponseMessage = '';

        let result = {};

        if (Array.isArray(solutionData) || solutionData.length > 0) {
          let addRemovedSolutionToUser = await userExtensionHelper.updateUserExtensionDocument(
            {
              userId: userId,
            },
            {
              $addToSet: { removedFromHomeScreen: solutionData[0]._id },
            }
          );

          if (!addRemovedSolutionToUser.success || !addRemovedSolutionToUser.data) {
            reponseMessage = messageConstants.apiResponses.SOLUTION_CANT_REMOVE;
          } else {
            reponseMessage = messageConstants.apiResponses.SOLUTION_REMOVED_FROM_HOME_SCREEN;
            result = solutionId;
          }
        } else {
          reponseMessage = messageConstants.apiResponses.SOLUTION_NOT_FOUND;
        }

        return resolve({
          message: reponseMessage,
          result: result,
        });
      } catch (error) {
        return reject(error);
      }
    });
  }

  /**
   * Add entity to solution.
   * @method
   * @name addEntityToSolution
   * @param {String} solutionId - solution id.
   * @param {Array} entityIds - Entity ids.
   * @param {Object} tenantData - tenant data.
   * @returns {String} - message.
   */

  static addEntityToSolution(solutionId, entityIds,tenantData) {
    return new Promise(async (resolve, reject) => {
      try {
        let responseMessage = messageConstants.apiResponses.ENTITIES_UPDATED;

        let solutionQuery = {
          isReusable: false,
        };

        if (gen.utils.isValidMongoId(solutionId)) {
          solutionQuery['_id'] = solutionId;
        } else {
          solutionQuery['externalId'] = solutionId;
        }

        solutionQuery['tenantId'] = tenantData.tenantId;

        let solutionDocument = await solutionsQueries.solutionDocuments(solutionQuery, ['entityType']);

        if (!solutionDocument.length > 0) {
          throw new Error(messageConstants.apiResponses.SOLUTION_NOT_FOUND);
        }
        
        let entitiesDocument = await entityManagementService.entityDocuments(
          {
            _id: { $in: entityIds },
            entityType: solutionDocument[0].entityType,
            tenantId: tenantData.tenantId
          },
          ['_id']
        );
        
        if (!entitiesDocument.success) {
          throw {
            message: messageConstants.apiResponses.ENTITIES_NOT_FOUND,
          };
        }

        let updateEntityIds = entitiesDocument.data.map((entity) => entity._id);

        if (entityIds.length != updateEntityIds.length) {
          responseMessage = messageConstants.apiResponses.ENTITIES_NOT_UPDATE;
        }

        await solutionsQueries.updateSolutionDocument(solutionQuery, {
          $addToSet: { entities: updateEntityIds },
        });

        return resolve({
          success: true,
          message: responseMessage,
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
   * Solution lists.
   * @method
   * @name list
   * @param {String} type - solution type.
   * @param {String} subType - solution sub type.
   * @param {Object} filter  - filter objecr
   * @param {String} pageNo - Page no.
   * @param {String} pageSize - Page size.
   * @param {String} searchText - search text.
   * @param {Array}  projection
   * @param {Object} tenantData - tenant data.
   * @returns {String} -        -list of solutions
   */

  static list(type, subType, filter = {}, pageNo, pageSize, searchText, projection,tenantData = {}) {
    return new Promise(async (resolve, reject) => {
      try {
        let matchQuery = {
          isDeleted: false
        };

        if(tenantData.hasOwnProperty('tenantId')) {
          matchQuery['tenantId'] = tenantData.tenantId;
        }

        if (type == messageConstants.common.SURVEY) {
          matchQuery['status'] = {
            $in: [messageConstants.common.ACTIVE_STATUS, messageConstants.common.INACTIVE_STATUS],
          };
        } else {
          matchQuery.status = messageConstants.common.ACTIVE_STATUS;
        }

        if (type !== '') {
          matchQuery['type'] = type;
        }

        if (subType !== '') {
          matchQuery['subType'] = subType;
        }

        if (Object.keys(filter).length > 0) {
          matchQuery = _.merge(matchQuery, filter);
        }

        let searchData = [
          {
            name: new RegExp(searchText, 'i'),
          },
          {
            externalId: new RegExp(searchText, 'i'),
          },
          {
            description: new RegExp(searchText, 'i'),
          },
        ];


        if(searchText !== ''){

          if(matchQuery['$and']){
            matchQuery['$and'].push({ $or: searchData });
          }else{
            matchQuery['$or'] = searchData;
          }
        }

        let projection1 = {};

        if (projection) {
          projection.forEach((projectedData) => {
            projection1[projectedData] = 1;
          });
        } else {
          projection1 = {
            description: 1,
            externalId: 1,
            name: 1,
          };
        }

        let facetQuery = {};
        facetQuery['$facet'] = {};

        facetQuery['$facet']['totalCount'] = [{ $count: 'count' }];

        facetQuery['$facet']['data'] = [{ $skip: pageSize * (pageNo - 1) }, { $limit: pageSize ? pageSize : 100 }];

        let projection2 = {};

        projection2['$project'] = {
          data: 1,
          count: {
            $arrayElemAt: ['$totalCount.count', 0],
          },
        };

        let solutionDocuments = await solutionsQueries.getAggregate([
          { $match: matchQuery },
          {
            $sort: { updatedAt: -1 },
          },
          { $project: projection1 },
          facetQuery,
          projection2,
        ]);
        return resolve({
          success: true,
          message: messageConstants.apiResponses.SOLUTIONS_LIST,
          data: solutionDocuments[0],
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
   * Remove entity from solution.
   * @method
   * @name removeEntities
   * @param {String} solutionId - solution id.
   * @param {Array} entityIds - Entity ids.
   * @returns {String} - message.
   */

  static removeEntities(solutionId, entityIds) {
    return new Promise(async (resolve, reject) => {
      try {
        let responseMessage = messageConstants.apiResponses.ENTITIES_UPDATED;

        let solutionQuery = {
          isReusable: false,
        };

        if (gen.utils.isValidMongoId(solutionId)) {
          solutionQuery['_id'] = solutionId;
        } else {
          solutionQuery['externalId'] = solutionId;
        }

        let solutionDocument = await solutionsQueries.solutionDocuments(solutionQuery, ['_id']);

        if (!solutionDocument.length > 0) {
          throw new Error(messageConstants.apiResponses.SOLUTION_NOT_FOUND);
        }

        let updateEntityIds = entityIds.map((entityId) => new ObjectId(entityId));

        await solutionsQueries.updateSolutionDocument(
          solutionQuery,
          { $pull: { entities: { $in: updateEntityIds } } },
          { multi: true }
        );

        return resolve({
          success: true,
          message: responseMessage,
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
   * Delete Criteria From Solution
   * @method
   * @name deleteCriteria
   * @param {String} solutionExternalId - solution ExternalId.
   * @param {Array} criteriaIds - criteriaIds.
   * @returns {JSON}
   */

  static deleteCriteria(solutionExternalId, criteriaIds) {
    return new Promise(async (resolve, reject) => {
      try {
        let solutionDocument = await solutionsQueries.solutionDocuments({ externalId: solutionExternalId }, [
          '_id',
          'themes',
        ]);
        if (!solutionDocument.length > 0) {
          return resolve({
            status: httpStatusCode.bad_request.status,
            message: messageConstants.apiResponses.SOLUTION_NOT_FOUND,
          });
        }

        let themeData = solutionDocument[0].themes;
        if (!themeData.length > 0) {
          return resolve({
            status: httpStatusCode.bad_request.status,
            message: messageConstants.apiResponses.THEMES_NOT_FOUND,
          });
        }

        for (let pointerToTheme = 0; pointerToTheme < themeData.length; pointerToTheme++) {
          let currentTheme = themeData[pointerToTheme];
          for (let pointerToCriteriaArray = 0; pointerToCriteriaArray < criteriaIds.length; pointerToCriteriaArray++) {
            let criteriaId = criteriaIds[pointerToCriteriaArray];
            let criteriaData = currentTheme.criteria;

            if (criteriaData && criteriaData != undefined) {
              let criteriaTobeUpdated = criteriaData.filter((eachCriteria) => eachCriteria.criteriaId != criteriaId);
              currentTheme.criteria = criteriaTobeUpdated;
            }

            let childrenData = currentTheme.children;
            if (childrenData && childrenData != undefined) {
              childrenData.forEach((childKey) => {
                let childCriteria = childKey.criteria;
                let childData = childKey.children;

                if (childCriteria && childCriteria != undefined) {
                  let criteriaTobeUpdated = childCriteria.filter(
                    (eachCriteria) => eachCriteria.criteriaId != criteriaId
                  );

                  childKey.criteria = criteriaTobeUpdated;
                }

                if (childData && childData != undefined) {
                  childData.forEach((nestedKey) => {
                    let nestedCriteria = nestedKey.criteria;
                    if (nestedCriteria) {
                      let nestedCriteriaTobeUpdated = nestedCriteria.filter(
                        (nested) => nested.criteriaId != criteriaId
                      );

                      nestedKey.criteria = nestedCriteriaTobeUpdated;
                    }
                  });
                }
              });
            }
          }
        }

        let solutionUpdated = await solutionsQueries.updateSolutionDocument(
          { externalId: solutionExternalId },
          { $set: { themes: themeData } }
        );

        let message = '';
        if (solutionUpdated.success == true) {
          message = messageConstants.apiResponses.CRITERIA_REMOVED;
        } else {
          message = messageConstants.apiResponses.CRITERIA_COULD_NOT_BE_DELETED;
        }

        return resolve({
          success: true,
          message: message,
        });
      } catch (error) {
        return reject(error);
      }
    });
  }

  /**
   * Details of solution based on role and location.
   * @method
   * @name detailsBasedOnRoleAndLocation
   * @param {String} solutionId - solution Id.
   * @param {Object} bodyData - Requested body data.
   * @param {String} type -Type of solution
   * @param {Object} tenantData - tenant data.
   * @returns {JSON} - Details of solution based on role and location.
   */

  static detailsBasedOnRoleAndLocation(solutionId, bodyData, type = '') {
    
    return new Promise(async (resolve, reject) => {
      try {
        let queryData = await this.queryBasedOnRoleAndLocation(bodyData, type);
        if (!queryData.success) {
          return resolve(queryData);
        }

        queryData.data['_id'] = solutionId;

        
        let targetedSolutionDetails = await solutionsQueries.solutionDocuments(queryData.data, [
          'name',
          'externalId',
          'description',
          'programId',
          'programName',
          'programDescription',
          'programExternalId',
          'isAPrivateProgram',
          'projectTemplateId',
          'entityType',
          'entityTypeId',
          'language',
          'creator',
          'link',
          'certificateTemplateId',
          'endDate',
        ]);
        if (!(targetedSolutionDetails.length > 0)) {
          throw {
            status: httpStatusCode['bad_request'].status,
            message: messageConstants.apiResponses.SOLUTION_NOT_FOUND,
          };
        }

        return resolve({
          success: true,
          message: messageConstants.apiResponses.TARGETED_SOLUTIONS_FETCHED,
          data: targetedSolutionDetails[0],
        });
      } catch (error) {
        
        return resolve({
          success: false,
          message: error.message,
          data: {},
          status: error.status,
        });
      }
    });
  }

  /**
   * Add roles in solution scope.
   * @method
   * @name addRolesInScope
   * @param {String} solutionId - Solution Id.
   * @param {Array} roles - roles data.
   * @param {Object} tenantData - tenant data.
   * @returns {JSON} - Added roles data.
   */

  static addRolesInScope(solutionId, roles,tenantData) {
    return new Promise(async (resolve, reject) => {
      try {
        //Retrive the solution to update the role
        let solutionData = await solutionsQueries.solutionDocuments(
          {
            _id: solutionId,
            scope: { $exists: true },
            isReusable: false,
            isDeleted: false,
            tenantId: tenantData.tenantId
          },
          ['_id']
        );

        if (!(solutionData.length > 0)) {
          return resolve({
            status: httpStatusCode.bad_request.status,
            message: messageConstants.apiResponses.SOLUTION_NOT_FOUND,
          });
        }

        let updateQuery = {};
        // Check the roles array from the req body and update the roles accordingly
        if (Array.isArray(roles) && roles.length > 0) {
          // let userRoles = await userRolesHelper.roleDocuments(
          //   {
          //     code: { $in: roles },
          //   },
          //   ['_id', 'code'],
          // );
          let currentRoles = await solutionsQueries.solutionDocuments({ _id: solutionId }, ['scope.roles']);
          currentRoles = currentRoles[0].scope.roles;

          let currentRolesSet = new Set(currentRoles);
          let rolesSet = new Set(roles);

          rolesSet.forEach((role) => {
            if (role != '' && role != 'all') currentRolesSet.add(role);
          });

          currentRoles = Array.from(currentRolesSet);
          // updateQuery['$set'] = {
          // 	'scope.roles': currentRoles,
          // }
          // if there is an role array removing all from the value of roles
          await solutionsQueries.updateSolutionDocument(
            {
              _id: solutionId,
              tenantId: tenantData.tenantId
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
          if (roles === messageConstants.common.ALL_ROLES) {
            updateQuery['$set'] = {
              'scope.roles': [{ code: messageConstants.common.ALL_ROLES }],
            };
          }
        }
        //update the solutions document
        let updateSolution = await solutionsQueries.updateSolutionDocument(
          {
            _id: solutionId,
            tenantId: tenantData.tenantId
          },
          updateQuery,
          { new: true }
        );
        if (!updateSolution || !updateSolution._id) {
          throw {
            message: messageConstants.apiResponses.PROGRAM_NOT_UPDATED,
          };
        }

        return resolve({
          message: messageConstants.apiResponses.ROLES_ADDED_IN_SOLUTION,
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
   * Add entities in solution.
   * @method
   * @name addEntitiesInScope
   * @param {String} solutionId - solution Id.
	 * @param {Object} bodyData - body data.
	 * @param {Object} userDetails - User Details
	 * @param {Boolean} organizations - If organizations is Present.
   * @returns {JSON} - Added entities data.
   */

  static addEntitiesInScope(solutionId, bodyData, userDetails, organizations) {
    return new Promise(async (resolve, reject) => {
      try {
        let tenantId = userDetails.tenantAndOrgInfo.tenantId
				let orgId = userDetails.tenantAndOrgInfo.orgId[0]
        let solutionData = await solutionsQueries.solutionDocuments(
          {
            _id: solutionId,
            scope: { $exists: true },
            isReusable: false,
            isDeleted: false,
            tenantId: tenantId,
            orgId: orgId,
          },
          ['_id', 'programId', 'scope']
        );

        if (!(solutionData.length > 0)) {
          return resolve({
            status: httpStatusCode.bad_request.status,
            message: messageConstants.apiResponses.SOLUTION_NOT_FOUND,
          });
        }
        //Check if the solution is part of program or not
        let programData;
        if (solutionData[0].programId) {
          programData = await programsQueries.programDocuments(
            {
              _id: solutionData[0].programId,
              tenantId: tenantData.tenantId
            },
            ['scope']
          );
        }

        if (!programData.length > 0) {
					return resolve({
						status: HTTP_STATUS_CODE.bad_request.status,
						message: CONSTANTS.apiResponses.PROGRAM_NOT_FOUND,
					})
				}

        // Build the $addToSet updateObject
        let updateObject = { $addToSet: {} };
        let validationExcludedEntitiesKeys = [];
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
            });
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

        let updateSolution = await solutionsQueries.updateSolutionDocument(
          {
            _id: solutionId,
          },
          updateObject,
          { new: true }
        )
        if (!updateSolution || !updateSolution._id) {
          throw {
            message: messageConstants.apiResponses.SOLUTION_NOT_UPDATED,
          };
        }

        return resolve({
          message: messageConstants.apiResponses.ENTITIES_ADDED_IN_SOLUTION,
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
   * remove roles from solution scope.
   * @method
   * @name removeRolesInScope
   * @param {String} solutionId - Solution Id.
   * @param {Array} roles - roles data.
   * @param {Object} tenantData - tenant data.
   * @returns {JSON} - Removed solution roles.
   */

  static removeRolesInScope(solutionId, roles,tenantData) {
    return new Promise(async (resolve, reject) => {
      try {
        let solutionData = await solutionsQueries.solutionDocuments(
          {
            _id: solutionId,
            scope: { $exists: true },
            isReusable: false,
            isDeleted: false,
            tenantId: tenantData.tenantId
          },
          ['_id']
        );

        if (!(solutionData.length > 0)) {
          return resolve({
            status: httpStatusCode.bad_request.status,
            message: messageConstants.apiResponses.SOLUTION_NOT_FOUND,
          });
        }

        // let userRoles = await userRolesHelper.roleDocuments(
        //   {
        //     code: { $in: roles },
        //   },
        //   ['_id', 'code'],
        // );

        // if (!(userRoles.length > 0)) {
        //   return resolve({
        //     status: httpStatusCode.bad_request.status,
        //     message: messageConstants.apiResponses.INVALID_ROLE_CODE,
        //   });
        // }
        if (Array.isArray(roles) && roles.length > 0) {
          let updateSolution = await solutionsQueries.updateSolutionDocument(
            {
              _id: solutionId,
              tenantId: tenantData.tenantId
            },
            {
              $pull: { 'scope.roles': { $in: roles } },
            },
            { new: true }
          );
          if (!updateSolution || !updateSolution._id) {
            throw {
              message: messageConstants.apiResponses.SOLUTION_NOT_UPDATED,
            };
          }
        } else {
          return resolve({
            status: httpStatusCode.bad_request.status,
            message: messageConstants.apiResponses.INVALID_ROLE_CODE,
          });
        }

        return resolve({
          message: messageConstants.apiResponses.ROLES_REMOVED_IN_SOLUTION,
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
   * remove entities in solution scope.
   * @method
   * @name removeEntitiesInScope
   * @param {String} solutionId - Program Id.
	 * @param {Object} bodyData - body data.
	 * @param {Object} userDetails - User Details
	 * @param {Boolean} organizations - If organizations is Present.
   * @returns {JSON} - Removed entities from solution scope.
   */

  static removeEntitiesInScope(solutionId, bodyData, userDetails, organizations) {
    return new Promise(async (resolve, reject) => {
      try {
        let tenantId = userDetails.tenantAndOrgInfo.tenantId
				let orgId = userDetails.tenantAndOrgInfo.orgId[0]
        let solutionData = await solutionsQueries.solutionDocuments(
          {
            _id: solutionId,
            scope: { $exists: true },
            isReusable: false,
            isDeleted: false,
            tenantId: tenantId,
						orgId: orgId,
          },
          ['_id', 'scope.entityType']
        );

        if (!(solutionData.length > 0)) {
          return resolve({
            status: httpStatusCode.bad_request.status,
            message: messageConstants.apiResponses.SOLUTION_NOT_FOUND,
          });
        }
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
        
        let updateSolution = await solutionsQueries.updateSolutionDocument(
          { _id: solutionId },
          updateObject,
          { new: true }
        );
        if (!updateSolution || !updateSolution._id) {
          throw {
            message: messageConstants.apiResponses.SOLUTION_NOT_UPDATED,
          };
        }

        return resolve({
          message: messageConstants.apiResponses.ENTITIES_REMOVED_IN_SOLUTION,
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
   * Get Questions in solution.
   * @method
   * @name deleteSolution
   * @param {Object} req - requested data.
   * @param {String} req.params._id - solutiion internal id.
   * @returns {JSON} consists of solution id.
   */

  static questions(solutionIds) {
    return new Promise(async (resolve, reject) => {
      try {
        let response = {
          message: messageConstants.apiResponses.ASSESSMENT_FETCHED,
          result: {},
        };

        let solutionId = solutionIds;
        let solutionDocumentProjectionFields = await observationHelper.solutionDocumentProjectionFieldsForDetailsAPI();
        //Retrive the solution document based on the solution id
        let solutionDocument = await solutionsQueries.findOne({ _id: solutionId }, solutionDocumentProjectionFields);

        if (!solutionDocument) {
          return resolve({
            status: httpStatusCode.bad_request.status,
            message: messageConstants.apiResponses.SOLUTION_NOT_FOUND,
          });
        }

        let solutionDocumentFieldList = await observationHelper.solutionDocumentFieldListInResponse();

        response.result.solution = await _.pick(solutionDocument, solutionDocumentFieldList);

        let assessment = {};
        assessment.name = solutionDocument.name;
        assessment.description = solutionDocument.description;
        assessment.externalId = solutionDocument.externalId;
        assessment.pageHeading = solutionDocument.pageHeading;
        assessment.submissionId = '';

        let criteriaId = new Array();
        let criteriaObject = {};
        //get criteria weightage and criteriaId from themes
        let criteriaIdArray = gen.utils.getCriteriaIdsAndWeightage(solutionDocument.themes);

        criteriaIdArray.forEach((eachCriteriaId) => {
          criteriaId.push(eachCriteriaId.criteriaId);
          criteriaObject[eachCriteriaId.criteriaId.toString()] = {
            weightage: eachCriteriaId.weightage,
          };
        });
        //find creteria documents based on the criteria ID
        let criteriaQuestionDocument = await database.models.criteriaQuestions
          .find(
            { _id: { $in: criteriaId } },
            {
              resourceType: 0,
              language: 0,
              keywords: 0,
              concepts: 0,
            }
          )
          .lean();

        let evidenceMethodArray = {};
        let submissionDocumentEvidences = {};
        let submissionDocumentCriterias = [];
        Object.keys(solutionDocument.evidenceMethods).forEach((solutionEcm) => {
          solutionDocument.evidenceMethods[solutionEcm].startTime = '';
          solutionDocument.evidenceMethods[solutionEcm].endTime = '';
          solutionDocument.evidenceMethods[solutionEcm].isSubmitted = false;
          solutionDocument.evidenceMethods[solutionEcm].submissions = new Array();
        });

        submissionDocumentEvidences = solutionDocument.evidenceMethods;

        criteriaQuestionDocument.forEach((criteria) => {
          criteria.weightage = criteriaObject[criteria._id.toString()].weightage;

          submissionDocumentCriterias.push(_.omit(criteria, ['evidences']));

          criteria.evidences.forEach((evidenceMethod) => {
            if (evidenceMethod.code) {
              if (!evidenceMethodArray[evidenceMethod.code]) {
                evidenceMethod.sections.forEach((ecmSection) => {
                  ecmSection.name = solutionDocument.sections[ecmSection.code];
                });
                _.merge(evidenceMethod, submissionDocumentEvidences[evidenceMethod.code]);
                evidenceMethodArray[evidenceMethod.code] = evidenceMethod;
              } else {
                evidenceMethod.sections.forEach((evidenceMethodSection) => {
                  let sectionExisitsInEvidenceMethod = 0;
                  let existingSectionQuestionsArrayInEvidenceMethod = [];

                  evidenceMethodArray[evidenceMethod.code].sections.forEach((exisitingSectionInEvidenceMethod) => {
                    if (exisitingSectionInEvidenceMethod.code == evidenceMethodSection.code) {
                      sectionExisitsInEvidenceMethod = 1;
                      existingSectionQuestionsArrayInEvidenceMethod = exisitingSectionInEvidenceMethod.questions;
                    }
                  });

                  if (!sectionExisitsInEvidenceMethod) {
                    evidenceMethodSection.name = solutionDocument.sections[evidenceMethodSection.code];
                    evidenceMethodArray[evidenceMethod.code].sections.push(evidenceMethodSection);
                  } else {
                    evidenceMethodSection.questions.forEach((questionInEvidenceMethodSection) => {
                      existingSectionQuestionsArrayInEvidenceMethod.push(questionInEvidenceMethodSection);
                    });
                  }
                });
              }
            }
          });
        });

        let entityDocument = {
          metaInformation: {},
          questionGroup: '',
        };

        let entityDocumentQuestionGroup = entityDocument.metaInformation.questionGroup
          ? entityDocument.metaInformation.questionGroup
          : ['A1'];
        assessment.evidences = [];
        const assessmentsHelper = require(MODULES_BASE_PATH + '/assessments/helper');
        // getting evidences and submissions for the assessment
        const parsedAssessment = await assessmentsHelper.parseQuestionsV2(
          Object.values(evidenceMethodArray),
          entityDocumentQuestionGroup,
          submissionDocumentEvidences,
          solutionDocument && solutionDocument.questionSequenceByEcm ? solutionDocument.questionSequenceByEcm : false,
          {}
        );
        assessment.evidences = parsedAssessment.evidences;
        assessment.submissions = parsedAssessment.submissions;

        if (parsedAssessment.generalQuestions && parsedAssessment.generalQuestions.length > 0) {
          assessment.generalQuestions = parsedAssessment.generalQuestions;
        }

        response.result.assessment = assessment;
        return resolve(response);
      } catch (error) {
        return reject({
          status: error.status || httpStatusCode.internal_server_error.status,
          message: error.message || httpStatusCode.internal_server_error.message,
          errorObject: error,
        });
      }
    });
  }
};

/**
 * Generate sharing Link.
 * @method
 * @name _targetedSolutionTypes
 * @returns {Array} - Targeted solution types
 */

function _generateLink(appsPortalBaseUrl, prefix, solutionLink, solutionType) {
  let link;

  switch (solutionType) {
    case messageConstants.common.OBSERVATION:
      link = appsPortalBaseUrl + prefix + messageConstants.common.CREATE_OBSERVATION + solutionLink;
      break;
    case messageConstants.common.IMPROVEMENT_PROJECT:
      link = appsPortalBaseUrl + prefix + messageConstants.common.CREATE_PROJECT + solutionLink;
      break;
    default:
      link = appsPortalBaseUrl + prefix + messageConstants.common.CREATE_SURVEY + solutionLink;
  }

  return link;
}

/**
 * Targeted solutions types.
 * @method
 * @name _targetedSolutionTypes
 * @returns {Array} - Targeted solution types
 */

function _targetedSolutionTypes() {
  return [messageConstants.common.OBSERVATION, messageConstants.common.SURVEY];
}

/**
 * Generate program creation data.
 * @method
 * @name _createProgramData
 * @returns {Object} - program creation data
 */

function _createProgramData(
  name,
  externalId,
  isAPrivateProgram,
  status,
  description,
  userId,
  startDate,
  endDate,
  createdBy = ''
) {
  let programData = {};
  programData.name = name;
  programData.externalId = externalId;
  programData.isAPrivateProgram = isAPrivateProgram;
  programData.status = status;
  programData.description = description;
  programData.userId = userId;
  programData.createdBy = createdBy;
  programData.startDate = startDate;
  programData.endDate = endDate;
  return programData;
}

/**
 * Generate solution creation data.
 * @method
 * @name _createSolutionData
 * @returns {Object} - solution creation data
 */

function _createSolutionData(
  name = '',
  externalId = '',
  isAPrivateProgram = '',
  status,
  description = '',
  userId,
  isReusable = '',
  parentSolutionId = '',
  type = '',
  subType = '',
  updatedBy = '',
  projectTemplateId = '',
  themes = [],
  evidenceMethods = {},
  sections = {}
) {
  let solutionData = {};
  solutionData.name = name;
  solutionData.externalId = externalId;
  solutionData.isAPrivateProgram = isAPrivateProgram;
  solutionData.status = status;
  solutionData.description = description;
  solutionData.author = userId;
  if (parentSolutionId) {
    solutionData.parentSolutionId = parentSolutionId;
  }
  if (type) {
    solutionData.type = type;
  }
  if (subType) {
    solutionData.subType = subType;
  }
  if (updatedBy) {
    solutionData.updatedBy = updatedBy;
  }
  if (isReusable) {
    solutionData.isReusable = isReusable;
  }
  if (projectTemplateId) {
    solutionData.projectTemplateId = projectTemplateId;
  }
  if (themes) {
    solutionData.themes = themes;
  }
  if (evidenceMethods) {
    solutionData.evidenceMethods = evidenceMethods;
  }
  if (sections) {
    solutionData.sections = sections;
  }

  return solutionData;
}
