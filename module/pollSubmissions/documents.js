/**
 * name : pollSubmissions/documents.js
 * author : Deepa
 * created-date : 01-Sep-2020
 * Description : pollSubmissionDocuments functionality.
 */

/**
 * PollSubmissionDocumentsHelper
 * @class
 */
module.exports = class PollSubmissionDocumentsHelper {
  /**
   * find pollSubmissions
   * @method
   * @name pollSubmissionDocuments
   * @param {Array} [pollSubmissionFilter = "all"] - poll submission ids.
   * @param {Array} [fieldsArray = "all"] - projected fields.
   * @param {Array} [skipFields = "none"] - field not to include
   * @returns {Array} List of pollSubmissions.
   */

  static pollSubmissionDocuments(
    pollSubmissionFilter = 'all',
    fieldsArray = 'all',
    sortedData = '',
    skipFields = 'none',
  ) {
    return new Promise(async (resolve, reject) => {
      try {
        let queryObject = pollSubmissionFilter != 'all' ? pollSubmissionFilter : {};

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

        let pollSubmissionDocuments;

        if (sortedData !== '') {
          pollSubmissionDocuments = await database.models.pollSubmissions
            .find(queryObject, fieldsArray)
            .sort(sortedData)
            .lean();
        } else {
          pollSubmissionDocuments = await database.models.pollSubmissions.find(queryObject, projection).lean();
        }

        return resolve(pollSubmissionDocuments);
      } catch (error) {
        return reject(error);
      }
    });
  }
};
