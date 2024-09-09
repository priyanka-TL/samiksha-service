/**
 * name : reportsController.js
 * author : Aman
 * created-date : 22-Dec-2018
 * Description : Reports related information.
 */

// Dependencies
let moment = require('moment');
const filesHelper = require(MODULES_BASE_PATH + '/files/helper');
const surveySubmissionsHelper = require(MODULES_BASE_PATH + '/surveySubmissions/helper');
const questionsHelper = require(MODULES_BASE_PATH + '/questions/helper');
const programsHelper = require(MODULES_BASE_PATH + '/programs/helper');
const helperFunc = require('../../helper/chart_data');
const solutionsQueries = require(DB_QUERY_BASE_PATH + '/solutions');
const observationSubmissionsHelper = require(MODULES_BASE_PATH + '/observationSubmissions/helper');
/**
 * ReportsHelper
 * @class
 */
module.exports = class ReportsHelper {
  /**
   * Convert gmt to ist.
   * @method
   * @name gmtToIst
   * @param {TimeRanges} gmtTime - gmtTime
   * @returns {TimeRanges} - converted gmtTime to ist
   */

  static gmtToIst(gmtTime) {
    try {
      let istStart = moment(gmtTime).tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss');

      if (istStart == 'Invalid date') {
        istStart = '-';
      }

      return istStart;
    } catch (error) {
      return error;
    }
  }

  /**
   * Convert gmt to ist.
   * @method
   * @name getFilePublicBaseUrl
   * @returns {String} - public base url
   */

  static getFilePublicBaseUrl() {
    return new Promise(async (resolve, reject) => {
      try {
        const url = filesHelper.getFilePublicBaseUrl();

        return resolve(url);
      } catch (error) {
        return reject(error);
      }
    });
  }

  static async surveySubmissionReport(req, res) {
    if (!req.query.submissionId) {
      let response = {
        result: false,
        message: 'submissionId is a required field',
      };
      return response;
    } else {
      let submissionId = req.query.submissionId;

      let surveySubmissionsDocumentArray = await surveySubmissionsHelper.surveySubmissionDocuments({
        _id: submissionId,
        status: 'completed',
      });

      let surveySubmissionsDocument = surveySubmissionsDocumentArray[0];

      if (!surveySubmissionsDocument) {
        throw { message: messageConstants.apiResponses.SUBMISSION_NOT_FOUND };
      }

      //adding question options, externalId to answers array
      if (surveySubmissionsDocument.answers && Object.keys(surveySubmissionsDocument.answers).length > 0) {
        surveySubmissionsDocument = await questionsHelper.addOptionsToSubmission(surveySubmissionsDocument);
      }

      let solutionDocument = await solutionsQueries.solutionDocuments(
        {
          _id: surveySubmissionsDocument.solutionId,
        },
        ['name', 'scoringSystem', 'description', 'questionSequenceByEcm']
      );

      if (!solutionDocument.length) {
        throw messageConstants.apiResponses.SOLUTION_NOT_FOUND;
      }

      solutionDocument = solutionDocument[0];
      surveySubmissionsDocument['solutionInfo'] = solutionDocument;

      if (surveySubmissionsDocument.programId && surveySubmissionsDocument.programId != '') {
        let programDocument = await programsHelper.list(
          {
            _id: surveySubmissionsDocument.programId,
          },
          ['name', 'description']
        );

        surveySubmissionsDocument['programInfo'] = programDocument[0];
      }

      let report = await helperFunc.generateSubmissionReportWithoutDruid(surveySubmissionsDocument);

      let responseObj = {};

      responseObj.response = {
        surveyName: surveySubmissionsDocument.surveyInformation.name,
        report: report,
      };

      return {
        status: httpStatusCode.ok.status,
        message: responseObj.response,
      };
    }
  }
  static async entityObservationReport(req) {
    let entityId = req.body.entityId;
    let observationId = req.body.observationId;
    let criteriaWise = req.body.criteriaWise;

    let queryObject = {
      entityId: entityId,
      observationId: observationId,
      status: 'completed',
    };

    let submissionDocumentArr = await observationSubmissionsHelper.observationSubmissionsDocument(queryObject);

    let submissionDocument = submissionDocumentArr[0];

    let solutionDocument = await solutionsQueries.solutionDocuments({
      _id: submissionDocument.solutionId,
    });

    let programDocument = await programsHelper.details(submissionDocument.programId);

    let responseObject = {
      result: true,
      entityType: submissionDocument.entityType,
      entityId: entityId,
      entityName: submissionDocument.entityInformation.name,
      solutionName: solutionDocument[0].name,
      observationId: observationId,
      programName: programDocument.data.name,
      totalSubmissions: submissionDocumentArr.length,
    };
    let result;
    if (req.body.scores === true) {
      result = await helperFunc.generateObservationReportForRubricWithoutDruid(submissionDocumentArr);
      console.log(result, 'this is a Rubricresult');
    } else {
      result = await helperFunc.generateObservationReportForNonRubricWithoutDruid(
        submissionDocumentArr,
        true,
        criteriaWise
      );
    }
    responseObject.reportSections = result;
    return responseObject;
  }
  static async instaceObservationReport(req) {
    let submissionId = req.body.submissionId;
    let entityType = req.body.entityType;

    let queryObject = {
      _id: submissionId,
      entityType: entityType,
      status: 'completed',
    };

    let submissionDocumentArr = await observationSubmissionsHelper.observationSubmissionsDocument(queryObject);

    let submissionDocument = submissionDocumentArr[0];

    let solutionDocument = await solutionsQueries.solutionDocuments({
      _id: submissionDocument.solutionId,
    });

    let programDocument = await programsHelper.details(submissionDocument.programId);

    let responseObject = {
      result: true,
      entityType: submissionDocument.entityType,
      entityId: submissionDocument.entityId,
      entityName: submissionDocument.entityInformation.name,
      solutionName: solutionDocument[0].name,
      observationId: submissionDocument.observationId,
      programName: programDocument.data.name,
      totalSubmissions: submissionDocumentArr.length,
    };
    let result;
    if (req.body.scores === true) {
      result = await helperFunc.generateObservationReportForRubricWithoutDruid(submissionDocumentArr);
      console.log(result, 'this is a Rubricresult');
    } else {
      result = await helperFunc.generateObservationReportForNonRubricWithoutDruid(submissionDocumentArr);
    }
    responseObject.reportSections = result;
    return responseObject;
  }
};
