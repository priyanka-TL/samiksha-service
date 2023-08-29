/**
 * name : helper.js
 * author : Aman
 * created-date : 04-Jun-2020
 * Description : Institutional assessment library helper functionality.
 */

// Dependencies
const solutionsHelper = require(MODULES_BASE_PATH + '/solutions/helper');
const assessmentsHelper = require(MODULES_BASE_PATH + '/assessments/helper');

/**
 * InstitutionalAssessmentHelper
 * @class
 */
module.exports = class InstitutionalAssessmentHelper {
  /**
   * List of institutional assessment solution templates.
   * @method
   * @name list
   * @param {String} search - Search Data.
   * @param {Number} limit - limitting value.
   * @param {Number} pageNo
   * @returns {Object} returns list of institutional solutions
   */

  static list(search, limit, pageNo, userId, token) {
    return new Promise(async (resolve, reject) => {
      try {
        let institutionalAssessmentsSolution = await solutionsHelper.templates(
          messageConstants.common.INSTITUTIONAL,
          search,
          limit,
          pageNo,
          userId,
          token,
        );

        return resolve({
          message: messageConstants.apiResponses.INSTITUTIONAL_SOLUTIONS_LIST,
          result: institutionalAssessmentsSolution,
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
   * Institutional assessment solution details information
   * @method
   * @name details
   * @param {String} templateId - Template id.
   * @returns {Object} returns creator,about and questions per ecm.
   */

  static details(templateId) {
    return new Promise(async (resolve, reject) => {
      try {
        let institutionalAssessmentSolution = await assessmentsHelper.templateDetails(templateId, true, true);

        institutionalAssessmentSolution.ecmQuestions = institutionalAssessmentSolution.questions;
        delete institutionalAssessmentSolution['questions'];

        return resolve({
          message: messageConstants.apiResponses.INSTITUTIONAL_SOLUTIONS_DETAILS,
          result: institutionalAssessmentSolution,
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
};
