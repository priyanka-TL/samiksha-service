/**
 * name : Surveys.js
 * author : Praveen
 * created-date : 13-Aug-2024
 * Description : Surveys helper for DB interactions.
 */

// Dependencies

/**
 * Surveys
 * @class
 */

module.exports = class Surveys {
  /**
   * find surveys
   * @method
   * @name surveyDocuments
   * @param {Array} [surveyFilter = "all"] - survey ids.
   * @param {Array} [fieldsArray = "all"] - projected fields.
   * @param {Array} [sortedData = "all"] - sorted field.
   * @param {Array} [skipFields = "none"] - field not to include
   * @returns {Array} List of surveys.
   */

  static surveyDocuments(surveyFilter = 'all', fieldsArray = 'all', sortedData = 'all', skipFields = 'none') {
    return new Promise(async (resolve, reject) => {
      try {
        let queryObject = surveyFilter != 'all' ? surveyFilter : {};

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

        let surveyDocuments;

        if (sortedData !== 'all') {
          surveyDocuments = await database.models.surveys.find(queryObject, projection).sort(sortedData).lean();
        } else {
          surveyDocuments = await database.models.surveys.find(queryObject, projection).lean();
        }

        return resolve(surveyDocuments);
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
   * Create survey.
   * @method create
   * @name create
   * @param {Object} data - survey creation data.
   * @returns {JSON} Survey creation data.
   */

  static create(data = {}) {
    return new Promise(async (resolve, reject) => {
      try {
        let surveyData = await database.models.surveys.create(data);

        return resolve(surveyData);
      } catch (error) {
        return resolve({
          success: false,
          message: error.message,
          data: false,
        });
      }
    });
  }
};
