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
     console.log(url,options)
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

// Function to fetch the project template based on the given externalId
const programDetails = function (userToken, programId) {
  return new Promise(async (resolve, reject) => {
    try {
      // Construct the URL for the project service
      let url =
        `${projectServiceUrl}${process.env.PROJECT_SERVICE_NAME}${messageConstants.endpoints.PROGRAM_DETAILS}` +
        '/' +
        programId;
      console.log(url, userToken, 'line no 78');

      // Set the options for the HTTP GET request
      const options = {
        headers: {
          'content-type': 'application/json',
          'X-auth-token': userToken,
        },
      };

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
          let result = JSON.parse(response);
          console.log(result,"line no 198");
          
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



// Function to fetch the project template based on the given externalId
const programUpdate = function (userToken, programId,reqBody) {
  return new Promise(async (resolve, reject) => {
    try {
      // Construct the URL for the project service
      let url =
        `${projectServiceUrl}${process.env.PROJECT_SERVICE_NAME}${messageConstants.endpoints.PROGRAM_UPDATE}` +
        '/' +
        programId;

      // Set the options for the HTTP GET request
      const options = {
        headers: {
          'content-type': 'application/json',
          'X-auth-token': userToken,
					'internal-access-token': process.env.INTERNAL_ACCESS_TOKEN,
        },
        json: reqBody,
      };
      console.log(url, options.json, 'line no 143');

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
  programUpdate:programUpdate
};
