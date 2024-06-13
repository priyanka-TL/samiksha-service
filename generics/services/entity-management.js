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
 *
 * @function
 * @name locationSearch
 * @param {object} filterData -  contain filter object.
 * @param {String} pageSize -  requested page size.
 * @param {String} pageNo -  requested page number.
 * @param {String} searchKey -  search string.
 * @param {Boolean} formatResult - format result
 * @param {Boolean} returnObject - return object or array.
 * @param {Boolean} resultForSearchEntities - format result for searchEntities api call.
 * @returns {Promise} returns a promise.
 */

const locationSearch = function (
    filterData,
    token,
    pageSize = '',
    pageNo = '',
    searchKey = '',
    formatResult = false,
    returnObject = false,
    resultForSearchEntities = false,
  ) {
    return new Promise(async (resolve, reject) => {
      try {
  
        let bodyData = {};
        bodyData['request'] = {};
        // bodyData['request']['filters'] = filterData;
        bodyData['query'] = filterData;
  
        if (pageSize !== '') {
          bodyData['request']['limit'] = pageSize;
        }
  
        if (pageNo !== '') {
          let offsetValue = pageSize * (pageNo - 1);
          bodyData['request']['offset'] = offsetValue;
        }
  
        if (searchKey !== '') {
          bodyData['request']['query'] = searchKey;
        }
  
        const url = entityManagementServiceUrl + messageConstants.endpoints.GET_LOCATION_DATA;
        const options = {
          headers: {
            'content-type': 'application/json',
            "x-authenticated-token": token,
            "internal-access-token":process.env.INTERNAL_ACCESS_TOKEN
          },
          json: bodyData,
        };
        request.post(url, options, requestCallback);
  
        let result = {
          success: true,
        };
  
        function requestCallback(err, data) {
          if (err) {
            result.success = false;
          } else {
            let response = data.body;
            if (
              // response.responseCode === messageConstants.common.OK &&
              response.result 
              // response.result.response &&
              // response.result.response.length > 0
              // response.result.length > 0
  
            ) {
              // format result if true
              if (formatResult) {
                let entityDocument = [];
                response.result.map((entityData) => {
                  let data = {};
                  // data._id = entityData.id;
                  // data.entityType = entityData.type;
                  // data.metaInformation = {};
                  // data.metaInformation.name = entityData.name;
                  // data.metaInformation.externalId = entityData.code;
                  // data.registryDetails = {};
                  // data.registryDetails.locationId = entityData.id;
                  // data.registryDetails.code = entityData.code;
                  data._id = entityData._id;
                  data.entityType = entityData.entityType;
                  data.metaInformation = {};
                  data.metaInformation.name = entityData.metaInformation.name;
                  data.metaInformation.externalId = entityData.metaInformation.code;
                  data.registryDetails = {};
                  data.registryDetails.locationId = entityData.registryDetails.locationId ;
                  data.registryDetails.code = entityData.registryDetails.code ;
                  entityDocument.push(data);
                });
                if (returnObject) {
                  result['data'] = entityDocument[0];
                  result['count'] = response.result.count;
                } else {
                  result['data'] = entityDocument;
                  result['count'] = response.result.count;
                }
              } else if (resultForSearchEntities) {
                let entityDocument = [];
                response.result.response.map((entityData) => {
                  let data = {};
                  data._id = entityData._id;
                  data.name = entityData.name;
                  data.externalId = entityData.registryDetails.code;
                  entityDocument.push(data);
                });
                result['data'] = entityDocument;
                result['count'] = response.result.count;
              } else {
                // result['data'] = response.result.response;
                result['data'] = response.result;
  
                // result['count'] = response.result.count;
              }
            } else {
              result.success = false;
            }
          }
          return resolve(result);
        }
  
        // setTimeout(function () {
        //   return resolve(
        //     (result = {
        //       success: false,
        //     }),
        //   );
        // }, messageConstants.common.SERVER_TIME_OUT);
      } catch (error) {
        return reject(error);
      }
    });
  };
  
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


module.exports = {
	locationSearch: locationSearch,
	getSubEntitiesBasedOnEntityType: getSubEntitiesBasedOnEntityType,
}