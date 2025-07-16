/**
 * name : observations/helper.js
 * author : Akash
 * created-date : 22-Nov-2018
 * Description : Observations helper functionality.
 */

// Dependencies
const entitiesHelper = require(MODULES_BASE_PATH + '/entities/helper');
const userExtensionHelper = require(MODULES_BASE_PATH + '/userExtension/helper');
const observationSubmissionsHelper = require(MODULES_BASE_PATH + '/observationSubmissions/helper');
const shikshalokamHelper = require(MODULES_BASE_PATH + '/shikshalokam/helper');
const slackClient = require(ROOT_PATH + '/generics/helpers/slackCommunications');
const kafkaClient = require(ROOT_PATH + '/generics/helpers/kafkaCommunications');
const chunkOfObservationSubmissionsLength = 500;
const solutionHelper = require(MODULES_BASE_PATH +'/solutions/helper');
const kendraService = require(ROOT_PATH + '/generics/services/kendra');
const moment = require('moment-timezone');
const { ObjectId } = require('mongodb');
const appsPortalBaseUrl =
  process.env.APP_PORTAL_BASE_URL && process.env.APP_PORTAL_BASE_URL !== ''
    ? process.env.APP_PORTAL_BASE_URL + '/'
    : 'https://apps.shikshalokam.org/';
const validateEntities = process.env.VALIDATE_ENTITIES ? process.env.VALIDATE_ENTITIES : 'OFF';
const FileStream = require(ROOT_PATH + '/generics/fileStream');
const submissionsHelper = require(MODULES_BASE_PATH + '/submissions/helper');
const programsHelper = require(MODULES_BASE_PATH + '/programs/helper');
const entityManagementService = require(ROOT_PATH + '/generics/services/entity-management');
const solutionsQueries = require(DB_QUERY_BASE_PATH + '/solutions');
const validateEntity = process.env.VALIDATE_ENTITIES;
const validateRole = process.env.VALIDATE_ROLE;
const topLevelEntityType = process.env.TOP_LEVEL_ENTITY_TYPE;
const surveyService = require(ROOT_PATH + "/generics/services/survey");
const userService = require(ROOT_PATH + '/generics/services/users');
const projectService = require(ROOT_PATH + '/generics/services/project')

/**
 * ObservationsHelper
 * @class
 */
