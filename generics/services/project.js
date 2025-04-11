/**
 * name : project.js
 * author : Mallanagouda R Biradar
 * Date : 11-Apr-2025
 * Description : Projcet service related information.
 */

const request = require('request');
const projectServiceUrl = process.env.INTERFACE_SERVICE_URL;

// Function to fetch the project template based on the given externalId
const listById = function (userToken, externalId) {
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
          'externalIds': externalId,
        },
      };
      
      request.post(url, options, userReadCallback);
      let result = {
        success: true,
      };
      // Handle callback fucntion
      function userReadCallback(err, data) {
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

module.exports = {
    listById: listById,
};
