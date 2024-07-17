/**
 * name : entity-management.js
 * author : Praveen
 * Date : 13-Jun-2024
 * Description : Entity service related information.
 */

//dependencies
const request = require('request');

const entityManagementServiceUrl = process.env.ENTITY_MANAGEMENT_SERVICE_URL;

/**
 * List of entity data.
 * @function
 * @name entityDocuments
 * @param {Object} filterData - Filter data.
 * @param {Array} projection - Projected data.
 * @returns {JSON} - List of entity data.
 */

// Function to find entity documents based on the given filter and projection
const entityDocuments = function (filterData = 'all', projection = 'all') {
  return new Promise(async (resolve, reject) => {
    try {
      // Function to find entity documents based on the given filter and projection
      const url = entityManagementServiceUrl + messageConstants.endpoints.FIND_ENTITY_DOCUMENTS;
      // Set the options for the HTTP POST request
      const options = {
        headers: {
          'content-type': 'application/json',
          'internal-access-token': process.env.INTERNAL_ACCESS_TOKEN,
        },
        json: {
          query: filterData,
          projection: projection,
        },
      };
	  console.log(url,'url')
      // Make the HTTP POST request to the entity management service
      request.post(url, options, requestCallBack);

      // Callback functioCopy as Expressionn to handle the response from the HTTP POST request
      function requestCallBack(err, data) {
		console.log(err,data,'err & data')
        let result = {
          success: true,
        };

        if (err) {
          result.success = false;
        } else {
          let response = data.body;
          // Check if the response status is OK (HTTP 200)
          if (response.status === httpStatusCode['ok'].status) {
            result['data'] = response.result;
          } else {
            result.success = false;
          }
        }

        return resolve(result);
      }
    } catch (error) {
      return reject(error);
    }
  });
};

/**
 * List of entityType data.
 * @function
 * @name entityTypeDocuments
 * @param {Object} filterData - Filter data.
 * @param {Array} projection - Projected data.
 * @returns {JSON} - List of entity data.
 */

// Function to find entity type documents based on the given filter, projection, and user token
const entityTypeDocuments = function (filterData = 'all', projection = 'all', userToken) {
  return new Promise(async (resolve, reject) => {
    try {
      // Construct the URL for the entity management service
      const url = entityManagementServiceUrl + messageConstants.endpoints.FIND_ENTITY_TYPE_DOCUMENTS;
      // Set the options for the HTTP POST request
      const options = {
        headers: {
          'content-type': 'application/json',
          'internal-access-token': process.env.INTERNAL_ACCESS_TOKEN,
          'x-authenticated-token': userToken,
        },
        json: {
          query: filterData,
          projection: projection,
        },
      };

      // Make the HTTP POST request to the entity management service
      request.post(url, options, requestCallBack);

      // Callback function to handle the response from the HTTP POST request
      function requestCallBack(err, data) {
        let result = {
          success: true,
        };

        if (err) {
          result.success = false;
        } else {
          let response = data.body;
          // Check if the response status is OK (HTTP 200)
          if (response.status === messageConstants.common.OK) {
            result['data'] = response.result;
          } else {
            result.success = false;
          }
        }

        return resolve(result);
      }
    } catch (error) {
      return reject(error);
    }
  });
};

async function validateEntities(entityIds, entityTypeId) {
    return new Promise(async (resolve, reject) => {
      try {
        let ids = [];

        // let entitiesDocuments = await database.models.entities
        //   .find(
        //     {
        //       _id: { $in: gen.utils.arrayIdsTobjectIds(entityIds) },
        //       entityTypeId: entityTypeId,
        //     },
        //     {
        //       _id: 1,
        //     },
        //   )
        //   .lean();



		///
		  let bodyData = {
			_id : { $in: gen.utils.arrayIdsTobjectIds(entityIds) },
			entityTypeId: entityTypeId,
		  };
		let entitiesDocuments = await this.entityDocuments(bodyData);

		console.log(entitiesDocuments,'entityData from entity management')
		
        if (entitiesDocuments.length > 0) {
          ids = entitiesDocuments.map((entityId) => entityId._id);
        }

        return resolve({
          entityIds: ids,
        });
      } catch (error) {
        return reject(error);
      }
    });
  }

module.exports = {
  entityDocuments: entityDocuments,
  entityTypeDocuments: entityTypeDocuments,
  validateEntities:validateEntities
};