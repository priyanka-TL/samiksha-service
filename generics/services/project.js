/**
 * name : project.js
 * author : Mallanagouda R Biradar
 * Date : 11-Apr-2025
 * Description : Projcet service related information.
 */

const request = require('request');
const projectServiceUrl = process.env.IMPROVEMENT_PROJECT_BASE_URL;

/**
 * Fetches the project template(s) based on the given externalId(s).
 *
 * @param {string} userToken - The user's authentication token.
 * @param {string[]|string} externalId - One or more external IDs of the project templates to fetch.
 * @returns {Promise<Object>} A promise that resolves to an object indicating success and containing the fetched data if successful.
 */

// Function to fetch the project template based on the given externalId
const templateLists = function (userToken, externalId) {
  return new Promise(async (resolve, reject) => {
    try {
      // Construct the URL for the project service
      let url = `${projectServiceUrl}${process.env.PROJECT_SERVICE_NAME}${messageConstants.endpoints.PROJECT_LIST_BY_ID}`;

      // Set the options for the HTTP GET request
      const options = {
        headers: {
          'content-type': 'application/json',
          'X-auth-token': userToken,
        },
        json: {
          externalIds: externalId,
        },
      };
      request.post(url, options, projectServiceCallback);
      let result = {
        success: true,
      };
      // Handle callback fucntion
      function projectServiceCallback(err, data) {
        if (err) {
          result.success = false;
        } else {
          let response = data.body;
          if (response.status === httpStatusCode['ok'].status) {
            result['data'] = response.result;
          } else {
            result.success = false;
          }
        }
        return resolve(result);
      }
      setTimeout(function () {
        return resolve(
          (result = {
            success: false,
          })
        );
      }, messageConstants.common.SERVER_TIME_OUT);
    } catch (error) {
      return reject(error);
    }
  });
};

/**
 * Fetches the program Details based on the given Id.
 * @param {string} userToken - The user's authentication token.
 * @param {string[]|string} programId - ProgramId
 * @param {Object} userDetails -userInfo
 * @param {Object} payload - tenant and org info on reqbody
 * @returns {Promise<Object>} A promise that resolves to an object indicating success and containing the fetched data if successful.
 */

const programDetails = function (userToken, programId, userDetails, payload = {}) {
  return new Promise(async (resolve, reject) => {
    try {
      let url;
      // Construct the URL for the project service
      if ((userDetails && userDetails?.roles?.includes(messageConstants.common.ADMIN)) || !userToken) {
        url = `${projectServiceUrl}${process.env.PROJECT_SERVICE_NAME}${messageConstants.endpoints.PROGRAM_DETAILS_WITH_INTERNAL_TOKEN}/${programId}`;
      } else {
        url = `${projectServiceUrl}${process.env.PROJECT_SERVICE_NAME}${messageConstants.endpoints.EXTERNAL_PROGRAM_DETAILS}/${programId}`;
      }
      // Set the options for the HTTP GET request
      const options = {
        headers: {
          'content-type': 'application/json',
          'internal-access-token': process.env.INTERNAL_ACCESS_TOKEN,
        },
        json: { tenantData: payload },
      };

      if (userToken) {
        _.assign(options.headers, {
          'X-auth-token': userToken,
        });
      }
      //add  tenant and orgId in the header if role issuper admin
      if (userDetails?.roles && userDetails.roles.includes(messageConstants.common.ADMIN)) {
        _.assign(options.headers, {
          'admin-auth-token': process.env.ADMIN_AUTH_TOKEN,
          tenantId: userDetails.tenantAndOrgInfo.tenantId,
          orgId: userDetails.tenantAndOrgInfo.orgId.join(','),
        });
      }
      request.get(url, options, projectServiceCallback);
      let result = {
        success: true,
      };
      // Handle callback fucntion
      function projectServiceCallback(err, data) {
        if (err) {
          result.success = false;
        } else {
          let response = data.body;
          if (typeof response === messageConstants.common.OBJECT) {
            result = response;
          } else {
            result = JSON.parse(response);
          }
          if (result.status === httpStatusCode['ok'].status) {
            return resolve(result);
          } else {
            result.success = false;
          }
        }
        return resolve(result);
      }
      setTimeout(function () {
        return resolve(
          (result = {
            success: false,
          })
        );
      }, messageConstants.common.SERVER_TIME_OUT);
    } catch (error) {
      return reject(error);
    }
  });
};

