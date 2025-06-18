/**
 * name : surveySubmissions/helper.js
 * author : Deepa
 * created-date : 07-Spe-2020
 * Description : Survey submissions helper functionality.
 */

// Dependencies
const kafkaClient = require(ROOT_PATH + '/generics/helpers/kafkaCommunications');
const slackClient = require(ROOT_PATH + '/generics/helpers/slackCommunications');
const solutionsHelper = require(MODULES_BASE_PATH + '/solutions/helper');
const surveySubmissionQueries = require(DB_QUERY_BASE_PATH + '/surveySubmissions');
const submissionsHelper = require(MODULES_BASE_PATH + '/submissions/helper');
const programsHelper = require(MODULES_BASE_PATH + '/programs/helper');
const entityManagementService = require(ROOT_PATH + '/generics/services/entity-management');
const projectService = require(ROOT_PATH + '/generics/services/project');

/**
 * SurveySubmissionsHelper
 * @class
 */
module.exports = class SurveySubmissionsHelper {
  /**
   * find survey submissions
   * @method
   * @name surveySubmissionDocuments
   * @param {Array} [surveySubmissionFilter = "all"] - survey submission ids.
   * @param {Array} [fieldsArray = "all"] - projected fields.
   * @param {Array} [sortedData = "all"] - sorted field.
   * @param {Array} [skipFields = "none"] - field not to include
   * @returns {Array} List of survey submissions.
   */

  static surveySubmissionDocuments(
    surveySubmissionFilter = 'all',
    fieldsArray = 'all',
    sortedData = 'all',
    skipFields = 'none'
  ) {
    return new Promise(async (resolve, reject) => {
      try {
        let surveySubmissionDocuments = await surveySubmissionQueries.surveySubmissionDocuments(
          surveySubmissionFilter,
          fieldsArray,
          sortedData,
          skipFields
        );
        return resolve(surveySubmissionDocuments);
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
   * Push completed survey submission in kafka for reporting.
   * @method
   * @name pushCompletedSurveySubmissionForReporting
   * @param {String} surveySubmissionId - survey submission id.
   * @returns {JSON} - message that survey submission is pushed to kafka.
   */

  static pushCompletedSurveySubmissionForReporting(surveySubmissionId = '') {
    return new Promise(async (resolve, reject) => {
      try {
        if (surveySubmissionId == '') {
          throw new Error(messageConstants.apiResponses.SURVEY_SUBMISSION_ID_REQUIRED);
        }

        if (typeof surveySubmissionId == 'string') {
          surveySubmissionId = new ObjectId(surveySubmissionId);
        }

        let surveySubmissionsDocument = await this.surveySubmissionDocuments({
          _id: surveySubmissionId,
          status: messageConstants.common.SUBMISSION_STATUS_COMPLETED,
        });

        if (!surveySubmissionsDocument) {
          throw new Error(
            messageConstants.apiResponses.SUBMISSION_NOT_FOUND +
              'or' +
              messageConstants.apiResponses.SUBMISSION_STATUS_NOT_COMPLETE
          );
        }

        if (surveySubmissionsDocument[0].programId && surveySubmissionsDocument[0].programInformation) {
          surveySubmissionsDocument[0]['programInfo'] = surveySubmissionsDocument[0].programInformation;
        }
        let entityTypeDocumentsAPICall = await entityManagementService.entityTypeDocuments({
          name: surveySubmissionsDocument[0].entityType,
          tenantId: surveySubmissionsDocument[0].tenantId,
          orgIds: { $in: ['ALL', surveySubmissionsDocument[0].orgId] },
        });

        if (
          entityTypeDocumentsAPICall?.success &&
          Array.isArray(entityTypeDocumentsAPICall?.data) &&
          entityTypeDocumentsAPICall.data.length > 0
        ) {
          surveySubmissionsDocument[0]['entityTypeId'] = entityTypeDocumentsAPICall.data[0]._id;
        }

        if (surveySubmissionsDocument[0].referenceFrom === messageConstants.common.PROJECT) {
          await this.pushSubmissionToProjectService(
            _.pick(surveySubmissionsDocument[0], ['project', 'status', '_id', 'completedDate'])
          );
        }
        const kafkaMessage = await kafkaClient.pushCompletedSurveySubmissionToKafka(surveySubmissionsDocument[0]);

        if (kafkaMessage.status != 'success') {
          let errorObject = {
            formData: {
              surveySubmissionId: surveySubmissionsDocument[0]._id.toString(),
              message: kafkaMessage.message,
            },
          };
          slackClient.kafkaErrorAlert(errorObject);
        }

        return resolve(kafkaMessage);
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
   * Push incomplete survey submission for reporting.
   * @method
   * @name pushInCompleteSurveySubmissionForReporting
   * @param {String} surveySubmissionId - survey submission id.
   * @returns {JSON} consists of kafka message whether it is pushed for reporting
   * or not.
   */

  static pushInCompleteSurveySubmissionForReporting(surveySubmissionId) {
    return new Promise(async (resolve, reject) => {
      try {
        if (surveySubmissionId == '') {
          throw new Error(messageConstants.apiResponses.SURVEY_SUBMISSION_ID_REQUIRED);
        }

        if (typeof surveySubmissionId == 'string') {
          surveySubmissionId = new ObjectId(surveySubmissionId);
        }

        let surveySubmissionsDocument = await this.surveySubmissionDocuments({
          _id: surveySubmissionId,
          status: { $ne: 'completed' },
        });

        if (!surveySubmissionsDocument.length) {
          throw (
            messageConstants.apiResponses.SUBMISSION_NOT_FOUND +
            'or' +
            messageConstants.apiResponses.SUBMISSION_STATUS_NOT_COMPLETE
          );
        }

        if (surveySubmissionsDocument[0].programId && surveySubmissionsDocument[0].programInformation) {
          surveySubmissionsDocument[0]['programInfo'] = surveySubmissionsDocument[0].programInformation;
        }

        let entityTypeDocumentsAPICall = await entityManagementService.entityTypeDocuments({
          name: surveySubmissionsDocument[0].entityType,
        });

        if (
          entityTypeDocumentsAPICall?.success &&
          Array.isArray(entityTypeDocumentsAPICall?.data) &&
          entityTypeDocumentsAPICall.data.length > 0
        ) {
          surveySubmissionsDocument[0]['entityTypeId'] = entityTypeDocumentsAPICall.data[0]._id;
        }

        if (surveySubmissionsDocument[0].referenceFrom === messageConstants.common.PROJECT) {
          await this.pushSubmissionToProjectService(
            _.pick(surveySubmissionsDocument[0], ['project', 'status', '_id', 'completedDate'])
          );
        }
        const kafkaMessage = await kafkaClient.pushInCompleteSurveySubmissionToKafka(surveySubmissionsDocument[0]);

        if (kafkaMessage.status != 'success') {
          let errorObject = {
            formData: {
              surveySubmissionId: surveySubmissionsDocument[0]._id.toString(),
              message: kafkaMessage.message,
            },
          };
          slackClient.kafkaErrorAlert(errorObject);
        }

        return resolve(kafkaMessage);
      } catch (error) {
        return reject(error);
      }
    });
  }

  /**
   * Push observation submission to improvement service.
   * @method
   * @name pushSubmissionToProjectService
   * @param {String} observationSubmissionDocument - observation submission document.
   * @returns {JSON} consists of kafka message whether it is pushed for reporting
   * or not.
   */

  static pushSubmissionToProjectService(surveySubmissionDocument) {
    return new Promise(async (resolve, reject) => {
      try {
        let surveySubmissionData = {
          taskId: surveySubmissionDocument.project.taskId,
          projectId: surveySubmissionDocument.project._id,
          _id: surveySubmissionDocument._id,
          status: surveySubmissionDocument.status,
        };

        if (surveySubmissionDocument.completedDate) {
          surveySubmissionData['submissionDate'] = surveySubmissionDocument.completedDate;
        }
        let pushSubmissionToProject;
        if (
          process.env.SUBMISSION_UPDATE_KAFKA_PUSH_ON_OFF === 'ON' &&
          process.env.IMPROVEMENT_PROJECT_SUBMISSION_TOPIC
        ) {
          pushSubmissionToProject = await kafkaClient.pushSubmissionToProjectService(surveySubmissionData);

          if ((pushSubmissionToProject.status != messageConstants.common, SUCCESS)) {
            throw new Error(
              `Failed to push submission to project. Submission ID: ${surveySubmissionDocument._id.toString()}, Message: ${
                pushSubmissionToProject.message
              }`
            );
          }
        } else {
          pushSubmissionToProject = await projectService.pushSubmissionToTask(
            surveySubmissionData.projectId,
            surveySubmissionData.taskId,
            surveySubmissionData
          );
          if (!pushSubmissionToProject.success) {
            throw {
              status: httpStatusCode.bad_request.status,
              message: messageConstants.apiResponses.PUSH_SUBMISSION_FAILED,
            };
          }
        }
        return resolve(pushSubmissionToProject);
      } catch (error) {
        return reject(error);
      }
    });
  }

  /**
   * Check if survey submission is allowed.
   * @method
   * @name isAllowed
   * @param {String} submissionId - survey submissionId
   * @param {String} evidenceId - evidence id
   * @param {String} userId - logged in userId
   * @param {Object} tenantData - tenant data
   * @returns {Json} - survey list.
   */

  static isAllowed(submissionId = '', evidenceId = '', userId = '', tenantData) {
    return new Promise(async (resolve, reject) => {
      try {
        if (submissionId == '') {
          throw new Error(messageConstants.apiResponses.SURVEY_SUBMISSION_ID_REQUIRED);
        }

        if (evidenceId == '') {
          throw new Error(messageConstants.apiResponses.EVIDENCE_ID_REQUIRED);
        }

        if (userId == '') {
          throw new Error(messageConstants.apiResponses.USER_ID_REQUIRED_CHECK);
        }

        let result = {
          allowed: true,
        };

        let submissionDocument = await this.surveySubmissionDocuments(
          {
            _id: submissionId,
            evidencesStatus: { $elemMatch: { externalId: evidenceId } },
            tenantId: tenantData.tenantId,
            orgId: tenantData.orgId,
          },
          ['evidencesStatus.$', 'status', 'createdBy']
        );

        if (!submissionDocument.length) {
          throw new Error(messageConstants.apiResponses.SUBMISSION_NOT_FOUND);
        }

        if (
          submissionDocument[0].status == messageConstants.common.SUBMISSION_STATUS_COMPLETED &&
          submissionDocument[0].createdBy == userId
        ) {
          throw new Error(messageConstants.apiResponses.MULTIPLE_SUBMISSIONS_NOT_ALLOWED);
        }

        if (
          submissionDocument[0].evidencesStatus[0].isSubmitted &&
          submissionDocument[0].evidencesStatus[0].isSubmitted == true
        ) {
          submissionDocument[0].evidencesStatus[0].submissions.forEach((submission) => {
            if (submission.submittedBy == userId) {
              result.allowed = false;
            }
          });
        }

        return resolve({
          success: true,
          message: messageConstants.apiResponses.SURVEY_SUBMISSION_CHECK,
          data: result,
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
   * List created and submitted surveys.
   * @method
   * @name list
   * @param {String} userId - logged in userId
   * @param {Object} tenantData - tenant data
   * @returns {Json} - survey list.
   */

  static list(userId = '', tenantData) {
    return new Promise(async (resolve, reject) => {
      try {
        if (userId == '') {
          throw new Error(messageConstants.apiResponses.USER_ID_REQUIRED_CHECK);
        }
        const solutionsHelper = require(MODULES_BASE_PATH + '/solutions/helper');

        let getSurveyList = [
          solutionsHelper.solutionDocumentsByAggregateQuery([
            {
              $match: {
                author: userId,
                type: messageConstants.common.SURVEY,
                isReusable: false,
                isDeleted: false,
                tenantId: tenantData.tenantId,
                orgId: { $in: ['ALL', tenantData.orgId] },
              },
            },
            {
              $project: {
                solutionId: '$_id',
                name: 1,
                status: 1,
                _id: 0,
              },
            },
            { $sort: { createdAt: -1 } },
          ]),
          surveySubmissionQueries.getAggregate([
            { $match: { createdBy: userId, tenantId: tenantData.tenantId, orgId: tenantData.orgId } },
            {
              $project: {
                submissionId: '$_id',
                surveyId: 1,
                solutionId: 1,
                'surveyInformation.name': 1,
                'surveyInformation.endDate': 1,
                status: 1,
                _id: 0,
              },
            },
            { $sort: { createdAt: -1 } },
          ]),
        ];

        let result = [];

        await Promise.all(getSurveyList).then(function (response) {
          if (response[0].length > 0) {
            result = result.concat(response[0]);
          }

          if (response[1].length > 0) {
            response[1].forEach(async (surveySubmission) => {
              if (new Date() > new Date(surveySubmission.surveyInformation.endDate)) {
                surveySubmission.status = messageConstants.common.EXPIRED;
              }
              surveySubmission.name = surveySubmission.surveyInformation.name;
              delete surveySubmission['surveyInformation'];
              result.push(surveySubmission);
            });
          }
        });

        return resolve({
          success: true,
          message: messageConstants.apiResponses.SURVEY_LIST_FETCHED,
          data: result,
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
   * Get status of Survey submission.
   * @method
   * @name getStatus
   * @param {String} submissionId - survey submissionId
   * @param {Object} tenantData - tenant data
   * @returns {Json} - status of survey submission.
   */

  static getStatus(submissionId = '', tenantData) {
    return new Promise(async (resolve, reject) => {
      try {
        if (submissionId == '') {
          throw new Error(messageConstants.apiResponses.SURVEY_SUBMISSION_ID_REQUIRED);
        }

        let submissionDocument = await this.surveySubmissionDocuments(
          { _id: submissionId, tenantId: tenantData.tenantId, orgId: tenantData.orgId },
          ['status']
        );

        if (!submissionDocument.length) {
          throw messageConstants.apiResponses.SUBMISSION_NOT_FOUND;
        }

        return resolve({
          success: true,
          message: messageConstants.apiResponses.SUBMISSION_STATUS_FETCHED,
          data: {
            status: submissionDocument[0].status,
          },
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
   * List of surveys for user.
   * @method
   * @name surveyList
   * @param {String} userId - logged in userId
   * @param {String} pageNo - page number
   * @param {String} pageSize - page size.
   * @param {String} filter - filter text.
   * @param {String} search - search key
   * @param {String} surveyReportPage - survey report page
   * @param {String} tenantFilter - tenant filter
   * @returns {Json} - survey list.
   */

  static surveyList(userId = '', pageNo, pageSize, search, filter, surveyReportPage = '', tenantFilter) {
    return new Promise(async (resolve, reject) => {
      try {
        if (userId == '') {
          throw new Error(messageConstants.apiResponses.USER_ID_REQUIRED_CHECK);
        }

        let result = {
          data: [],
          count: 0,
        };
        //Constructing the match query
        let submissionMatchQuery = {
          $match: {
            createdBy: userId,
            tenantId: tenantFilter.tenantId,
            orgId: {
              $in: ['ALL', tenantFilter.orgId],
            },
          },
        };

        if (gen.utils.convertStringToBoolean(surveyReportPage)) {
          submissionMatchQuery['$match']['status'] = messageConstants.common.SUBMISSION_STATUS_COMPLETED;
        }

        if (search !== '') {
          submissionMatchQuery['$match']['$or'] = [
            { 'surveyInformation.name': new RegExp(search, 'i') },
            { 'surveyInformation.description': new RegExp(search, 'i') },
          ];
        }

        if (filter && filter !== '') {
          if (filter === messageConstants.common.CREATED_BY_ME) {
            submissionMatchQuery['$match']['isAPrivateProgram'] = {
              $ne: false,
            };
          } else if (filter === messageConstants.common.ASSIGN_TO_ME) {
            submissionMatchQuery['$match']['isAPrivateProgram'] = false;
          }
        }
        let surveySubmissions = await surveySubmissionQueries.getAggregate([
          submissionMatchQuery,
          {
            $project: {
              submissionId: '$_id',
              surveyId: 1,
              solutionId: 1,
              'surveyInformation.name': 1,
              'surveyInformation.endDate': 1,
              'surveyInformation.description': 1,
              completedDate: 1,
              status: 1,
              _id: 0,
            },
          },
          {
            $facet: {
              totalCount: [{ $count: 'count' }],
              data: [
                { $skip: pageSize * (pageNo - messageConstants.common.DEFAULT_PAGE_NO) },
                { $limit: pageSize ? pageSize : messageConstants.common.DEFAULT_PAGE_SIZE },
              ],
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
        //update the status and information of survey in results
        if (surveySubmissions[0].data && surveySubmissions[0].data.length > 0) {
          surveySubmissions[0].data.forEach(async (surveySubmission) => {
            let submissionStatus = surveySubmission.status;

            if (surveyReportPage === '') {
              if (new Date() > new Date(surveySubmission.surveyInformation.endDate)) {
                surveySubmission.status = messageConstants.common.EXPIRED;
              }
            }

            surveySubmission.name = surveySubmission.surveyInformation.name;
            surveySubmission.description = surveySubmission.surveyInformation.description;
            surveySubmission._id = surveySubmission.surveyId;
            surveySubmission.endDate = surveySubmission.surveyInformation.endDate;
            delete surveySubmission.surveyId;
            delete surveySubmission['surveyInformation'];
            //
            if (!surveyReportPage) {
              if (submissionStatus === messageConstants.common.SUBMISSION_STATUS_COMPLETED) {
                result.data.push(surveySubmission);
              } else {
                let currentDate = new Date();
                currentDate.setDate(currentDate.getDate() - 15);
                if (new Date(surveySubmission.endDate) > currentDate) {
                  result.data.push(surveySubmission);
                }
              }
            } else {
              result.data.push(surveySubmission);
            }
          });
          result.count = surveySubmissions[0].count ? result.count + surveySubmissions[0].count : result.count;
        }

        return resolve({
          success: true,
          message: messageConstants.apiResponses.SURVEYS_FETCHED,
          data: {
            data: result.data,
            count: result.count,
          },
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
   * List of created survey solutions by user.
   * @method
   * @name surveySolutions
   * @param {String} userId - logged in userId
   * @param {String} search - search key
   * @param {String} [filter = ""] - filter text
   * @returns {Json} - survey list.
   */

  static surveySolutions(userId, pageNo, pageSize, search, filter = '', tenantFilter) {
    return new Promise(async (resolve, reject) => {
      try {
        if (userId == '') {
          throw new Error(messageConstants.apiResponses.USER_ID_REQUIRED_CHECK);
        }

        let solutionMatchQuery = {
          $match: {
            author: userId,
            type: messageConstants.common.SURVEY,
            isReusable: false,
            isDeleted: false,
            tenantId: tenantFilter.tenantId,
            orgId: {
              $in: ['ALL', tenantFilter.orgId],
            },
          },
        };

        if (search !== '') {
          solutionMatchQuery['$match']['$or'] = [
            { name: new RegExp(search, 'i') },
            { description: new RegExp(search, 'i') },
          ];
        }

        if (filter && filter !== '') {
          if (filter === messageConstants.common.CREATED_BY_ME) {
            solutionMatchQuery['$match']['isAPrivateProgram'] = {
              $ne: false,
            };
          } else if (filter === messageConstants.common.ASSIGN_TO_ME) {
            solutionMatchQuery['$match']['isAPrivateProgram'] = false;
          }
        }
        const solutionsHelper = require(MODULES_BASE_PATH + '/solutions/helper');
        // finding  list of created survey solutions by user
        let result = await solutionsHelper.solutionDocumentsByAggregateQuery([
          solutionMatchQuery,
          {
            $project: {
              solutionId: '$_id',
              name: 1,
              description: 1,
              status: 1,
              _id: 0,
            },
          },
          {
            $facet: {
              totalCount: [{ $count: 'count' }],
              data: [
                { $skip: pageSize * (pageNo - messageConstants.common.DEFAULT_PAGE_NO) },
                { $limit: pageSize ? pageSize : messageConstants.common.DEFAULT_PAGE_SIZE },
              ],
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
          success: true,
          data: {
            data: result[0].data,
            count: result[0].count ? result[0].count : 0,
          },
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
   * update survey submissions.
   * @method
   * @name update
   * @param {Object} req -request data.
   * @param {Object} tenantData - tenant data
   * @returns {JSON} - survey submissions creation.
   */

  static update(req, tenantData) {
    return new Promise(async (resolve, reject) => {
      try {
        // Check if the survey has already been submitted
        let isSubmissionAllowed = await this.isAllowed(
          req.params._id,
          req.body.evidence.externalId,
          req.userDetails.userId,
          tenantData
        );

        if (
          (isSubmissionAllowed.data.allowed && isSubmissionAllowed.data.allowed == false) ||
          !isSubmissionAllowed.data
        ) {
          throw new Error(messageConstants.apiResponses.MULTIPLE_SUBMISSIONS_NOT_ALLOWED);
        }

        if (req.headers.deviceid) {
          req.body.evidence['deviceId'] = req.headers.deviceid;
        }

        if (req.headers['user-agent']) {
          req.body.evidence['userAgent'] = req.headers['user-agent'];
        }
        const submissionsHelper = require(MODULES_BASE_PATH + '/submissions/helper');
        // creating evidence and adding answers in the Submission documents
        let response = await submissionsHelper.createEvidencesInSubmission(
          req,
          messageConstants.common.SURVEY_SUBMISSIONS,
          false
        );
        if (response.result.status && response.result.status === messageConstants.common.SUBMISSION_STATUS_COMPLETED) {
          await this.pushCompletedSurveySubmissionForReporting(req.params._id);
        }

        let appInformation = {};

        if (req.headers['x-app-id'] || req.headers.appname) {
          appInformation['appName'] = req.headers['x-app-id'] ? req.headers['x-app-id'] : req.headers.appname;
        }

        if (req.headers['x-app-ver'] || req.headers.appversion) {
          appInformation['appVersion'] = req.headers['x-app-ver'] ? req.headers['x-app-ver'] : req.headers.appversion;
        }

        if (Object.keys(appInformation).length > 0) {
          await submissionsHelper.addAppInformation(
            req.params._id,
            appInformation,
            messageConstants.common.SURVEY_SUBMISSIONS
          );
        }

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

  /**
   * Update survey Submission
   * @method
   * @name updateMany
   * @param {Object} query
   * @param {Object} update
   * @param {Object} options
   * @returns {JSON} - update observations.
   */
  static updateMany(query, update) {
    return new Promise(async (resolve, reject) => {
      try {
        let surveySubmissionUpdate = await surveySubmissionQueries.updateMany(query, update);

        if (surveySubmissionUpdate) {
          return resolve(surveySubmissionUpdate);
        }
      } catch (error) {
        return reject(error);
      }
    });
  }
};
