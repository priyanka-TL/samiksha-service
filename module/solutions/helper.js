/**
 * name : solutions/helper.js
 * author : Akash
 * created-date : 22-feb-2019
 * Description : Solution related helper functionality.
 */

//Dependencies
const entitiesHelper = require(MODULES_BASE_PATH + '/entities/helper');
const userExtensionHelper = require(MODULES_BASE_PATH + '/userExtension/helper');
const criteriaHelper = require(MODULES_BASE_PATH + '/criteria/helper');
const entityTypesHelper = require(MODULES_BASE_PATH + '/entityTypes/helper');
const userRolesHelper = require(MODULES_BASE_PATH + '/userRoles/helper');
const appsPortalBaseUrl = process.env.APP_PORTAL_BASE_URL + '/';
/**
 * SolutionsHelper
 * @class
 */
module.exports = class SolutionsHelper {
  /**
   * List of solutions and targeted ones.
   * @method
   * @name targetedSolutions
   * @param {String} solutionId - Program Id.
   * @returns {Object} - Details of the solution.
   */

  static targetedSolutions(
    requestedData,
    solutionType,
    userToken,
    pageSize,
    pageNo,
    search,
    filter,
    surveyReportPage = '',
  ) {
    return new Promise(async (resolve, reject) => {
      try {
        let totalCount = 0;
        let mergedData = [];
        let solutionIds = [];

        requestedData['filter'] = {};
        if (solutionIds.length > 0) {
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
        }

        if (getTargetedSolution) {
          targetedSolutions = await this.forUserRoleAndLocation(
            requestedData,
            solutionType,
            '',
            messageConstants.common.DEFAULT_PAGE_SIZE,
            messageConstants.common.DEFAULT_PAGE_NO,
            search,
          );
        }

        if (targetedSolutions.success) {
          if (targetedSolutions.success && targetedSolutions.data.data && targetedSolutions.data.data.length > 0) {
            totalCount += targetedSolutions.data.count;
            targetedSolutions.data.data.forEach((targetedSolution) => {
              targetedSolution.solutionId = targetedSolution._id;
              targetedSolution._id = '';

              if (solutionType !== messageConstants.common.COURSE) {
                targetedSolution['creator'] = targetedSolution.creator ? targetedSolution.creator : '';
              }

              if (solutionType === messageConstants.common.SURVEY) {
                targetedSolution.isCreator = false;
              }

              mergedData.push(targetedSolution);
              delete targetedSolution.type;
              delete targetedSolution.externalId;
            });
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
   * Auto targeted query field.
   * @method
   * @name queryBasedOnRoleAndLocation
   * @param {String} data - Requested body data.
   * @returns {JSON} - Auto targeted solutions query.
   */

  static queryBasedOnRoleAndLocation(data, type = '') {
    return new Promise(async (resolve, reject) => {
      try {
        let registryIds = [];
        let entityTypes = [];

        Object.keys(_.omit(data, ['filter', 'role', 'recommendedFor'])).forEach((requestedDataKey) => {
          registryIds.push(data[requestedDataKey]);
          entityTypes.push(requestedDataKey);
        });
        if (!registryIds.length > 0) {
          throw {
            message: messageConstants.apiResponses.NO_LOCATION_ID_FOUND_IN_DATA,
          };
        }

        let filterQuery = {
          'scope.roles.code': { $in: [messageConstants.common.ALL_ROLES, ...data.role.split(',')] },
          'scope.entities': { $in: [...registryIds] },
          'scope.recommendedFor': { $in: data.recommendedFor.split(',') },
          isReusable: false,
          isDeleted: false,
        };

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

  static forUserRoleAndLocation(bodyData, type, subType = '', pageSize, pageNo, searchText = '') {
    return new Promise(async (resolve, reject) => {
      try {
        let queryData = await this.queryBasedOnRoleAndLocation(bodyData, type, subType);

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
          }

          if (subType !== '') {
            matchQuery['subType'] = subType;
          }
        }

        let targetedSolutions = await this.list(type, subType, matchQuery, pageNo, pageSize, searchText, [
          'name',
          'description',
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
   * find solutions
   * @method
   * @name solutionDocuments
   * @param {Array} [solutionFilter = "all"] - solution ids.
   * @param {Array} [fieldsArray = "all"] - projected fields.
   * @param {Array} [skipFields = "none"] - field not to include
   * @returns {Array} List of solutions.
   */

  static solutionDocuments(solutionFilter = 'all', fieldsArray = 'all', skipFields = 'none') {
    return new Promise(async (resolve, reject) => {
      try {
        let queryObject = solutionFilter != 'all' ? solutionFilter : {};

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

        let solutionDocuments = await database.models.solutions.find(queryObject, projection).lean();

        return resolve(solutionDocuments);
      } catch (error) {
        return reject(error);
      }
    });
  }

  /**
   * Set scope in solution
   * @method
   * @name setScope
   * @param {String} solutionId - solution id.
   * @param {Object} scopeData - scope data.
   * @param {String} scopeData.entityType - scope entity type
   * @param {Array} scopeData.entities - scope entities
   * @param {Array} scopeData.roles - roles in scope
   * @returns {JSON} - scope in solution.
   */

  static setScope(solutionId, scopeData) {
    return new Promise(async (resolve, reject) => {
      try {
        let solutionData = await this.solutionDocuments({ _id: solutionId }, ['_id', 'scope']);

        if (!solutionData.length > 0) {
          return resolve({
            status: httpStatusCode.bad_request.status,
            message: messageConstants.apiResponses.SOLUTION_NOT_FOUND,
          });
        }

        let currentSolutionScope = JSON.parse(JSON.stringify(solutionData[0].scope));

        if (Object.keys(scopeData).length > 0) {
          if (scopeData.entityType) {
            let bodyData = { name: scopeData.entityType };
            let entityTypeData = await entityTypesHelper.list(bodyData);
            if (entityTypeData.length > 0) {
              currentSolutionScope.entityType = entityTypeData[0].name;
            }
          }

          if (scopeData.entities && scopeData.entities.length > 0) {
            //call learners api for search
            let entityIds = [];
            let locationData = gen.utils.filterLocationIdandCode(scopeData.entities);

            if (locationData.codes.length > 0) {
              let filterData = {
                'registryDetails.code': locationData.codes,
                entityType: currentSolutionScope.entityType,
              };
              let entityDetails = await entitiesHelper.entitiesDocument(filterData);

              if (entityDetails.success) {
                entityDetails.data.forEach((entity) => {
                  entityIds.push(entity.id);
                });
              }
            }
            entityIds = [...locationData.ids, ...locationData.codes];

            if (!entityIds.length > 0) {
              return resolve({
                status: httpStatusCode.bad_request.status,
                message: messageConstants.apiResponses.ENTITIES_NOT_FOUND,
              });
            }

            let entitiesData = [];

            // if( currentSolutionScope.entityType !== programData[0].scope.entityType ) {
            //   let result = [];
            //   let childEntities = await userService.getSubEntitiesBasedOnEntityType(currentSolutionScope.entities, currentSolutionScope.entityType, result);
            //   if( childEntities.length > 0 ) {
            //     entitiesData = entityIds.filter(element => childEntities.includes(element));
            //   }
            // } else {
            entitiesData = entityIds;
            // }

            if (!entitiesData.length > 0) {
              return resolve({
                status: httpStatusCode.bad_request.status,
                message: messageConstants.apiResponses.SCOPE_ENTITY_INVALID,
              });
            }

            currentSolutionScope.entities = entitiesData;
          }

          currentSolutionScope.recommendedFor = scopeData.recommendedFor;

          if (scopeData.roles) {
            if (Array.isArray(scopeData.roles) && scopeData.roles.length > 0) {
              let userRoles = await userRolesHelper.list(
                {
                  code: { $in: scopeData.roles },
                },
                ['_id', 'code'],
              );

              if (!userRoles.length > 0) {
                return resolve({
                  status: httpStatusCode.bad_request.status,
                  message: messageConstants.apiResponses.INVALID_ROLE_CODE,
                });
              }

              currentSolutionScope['roles'] = userRoles;
            } else {
              if (scopeData.roles === messageConstants.common.ALL_ROLES) {
                currentSolutionScope['roles'] = [
                  {
                    code: messageConstants.common.ALL_ROLES,
                  },
                ];
              }
            }
          }
        }

        let updateSolution = await database.models.solutions
          .findOneAndUpdate(
            {
              _id: solutionId,
            },
            { $set: { scope: currentSolutionScope } },
            { new: true },
          )
          .lean();

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

  static update(SolutionId, bodyData, userId) {
    return new Promise(async (resolve, reject) => {
      try {
        let solutionData = bodyData;
        let queryObject = {
          _id: SolutionId,
        };

        let solutionDocument = await this.solutionDocuments(queryObject, ['_id']);

        if (!solutionDocument.length > 0) {
          return resolve({
            status: httpStatusCode.bad_request.status,
            message: messageConstants.apiResponses.SOLUTION_NOT_FOUND,
          });
        }

        let updateObject = {
          $set: {},
        };

        if (
          solutionData.minNoOfSubmissionsRequired &&
          solutionData.minNoOfSubmissionsRequired > messageConstants.common.DEFAULT_SUBMISSION_REQUIRED
        ) {
          if (!solutionData.allowMultipleAssessemts) {
            solutionData.minNoOfSubmissionsRequired = messageConstants.common.DEFAULT_SUBMISSION_REQUIRED;
          }
        }

        let solutionUpdateData = solutionData;

        Object.keys(_.omit(solutionUpdateData, ['scope'])).forEach((updationData) => {
          updateObject['$set'][updationData] = solutionUpdateData[updationData];
        });
        updateObject['$set']['updatedBy'] = userId;

        let solutionUpdatedData = await database.models.solutions
          .findOneAndUpdate(
            {
              _id: solutionDocument[0]._id,
            },
            updateObject,
            { new: true },
          )
          .lean();

        if (!solutionUpdatedData._id) {
          throw {
            message: messageConstants.apiResponses.SOLUTION_NOT_CREATED,
          };
        }

        if (solutionData.scope && Object.keys(solutionData.scope).length > 0) {
          let solutionScope = await this.setScope(solutionUpdatedData._id, solutionData.scope);

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
        let solutionDocuments = await database.models.solutions.aggregate(query);

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
        let solutionData = await database.models.solutions.create(data);

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
        let solutionDocument = await database.models.solutions
          .find(
            {
              _id: solutionId,
              scoringSystem: {
                $exists: true,
                $ne: '',
              },
              isRubricDriven: true,
            },
            {
              scoringSystem: 1,
            },
          )
          .lean();

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

  static solutionDocuments(filterQuery = 'all', fieldsArray = 'all', skipFields = 'none') {
    return new Promise(async (resolve, reject) => {
      try {
        let queryObject = filterQuery != 'all' ? filterQuery : {};

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

        let solutionDocuments = await database.models.solutions.find(queryObject, projection).lean();

        return resolve(solutionDocuments);
      } catch (error) {
        return reject(error);
      }
    });
  }
  /**
   * Solution details.
   * @method
   * @name details
   * @param {String} solutionId - Solution Id.
   * @returns {Object} - Details of the solution.
   */

  static getDetails(solutionId) {
    return new Promise(async (resolve, reject) => {
      try {
        let solutionData = await this.solutionDocuments({
          _id: solutionId,
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

        let solutionEntities = await database.models.solutions.findOne(
          {
            externalId: solutionExternalId,
          },
          {
            entities: 1,
          },
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
            },
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
            },
          );
        }

        return resolve(csvArray);
      } catch (error) {
        console.log(error);
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
            (row) => row.externalId === themeRow.externalId && row.name === themeRow.name,
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
              _.omit(childTheme, ['children', 'rubric', 'criteria', 'hierarchyLevel', 'hierarchyTrack']),
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
            },
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

        let solutionDocuments = await database.models.solutions.aggregate(solutionDocument);

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
   * Solution details
   * @method
   * @name details
   * @param {String} - solutionId
   * @returns {Object} - Solution details information.
   */

  static details(solutionId) {
    return new Promise(async (resolve, reject) => {
      try {
        let solutionData = await this.solutionDocuments(
          {
            _id: solutionId,
          },
          ['creator', 'description', 'themes', 'evidenceMethods', 'linkTitle', 'linkUrl', 'name', 'entityType', 'type'],
        );

        if (!solutionData[0]) {
          throw {
            status: httpStatusCode.bad_request.status,
            message: messageConstants.apiResponses.SOLUTION_NOT_FOUND,
          };
        }

        return resolve(solutionData[0]);
      } catch (error) {
        return reject(error);
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
    createdFor = [],
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
          createdFor,
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
          ]),
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
   * @returns {Object} New solution information
   */

  static importFromSolution(
    solutionId,
    // programId,
    userId,
    data,
    createdFor = '',
    // rootOrganisations = ""
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

        let solutionDocument = await this.solutionDocuments(solutionQuery);

        if (!solutionDocument[0]) {
          throw {
            message: messageConstants.apiResponses.SOLUTION_NOT_FOUND,
          };
        }

        // let programQuery = {};

        // let validateProgramId = gen.utils.isValidMongoId(programId);

        // if (validateProgramId) {
        //   programQuery["_id"] = programId;
        // } else {
        //   programQuery["externalId"] = programId;
        // }

        // let programDocument = await programsHelper.list(programQuery, [
        //   "externalId",
        //   "name",
        //   "description",
        //   "isAPrivateProgram",
        // ]);

        // if (!programDocument[0]) {
        //   throw {
        //     message: messageConstants.apiResponses.PROGRAM_NOT_FOUND,
        //   };
        // }

        let newSolutionDocument = _.cloneDeep(solutionDocument[0]);

        let duplicateCriteriasResponse = await criteriaHelper.duplicate(newSolutionDocument.themes);

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
        // newSolutionDocument.programId = programDocument[0]._id;
        // newSolutionDocument.programExternalId = programDocument[0].externalId;
        // newSolutionDocument.programName = programDocument[0].name;
        // newSolutionDocument.programDescription = programDocument[0].description;
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

        let duplicateSolutionDocument = await database.models.solutions.create(_.omit(newSolutionDocument, ['_id']));

        if (duplicateSolutionDocument._id) {
          if (data.scope && Object.keys(data.scope).length > 0) {
            await this.setScope(
              // newSolutionDocument.programId,
              duplicateSolutionDocument._id,
              data.scope,
            );
          }

          if (duplicateSolutionDocument.type == messageConstants.common.OBSERVATION) {
            let link = await gen.utils.md5Hash(duplicateSolutionDocument._id + '###' + userId);

            await this.updateSolutionDocument({ _id: duplicateSolutionDocument._id }, { $set: { link: link } });
          }

          // await database.models.programs.updateOne(
          //   { _id: programDocument[0]._id },
          //   { $addToSet: { components: duplicateSolutionDocument._id } }
          // );

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
   * @returns {Object} - Details of the solution.
   */

  static fetchLink(solutionId, userId) {
    return new Promise(async (resolve, reject) => {
      try {
        let solutionData = await this.solutionDocuments(
          {
            _id: solutionId,
            isReusable: false,
            isAPrivateProgram: false,
          },
          ['link', 'type', 'author'],
        );

        if (!Array.isArray(solutionData) || solutionData.length < 1) {
          return resolve({
            message: messageConstants.apiResponses.SOLUTION_NOT_FOUND,
            result: {},
          });
        }

        let prefix = messageConstants.common.PREFIX_FOR_SOLUTION_LINK;

        let solutionLink, link;

        if (!solutionData[0].link) {
          let updateLink = await gen.utils.md5Hash(solutionData[0]._id + '###' + solutionData[0].author);

          let updateSolution = await this.update(solutionId, { link: updateLink }, userId);

          solutionLink = updateLink;
        } else {
          solutionLink = solutionData[0].link;
        }

        link = _generateLink(appsPortalBaseUrl, prefix, solutionLink, solutionData[0].type);

        return resolve({
          success: true,
          message: messageConstants.apiResponses.LINK_GENERATED,
          result: link,
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

        let solutionRoles = await database.models.solutions.findOneAndUpdate(
          {
            _id: solutionId,
          },
          {
            $set: {
              roles: roles,
            },
          },
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
   * @param {String} userId - UserId.
   * @returns {Object} Delete Solution .
   */

  static delete(solutionId = '', userId = '') {
    return new Promise(async (resolve, reject) => {
      try {
        if (solutionId == '') {
          throw new Error(messageConstants.apiResponses.SOLUTION_ID_REQUIRED);
        }

        if (userId == '') {
          throw new Error(messageConstants.apiResponses.USER_ID_REQUIRED_CHECK);
        }

        let solutionData = await this.updateSolutionDocument(
          {
            _id: solutionId,
            isAPrivateProgram: true,
            author: userId,
          },
          {
            $set: { isDeleted: true },
          },
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

        let solutionData = await this.updateSolutionDocument(
          {
            _id: solutionId,
            isAPrivateProgram: true,
            author: userId,
          },
          {
            $set: { status: messageConstants.common.INACTIVE_STATUS },
          },
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

        let solutionData = await this.updateSolutionDocument(
          {
            _id: solutionId,
            isAPrivateProgram: true,
            author: userId,
          },
          {
            $set: { status: messageConstants.common.ACTIVE_STATUS },
          },
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

        let trashData = await this.solutionDocuments(
          {
            author: userId,
            isAPrivateProgram: true,
            status: messageConstants.common.INACTIVE_STATUS,
            isDeleted: false,
          },
          ['name'],
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

        let solutionData = await this.solutionDocuments(
          {
            _id: solutionId,
          },
          ['_id'],
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
            },
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
   * Update solution document.
   * @method
   * @name updateSolutionDocument
   * @param {Object} query - query to find document
   * @param {Object} updateObject - fields to update
   * @returns {String} - message.
   */

  static updateSolutionDocument(query = {}, updateObject = {}) {
    return new Promise(async (resolve, reject) => {
      try {
        if (Object.keys(query).length == 0) {
          throw new Error(messageConstants.apiResponses.UPDATE_QUERY_REQUIRED);
        }

        if (Object.keys(updateObject).length == 0) {
          throw new Error(messageConstants.apiResponses.UPDATE_OBJECT_REQUIRED);
        }

        let updateResponse = await database.models.solutions.updateOne(query, updateObject);

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
   * Add entity to solution.
   * @method
   * @name addEntityToSolution
   * @param {String} solutionId - solution id.
   * @param {Array} entityIds - Entity ids.
   * @returns {String} - message.
   */

  static addEntityToSolution(solutionId, entityIds) {
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

        let solutionDocument = await this.solutionDocuments(solutionQuery, ['entityType']);

        if (!solutionDocument.length > 0) {
          throw new Error(messageConstants.apiResponses.SOLUTION_NOT_FOUND);
        }

        let entitiesDocument = await entitiesHelper.entityDocuments(
          {
            _id: { $in: entityIds },
            entityType: solutionDocument[0].entityType,
          },
          ['_id'],
        );

        let updateEntityIds = entitiesDocument.map((entity) => entity._id);

        if (entityIds.length != updateEntityIds.length) {
          responseMessage = messageConstants.apiResponses.ENTITIES_NOT_UPDATE;
        }

        await database.models.solutions.findOneAndUpdate(solutionQuery, {
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
   * @param {String} solutionIds - solution ids.
   * @returns {String} - message.
   */

  static list(type, subType, filter = {}, pageNo, pageSize, searchText, projection) {
    return new Promise(async (resolve, reject) => {
      try {
        let matchQuery = {
          isDeleted: false,
        };

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

        if (searchText !== '') {
          if (matchQuery['$or']) {
            matchQuery['$and'] = [{ $or: matchQuery.$or }, { $or: searchData }];

            delete matchQuery.$or;
          } else {
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

        facetQuery['$facet']['data'] = [{ $skip: pageSize * (pageNo - 1) }, { $limit: pageSize }];

        let projection2 = {};

        projection2['$project'] = {
          data: 1,
          count: {
            $arrayElemAt: ['$totalCount.count', 0],
          },
        };

        let solutionDocuments = await database.models.solutions.aggregate([
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

  // static list() {
  //   return new Promise(async (resolve, reject) => {
  //     try {
  //       let solutionData = await this.solutionDocuments(
  //         {
  //           // externalId : { $in : solutionIds },
  //           status: messageConstants.common.ACTIVE_STATUS,
  //         },
  //         'all',
  //         [
  //           'levelToScoreMapping',
  //           'scoringSystem',
  //           'themes',
  //           'flattenedThemes',
  //           'questionSequenceByEcm',
  //           'entityProfileFieldsPerEntityTypes',
  //           'evidenceMethods',
  //           'sections',
  //           'noOfRatingLevels',
  //           'roles',
  //           'captureGpsLocationAtQuestionLevel',
  //           'enableQuestionReadOut',
  //           'entities',
  //           'criteriaLevelReport',
  //         ],
  //       );

  //       if (!solutionData.length > 0) {
  //         throw {
  //           message: messageConstants.apiResponses.SOLUTION_NOT_FOUND,
  //           status: httpStatusCode['bad_request'].status,
  //         };
  //       }

  //       return resolve({
  //         success: true,
  //         message: messageConstants.apiResponses.SOLUTION_FETCHED,
  //         data: solutionData,
  //       });
  //     } catch (error) {
  //       return resolve({
  //         status: error.status ? error.status : httpStatusCode['internal_server_error'].status,
  //         success: false,
  //         message: error.message,
  //         data: [],
  //       });
  //     }
  //   });
  // }

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

        let solutionDocument = await this.solutionDocuments(solutionQuery, ['_id']);

        if (!solutionDocument.length > 0) {
          throw new Error(messageConstants.apiResponses.SOLUTION_NOT_FOUND);
        }

        let updateEntityIds = entityIds.map((entityId) => ObjectId(entityId));

        await database.models.solutions.findOneAndUpdate(
          solutionQuery,
          { $pull: { entities: { $in: updateEntityIds } } },
          { multi: true },
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
        let solutionDocument = await this.solutionDocuments({ externalId: solutionExternalId }, ['_id', 'themes']);
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
                    (eachCriteria) => eachCriteria.criteriaId != criteriaId,
                  );

                  childKey.criteria = criteriaTobeUpdated;
                }

                if (childData && childData != undefined) {
                  childData.forEach((nestedKey) => {
                    let nestedCriteria = nestedKey.criteria;
                    if (nestedCriteria) {
                      let nestedCriteriaTobeUpdated = nestedCriteria.filter(
                        (nested) => nested.criteriaId != criteriaId,
                      );

                      nestedKey.criteria = nestedCriteriaTobeUpdated;
                    }
                  });
                }
              });
            }
          }
        }

        let solutionUpdated = await this.updateSolutionDocument(
          { externalId: solutionExternalId },
          { $set: { themes: themeData } },
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
