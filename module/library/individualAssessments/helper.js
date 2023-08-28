/**
 * name : helper.js
 * author : Aman
 * created-date : 04-Jun-2020
 * Description : Individual Assessment library helper functionality.
 */

// Dependencies 
const solutionsHelper = require(MODULES_BASE_PATH + "/solutions/helper");
const assessmentsHelper = require(MODULES_BASE_PATH + "/assessments/helper");

 /**
    * IndividualAssessmentHelper
    * @class
*/

module.exports = class IndividualAssessmentHelper {

    /**
      * List of individual assessment solution templates.
      * @method
      * @name list
      * @param {String} search - Search Data.
      * @param {Number} limit - limitting value.
      * @param {Number} pageNo
      * @returns {Object} returns list of individual solutions
     */

    static list(search,limit,pageNo,userId,token) {
        return new Promise(async (resolve, reject) => {
            try {
                
                let individualAssessmentsSolution = 
                await solutionsHelper.templates( 
                  messageConstants.common.INDIVIDUAL,
                  search, 
                  limit, 
                  pageNo,
                  userId,
                  token  
                );

                return resolve({
                  message : messageConstants.apiResponses.INDIVIDUAL_SOLUTIONS_LIST,
                  result : individualAssessmentsSolution
                });
            } catch (error) {
                return reject({
                    status: error.status || httpStatusCode.internal_server_error.status,
                    message: error.message || httpStatusCode.internal_server_error.message,
                    errorObject: error
                });
            }
        })
    }

    /**
      * Individual assessment solution information
      * @method
      * @name details
      * @param {String} templateId - Template id.
      * @returns {Object} returns creator,about and questions.
     */

    static details( templateId ) {
        return new Promise(async (resolve, reject) => {
            try {

              let individualAssessmentSolution = 
              await assessmentsHelper.templateDetails(
                templateId,
                true,
                true
              );

              individualAssessmentSolution.ecmQuestions = individualAssessmentSolution.questions;
              delete individualAssessmentSolution['questions'];

              return resolve({
                message : 
                messageConstants.apiResponses.INDIVIDUAL_SOLUTIONS_DETAILS,
                result : individualAssessmentSolution
              });

            } catch (error) {
                return reject({
                    status: error.status || httpStatusCode.internal_server_error.status,
                    message: error.message || httpStatusCode.internal_server_error.message,
                    errorObject: error
                });
            }
        })
    }
};
