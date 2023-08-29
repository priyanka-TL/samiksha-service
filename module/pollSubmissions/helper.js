/**
 * name : pollSubmissions/helper.js
 * author : Deepa
 * created-date : 01-Aug-2020
 * Description : PollSubmissions helper functionality.
 */

// Dependencies
const pollsHelper = require(MODULES_BASE_PATH + '/polls/helper');
const pollSubmissionDocumentHelper = require('./documents');

/**
 * PollSubmissionsHelper
 * @class
 */
module.exports = class PollSubmissionsHelper {
  /**
   * Make poll submission.
   * @method
   * @name make
   * @param {String} pollId - pollId
   * @param {Array} responseObject - Questions and answers object
   * @param {String} userId - userId
   * @returns {String} - message.
   */

  static make(pollId = '', responseObject = {}, userId = '') {
    return new Promise(async (resolve, reject) => {
      try {
        if (pollId == '') {
          throw new Error(messageConstants.apiResponses.POLL_ID_REQUIRED_CHECK);
        }

        if (Object.keys(responseObject).length == 0) {
          throw new Error(messageConstants.apiResponses.RESPONSE_OBJECT_REQUIRED_CHECK);
        }

        if (userId == '') {
          throw new Error(messageConstants.apiResponses.USER_ID_REQUIRED_CHECK);
        }

        let validatePollSubmission = await this.isPollSubmissionAllowed(pollId, userId);

        if (!validatePollSubmission.success && !validatePollSubmission.data) {
          return resolve(validatePollSubmission);
        }

        let pollDocument = await pollsHelper.pollDocuments(
          {
            _id: pollId,
          },
          ['name'],
        );

        let pollSubmissionDocument = {
          pollName: pollDocument[0].name,
          pollId: pollId,
          submittedAt: new Date(),
          responses: responseObject,
          isDeleted: false,
          userId: userId,
          status: messageConstants.common.SUBMISSION_STATUS_COMPLETED,
        };

        await database.models.pollSubmissions.create(pollSubmissionDocument);

        let incrementKeyValues = {
          numberOfResponses: 1,
        };

        Object.values(responseObject).forEach((singleResponse) => {
          if (Array.isArray(singleResponse.value)) {
            singleResponse.value.forEach((value) => {
              incrementKeyValues[`result.${singleResponse.qid}.${value}`] = 1;
            });
          } else {
            incrementKeyValues[`result.${singleResponse.qid}.${singleResponse.value}`] = 1;
          }
        });

        let updateQuery = {
          $inc: incrementKeyValues,
        };

        await pollsHelper.updatePollDocument({ _id: pollId }, updateQuery);

        return resolve({
          success: true,
          message: messageConstants.apiResponses.POLL_SUBMITTED,
          data: true,
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
   * List all the polls.
   * @method
   * @name list
   * @param {String} userId - userId
   * @returns {JSON} - Polls list.
   */

  static list(userId = '') {
    return new Promise(async (resolve, reject) => {
      try {
        if (userId == '') {
          throw new Error(messageConstants.apiResponses.USER_ID_REQUIRED_CHECK);
        }

        let getPollList = [
          pollsHelper.list(userId),
          database.models.pollSubmissions.aggregate([
            { $match: { userId: userId, isDeleted: false } },
            {
              $project: {
                _id: '$pollId',
                name: '$pollName',
              },
            },
            { $sort: { createdAt: 1 } },
          ]),
        ];

        let result = [];

        await Promise.all(getPollList).then(function (response) {
          if (Array.isArray(response[0].data) && response[0].data.length > 0) {
            result = result.concat(response[0].data);
          }

          if (response[1].length > 0) {
            result = result.concat(response[1]);
          }
        });

        if (result.length > 0) {
          result = await gen.utils.removeDuplicatesFromArray(result, '_id');
        }

        return resolve({
          success: true,
          message: messageConstants.apiResponses.POLLS_LIST_FETCHED,
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
   * Validate poll submission.
   * @method
   * @name isPollSubmissionAllowed
   * @param {String} pollId - pollId
   * @param {String} userId - userId
   * @returns {String} - message.
   */

  static isPollSubmissionAllowed(pollId = '', userId = '') {
    return new Promise(async (resolve, reject) => {
      try {
        if (pollId == '') {
          throw new Error(messageConstants.apiResponses.POLL_ID_REQUIRED_CHECK);
        }

        if (userId == '') {
          throw new Error(messageConstants.apiResponses.USER_ID_REQUIRED_CHECK);
        }

        let pollDocument = await pollsHelper.isPollOpenForSubmission(pollId);

        if (!pollDocument.success && !pollDocument.data) {
          return resolve(pollDocument);
        }

        let pollSubmissionDocument = await pollSubmissionDocumentHelper.pollSubmissionDocuments(
          {
            userId: userId,
            pollId: pollId,
          },
          ['_id'],
        );

        if (pollSubmissionDocument.length > 0) {
          throw new Error(messageConstants.apiResponses.MULTIPLE_SUBMISSIONS_NOT_ALLOWED);
        }

        return resolve({
          success: true,
          message: messageConstants.apiResponses.POLL_SUBMISSION_VALIDATED,
          data: true,
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
};