/**
 * update the program  based on the given Id.
 * This functionality helps add survey and observation solutions to the components array of a program
 * This function will be called when creating child solution for survey and observation
 * @param {string} userToken - The user's authentication token.
 * @param {string[]|string} programId - ProgramId
 * @param {object} reqBody - update query
 * @returns {Promise<Object>} update success message
 */
const programUpdate = function (userToken, programId, reqBody, tenantData, userDetails) {
  return new Promise(async (resolve, reject) => {
    try {
      // Construct the URL for the project service
      let url = `${projectServiceUrl}${process.env.PROJECT_SERVICE_NAME}${messageConstants.endpoints.EXTERNAL_PROGRAM_UPDATE}/${programId}`;
      // Set the options for the HTTP GET request
      const options = {
        headers: {
          'content-type': 'application/json',
          'X-auth-token': userToken,
          'internal-access-token': process.env.INTERNAL_ACCESS_TOKEN,
        },
        json: reqBody,
      };
      //add super admin details if role is not has orgadmin
      if (userDetails?.roles && !userDetails.roles.includes(messageConstants.common.ORG_ADMIN)) {
        _.assign(options.headers, {
          'admin-auth-token': process.env.ADMIN_AUTH_TOKEN,
          tenantId: tenantData.tenantId,
          orgId: tenantData.orgId.join(','),
        });
      }
      request.post(url, options, projectServiceCallback);
      let result = {
        success: true,
      };
      // Handle callback fucntion
      function projectServiceCallback(err, data) {
        if (err) {
          result.success = false;
        } else {
          let response = data.body;

          if (response.status === httpStatusCode['ok'].status) {
            return resolve(result);
          } else {
            result.success = false;
          }
        }
        return resolve(result);
      }
      setTimeout(function () {
        return resolve(
          (result = {
            success: false,
          })
        );
      }, messageConstants.common.SERVER_TIME_OUT);
    } catch (error) {
      return reject(error);
    }
  });
};

/**
 * pushSubmissionToTask on based on given project and taskId.
 * Updates the status of a survey or observation task in the project service based on the given project and task ID.
 * It will be called when start and complete the observation/survey
 * @param {string} projectId - projectId
 * @param {string} taskId     - taskId
 * @param {object} reqBody    - task Submission to update
 * @returns {Promise<Object>} update success message
 */
const pushSubmissionToTask = function (projectId, taskId, reqBody) {
  return new Promise(async (resolve, reject) => {
    try {
      // Construct the URL for the project service
      let url = `${projectServiceUrl}${process.env.PROJECT_SERVICE_NAME}${messageConstants.endpoints.PUSH_SUBMISSION_TO_TASK}/${projectId}?taskId=${taskId}`;

      // Set the options for the HTTP GET request
      const options = {
        headers: {
          'content-type': 'application/json',
          'internal-access-token': process.env.INTERNAL_ACCESS_TOKEN,
        },
        json: reqBody,
      };
      request.post(url, options, projectServiceCallback);
      let result = {
        success: true,
      };
      // Handle callback fucntion
      function projectServiceCallback(err, data) {
        if (err) {
          result.success = false;
        } else {
          let response = data.body;

          if (response.status === httpStatusCode['ok'].status) {
            return resolve(result);
          } else {
            result.success = false;
          }
        }
        return resolve(result);
      }
      setTimeout(function () {
        return resolve(
          (result = {
            success: false,
          })
        );
      }, messageConstants.common.SERVER_TIME_OUT);
    } catch (error) {
      return reject(error);
    }
  });
};

module.exports = {
  templateLists: templateLists,
  programDetails: programDetails,
  programUpdate: programUpdate,
  pushSubmissionToTask: pushSubmissionToTask,
};
