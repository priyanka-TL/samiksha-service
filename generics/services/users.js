//dependencies
const request = require('request');
const userServiceUrl = process.env.USER_SERVICE_URL;
const entityServiceUrl = process.env.ENTITY_SERVICE_URL



const profile = function ( token,userId = "" ) {
    return new Promise(async (resolve, reject) => {
        try {
            let url = userServiceUrl + messageConstants.endpoints.USER_READ_V5;

            if( userId !== "" ) {
                url = url + "/" + userId + "?"  + "fields=organisations,roles,locations,declarations,externalIds"
            }

            const options = {
                headers : {
                    "content-type": "application/json",
                    "X-auth-token" : `bearer ${token}`
                }
            };

            request.get(url,options,kendraCallback);

            function kendraCallback(err, data) {

                let result = {
                    success : true
                };

                if (err) {
                    result.success = false;
                } else {

                    let response = JSON.parse(data.body);
                    if( response.responseCode === httpStatusCode['ok_userService'].message ) {
                        result["data"] = _.omit(response.result, [
                            "email",
                            "maskedEmail",
                            "maskedPhone",
                            "recoveryEmail",
                            "phone",
                            "prevUsedPhone",
                            "prevUsedEmail",
                            "recoveryPhone",
                            "encEmail",
                            "encPhone"
                        ]);
                    } else {
                        result["message"] = response.params?.status;
                        result.success = false;
                    }

                }

                return resolve(result);
            }

        } catch (error) {
            return reject(error);
        }
    })
}

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
      bodyData['request']['filters'] = filterData;

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

      const url = userServiceUrl + constants.endpoints.GET_LOCATION_DATA;
      const options = {
        headers: {
          'content-type': 'application/json',
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
            response.responseCode === constants.common.OK &&
            response.result &&
            response.result.response &&
            response.result.response.length > 0
          ) {
            // format result if true
            if (formatResult) {
              let entityDocument = [];
              response.result.response.map((entityData) => {
                let data = {};
                data._id = entityData.id;
                data.entityType = entityData.type;
                data.metaInformation = {};
                data.metaInformation.name = entityData.name;
                data.metaInformation.externalId = entityData.code;
                data.registryDetails = {};
                data.registryDetails.locationId = entityData.id;
                data.registryDetails.code = entityData.code;
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
                data._id = entityData.id;
                data.name = entityData.name;
                data.externalId = entityData.code;
                entityDocument.push(data);
              });
              result['data'] = entityDocument;
              result['count'] = response.result.count;
            } else {
              result['data'] = response.result.response;
              result['count'] = response.result.count;
            }
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
          }),
        );
      }, constants.common.SERVER_TIME_OUT);
    } catch (error) {
      return reject(error);
    }
  });
};

/**
 *
 * @function
 * @name orgSchoolSearch
 *  @param {object} filterData -  contain filter object.
 * @param {String} pageSize -  requested page size.
 * @param {String} pageNo -  requested page number.
 * @param {String} searchKey -  search string.
 * @param {String} searchKey - search key for fuzzy search.
 * @param {String} fields -  required field filter.
 * @returns {Promise} returns a promise.
 */
const orgSchoolSearch = function (filterData, pageSize = '', pageNo = '', searchKey = '', fields = []) {
  return new Promise(async (resolve, reject) => {
    try {
      let bodyData = {};
      bodyData['request'] = {};
      bodyData['request']['filters'] = filterData;

      if (pageSize !== '') {
        bodyData['request']['limit'] = pageSize;
      }

      if (pageNo !== '') {
        let offsetValue = pageSize * (pageNo - 1);
        bodyData['request']['offset'] = offsetValue;
      }

      if (searchKey !== '') {
        if (gen.utils.checkIfStringIsNumber(searchKey)) {
          bodyData['request']['fuzzy'] = {
            externalId: searchKey,
          };
        } else {
          bodyData['request']['fuzzy'] = {
            orgName: searchKey,
          };
        }
      }

      //for getting specified key data only.
      if (fields.length > 0) {
        bodyData['request']['fields'] = fields;
      }

      const url = userServiceUrl + constants.endpoints.GET_SCHOOL_DATA;
      const options = {
        headers: {
          'content-type': 'application/json',
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
            response.responseCode === constants.common.OK &&
            response.result &&
            response.result.response &&
            response.result.response.content &&
            response.result.response.content.length > 0
          ) {
            result['data'] = response.result.response.content;
            result['count'] = response.result.response.count;
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
          }),
        );
      }, constants.common.SERVER_TIME_OUT);
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

async function getSubEntitiesBasedOnEntityType( parentIds, entityType, result ) {

  if( !(parentIds.length > 0) ){
      return result;
  }
  let bodyData={
      "parentId" : parentIds
  };

  let entityDetails = await locationSearch(bodyData);
  if( !entityDetails.success ) {
      return (result);
  }

  let entityData = entityDetails.data;
  let parentEntities = [];
  entityData.map(entity => {
  if( entity.type == entityType ) {
      result.push(entity.id)
  } else {
      parentEntities.push(entity.id)
  }
  });
  
  if( parentEntities.length > 0 ){
      await getSubEntitiesBasedOnEntityType(parentEntities,entityType,result)
  } 
  
  let uniqueEntities = _.uniq(result);
  return uniqueEntities;    
}

/**
  * update user consent for sharing the PII.
  * @method
  * @name setUserConsent
  * @param {String} token - user token
  * @returns {Object} consentData - consent data.
*/

const setUserConsent = function ( token, consentData ) {
  return new Promise(async (resolve, reject) => {
      try {
          
          let url = userServiceUrl + constants.endpoints.USER_CONSENT_API;
          
          const options = {
              headers : {
                  "content-type": "application/json",
                  "x-authenticated-user-token" : token
              },
              body: JSON.stringify(consentData) 
          };
          
          request.post(url,options,requestCallback);

          function requestCallback(err, data) {

              let result = {
                  success : true
              };

              if (err) {
                  result.success = false;
              } else {
                 
                  let response = JSON.parse(data.body);
                  
                  if( response.responseCode === httpStatusCode['http_responsecode_ok'].message ) {
                      result["data"] = response;
                  } else {
                      result["message"] = response;
                      result.success = false;
                  }

              }
              return resolve(result);
          }
          setTimeout(function () {
              return resolve (result = {
                  success : false
              });
          }, constants.common.SERVER_TIME_OUT);

      } catch (error) {
          return reject(error);
      }
  })
}

module.exports = {
  profile:profile,
  locationSearch: locationSearch,
  orgSchoolSearch: orgSchoolSearch,
  getSubEntitiesBasedOnEntityType:getSubEntitiesBasedOnEntityType,
  setUserConsent:setUserConsent
};
