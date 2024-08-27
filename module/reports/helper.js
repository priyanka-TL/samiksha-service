/**
 * name : reportsController.js
 * author : Aman
 * created-date : 22-Dec-2018
 * Description : Reports related information.
 */

// Dependencies
let moment = require('moment');
const filesHelper = require(MODULES_BASE_PATH + '/files/helper');
const observationSubmissionsHelper = require(MODULES_BASE_PATH+ '/observationSubmissions/helper')
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
static observationReport(req) {
  return new Promise(async (resolve, reject) => {
    try {
      const observationSubmissionId = req.query.observationSubmissionId;

      let submissionDocumentResult = await observationSubmissionsHelper.observationSubmissionsDocument(
        {_id:observationSubmissionId}
      );

      const submissionDocument = submissionDocumentResult[0]

      console.log(submissionDocument,'submissionDoc')
      console.log(observationSubmissionId,'observationSubmissionId')
      console.log('API is working....')
      return resolve(submissionDocument);
    } catch (error) {
      return reject(error);
    }
  });
}
};
