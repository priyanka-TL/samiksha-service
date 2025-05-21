/**
 * name : surveySubmissions.js
 * author : Praveen
 * created-date : 13-Aug-2024
 * Description : surveySubmissions helper for DB interactions.
 */

// Dependencies

/**
 * surveySubmissions
 * @class
 */

module.exports = class SurveySubmissions {
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
        let queryObject = surveySubmissionFilter != 'all' ? surveySubmissionFilter : {};

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

        let surveySubmissionDocuments;

        if (sortedData !== 'all') {
          surveySubmissionDocuments = await database.models.surveySubmissions
            .find(queryObject, projection)
            .sort(sortedData)
            .lean();
        } else {
          surveySubmissionDocuments = await database.models.surveySubmissions.find(queryObject, projection).lean();
        }

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
   * find Survey Submissions
   * @method
   * @name getAggregate
   * @param {Array} query - aggregation query.
   * @returns {Array} List of surveySubmissions
   */

  static getAggregate(query = []) {
    return new Promise(async (resolve, reject) => {
      try {
        let surveySubmissionDocuments = await database.models.surveySubmissions.aggregate(query);

        return resolve(surveySubmissionDocuments);
      } catch (error) {
        return reject(error);
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
   * @returns {JSON} - update response
  */

  static updateMany(query, update) {
    return new Promise(async (resolve, reject) => {
      try {
        let surveySubmissionDocuments = await database.models.surveySubmissions.updateMany(query, update);
        return resolve(surveySubmissionDocuments);
      } catch (error) {
        return reject(error);
      }
    });
  }
};
