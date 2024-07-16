/**
 * name : entity-management.js
 * author : Praveen
 * Date : 13-Jun-2024
 * Description : Entity service related information.
 */

//dependencies
const request = require('request')

const entityManagementServiceUrl = process.env.ENTITY_MANAGEMENT_SERVICE_URL


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
			const url = entityManagementServiceUrl + messageConstants.endpoints.FIND_ENTITY_DOCUMENTS
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
			}
			// Make the HTTP POST request to the entity management service
			request.post(url, options, requestCallBack)

			// Callback functioCopy as Expressionn to handle the response from the HTTP POST request
			function requestCallBack(err, data) {
				let result = {
					success: true,
				}

				if (err) {
					result.success = false
				} else {
					let response = data.body
					// Check if the response status is OK (HTTP 200)
					if (response.status === httpStatusCode['ok'].status) {
						result['data'] = response.result
					} else {
						result.success = false
					}
				}

				return resolve(result)
			}
		} catch (error) {
			return reject(error)
		}
	})
}

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
			const url = entityManagementServiceUrl + messageConstants.endpoints.FIND_ENTITY_TYPE_DOCUMENTS
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
			}

			// Make the HTTP POST request to the entity management service
			request.post(url, options, requestCallBack)

			// Callback function to handle the response from the HTTP POST request
			function requestCallBack(err, data) {
				let result = {
					success: true,
				}

				if (err) {
					result.success = false
				} else {
					let response = data.body
					// Check if the response status is OK (HTTP 200)
					if (response.status === messageConstants.common.OK) {
						result['data'] = response.result
					} else {
						result.success = false
					}
				}

				return resolve(result)
			}
		} catch (error) {
			return reject(error)
		}
	})
}

  
/**
  * get subEntities of matching type by recursion.
  * @method
  * @name getSubEntitiesBasedOnEntityType
  * @param parentIds {Array} - Array of entity Ids- for which we are finding sub entities of given entityType
  * @param entityType {string} - EntityType.
  * @returns {Array} - Sub entities matching the type .
*/

async function getSubEntitiesBasedOnEntityType( parentIds, entityType, result,token ) {

    if( !(parentIds.length > 0) ){
        return result;
    }
    let bodyData={
        // "parentId" : parentIds
        "registryDetails.code":{$in:parentIds}
    };
  
    let entityDetails = await locationSearch(bodyData,token);
    if( !entityDetails.success ) {
        return (result);
    }
  
    let entityData = entityDetails.data;
    let parentEntities = [];
    entityData.map(entity => {
    if( entity.entityType == entityType ) {
        result.push(entity.registryDetails.locationId)
    } else {
        parentEntities.push(entity.registryDetails.locationId)
    }
    });
    
    if( parentEntities.length > 0 ){
        await getSubEntitiesBasedOnEntityType(parentEntities,entityType,result,token)
    } 
    
    let uniqueEntities = _.uniq(result);
    return uniqueEntities;    
  }

  /**
   * validate entities.
   * @method
   * @name validateEntities
   * @param {String} entityTypeId - Entity type id.
   * @param {Array} entityIds - Array of entity ids.
   */

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
		let entityData = await entityManagementService.entityDocuments(bodyData);

		console.log(entityData,'entityData from entity management')
		
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
  getSubEntitiesBasedOnEntityType: getSubEntitiesBasedOnEntityType,
  validateEntities:validateEntities
}