module.exports = class ObservationsHelper {
  /**
   * Get Observation document based on filtered data provided.
   * @method
   * @name observationDocuments
   * @param {Object} [findQuery = "all"] -filter data.
   * @param {Array} [fields = "all"] - Projected fields.
   * @returns {Array} - List of observations.
   */

  static observationDocuments(findQuery = 'all', fields = 'all') {
    return new Promise(async (resolve, reject) => {
      try {
        let queryObject = {};

        if (findQuery != 'all') {
          queryObject = _.merge(queryObject, findQuery);
        }

        let projectionObject = {};

        if (fields != 'all') {
          fields.forEach((element) => {
            projectionObject[element] = 1;
          });
        }

        let observationDocuments = await database.models.observations.find(queryObject, projectionObject).lean();

        return resolve(observationDocuments);
      } catch (error) {
        return reject(error);
      }
    });
  }

  /**
   * Create observation.
   * @method
   * @name create
   * @param {String} solutionId -solution id.
   * @param {Object} data - Observation creation data.
   * @param {Object} userId - User id.
   * @param {String} requestingUserAuthToken - Requesting user auth token.
   * @param {Object} tenantData - tenantData information
   * @param {String} [programId = ""] - program id
   * @returns {Object} observation creation data.
   */

  static create(
    solutionId,
    data,
    userId,
    requestingUserAuthToken = "",
    userRoleAndProfileInformation,
    tenantData,
    programId = ""
  ) {
    return new Promise(async (resolve, reject) => {
      try {
        // if (requestingUserAuthToken == "") {
        //   throw new Error(
        //     messageConstants.apiResponses.REQUIRED_USER_AUTH_TOKEN
        //   );
        // }
  
        // let organisationAndRootOrganisation =
        //   await shikshalokamHelper.getOrganisationsAndRootOrganisations(
        //     requestingUserAuthToken,
        //     userId
        //   );
        let solutionData = await solutionsQueries.solutionDocuments(
          {
            _id: solutionId,
          },
          [
            "isReusable",
            "externalId",
            "programId",
            "programExternalId",
            "frameworkId",
            "frameworkExternalId",
            "entityType",
            "entityTypeId",
            "isAPrivateProgram",
            "project",
            "referenceFrom",
            "isExternalProgram",
          ]
        );
        if (!solutionData.length > 0) {
          throw {
            status: httpStatusCode.bad_request.status,
            message: messageConstants.apiResponses.SOLUTION_NOT_FOUND,
          };
        }
  
        if (solutionData[0].isReusable) {
          const solutionHelper = require(MODULES_BASE_PATH + "/solutions/helper");
          solutionData =
            await solutionHelper.createProgramAndSolutionFromTemplate(
              solutionId,
              {
                _id: programId,
              },
              userId,
              _.omit(data, ["entities"]),
              true,
              userId,
              requestingUserAuthToken,
              tenantData
              //   organisationAndRootOrganisation.,
              //   organisationAndRootOrganisation.rootOrganisations
            );
        } else {
          solutionData = solutionData[0];
        }
        if (
          userRoleAndProfileInformation &&
          Object.keys(userRoleAndProfileInformation).length > 0 &&
          validateRole == "ON" &&
          topLevelEntityType
        ) {
          //validate the user access to create observation
          let validateUserRole = await this.validateUserRole(
            userRoleAndProfileInformation,
            solutionId,
            tenantData
          );
          if (!validateUserRole.success) {
            throw {
              status: httpStatusCode.bad_request.status,
              message:
                validateUserRole.message ||
                messageConstants.apiResponses.OBSERVATION_NOT_RELEVENT_FOR_USER,
            };
          }
        }
  
        let userProfileData = await surveyService.profileRead(
          requestingUserAuthToken
        );
        userProfileData =
          userProfileData.success && userProfileData.data
            ? userProfileData.data
            : {};
  
        let observationData = await this.createObservation(
          data,
          userId,
          solutionData,
          userProfileData,
          tenantData
        );
  
        return resolve(
          _.pick(observationData, [
            "_id",
            "name",
            "description",
            "solutionId",
            "solutionExternalId",
          ])
        );
      } catch (error) {
        return reject(error);
      }
    });
  }
  


  /**
   * Create observation.
   * @method
   * @name createObservation
   * @param {Object} data - Observation creation data.
   * @param {String} userId - Logged in user id.
   * @param {Object} solution - Solution detail data.
   * @param {Object} solution - Solution detail data.
   * @param {String} organisationAndRootOrganisation - organisation and root organisation details.
   * @returns {Object} observation creation data.
   */

  static createObservation(data, userId, solution,userProfileInformation = {},tenantData) {
    return new Promise(async (resolve, reject) => {
      try {
        if (validateEntities == 'ON') {
          if (data.entities ) {
            if(!solution.entityTypeId){
              let entityTypeDocumentsAPICall = await entityManagementService.entityTypeDocuments({
                name: solution.entityType,
                tenantId: tenantData.tenantId,
                orgIds: {$in:['ALL',tenantData.orgId]}
              });
              if (entityTypeDocumentsAPICall?.success && Array.isArray(entityTypeDocumentsAPICall?.data) && entityTypeDocumentsAPICall.data.length > 0) {
                solution['entityTypeId'] = entityTypeDocumentsAPICall.data[0]._id;
              }
            }
            let entitiesToAdd = await entityManagementService.validateEntities(data.entities, solution.entityTypeId,tenantData);
            data.entities = entitiesToAdd.entityIds;
          }
        }

        if (data?.project) {
          data.project._id = new ObjectId(data.project._id);
          data.referenceFrom = messageConstants.common.PROJECT;
        }
        
        let observationData = _.merge(data, {
          solutionId: solution._id,
          solutionExternalId: solution.externalId,
          programId: solution.programId,
          programExternalId: solution.programExternalId,
          frameworkId: solution.frameworkId,
          frameworkExternalId: solution.frameworkExternalId,
          entityTypeId: solution.entityTypeId,
          entityType: solution.entityType,
          updatedBy: userId,
          createdBy: userId,
          createdFor: userId,
          isAPrivateProgram: solution.isAPrivateProgram,
          startDate:solution.startDate,
          endDate:solution.endDate,
          "userProfile" : userProfileInformation ? userProfileInformation : {},
          tenantId: tenantData.tenantId,
          orgId: tenantData.orgId,
          isExternalProgram:solution.isExternalProgram
        });
        let observationDataEntry = await database.models.observations.create(
          observationData
        );

        if (!observationDataEntry._id) {
          throw {
            status: httpStatusCode.bad_request.status,
            message: messageConstants.apiResponses.OBSERVATION_NOT_CREATED,
          };
        }

        return resolve(observationDataEntry);
      } catch (error) {
        return reject(error);
      }
    });
  }

  /**
   * Fetch user organisation details.
   * @method
   * @name getUserOrganisationDetails
   * @param {Array} userIds - Array of user ids required..
   * @param {String} requestingUserAuthToken - Requesting user auth token.
   * @returns {Object} User organisation details.
   */

  static getUserOrganisationDetails(userIds = [], requestingUserAuthToken = '') {
    return new Promise(async (resolve, reject) => {
      try {
        if (requestingUserAuthToken == '') {
          throw new Error(messageConstants.apiResponses.REQUIRED_USER_AUTH_TOKEN);
        }

        let userOrganisationDetails = {};

        if (userIds.length > 0) {
          for (let pointerToUserIds = 0; pointerToUserIds < userIds.length; pointerToUserIds++) {
            const user = userIds[pointerToUserIds];
            let userOrganisations = await shikshalokamHelper.getOrganisationsAndRootOrganisations(
              requestingUserAuthToken,
              userIds[pointerToUserIds],
            );

            userOrganisationDetails[user] = userOrganisations;
          }
        }

        return resolve({
          success: true,
          message: 'User organisation details fetched successfully.',
          data: userOrganisationDetails,
        });
      } catch (error) {
        return reject({
          success: false,
          message: error.message,
        });
      }
    });
  }

  /**
   * list observation v1.
   * @method
   * @name listV1
   * @param {String} [userId = ""] -Logged in user id.
   * @returns {Object} observation list.
   */

  static listV1(userId = '',tenantData) {
    return new Promise(async (resolve, reject) => {
      try {
        if (userId == '') {
          throw new Error(messageConstants.apiResponses.INVALID_USER_ID);
        }

        let observations = this.listCommon(userId, 'v1',tenantData);

        return resolve(observations);
      } catch (error) {
        return reject(error);
      }
    });
  }

  /**
   * list observation v2.
   * @method
   * @name listV2
   * @param {String} [userId = ""] -Logged in user id.
   * @param {Object} tenantData - tenantData
   * @returns {Object} observation list.
   */

  static listV2(userId = '',tenantData) {
    return new Promise(async (resolve, reject) => {
      try {
        if (userId == '') {
          throw new Error(messageConstants.apiResponses.INVALID_USER_ID);
        }

        let observations = this.listCommon(userId, 'v2',tenantData);

        return resolve(observations);
      } catch (error) {
        return reject(error);
      }
    });
  }

  /**
   * list observation v2.
   * @method
   * @name listV2
   * @param {String} [userId = ""] -Logged in user id.
   * @param {String} [sourceApi = ""] - source api.
   * @param {Object} [tenantData = ""] - tenant data.
   * @returns {Object} observation list.
   */

  static listCommon(userId = '', sourceApi = 'v2',tenantData) {
    return new Promise(async (resolve, reject) => {
      try {
        if (userId == '') {
          throw new Error(messageConstants.apiResponses.INVALID_USER_ID);
        }

        let observations = new Array();

        let assessorObservationsQueryObject = [
          {
            $match: {
              createdBy: userId,
              status: { $ne: 'inactive' },
              tenantId: tenantData.tenantId,
              orgId:tenantData.orgId
            },
          },
          {
            $lookup: {
              from: 'entities',
              localField: 'entities',
              foreignField: '_id',
              as: 'entityDocuments',
            },
          },
          {
            $project: {
              name: 1,
              description: 1,
              entities: 1,
              startDate: 1,
              endDate: 1,
              status: 1,
              solutionId: 1,
              'entityDocuments._id': 1,
              'entityDocuments.metaInformation.externalId': 1,
              'entityDocuments.metaInformation.name': 1,
            },
          },
        ];

        const userObservations = await database.models.observations.aggregate(assessorObservationsQueryObject);

        let observation;
        let submissions;
        let entityObservationSubmissionStatus;

        for (
          let pointerToAssessorObservationArray = 0;
          pointerToAssessorObservationArray < userObservations.length;
          pointerToAssessorObservationArray++
        ) {
          observation = userObservations[pointerToAssessorObservationArray];

          if (sourceApi == 'v2') {
            submissions = await database.models.observationSubmissions
              .find(
                {
                  observationId: observation._id,
                  entityId: {
                    $in: observation.entities,
                  },
                  tenantId: tenantData.tenantId,
                  orgId: tenantData.orgId
                },
                {
                  themes: 0,
                  criteria: 0,
                  evidences: 0,
                  answers: 0,
                },
              )
              .sort({ createdAt: -1 });
          } else {
            submissions = await database.models.observationSubmissions.find(
              {
                observationId: observation._id,
                entityId: {
                  $in: observation.entities,
                },
                tenantId: tenantData.tenantId,
                orgId: tenantData.orgId,
              },
              {
                themes: 0,
                criteria: 0,
                evidences: 0,
                answers: 0,
              },
            );
          }

          let observationEntitySubmissions = {};
          submissions.forEach((observationEntitySubmission) => {
            if (!observationEntitySubmissions[observationEntitySubmission.entityId.toString()]) {
              observationEntitySubmissions[observationEntitySubmission.entityId.toString()] = {
                submissionStatus: '',
                submissions: new Array(),
                entityId: observationEntitySubmission.entityId.toString(),
              };
            }
            observationEntitySubmissions[observationEntitySubmission.entityId.toString()].submissionStatus =
              observationEntitySubmission.status;
            observationEntitySubmissions[observationEntitySubmission.entityId.toString()].submissions.push(
              observationEntitySubmission,
            );
          });

          // entityObservationSubmissionStatus = submissions.reduce(
          //     (ac, entitySubmission) => ({ ...ac, [entitySubmission.entityId.toString()]: {submissionStatus:(entitySubmission.entityId && entitySubmission.status) ? entitySubmission.status : "pending"} }), {})

          observation.entities = new Array();
          observation.entityDocuments.forEach((observationEntity) => {
            observation.entities.push({
              _id: observationEntity._id,
              submissionStatus: observationEntitySubmissions[observationEntity._id.toString()]
                ? observationEntitySubmissions[observationEntity._id.toString()].submissionStatus
                : 'pending',
              submissions: observationEntitySubmissions[observationEntity._id.toString()]
                ? observationEntitySubmissions[observationEntity._id.toString()].submissions
                : new Array(),
              ...observationEntity.metaInformation,
            });
          });
          observations.push(_.omit(observation, ['entityDocuments']));
        }

        return resolve(observations);
      } catch (error) {
        return reject(error);
      }
    });
  }

  /**
   * find observation submission.
   * @method
   * @name findSubmission
   * @param {Object} document
   * @param {Object} document.entityId - entity id.
   * @param {Object} document.solutionId - solution id.
   * @param {Object} document.observationId - observation id.
   * @param {Object} document.submissionNumber - submission number.
   * @returns {Object} Submission document.
   */

  static findSubmission(document) {
    return new Promise(async (resolve, reject) => {
      try {
        let submissionDocument = await database.models.observationSubmissions
          .findOne({
            entityId: document.entityId,
            solutionId: document.solutionId,
            observationId: document.observationId,
            submissionNumber: document.submissionNumber,
          })
          .lean();

        if (!submissionDocument) {
          submissionDocument = await database.models.observationSubmissions.create(document);

          if (submissionDocument.referenceFrom === messageConstants.common.PROJECT) {
            await submissionsHelper.pushSubmissionToProjectService(submissionDocument);
          }

          // Push new observation submission to kafka for reporting/tracking.
          observationSubmissionsHelper.pushInCompleteObservationSubmissionForReporting(submissionDocument._id);
        }

        return resolve({
          message: messageConstants.apiResponses.FOUND_SUBMISSION,
          result: submissionDocument,
        });
      } catch (error) {
        return reject(error);
      }
    });
  }

  /**
   * find last submission for observation entity.
   * @method
   * @name findLastSubmissionForObservationEntity
   * @param {String} [observationId = ""] - observation id.
   * @param {String} [entityId = ""] - entity id.
   * @returns {Object} submissionNumber.
   */

  static findLastSubmissionForObservationEntity(observationId = '', entityId = '') {
    return new Promise(async (resolve, reject) => {
      try {
        if (observationId == '' || entityId == '') {
          throw new Error(messageConstants.apiResponses.INVALID_OBSERVATION_ENTITY_ID);
        }

        if (typeof observationId == 'string') {
          observationId = new ObjectId(observationId);
        }

        if (typeof entityId == 'string') {
          entityId = gen.utils.isValidMongoId(entityId) ? new ObjectId(entityId) : entityId;
        }

        let submissionDocument = await database.models.observationSubmissions
          .find(
            {
              observationId: observationId,
              entityId: entityId,
            },
            {
              submissionNumber: 1,
            },
          )
          .sort({ createdAt: -1 })
          .limit(1)
          .lean();

        return resolve({
          success: true,
          message: messageConstants.apiResponses.SUBMISSION_NUMBER_FETCHED,
          result:
            submissionDocument[0] && submissionDocument[0].submissionNumber
              ? submissionDocument[0].submissionNumber
              : 0,
        });
      } catch (error) {
        return reject(error);
      }
    });
  }

  /**
   * Bulk create observation.
   * @method
   * @name bulkCreate
   * @param {Object} solution - solution document.
   * @param {String} solution.externalId - solution external id.
   * @param {String} solution.frameworkId - framework id.
   * @param {String} solution.frameworkExternalId - framework external id.
   * @param {String} solution.name - solution name.
   * @param {String} solution.description - solution description.
   * @param {String} solution.type - solution type.
   * @param {String} solution.entityTypeId - entity type id.
   * @param {String} solution.entityType - entity type.
   * @param {String} solution._id - solution id.
   * @param {Object} entityDocument - entity document.
   * @param {String} entityDocument._id - entity id.
   * @param {String} entityDocument.parentId - parent id.
   * @param {String} userId - logged in user id.
   * @param {Array} userOrganisations - User organisations
   * @returns {Object} status.
   */

  static bulkCreate(userId, solution, entityDocument = {}, userOrganisations) {
    return new Promise(async (resolve, reject) => {
      try {
        let status;
        let startDate = new Date();
        let endDate = new Date();
        let isEntityDocumentValid = false;

        endDate.setFullYear(endDate.getFullYear() + 1);

        if (entityDocument._id && entityDocument._id.toString() != '') {
          if (
            solution.entityTypeId.toString() === entityDocument.entityTypeId.toString() &&
            solution.entityType === entityDocument.entityType
          ) {
            isEntityDocumentValid = true;
          }
        }

        let observationDocument = await database.models.observations
          .findOne(
            {
              solutionExternalId: solution.externalId,
              createdBy: userId,
              status: 'published',
            },
            { _id: 1 },
          )
          .lean();

        if (observationDocument) {
          if (isEntityDocumentValid) {
            let updateObservationData = await database.models.observations
              .findOneAndUpdate(
                {
                  _id: observationDocument._id,
                },
                {
                  $addToSet: { entities: entityDocument._id },
                },
              )
              .lean();
            updateObservationData
              ? (status = `${updateObservationData._id.toString()} Updated Successfully`)
              : (status = `${updateObservationData._id.toString()} Could not be Updated`);
          } else {
            status = messageConstants.apiResponses.INVALID_ENTITY_TYPE;
          }
        } else {
          let observation = {};

          observation['createdFor'] = userOrganisations.createdFor;
          observation['rootOrganisations'] = userOrganisations.rootOrganisations;
          observation['status'] = 'published';
          observation['deleted'] = false;
          observation['solutionId'] = solution._id;
          observation['solutionExternalId'] = solution.externalId;
          observation['programId'] = solution.programId;
          observation['programExternalId'] = solution.programExternalId;
          observation['frameworkId'] = solution.frameworkId;
          observation['frameworkExternalId'] = solution.frameworkExternalId;
          observation['entityTypeId'] = solution.entityTypeId;
          observation['entityType'] = solution.entityType;
          observation['createdBy'] = userId;
          observation['startDate'] = startDate;
          observation['endDate'] = endDate;
          observation['name'] = solution.name;
          observation['description'] = solution.description;
          observation['entities'] = new Array();

          if (isEntityDocumentValid) {
            observation['entities'].push(entityDocument._id);
          }

          let observationDocument = await database.models.observations.create(observation);
          observationDocument._id
            ? (status = `${observationDocument._id} created`)
            : (status = `${observationDocument._id} could not be created`);

          if (observationDocument._id) {
            await this.sendUserNotifications(userId, {
              solutionType: solution.type,
              solutionId: solution._id.toString(),
              programId: solution.programId,
              observationId: observationDocument._id.toString(),
            });
          }
        }

        return resolve({
          status: status,
        });
      } catch (error) {
        return reject(error);
      }
    });
  }

  /**
   * Send user notifications.
   * @method
   * @name sendUserNotifications
   * @param {Object} [observationData = {}] - .
   * @param {String} [userId = ""] - logged in user id.
   * @returns {Object} message and success status.
   */

  static sendUserNotifications(userId = '', observationData = {}) {
    return new Promise(async (resolve, reject) => {
      try {
        if (userId == '') {
          throw new Error(messageConstants.apiResponses.INVALID_USER_ID);
        }

        const kafkaMessage = await kafkaClient.pushUserMappingNotificationToKafka({
          user_id: userId,
          internal: false,
          text: `New observation available now (Observation form)`,
          type: 'information',
          action: 'mapping',
          payload: {
            type: observationData.solutionType,
            solution_id: observationData.solutionId,
            observation_id: observationData.observationId,
          },
          title: 'New Observation',
          created_at: new Date(),
          appType: process.env.MOBILE_APPLICATION_APP_TYPE,
        });

        if (kafkaMessage.status != 'success') {
          let errorObject = {
            formData: {
              userId: userId,
              message: `Failed to push entity notification for observation ${observationData._id.toString()} in the solution ${
                observationData.solutionName
              }`,
            },
          };
          slackClient.kafkaErrorAlert(errorObject);
          throw new Error(
            `Failed to push entity notification for observation ${observationData._id.toString()} in the solution ${
              observationData.solutionName
            }`,
          );
        }

        return resolve({
          success: true,
          message: messageConstants.apiResponses.NOTIFICATION_PUSHED_TO_KAFKA,
        });
      } catch (error) {
        return reject(error);
      }
    });
  }

  /**
   * Pending observation.
   * @method
   * @name pendingObservations
   * @returns {Object} list of pending observation.
   */

  static pendingObservations() {
    return new Promise(async (resolve, reject) => {
      try {
        let findQuery = {
          status: {
            $ne: messageConstants.apiResponses.STATUS_COMPLETED,
          },
        };

        let observationSubmissionsDocuments = await database.models.observationSubmissions
          .find(findQuery, {
            _id: 1,
          })
          .lean();

        if (observationSubmissionsDocuments.length < 0) {
          throw {
            message: messageConstants.apiResponses.NO_PENDING_OBSERVATION,
          };
        }

        let chunkOfObservationSubmissions = _.chunk(
          observationSubmissionsDocuments,
          chunkOfObservationSubmissionsLength,
        );

        let observationData = [];
        let observationSubmissionsIds;
        let observationSubmissionsDocument;

        for (
          let pointerToObservationSubmission = 0;
          pointerToObservationSubmission < chunkOfObservationSubmissions.length;
          pointerToObservationSubmission++
        ) {
          observationSubmissionsIds = chunkOfObservationSubmissions[pointerToObservationSubmission].map(
            (observationSubmission) => {
              return observationSubmission._id;
            },
          );

          observationSubmissionsDocument = await database.models.observationSubmissions
            .find(
              {
                _id: { $in: observationSubmissionsIds },
              },
              {
                _id: 1,
                solutionId: 1,
                createdAt: 1,
                entityId: 1,
                observationId: 1,
                createdBy: 1,
                'entityInformation.name': 1,
                'entityInformation.externalId': 1,
                programId: 1,
              },
            )
            .lean();

          await Promise.all(
            observationSubmissionsDocument.map(async (eachObservationData) => {
              let entityName = '';
              if (eachObservationData.entityInformation && eachObservationData.entityInformation.name) {
                entityName = eachObservationData.entityInformation.name;
              } else if (eachObservationData.entityInformation && eachObservationData.entityInformation.externalId) {
                entityName = eachObservationData.entityInformation.externalId;
              }

              observationData.push({
                _id: eachObservationData._id,
                userId: eachObservationData.createdBy,
                solutionId: eachObservationData.solutionId,
                createdAt: eachObservationData.createdAt,
                entityId: eachObservationData.entityId,
                observationId: eachObservationData.observationId,
                entityName: entityName,
                programId: eachObservationData.programId,
              });
            }),
          );
        }

        return resolve(observationData);
      } catch (error) {
        return reject(error);
      }
    });
  }

  /**
   * Completed observations.
   * @method
   * @name completedObservations
   * @param {String} fromDate  - from Date.
   * @param {String} toDate  - to Date.
   * @returns {Object} list of completed observations.
   */

  static completedObservations(fromDate, toDate) {
    return new Promise(async (resolve, reject) => {
      try {
        let findQuery = {
          status: messageConstants.apiResponses.STATUS_COMPLETED,
          completedDate: {
            $exists: true,
            $gte: fromDate,
            $lte: toDate,
          },
        };

        let observationDocuments = await database.models.observationSubmissions
          .find(findQuery, {
            _id: 1,
          })
          .lean();

        if (!observationDocuments.length > 0) {
          throw {
            message: messageConstants.apiResponses.NO_COMPLETED_OBSERVATIONS,
          };
        }

        let chunkOfObservationSubmissions = _.chunk(observationDocuments, chunkOfObservationSubmissionsLength);

        let observationData = [];
        let observationSubmissionsIds;
        let observationSubmissionsDocument;

        for (
          let pointerToObservationSubmission = 0;
          pointerToObservationSubmission < chunkOfObservationSubmissions.length;
          pointerToObservationSubmission++
        ) {
          observationSubmissionsIds = chunkOfObservationSubmissions[pointerToObservationSubmission].map(
            (observationSubmission) => {
              return observationSubmission._id;
            },
          );

          observationSubmissionsDocument = await database.models.observationSubmissions
            .find(
              {
                _id: { $in: observationSubmissionsIds },
              },
              {
                _id: 1,
                solutionId: 1,
                entityId: 1,
                observationId: 1,
                createdBy: 1,
                'entityInformation.name': 1,
                'entityInformation.externalId': 1,
                completedDate: 1,
                programId: 1,
              },
            )
            .lean();
          await Promise.all(
            observationSubmissionsDocument.map(async (eachObservationData) => {
              let entityName = '';
              if (eachObservationData.entityInformation && eachObservationData.entityInformation.name) {
                entityName = eachObservationData.entityInformation.name;
              } else if (eachObservationData.entityInformation && eachObservationData.entityInformation.externalId) {
                entityName = eachObservationData.entityInformation.externalId;
              }

              observationData.push({
                _id: eachObservationData._id,
                userId: eachObservationData.createdBy,
                solutionId: eachObservationData.solutionId,
                entityId: eachObservationData.entityId,
                observationId: eachObservationData.observationId,
                entityName: entityName,
                completedDate: eachObservationData.completedDate,
                programId: eachObservationData.programId,
              });
            }),
          );
        }

        return resolve(observationData);
      } catch (error) {
        return reject(error);
      }
    });
  }

  /**
   * observation details.
   * @method
   * @name details
   * @param  {String} observationId -observation id.
   * @param  {String} solutionId    -solutionId.
   * @param  {String} userId        -user id.
   * @param  {Object} tenantData    -tenant data.
   * @returns {Object}              observation details.
   */
  static details(observationId = "", solutionId = "", userId = "",tenantData) {
    return new Promise(async (resolve, reject) => {
      try {
        //Check for observation or soultion ID
        if (observationId == "" && solutionId == "") {
          throw {
            message:
              messageConstants.apiResponses.OBSERVATION_OR_SOLUTION_CHECK,
            status: httpStatusCode["bad_request"].status,
          };
        }

        let filterQuery = {};
        if (observationId && observationId != "") {
          filterQuery._id = observationId;
        }

        if (solutionId && solutionId != "" && userId && userId != "") {
          filterQuery.solutionId = new ObjectId(solutionId);
          filterQuery.createdBy = userId;
        }

        filterQuery.tenantId = tenantData.tenantId;
        //find the Obserations documents from the observation collections
        let observationDocument = await this.observationDocuments(filterQuery);

        if (!observationDocument[0]) {
          throw new Error(messageConstants.apiResponses.OBSERVATION_NOT_FOUND);
        }

        if (observationDocument[0].entities.length > 0) {
          let filterData = {
           _id: {$in:observationDocument[0].entities},
           tenantId:tenantData.tenantId,
           orgId: {$in:['ALL',tenantData.orgId]}
          };
        
         //Retrieving the entity from the Entity Management Service
          let entitiesDocument = await entityManagementService.entityDocuments(
            filterData
          );
          // Adding the entity and count on the observation response document
          if (entitiesDocument.success) {
            observationDocument[0].entities = entitiesDocument.data;
            observationDocument[0].count = entitiesDocument.count;
          } else {
            observationDocument[0].entities = [];
            observationDocument[0].count = 0;
          }
        }

        return resolve(observationDocument[0]);
      } catch (error) {
        return reject(error);
      }
    });
  }

  /**
   *  Helper function for list of fields to be selected from solution document.
   * @method
   * @name solutionDocumentProjectionFieldsForDetailsAPI
   * @returns {Promise} Returns a Promise.
   */

  static solutionDocumentProjectionFieldsForDetailsAPI() {
    return new Promise(async (resolve, reject) => {
      return resolve({
        name: 1,
        externalId: 1,
        programId: 1,
        programExternalId: 1,
        description: 1,
        themes: 1,
        entityProfileFieldsPerEntityTypes: 1,
        registry: 1,
        questionSequenceByEcm: 1,
        frameworkId: 1,
        frameworkExternalId: 1,
        roles: 1,
        evidenceMethods: 1,
        sections: 1,
        entityTypeId: 1,
        entityType: 1,
        captureGpsLocationAtQuestionLevel: 1,
        enableQuestionReadOut: 1,
        scoringSystem: 1,
        isRubricDriven: 1,
        project: 1,
        referenceFrom: 1,
        pageHeading: 1,
        criteriaLevelReport: 1,
        endDate: 1,
        isExternalProgram: 1
      });
    });
  }

  /**
   *  Helper function for list of solution fields to be sent in response.
   * @method
   * @name solutionDocumentFieldListInResponse
   * @returns {Promise} Returns a Promise.
   */

  static solutionDocumentFieldListInResponse() {
    return new Promise(async (resolve, reject) => {
      return resolve([
        '_id',
        'externalId',
        'name',
        'description',
        'registry',
        'captureGpsLocationAtQuestionLevel',
        'enableQuestionReadOut',
        'scoringSystem',
        'isRubricDriven',
        'pageHeading',
        'criteriaLevelReport',
        // 'isAPrivateProgram',
        'endDate'
      ]);
    });
  }

  /**
   * Create solution from library template.
   * @method
   * @name createV2
   * @param {String} templateId - observation solution library id.
   * @param {String} userId - Logged in user id.
   * @param {Object} requestedData - request body data.
   * @param {String} token - logged in token.
   * @returns {Array} - Create solution from library template.
   */

  static createV2(templateId, userId, requestedData, token) {
    return new Promise(async (resolve, reject) => {
      try {
        let organisationAndRootOrganisation = await shikshalokamHelper.getOrganisationsAndRootOrganisations(
          token,
          userId,
        );

        let solutionInformation = {
          name: requestedData.name,
          description: requestedData.description,
        };

        if (requestedData.project) {
          solutionInformation['project'] = requestedData.project;
          solutionInformation['referenceFrom'] = messageConstants.common.PROJECT;
        }

        let createdSolutionAndProgram = await solutionHelper.createProgramAndSolutionFromTemplate(
          templateId,
          requestedData.program,
          userId,
          solutionInformation,
          true,
          organisationAndRootOrganisation.createdFor,
          organisationAndRootOrganisation.rootOrganisations,
        );

        let startDate = new Date();
        let endDate = new Date();
        endDate.setFullYear(endDate.getFullYear() + 1);

        let observationData = {
          name: requestedData.name,
          description: requestedData.description,
          status: requestedData.status,
          startDate: startDate,
          endDate: endDate,
          entities: requestedData.entities,
        };

        if (requestedData.project) {
          observationData['project'] = requestedData.project;
          observationData['referenceFrom'] = messageConstants.common.PROJECT;
        }

        let observation = await this.createObservation(
          observationData,
          userId,
          createdSolutionAndProgram,
          organisationAndRootOrganisation,
        );

        createdSolutionAndProgram['observationName'] = observation.name;
        createdSolutionAndProgram['observationId'] = observation._id;
        createdSolutionAndProgram['observationExternalId'] = observation.externalId;

        return resolve({
          message: messageConstants.apiResponses.CREATED_SOLUTION,
          result: createdSolutionAndProgram,
        });
      } catch (error) {
        return reject(error);
      }
    });
  }

  /**
   * observation link.
   * @method
   * @name getObservationLink
   * @param  {String} observationSolutionId observation solution external Id.
   * @param  {String} appName name of app.
   * @returns {getObservationLink} observation getObservationLink.
   */

  static getObservationLink(observationSolutionId, appName) {
    return new Promise(async (resolve, reject) => {
      try {
        let observationData = await solutionsQueries.solutionDocuments(
          {
            externalId: observationSolutionId,
            isReusable: false,
            type: messageConstants.common.OBSERVATION,
          },
          ['link'],
        );

        if (!Array.isArray(observationData) || observationData.length < 1) {
          return resolve({
            message: messageConstants.apiResponses.OBSERVATION_NOT_FOUND,
            result: {},
          });
        }

        let appDetails = await kendraService.getAppDetails(appName);

        if (appDetails.result === false) {
          throw new Error(messageConstants.apiResponses.APP_NOT_FOUND);
        }

        let link = appsPortalBaseUrl + appName + messageConstants.common.CREATE_OBSERVATION + observationData[0].link;

        return resolve({
          message: messageConstants.apiResponses.OBSERVATION_LINK_GENERATED,
          result: link,
        });
      } catch (error) {
        return reject(error);
      }
    });
  }

  /**
   * Verfy observation link.
   * @method
   * @name verifyLink
   * @param {Object} data - observation link.
   * @param {String} requestingUserAuthToken - Requesting user auth token.
   * @param {Object} bodyData - request body data.
   * @returns {Object} observation data.
   */

  static verifyLink(link = '', requestingUserAuthToken = '', userId = '', bodyData = {}) {
    return new Promise(async (resolve, reject) => {
      try {
        if (link == '') {
          throw new Error(messageConstants.apiResponses.LINK_REQUIRED_CHECK);
        }

        if (requestingUserAuthToken == '') {
          throw new Error(messageConstants.apiResponses.REQUIRED_USER_AUTH_TOKEN);
        }

        if (userId == '') {
          throw new Error(messageConstants.apiResponses.USER_ID_REQUIRED_CHECK);
        }

        let observationSolutionData = await solutionsQueries.solutionDocuments(
          {
            link: link,
            type: messageConstants.common.OBSERVATION,
            isReusable: false,
            status: { $ne: messageConstants.common.INACTIVE_STATUS },
          },
          [
            'externalId',
            'subType',
            'programId',
            'name',
            'description',
            'frameworkExternalId',
            'frameworkId',
            'entityTypeId',
            'entityType',
            'isAPrivateProgram',
            'programExternalId',
            'endDate',
            'status',
          ],
        );

        if (!Array.isArray(observationSolutionData) || observationSolutionData.length < 1) {
          return resolve({
            message: messageConstants.apiResponses.INVALID_LINK,
            result: [],
          });
        }

        if (observationSolutionData[0].status != messageConstants.common.ACTIVE_STATUS) {
          return resolve({
            message: messageConstants.apiResponses.LINK_IS_EXPIRED,
            result: [],
          });
        }

        if (new Date() > new Date(observationSolutionData[0].endDate)) {
          if (observationSolutionData[0].status == messageConstants.common.ACTIVE_STATUS) {
            await solutionsQueries.updateSolutionDocument(
              { link: link },
              { $set: { status: messageConstants.common.INACTIVE_STATUS } },
            );
          }

          return resolve({
            message: messageConstants.apiResponses.LINK_IS_EXPIRED,
            result: [],
          });
        }

        let observationData = await this.observationDocuments({
          solutionExternalId: observationSolutionData[0].externalId,
          createdBy: userId,
        });

        if (observationData && observationData.length > 0) {
          return resolve({
            message: messageConstants.apiResponses.OBSERVATION_LINK_VERIFIED,
            result: observationData[0],
          });
        }

        let entities = new Array();

        let registryIds = [];
        let userEntities = [];

        Object.keys(_.omit(bodyData, ['role'])).forEach((requestedDataKey) => {
          registryIds.push(bodyData[requestedDataKey]);
        });

        let filterQuery = {
          $or: [
            {
              'registryDetails.code': { $in: registryIds },
            },
            {
              'registryDetails.locationId': { $in: registryIds },
            },
          ],
        };

        let entitiyDocuments = await entitiesHelper.entityDocuments(filterQuery, ['_id']);

        if (entitiyDocuments.length > 0) {
          userEntities = entitiyDocuments.map((entity) => {
            return entity._id;
          });
        }

        if (!userEntities.length) {
          userEntities = await userExtensionHelper.getUserEntities(userId);
        }

        if (userEntities.length > 0) {
          let entityIdsWithSolutionSubType = await entitiesHelper.entityDocuments(
            {
              _id: { $in: userEntities },
              entityType: observationSolutionData[0].subType,
            },
            ['_id'],
          );

          for (
            let pointerToUserExtension = 0;
            pointerToUserExtension < entityIdsWithSolutionSubType.length;
            pointerToUserExtension++
          ) {
            entities.push(entityIdsWithSolutionSubType[pointerToUserExtension]._id);
          }
        }

        let solutionId = observationSolutionData[0]._id;
        let programId = observationSolutionData[0].programId;
        let today = new Date();
        let startDate = moment(today).format('YYYY-MM-DD');
        let endDate = moment(startDate, 'YYYY-MM-DD').add('years', 1).format('YYYY-MM-DD');
        let dataObj = {
          name: observationSolutionData[0].name,
          description: observationSolutionData[0].description,
          startDate: startDate,
          endDate: endDate,
          status: messageConstants.common.PUBLISHED,
          entities: entities,
          link: link,
        };

        let organisationAndRootOrganisation = await shikshalokamHelper.getOrganisationsAndRootOrganisations(
          requestingUserAuthToken,
          userId,
        );

        let solution = {
          _id: solutionId,
          externalId: observationSolutionData[0].externalId,
          frameworkExternalId: observationSolutionData[0].frameworkExternalId,
          frameworkId: observationSolutionData[0].frameworkId,
          programExternalId: observationSolutionData[0].programExternalId,
          programId: programId,
          entityTypeId: observationSolutionData[0].entityTypeId,
          entityType: observationSolutionData[0].entityType,
          isAPrivateProgram: observationSolutionData[0].isAPrivateProgram,
          entities: entities,
        };

        let result = await this.createObservation(dataObj, userId, solution, organisationAndRootOrganisation);

        return resolve({
          message: messageConstants.apiResponses.OBSERVATION_LINK_VERIFIED,
          result: result,
        });
      } catch (error) {
        return reject(error);
      }
    });
  }

  /**
   * Bulk create observations By entityId and role.
   * @method
   * @name bulkCreateByUserRoleAndEntity - Bulk create observations by entity and role.
   * @param {Object} userObservationData - user observation data
   * @param {String} userToken - logged in user token.
   * @returns {Object}  Bulk create user observations.
   */

  static bulkCreateByUserRoleAndEntity(userObservationData, userToken) {
    return new Promise(async (resolve, reject) => {
      try {
        let userAndEntityList = await kendraService.getUsersByEntityAndRole(
          userObservationData.entityId,
          userObservationData.role,
        );

        if (!userAndEntityList.success) {
          throw new Error(messageConstants.apiResponses.USERS_AND_ENTITIES_NOT_FOUND);
        }

        let entityIds = [];
        let usersKeycloakIdMap = {};

        await Promise.all(
          userAndEntityList.data.map((user) => {
            if (!entityIds.includes(user.entityId)) {
              entityIds.push(user.entityId);
            }
            usersKeycloakIdMap[user.userId] = true;
          }),
        );

        const fileName = `Observation-Upload-Result`;
        let fileStream = new FileStream(fileName);
        let input = fileStream.initStream();

        (async function () {
          await fileStream.getProcessorPromise();
          return resolve({
            isResponseAStream: true,
            fileNameWithPath: fileStream.fileNameWithPath(),
          });
        })();

        if (Object.keys(usersKeycloakIdMap).length > 0) {
          let userOrganisationDetails = await this.getUserOrganisationDetails(
            Object.keys(usersKeycloakIdMap),
            userToken,
          );

          usersKeycloakIdMap = userOrganisationDetails.data;
        }

        let entityDocument;

        if (entityIds.length > 0) {
          let entityQuery = {
            _id: {
              $in: entityIds,
            },
          };

          let entityProjection = ['entityTypeId', 'entityType'];

          entityDocument = await entitiesHelper.entityDocuments(entityQuery, entityProjection);
        }

        let entityObject = {};

        if (entityDocument && Array.isArray(entityDocument) && entityDocument.length > 0) {
          entityDocument.forEach((eachEntityDocument) => {
            entityObject[eachEntityDocument._id.toString()] = eachEntityDocument;
          });
        }

        let solutionQuery = {
          externalId: userObservationData.solutionExternalId,
          status: 'active',
          isDeleted: false,
          isReusable: false,
          type: 'observation',
          programId: { $exists: true },
        };

        let solutionProjection = [
          'externalId',
          'frameworkExternalId',
          'frameworkId',
          'name',
          'description',
          'type',
          'subType',
          'entityTypeId',
          'entityType',
          'programId',
          'programExternalId',
        ];

        let solutionDocument = await solutionsQueries.solutionDocuments(solutionQuery, solutionProjection);

        if (!solutionDocument.length) {
          throw new Error(messageConstants.apiResponses.SOLUTION_NOT_FOUND);
        }

        let solution = solutionDocument[0];

        for (
          let pointerToObservation = 0;
          pointerToObservation < userAndEntityList.data.length;
          pointerToObservation++
        ) {
          let entityDocument = {};
          let observationHelperData;
          let currentData = userAndEntityList.data[pointerToObservation];
          let csvResult = {};
          let status;
          let userId;
          let userOrganisations;

          Object.keys(currentData).forEach((eachObservationData) => {
            csvResult[eachObservationData] = currentData[eachObservationData];
          });

          try {
            if (currentData['userId'] && currentData['userId'] !== '') {
              userId = currentData['userId'];
            }

            if (userId == '') {
              throw new Error(messageConstants.apiResponses.USER_NOT_FOUND);
            }

            if (
              !usersKeycloakIdMap[userId] ||
              !Array.isArray(usersKeycloakIdMap[userId].rootOrganisations) ||
              usersKeycloakIdMap[userId].rootOrganisations.length < 1
            ) {
              throw new Error(messageConstants.apiResponses.USER_ORGANISATION_DETAILS_NOT_FOUND);
            } else {
              userOrganisations = usersKeycloakIdMap[userId];
            }

            if (currentData.entityId && currentData.entityId != '') {
              if (entityObject[currentData.entityId.toString()] !== undefined) {
                entityDocument = entityObject[currentData.entityId.toString()];
              } else {
                throw new Error(messageConstants.apiResponses.ENTITY_NOT_FOUND);
              }
            }

            observationHelperData = await this.bulkCreate(userId, solution, entityDocument, userOrganisations);
            status = observationHelperData.status;
          } catch (error) {
            status = error.message;
          }

          csvResult['status'] = status;
          input.push(csvResult);
        }

        input.push(null);
      } catch (error) {
        return reject(error);
      }
    });
  }

  /**
   * List of Observation submissions
   * @method
   * @name submissionStatus
   * @param {String} observationId - observation id.
   * @param {String} entityId - entity id.
   * @param {String} userId - logged in user id.
   * @returns {Object} list of observation submissions.
   */

  static submissionStatus(observationId, entityId, userId) {
    return new Promise(async (resolve, reject) => {
      try {
        let observation = await this.observationDocuments(
          {
            _id: observationId,
            createdBy: userId,
            entities: ObjectId(entityId),
          },
          ['_id'],
        );

        if (!observation.length > 0) {
          throw {
            message: messageConstants.apiResponses.OBSERVATION_NOT_FOUND,
            status: httpStatusCode['bad_request'].status,
          };
        }

        let observationSubmissions = await observationSubmissionsHelper.observationSubmissionsDocument(
          {
            observationId: observationId,
            entityId: entityId,
            isDeleted: false,
          },
          ['status', 'submissionNumber'],
        );

        if (!observationSubmissions.length > 0) {
          throw {
            message: messageConstants.apiResponses.OBSERVATION_SUBMISSSION_NOT_FOUND,
            status: httpStatusCode['bad_request'].status,
          };
        }

        return resolve({
          message: messageConstants.apiResponses.OBSERVATION_SUBMISSIONS_LIST_FETCHED,
          data: observationSubmissions,
        });
      } catch (error) {
        return reject(error);
      }
    });
  }

  /**
   * List of user assigned observations.
   * @method
   * @name userAssigned
   * @param {String} userId - logged in user id.
   * @param {Number} pageNo - Recent page no.
   * @param {Number} pageSize - Size of page.
   * @param {String} search - search text.
   * @param {String} [ filter = ""] - filter text.
   * @param {Object} tenantFilter - tenant filter.
   * @returns {Object} List of user assigned observations.
   */

  static userAssigned(userId, pageNo, pageSize, search, filter = '',tenantFilter) {
    return new Promise(async (resolve, reject) => {
      try {
        //Constructing the match query for assigned solutions
        let matchQuery = {
          $match: {
            createdBy: userId,
            deleted: false,
            referenceFrom: { $ne: messageConstants.common.PROJECT },
            tenantId:tenantFilter.tenantId,
            orgId:tenantFilter.orgId
          },
        };

        if (search && search !== '') {
          matchQuery['$match']['$or'] = [{ name: new RegExp(search, 'i') }, { description: new RegExp(search, 'i') }];
        }

        if (filter && filter !== '') {
          if (filter === messageConstants.common.CREATED_BY_ME) {
            matchQuery['$match']['isAPrivateProgram'] = {
              $ne: false,
            };
          } else if (filter === messageConstants.common.ASSIGN_TO_ME) {
            matchQuery['$match']['isAPrivateProgram'] = false;
          }
        }
      //Constructing the projection 
        let projection1 = {
          $project: {
            name: 1,
            description: 1,
            solutionId: 1,
            programId: 1,
            entityType:1
          },
        };

        let facetQuery = {};
        facetQuery['$facet'] = {};

        facetQuery['$facet']['totalCount'] = [{ $count: 'count' }];

        facetQuery['$facet']['data'] = [{ $skip: pageSize * (pageNo - messageConstants.common.DEFAULT_PAGE_NO) }, { $limit: pageSize ? pageSize: messageConstants.common.DEFAULT_PAGE_SIZE }];

        let projection2 = {};
        projection2['$project'] = {
          data: 1,
          count: {
            $arrayElemAt: ['$totalCount.count', 0],
          },
        };

        let aggregateData = [];
        aggregateData.push(
          matchQuery,
          {
            $sort: { updatedAt: -1 },
          },
          projection1,
          facetQuery,
          projection2,
        );
        
       //Retrieve the matching documents from the observation collection
        let result = await database.models.observations.aggregate(aggregateData);
        if (result[0].data.length > 0) {
          let solutionIds = [];

          result[0].data.forEach((resultedData) => {
            solutionIds.push(resultedData.solutionId);
          });

          let solutionDocuments = await solutionsQueries.solutionDocuments(
            {
              _id: { $in: solutionIds },
              tenantId:tenantFilter.tenantId
            },
            ['language', 'creator'],
          );
        //Adding creator and language to the observation document fetched from the solution documents
          solutionDocuments.forEach((solutionDocument) => {
            let solution = result[0].data.find(
              (resultData) => resultData.solutionId.toString() === solutionDocument._id.toString(),
            );
            solution['language'] = solutionDocument.language;
            solution['creator'] = solutionDocument.creator ? solutionDocument.creator : '';
          });
        }

        return resolve({
          success: true,
          message: messageConstants.apiResponses.USER_ASSIGNED_OBSERVATION_FETCHED,
          data: {
            data: result[0].data,
            count: result[0].count ? result[0].count : 0,
          },
        });
      } catch (error) {
        return resolve({
          success: false,
          message: error.message,
          data: {
            data: [],
            count: 0,
          },
        });
      }
    });
  }

  /**
   * Get list of observations with the targetted ones.
   * @method
   * @name getObservation
   * @param {String} userId - Logged in user id.
   * @param {String} userToken - Logged in user token.
   * @returns {Object}
   */

  static getObservation(bodyData, userId, token, pageSize, pageNo, search = '') {
    return new Promise(async (resolve, reject) => {
      try {
        let observations = await this.userAssigned(
          userId,
          messageConstants.common.DEFAULT_PAGE_NO,
          messageConstants.common.DEFAULT_PAGE_SIZE,
          search,
        );

        let solutionIds = [];

        let totalCount = 0;
        let mergedData = [];

        if (observations.success && observations.data) {
          totalCount = observations.data.count;
          mergedData = observations.data.data;

          if (mergedData.length > 0) {
            let programIds = [];

            mergedData.forEach((observationData) => {
              if (observationData.solutionId) {
                solutionIds.push(observationData.solutionId);
              }

              if (observationData.programId) {
                programIds.push(observationData.programId);
              }
            });

            let programsData = await programsHelper.list(
              {
                _id: { $in: programIds },
              },
              ['name'],
            );

            if (programsData.length > 0) {
              let programs = programsData.reduce((ac, program) => ({ ...ac, [program._id.toString()]: program }), {});

              mergedData = mergedData.map((data) => {
                if (programs[data.programId.toString()]) {
                  data.programName = programs[data.programId.toString()].name;
                }
                return data;
              });
            }
          }
        }

        if (solutionIds.length > 0) {
          bodyData['filter'] = {};
          bodyData['filter']['skipSolutions'] = solutionIds;
        }

        let targetedSolutions = await kendraService.solutionBasedOnRoleAndLocation(
          token,
          bodyData,
          messageConstants.common.OBSERVATION,
          search,
        );

        if (targetedSolutions.success) {
          if (targetedSolutions.data.data && targetedSolutions.data.data.length > 0) {
            totalCount += targetedSolutions.data.count;

            if (mergedData.length !== pageSize) {
              targetedSolutions.data.data.forEach((targetedSolution) => {
                targetedSolution.solutionId = targetedSolution._id;
                targetedSolution._id = '';
                mergedData.push(targetedSolution);
                delete targetedSolution.type;
                delete targetedSolution.externalId;
              });
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
          message: messageConstants.apiResponses.TARGETED_OBSERVATION_FETCHED,
          data: {
            data: mergedData,
            count: totalCount,
          },
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
   * List of observation entities.
   * @method
   * @name entities
   * @param {String} userId - Logged in user id.
   * @param {String} token - Logged in user token.
   * @param {String} observationId - observation id.
   * @param {String} solutionId - solution id.
   * @param {Object} bodyData - request body data.
   * @param {Object} tenantData - tenant data.
   * @returns {Object} list of entities in observation
   */

  static entities(userId, token, observationId, solutionId, bodyData,tenantData) {
    return new Promise(async (resolve, reject) => {
      try {
        if (observationId === '') {
          let observationData = await this.observationDocuments(
            {
              solutionId: solutionId,
              createdBy: userId,
              tenantId:tenantData.tenantId,
              orgId:tenantData.orgId
            },
            ['_id'],
          );
          
          if (observationData.length > 0) {
            observationId = observationData[0]._id;
          } else {
            let solutionData = await solutionsQueries.solutionDocuments({
              _id: solutionId,
              tenantId:tenantData.tenantId
            });

            if (solutionData.length === 0) {
              throw {
                message: messageConstants.apiResponses.SOLUTION_DETAILS_NOT_FOUND,
              };
            }
            solutionData.data = solutionData[0];

            solutionData.data['startDate'] = new Date();
            let endDate = new Date();
            endDate.setFullYear(endDate.getFullYear() + 1);
            solutionData.data['endDate'] = endDate;
            solutionData.data['status'] = messageConstants.common.PUBLISHED;

            let entityTypes = Object.keys(_.omit(bodyData, ['role']));
            if (validateEntities == 'ON') {
              if (entityTypes.includes(solutionData.data.entityType)) {
                let filterData = {
                  _id:bodyData[solutionData.data.entityType],
                  entityType: solutionData.data.entityType,
                  tenantId:tenantData.tenantId
                };
                
                let entitiesDocument = await entityManagementService.entityDocuments(
                  filterData
                );
                if(!entitiesDocument.success){
                  throw new Error(
                    messageConstants.apiResponses.ENTITIES_NOT_FOUND
                  );
                 }
                 let entityInfo = entitiesDocument.data[0];
                solutionData.data['entities'] = [entityInfo._id];
              }
            } else {
              solutionData.data['entities'] = [bodyData[solutionData.data.entityType]];
            }

            delete solutionData.data._id;
            if(validateRole == 'ON' && topLevelEntityType){ 
              //validate the user access to create observation
              let validateUserRole = await this.validateUserRole(
                bodyData,
                solutionId,
                tenantData
              );

              if (!validateUserRole.success) {
                throw {
                  status: httpStatusCode.bad_request.status,
                  message: validateUserRole.message ||
                    messageConstants.apiResponses
                      .OBSERVATION_NOT_RELEVENT_FOR_USER,
                  
                };
              }
           }
            
            let observation = await this.create(solutionId, solutionData.data, userId, token,bodyData,tenantData);
            observationId = observation._id;
          }
        }    
        let entitiesList = await this.listEntities(observationId,tenantData); 
        let observationData = await this.observationDocuments(
          {
            _id: observationId,
          },
          ['_id', 'solutionId'],
        );       
        let solutionData;
        if (observationData[0]) {
          solutionData = await solutionsQueries.solutionDocuments(
            {
              _id: observationData[0].solutionId,
              tenantId:tenantData.tenantId
            },
            ['allowMultipleAssessemts'],
          );
        }

        return resolve({
          success: true,
          message: messageConstants.apiResponses.OBSERVATION_ENTITIES_FETCHED,
          data: {
            allowMultipleAssessemts: solutionData[0].allowMultipleAssessemts,
            _id: observationId,
            entities: entitiesList.data.entities,
            entityType: entitiesList.data.entityType,
          },
        });
      } catch (error) {
        return resolve({
          status: error.status ? error.status : httpStatusCode['internal_server_error'].status,
          success: false,
          message: error.message,
          data: [],
        });
      }
    });
  }

  /**
   * List of observation entities.
   * @method
   * @name listEntities
   * @param {String} observationId - Observation id.
   * @param {Object} tenantData -tenantData.
   * @returns {Object} List of observation entities.
   */

  static listEntities(observationId,tenantData) {
    return new Promise(async (resolve, reject) => {
      try {
        let observationDocument = await this.observationDocuments(
          {
            _id: observationId,
          },
          ['entities', 'entityType'],
        );
        if (!observationDocument[0]) {
          throw {
            message: messageConstants.apiResponses.OBSERVATION_NOT_FOUND,
          };
        }

        let entities = [];

        if (observationDocument[0].entities && observationDocument[0].entities.length > 0) {
          let entitiesData=[];
          /*
          If validateEntity is set to ON, a call will be made to the Entity Management
          service to fetch information about the entities.
          Conversely, if validateEntity is OFF, the entities will be used directly without validation,
           and the response will not include the entity's name or additional information.
          */

          if(validateEntity == 'ON'){
             entitiesData = await entityManagementService.entityDocuments(
              {
                _id: { $in: observationDocument[0].entities },
                tenantId:tenantData.tenantId,
                orgIds: {$in:['ALL',tenantData.orgId]}
              },
              ['metaInformation.externalId', 'metaInformation.name'],
            );
  
            entitiesData = entitiesData.data;
          }
          else {
            entitiesData = observationDocument[0].entities;
            entitiesData = entitiesData.map((data)=>{
              return {"_id":data}
            });
          }
          if (!entitiesData.length > 0) {
            throw {
              message: messageConstants.apiResponses.ENTITIES_NOT_FOUND,
            };

          }

          for (let pointerToEntities = 0; pointerToEntities < entitiesData.length; pointerToEntities++) {
            let currentEntities = entitiesData[pointerToEntities];

            let observationSubmissions = await observationSubmissionsHelper.observationSubmissionsDocument({
              observationId: observationId,
              entityId: currentEntities._id,
            });

            let entity = {
              _id: currentEntities._id,
              externalId: currentEntities.metaInformation?.externalId,
              name: currentEntities.metaInformation?.name,
              submissionsCount: observationSubmissions.length > 0 ? observationSubmissions.length : 0,
            };

            if (observationSubmissions.length == 1) {
              entity['submissionId'] = observationSubmissions[0]._id;
              entity['status'] =  observationSubmissions[0].status;
            }

            entities.push(entity);
          }
        }

        return resolve({
          success: true,
          message: messageConstants.apiResponses.OBSERVATION_ENTITIES_FETCHED,
          data: {
            entities: entities,
            entityType: observationDocument[0].entityType,
          },
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
   * Add entity to observation.
   * @method
   * @name addEntityToObservation
   * @param {String} observationId - observation id.
   * @param {Object} requestedData - requested data.
   * @param {String} userId - logged in user id.
   * @param {Object} tenantData -tenantData.
   * @returns {JSON} message - regarding either entity is added to observation or not.
   */

  static addEntityToObservation(observationId, requestedData, userId,tenantData) {
    return new Promise(async (resolve, reject) => {
      try {
        let responseMessage = 'Updated successfully.';

        let observationDocument = await this.observationDocuments(
          {
            _id: observationId,
            createdBy: userId,
            status: { $ne: 'inactive' },
            tenantId:tenantData.tenantId,
            orgId: tenantData.orgId
          },
          ['entityTypeId', 'status'],
        );

        if (observationDocument[0].status != messageConstants.common.PUBLISHED) {
          return resolve({
            status: httpStatusCode.bad_request.status,
            message:
              messageConstants.apiResponses.OBSERVATION_ALREADY_COMPLETED +
              messageConstants.apiResponses.OBSERVATION_NOT_PUBLISHED,
          });
        }

        let entitiesToAdd =  await entityManagementService.validateEntities(requestedData,observationDocument[0].entityTypeId,tenantData);

        if (entitiesToAdd.entityIds.length > 0) {
          await database.models.observations.updateOne(
            {
              _id: observationDocument[0]._id,
            },
            {
              $addToSet: { entities: { $each: entitiesToAdd.entityIds } },
            },
          );
        }

        if (entitiesToAdd.entityIds.length != requestedData.length) {
          responseMessage = messageConstants.apiResponses.ENTITIES_NOT_UPDATE;
        }

        return resolve({
          message: responseMessage,
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
   * Remove entity from observation.
   * @method
   * @name removeEntityFromObservation
   * @param {String} observationId - observation id.
   * @param {Object} requestedData - requested data.
   * @param {String} userId - logged in user id.
   * @returns {JSON} observation remoevable message
   */

  static removeEntityFromObservation(observationId, requestedData, userId,tenantData) {
    return new Promise(async (resolve, reject) => {
      try {
        await database.models.observations.updateOne(
          {
            _id:observationId,
            status: { $ne: 'completed' },
            createdBy: userId,
            tenantId:tenantData.tenantId,
            orgId:tenantData.orgId,
          },
          {
            $pull: {
                entities: { $in: requestedData }
            }
        }
        );

        return resolve({
          message: messageConstants.apiResponses.ENTITY_REMOVED,
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
 * Create a new observation submission
 * @param {Object} req - The request object
 * @param {Object} req.params - Request parameters
 * @param {string} req.params._id - Observation ID
 * @param {Object} req.query - Query parameters
 * @param {string} req.query.entityId - Entity ID
 * @param {Object} req.userDetails - User details
 * @param {string} req.userDetails.userId - User ID
 * @param {Object} req.body - Request body
 * @param {Object} req.headers - Request headers
 * @returns {Promise<Object>} - A promise that resolves to an object containing the result of the operation
 */
  static async createNewObservation(req){

    return new Promise(async (resolve, reject)=>{

      let tenantData = req.userDetails.tenantData;
      let observationDocument = await this.observationDocuments({
        _id: req.params._id,
        createdBy: req.userDetails.userId,
        status: { $ne: 'inactive' },
        entities: { '$in': [req.query.entityId]},
        tenantId:tenantData.tenantId,
        orgId:tenantData.orgId,
      });

      if (!observationDocument[0]) {
        return resolve({
          status: httpStatusCode.bad_request.status,
          message: messageConstants.apiResponses.OBSERVATION_NOT_FOUND,
        });
      }
  
      observationDocument = observationDocument[0];
      let entityDocument = { metaInformation: {} };
  
      if (validateEntities == 'ON') {
  
        let filterData = {
          _id: req.query.entityId,
          entityType: observationDocument.entityType,
          tenantId: req.userDetails.tenantData.tenantId,
          orgIds: {$in:['ALL',req.userDetails.tenantData.orgId]}
         };
         let entitiesDocument = await entityManagementService.entityDocuments(
           filterData
         );
         if(!entitiesDocument.success){
          throw new Error({
            message:messageConstants.apiResponses.ENTITIES_NOT_FOUND
          });
         }
  
         entityDocument = entitiesDocument.data[0];
  
        if (!entityDocument) {
          let responseMessage = messageConstants.apiResponses.ENTITY_NOT_FOUND;
          return resolve({
            status: httpStatusCode.bad_request.status,
            message: responseMessage,
          });
        }
      }
  
      if (entityDocument.registryDetails && Object.keys(entityDocument.registryDetails).length > 0) {
        entityDocument.metaInformation.registryDetails = entityDocument.registryDetails;
      }
  
      let solutionDocument = await solutionsQueries.solutionDocuments(
        {
          _id: observationDocument.solutionId,
          status: 'active',
        },
        [
          'externalId',
          'themes',
          'frameworkId',
          'frameworkExternalId',
          'evidenceMethods',
          'entityTypeId',
          'entityType',
          'programId',
          'programExternalId',
          'isAPrivateProgram',
          'scoringSystem',
          'isRubricDriven',
          'project',
          'referenceFrom',
          'criteriaLevelReport',
          'isExternalProgram'
        ],
      );
  
      if (!solutionDocument[0]) {
        return resolve({
          status: httpStatusCode.bad_request.status,
          message: messageConstants.apiResponses.SOLUTION_NOT_FOUND,
        });
      }
  
      solutionDocument = solutionDocument[0];
     //need to check usage of entityProfileForm, why it is fetched. if needed create new logic
      // if (validateEntities == 'ON') {
  
      //   let filterData = {
      //     _id: solutionDocument.entityTypeId
      //    };
  
      //    let entityTypeDocumentsAPICall = await entityManagementService.entityTypeDocuments(
      //      filterData,
      //      {profileForm:1},
      //      req.userDetails.userToken
      //    );
  
      //    if(!entityTypeDocumentsAPICall.success){
      //     throw new Error({
      //       message:messageConstants.apiResponses.ENTITY_NOT_FOUND
      //     });
      //    }
  
      //   let entityProfileForm = entityTypeDocumentsAPICall.data[0];
  
      //   if (!entityProfileForm) {
      //     return resolve({
      //       status: httpStatusCode.bad_request.status,
      //       message: messageConstants.apiResponses.ENTITY_PROFILE_FORM_NOT_FOUND,
      //     });
      //   }
      // }
  
      let lastSubmissionNumber = 0;
  
      const lastSubmissionForObservationEntity = await this.findLastSubmissionForObservationEntity(
        req.params._id,
        req.query.entityId,
      );

      if (!lastSubmissionForObservationEntity.success) {
        throw new Error(lastSubmissionForObservationEntity.message);
      }
  
      lastSubmissionNumber = lastSubmissionForObservationEntity.result + 1;
  
      let programInformation = null;
      
      if(solutionDocument.programId){
        let programDocument
        let programQueryObject = {
          _id: solutionDocument.programId,
          status: messageConstants.common.ACTIVE_STATUS,
          tenantId:tenantData.tenantId,
        };
        if (solutionDocument.isExternalProgram) {
          programDocument = await projectService.programDetails(req.userDetails.userToken, solutionDocument.programId);
          if (programDocument.status != httpStatusCode.ok.status || !programDocument?.result?._id) {
            throw {
              status: httpStatusCode.bad_request.status,
              message: messageConstants.apiResponses.PROGRAM_NOT_FOUND,
            };
          }
          programDocument = [programDocument.result];
        } else {
          /*
          arguments passed to programsHelper.list() are:
          - filter: { externalId: { $in: Array.from(allProgramIds) } }
          - projection: ['_id', 'externalId']
          - sort: ''
          - skip: ''
          - limit: ''
        */
          programDocument = await programsHelper.list(
            programQueryObject,
            ['externalId', 'name', 'description', 'imageCompression', 'isAPrivateProgram'],
            '',
            '',
            ''
          );
          programDocument = programDocument.data.data;
        }
        
       
       if (!programDocument[0]._id) {
         throw messageConstants.apiResponses.PROGRAM_NOT_FOUND;
       }

       programInformation =  {
           ..._.omit(programDocument[0], [
             "_id",
             "components",
             "isAPrivateProgram",
           ]),
         }

      }

      let submissionDocument = {
        entityId: entityDocument._id,
        entityExternalId: entityDocument.metaInformation.externalId ? entityDocument.metaInformation.externalId : '',
        entityInformation: entityDocument.metaInformation,
        solutionId: solutionDocument._id,
        solutionExternalId: solutionDocument.externalId,
        programId: solutionDocument.programId ? solutionDocument.programId :undefined,
        programExternalId: solutionDocument.programExternalId ? solutionDocument.programExternalId: undefined ,
        isAPrivateProgram: solutionDocument.isAPrivateProgram,
        frameworkId: solutionDocument.frameworkId,
        frameworkExternalId: solutionDocument.frameworkExternalId,
        entityTypeId: solutionDocument.entityTypeId,
        entityType: solutionDocument.entityType,
        observationId: observationDocument._id,
        observationInformation: {
          ..._.omit(observationDocument, ['_id', 'entities', 'deleted', '__v']),
        },
        createdBy: observationDocument.createdBy,
        evidenceSubmissions: [],
        entityProfile: {},
        status: 'started',
        scoringSystem: solutionDocument.scoringSystem,
        isRubricDriven: solutionDocument.isRubricDriven,
        userProfile: observationDocument?.userProfile ?? {},
        themes: solutionDocument.themes,
        programInformation:programInformation,
        tenantId: observationDocument.tenantId,
        orgId: observationDocument.orgId,
        isExternalProgram:solutionDocument.isExternalProgram
      };
  
      if (solutionDocument.hasOwnProperty('criteriaLevelReport')) {
        submissionDocument['criteriaLevelReport'] = solutionDocument['criteriaLevelReport'];
      }
  
      if (req.body && req.body.role) {
        submissionDocument.userRoleInformation = req.body;
      }
  
      if (solutionDocument.referenceFrom === messageConstants.common.PROJECT) {
        submissionDocument['referenceFrom'] = messageConstants.common.PROJECT;
        submissionDocument['project'] = observationDocument.project;
      }
  
      let criteriaId = new Array();
      let criteriaObject = {};
      let criteriaIdArray = gen.utils.getCriteriaIdsAndWeightage(solutionDocument.themes);
  
      criteriaIdArray.forEach((eachCriteriaId) => {
        criteriaId.push(eachCriteriaId.criteriaId);
        criteriaObject[eachCriteriaId.criteriaId.toString()] = {
          weightage: eachCriteriaId.weightage,
        };
      });
  
      let criteriaDocuments = await database.models.criteria
        .find(
          { _id: { $in: criteriaId } },
          {
            evidences: 0,
            resourceType: 0,
            language: 0,
            keywords: 0,
            concepts: 0,
            createdFor: 0,
            updatedAt: 0,
            createdAt: 0,
            frameworkCriteriaId: 0,
            __v: 0,
          },
        )
        .lean();
  
      let submissionDocumentEvidences = {};
      let submissionDocumentCriterias = [];
  
      solutionDocument.evidenceMethods !== undefined && Object.keys(solutionDocument.evidenceMethods).forEach((solutionEcm) => {
        if (!(solutionDocument.evidenceMethods[solutionEcm].isActive === false)) {
          solutionDocument.evidenceMethods[solutionEcm].startTime = '';
          solutionDocument.evidenceMethods[solutionEcm].endTime = '';
          solutionDocument.evidenceMethods[solutionEcm].isSubmitted = false;
          solutionDocument.evidenceMethods[solutionEcm].submissions = new Array();
        } else {
          delete solutionDocument.evidenceMethods[solutionEcm];
        }
      });
      submissionDocumentEvidences = solutionDocument.evidenceMethods;
  
      criteriaDocuments.forEach((criteria) => {
        criteria.weightage = criteriaObject[criteria._id.toString()].weightage;
  
        submissionDocumentCriterias.push(_.omit(criteria, ['evidences']));
      });
  
      submissionDocument.evidences = submissionDocumentEvidences;
  
      try{
        submissionDocument.evidencesStatus = Object.values(submissionDocumentEvidences);
      }catch(error){
        submissionDocument.evidencesStatus = []
      }
  
      submissionDocument.criteria = submissionDocumentCriterias;
      submissionDocument.submissionNumber = lastSubmissionNumber;
  
      submissionDocument['appInformation'] = {};
  
      if (req.headers['x-app-id'] || req.headers.appname) {
        submissionDocument['appInformation']['appName'] = req.headers['x-app-id']
          ? req.headers['x-app-id']
          : req.headers.appname;
      }
  
      if (req.headers['x-app-ver'] || req.headers.appversion) {
        submissionDocument['appInformation']['appVersion'] = req.headers['x-app-ver']
          ? req.headers['x-app-ver']
          : req.headers.appversion;
      }
  
      let newObservationSubmissionDocument = await database.models.observationSubmissions.create(submissionDocument);
  
      if (newObservationSubmissionDocument.referenceFrom === messageConstants.common.PROJECT) {
        await observationSubmissionsHelper.pushSubmissionToProjectService(
          _.pick(newObservationSubmissionDocument, ['project', 'status', '_id']),
        );
      }
  
      // Push new observation submission to kafka for reporting/tracking.
      observationSubmissionsHelper.pushInCompleteObservationSubmissionForReporting(
        newObservationSubmissionDocument._id,
      );
  
      let observations = new Array();
      observations = await this.listV2(req.userDetails.userId,tenantData);

      let responseMessage = messageConstants.apiResponses.OBSERVATION_SUBMISSION_CREATED;
  
      return resolve({
        message: responseMessage,
        result: observations,
      });


    })
  

  }

  static async targetedEntityHelper(solutionId,requestedData,tenantData){

    let solutionData = await solutionsQueries.solutionDocuments(
      {
        _id: solutionId,
        isDeleted: false,
      },
      ["entityType", "type"]
    );

    if (!solutionData.length > 0) {
      return resolve({
        status: httpStatusCode.bad_request.status,
        message: constants.apiResponses.SOLUTION_NOT_FOUND,
      });
    }
    
    let rolesDocumentAPICall = await entityManagementService.userRoleExtension({
      code: requestedData.role,
      "tenantId": tenantData.tenantId,
      "orgIds": {$in:['ALL',tenantData.orgId]}
    },
    ["entityTypes.entityType"])
    if (!rolesDocumentAPICall.success) {
      throw {
        status: httpStatusCode["bad_request"].status,
        message: messageConstants.apiResponses.USER_ROLES_NOT_FOUND,
      };
    }

    let requestedEntityTypes = Object.keys(_.omit(requestedData, ["role"]));
    let targetedEntityType = "";
    

    
    rolesDocumentAPICall.data[0].entityTypes.forEach((singleEntityType) => {
      if (requestedEntityTypes.includes(singleEntityType.entityType)) {
        targetedEntityType = singleEntityType.entityType;
      }
    });

    if (solutionData[0].entityType === targetedEntityType) {

      let filterQuery = {
        "_id": requestedData[targetedEntityType],
        "tenantId": tenantData.tenantId,
        "orgIds": {$in:['ALL',tenantData.orgId]}
      };

      // if (gen.utils.checkValidUUID(requestedData[targetedEntityType])) {
      //   filterQuery = {
      //     "registryDetails.locationId": requestedData[targetedEntityType]
      //   };
      // }
      let entitiesAPICall = await entityManagementService.entityDocuments(filterQuery, [
        "groups",
      ]);

      

      const entityDetails = entitiesAPICall.data
      
      if (!entityDetails.length > 0) {
        throw {
          message: messageConstants.apiResponses.ENTITY_NOT_FOUND
        };
      }
      
      let entities = entitiesAPICall.data;
      if (
        entities[0] &&
        entities[0].groups &&
        Object.keys(entities[0].groups).length > 0
      ) {
      //  targetedEntityType = messageConstants.common.STATE_ENTITY_TYPE;
      }
    }
    let filterData = {
      "_id": requestedData[targetedEntityType],
      "tenantId": tenantData.tenantId,
      "orgIds": {$in:['ALL',tenantData.orgId]}
    };

    // if (gen.utils.checkValidUUID(requestedData[targetedEntityType])) {
    //   filterData = {
    //     "registryDetails.locationId": requestedData[targetedEntityType]
    //   };
    // }

    
    let entitiesAPICall = await entityManagementService.entityDocuments(filterData, [
      "metaInformation.name",
      "entityType"
    ]);

    if (!entitiesAPICall.success) {
      throw {
        message: messageConstants.apiResponses.ENTITY_NOT_FOUND
      };
    }

    let entities = entitiesAPICall.data;

    

    if (entities[0].metaInformation && entities[0].metaInformation.name) {
      entities[0]['entityName'] = entities[0].metaInformation.name;
      delete entities[0].metaInformation;
    }

    return {
      message: messageConstants.apiResponses.SOLUTION_TARGETED_ENTITY,
      success: true,
      data: entities[0]
    };

  }
  /**
   * Highest Targeted entity.
   * @method
   * @name getHighestTargetedEntity
   * @param {Object} requestedData - requested data
   * @param {Object} tenantData - tenantData data
   * @returns {Object} - Entity.
   */

  static getHighestTargetedEntity( roleWiseTargetedEntities,tenantData ) {
    return new Promise(async (resolve, reject) => {
      try {

        let allTargetedEntities = {};
        let targetedEntity = {};

        for( let pointerToEntities = 0 ; pointerToEntities < roleWiseTargetedEntities.length ; pointerToEntities++ ) {

          let currentEntity = roleWiseTargetedEntities[pointerToEntities];

          if ( !allTargetedEntities.hasOwnProperty(currentEntity._id) ) {
            allTargetedEntities[currentEntity._id] = new Array();
          }

          let otherEntities = roleWiseTargetedEntities.filter((entity) => entity.entityType !== currentEntity.entityType);
          
          if ( !otherEntities || !otherEntities.length > 0 ) {
            continue; 
          }

          let entitiesDocument = await entityManagementService.entityDocuments({
              _id: currentEntity._id,
              tenantId:tenantData.tenantId,
              orgIds:{$in:['ALL',tenantData.orgId]}
          }, ["groups"]);

          if (!entitiesDocument.success || entitiesDocument.data.length == 0 ) {
            continue;
          }

          entitiesDocument = entitiesDocument.data[0];

          for( let entityCounter = 0 ; entityCounter < otherEntities.length ; entityCounter++ ) {

            let entityDoc = otherEntities[entityCounter];
          
            if ( !entitiesDocument.groups || !entitiesDocument.groups.hasOwnProperty(entityDoc.entityType) ) {
              break;
            }

            allTargetedEntities[currentEntity._id].push(true);
            if ( allTargetedEntities[currentEntity._id].length == otherEntities.length ) {
              targetedEntity = roleWiseTargetedEntities.filter((entity) => entity._id == currentEntity._id);
              break;
            }
          }

        }

        return resolve({
          message: messageConstants.apiResponses.SOLUTION_TARGETED_ENTITY,
          success: true,
          data: targetedEntity
        });
        
      } catch (error) {
        
        return resolve({
          success: false,
          status: error.status
            ? error.status
            : httpStatusCode['internal_server_error'].status,
          message: error.message
        });
      }
    });
  }
  static async targetedEntity(req){

    return new Promise(async (resolve, reject)=>{

      try{
        let roleArray = req.body.role.split(",");
        let targetedEntities = {};
        let tenantData = req.userDetails.tenantData;
        if ( roleArray.length === 1 ) {
          
          const detailEntity = 
          await this.targetedEntityHelper(
              req.params._id,
              req.body,
              tenantData
          );
          detailEntity["result"] = detailEntity.data;
          return resolve(detailEntity);
  
      } else {
         
          let roleWiseTargetedEntities = new Array();
          for ( let roleCount = 0; roleCount < roleArray.length; roleCount++ ) {
  
              const eachRole = roleArray[roleCount];            
              let bodyData = _.omit(req.body, ['role']);
              bodyData.role = eachRole;         
              const detailEntity = 
              await this.targetedEntityHelper(
                  req.params._id,
                  bodyData,
                  tenantData
              );       
              if ( detailEntity.data && Object.keys(detailEntity.data).length > 0 ) {              
                  roleWiseTargetedEntities.push(detailEntity.data);
              }
          }

          //no targeted entity
          if ( roleWiseTargetedEntities.length  == 0 ) {
              throw {
                  status: httpStatusCode["bad_request"].status,
                  message: messageConstants.apiResponses.ENTITIES_NOT_ALLOWED_IN_ROLE
              };
          } 
          //one targeted entity 
          else if (roleWiseTargetedEntities && roleWiseTargetedEntities.length == 1) {
            targetedEntities.result = roleWiseTargetedEntities[0];
          }
          // multiple targeted entity
          else if (roleWiseTargetedEntities && roleWiseTargetedEntities.length > 1) {
            // request body contain role and entity information
            let targetedEntity = await this.getHighestTargetedEntity(roleWiseTargetedEntities, tenantData);

            if (!targetedEntity.data) {
              throw {
                status: httpStatusCode['bad_request'].status,
                message: messageConstants.apiResponses.ENTITIES_NOT_ALLOWED_IN_ROLE,
              };
            }
            targetedEntities.result = targetedEntity.data;
            targetedEntities.message = messageConstants.apiResponses.SOLUTION_TARGETED_ENTITY;
          }
      }
      return resolve(targetedEntities);
  
      }catch(err){
          return reject(err);
      }
    
    })

  }
    /**
   * Check user eligibity to create observation
   * @method
   * @name validateUserRole
   * @param {Object} bodyData - user location request data
   * @param {String} solutionId - Solution id.
   * @param {Object} tenantData - tenant data.
   * @returns {Object} return the eligibity of user
   */

    static validateUserRole(bodyData, solutionId,tenantData) {
      return new Promise(async (resolve, reject) => {
        try {
          //validate solution
          let solutionDocument = await solutionsQueries.solutionDocuments(
            {
              _id: solutionId,
            },
            ["entityType",'tenantId','orgId']
          );
  
          if (!solutionDocument[0]) {
            throw {
              message: messageConstants.apiResponses.SOLUTION_NOT_FOUND,
            };
          }

          let solutionEntityType = solutionDocument[0].entityType;
          let topLevelEntityId = bodyData[topLevelEntityType];


          let tenantDetails = await userService.fetchPublicTenantDetails(tenantData.tenantId);
          if (!tenantDetails.success || !tenantDetails?.data?.meta) {
            throw { 
              status: httpStatusCode.bad_request.status,
              message: messageConstants.apiResponses.FAILED_TO_FETCH_TENANT_DETAILS,
            };
          }

          let observableEntityKeys = tenantDetails.data.meta?.observableEntityKeys || [];

          if (!observableEntityKeys || observableEntityKeys.length === 0) {
            // if observableEntityKeys is empty, then no validation is needed
            resolve({
              success: true
            })
          }

          let KeytoValidate = [];

          for (let i = 0; i < observableEntityKeys.length; i++) {
            KeytoValidate.push(observableEntityKeys[i]);
          }

          let roles = observableEntityKeys
            .filter((key) => typeof bodyData[key] === 'string' && bodyData[key].trim() !== '')
            .flatMap((key) => bodyData[key].split(',').map((role) => role.trim()));

          let entityTypeArr = [];

          for (let roleIndex = 0; roleIndex < roles.length; roleIndex++) {
            let rolesDocumentAPICall = await entityManagementService.entityDocuments(
              {
                _id: roles[roleIndex],
                tenantId: solutionDocument[0].tenantId,
                orgIds: { $in: ['ALL', solutionDocument[0].orgId] },
              },
              ['metaInformation.targetedEntityTypes']
            );
            
            if (
              rolesDocumentAPICall?.success &&
              Array.isArray(rolesDocumentAPICall.data) &&
              rolesDocumentAPICall.data[0]?.metaInformation?.targetedEntityTypes &&
              rolesDocumentAPICall.data[0].metaInformation.targetedEntityTypes.length > 0
            ) {
              let targetedEntityTypes = rolesDocumentAPICall.data[0].metaInformation.targetedEntityTypes;
              for (let entityTypeData of targetedEntityTypes) {
                if (!entityTypeData.entityType) {
                  throw {
                    status: httpStatusCode.bad_request.status,
                    message: messageConstants.apiResponses.INVALID_ENTITY_TYPE,
                  };
                }
                entityTypeArr.push(entityTypeData.entityType);
              }
            } else {
              throw {
                status: httpStatusCode.bad_request.status,
                message: messageConstants.apiResponses.USER_ROLES_NOT_FOUND,
              };
            }
          }

          const uniqueEntityTypeArr = _.uniq(entityTypeArr);
          if (uniqueEntityTypeArr.includes(solutionEntityType)) {
            resolve({
              success: true,
            });
          } else {
            throw {
              status: httpStatusCode.bad_request.status,
              message: messageConstants.apiResponses.OBSERVATION_NOT_RELEVENT_FOR_USER,
            };
          }

        } catch (error) { 
          return resolve({
            status: error.status || httpStatusCode.internal_server_error.status,
            message:
              error.message || httpStatusCode.internal_server_error.message,
            data: false,
          });
        }
      });
    }
      /**
   * Get the highest role in the heirarchy.
   * @method
   * @name findHighestHierarchy
   * @param {String} roles - Roles of the user.
   * @param {Array} rolesHierarchy - Roles hierarchy in descending order.
   * @returns {String} returns highest role in the heirarchy.
   */
    static findHighestHierarchy(roles,rolesHierarchy) {
        let highestHierarchyValue = null;
        let highestIndex = Infinity;
      
        // Loop through each role in the given array
        roles.forEach(role => {
          const index = rolesHierarchy.indexOf(role);
          if (index !== -1 && index < highestIndex) {
            highestIndex = index;
            highestHierarchyValue = role;
          }
        });
      
        return highestHierarchyValue;
    }

  /**
   * Update observations
   * @method
   * @name updateMany
   * @param {Object} query 
   * @param {Object} update 
   * @param {Object} options 
   * @returns {JSON} - updated response.
  */

  static updateMany(query, update, options={}) {
    return new Promise(async (resolve, reject) => {
        try {

            let observationUpdate = await database.models.observations.updateMany(
                query, 
                update,
                options
            );
           return resolve(observationUpdate);
        } catch (error) {
            return reject(error);
        }
    })
  }
};