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
const programsHelper = require(MODULES_BASE_PATH+'/programs/helper');
const helperFunc = require('../../helper/chart_data')
const solutionsQueries = require(DB_QUERY_BASE_PATH + '/solutions');
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

  static async surveySubmissionReport(req,res){

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
      let data = surveySubmissionsDocument;

      let transformedData = transformData(data);

      let chartData = await helperFunc.instanceReportChart(transformedData,messageConstants.common.SURVEY);
      chartData.solutionName = data.solutionExternalId;

      let surveyAnswers = data.answers;

      let evidenceData = formateEvidenceData(surveyAnswers, chartData);

      let responseObj;

      if (evidenceData.length > 0) {
        responseObj = await helperFunc.evidenceChartObjectCreation(
          chartData,
          evidenceData
        );
      } else {
        responseObj = chartData;
      }

      return {
        status: httpStatusCode.ok.status,
        message: responseObj.response,
      };
    }
  }
};

/**
 * Transforms survey submission data into a custom format resembling a Druid response.
 *
 * This function processes the input `data` and extracts key details about the 
 * survey, solution, criteria, and answers. It then constructs an array of 
 * objects, where each object represents the response to a single question, 
 * including metadata such as solution and criteria details, answer, response type, 
 * and associated options.
 *
 * @param {Object} data - The survey submission data to be transformed.
 * @returns {Array<Object>} - An array of objects, each representing a single 
 *                            question's response with associated metadata.
 */
function transformData(data) {
  //custom function return to mimic druid response from data source
  let singleQuestionAnswerDataPerSolutionArr = [];

  let solutionExternalId = data.solutionExternalId;

  let solutionId = data.solutionId;
  let solutionName = data.solutionInfo.name;

  let surveyId = data.surveyId;
  let surveySubmissionId = data._id;
  let createdAt = data.createdAt;
  let completedAt = data.completedDate;
  let createdBy = data.createdBy;

  let criteriaExternalId = data.criteria[0].externalId;
  let criteriaId = data.criteria[0]._id;
  let criteriaName = data.criteria[0].name;
  let isAPrivateProgram = data.isAPrivateProgram;

  let answersObject = data.answers;

  let answerKeys = Object.keys(answersObject);

  answerKeys.forEach((key) => {
    let singleAnswerObj = answersObject[key];

    singleQuestionAnswerDataPerSolutionArr.push({
      event: {
        solutionExternalId,
        solutionId,
        solutionName,
        surveyId,
        surveySubmissionId,
        createdAt,
        completedAt,
        createdBy,
        criteriaExternalId,
        criteriaId,
        criteriaName,
        isAPrivateProgram,
        questionAnswer: singleAnswerObj.value[0],
        questionECM: singleAnswerObj.evidenceMethod,
        questionExternalId: singleAnswerObj.externalId,
        questionId: singleAnswerObj.qid,
        questionName: singleAnswerObj.question[0],
        questionResponseLabel: singleAnswerObj.value,
        //questionResponseLabel_number:,
        questionResponseType: singleAnswerObj.responseType,
        // question_response_number
        answerOptions: singleAnswerObj.options ? singleAnswerObj.options : undefined,
      },
    });
  });

  return singleQuestionAnswerDataPerSolutionArr;
  //return data;
}

/**
 * Formats evidence data by matching survey answers with chart data.
 *
 * This function takes `surveyAnswers` and `chartData`, matches them based on 
 * the `externalId`, and extracts file paths from the survey answers. It 
 * returns an array of evidence objects containing the `questionExternalId` and 
 * concatenated `fileSourcePath`.
 *
 * @param {Object} surveyAnswers - The survey answers containing evidence details.
 * @param {Object} chartData - The chart data with response information.
 * @returns {Array<Object>} - An array of formatted evidence objects.
 */
function formateEvidenceData(surveyAnswers, chartData) {

  //custom formateEvidenceData to mimic formatting of evidence data which was previously done using druid

  let evidenceArray = [];

  // Loop through each item in chartData.response
  chartData.response.forEach((chartItem) => {
    const externalId = chartItem.order;

    for (let key in surveyAnswers) {
      let record = surveyAnswers[key];

      if (record.externalId == externalId) {
        if (record.fileName && record.fileName.length > 0) {
          let sourcePathArray = record.fileName.map((fileInfo) => {
            return fileInfo.sourcePath;
          });

          const evidenceObject = {
            event: {
              questionExternalId: externalId,
              fileSourcePath: sourcePathArray.join(','),
            },
          };

          // Add the evidence object to the evidenceArray
          evidenceArray.push(evidenceObject);
        }
      }
    }
  });

  return evidenceArray;
}
