//dependencies
const request = require('request');
const userServiceUrl = process.env.USER_SERVICE_URL;


/**
 *
 * @function
 * @name profile
 * @param {String}   userId -userId 
 * @param {String}   userToken-userToken
 * @returns {Promise} returns a promise.
 */
const profile = function ( userId = "",userToken="" ) {
    return new Promise(async (resolve, reject) => {
        try {
            let url = userServiceUrl + messageConstants.endpoints.USER_READ;

            if( userId !== "" ) {
                url = url + "/" + userId
            }

            const options = {
                headers : {
                    "content-type": "application/json",
                    "internal_access_token":process.env.INTERNAL_ACCESS_TOKEN

                }
            };
            if (userToken !== '') {
				options.headers['x-auth-token'] = userToken
			}
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
 * Fetches the default organization details for a given organization code/id.
 * @param {string} organisationIdentifier - The code/id of the organization.
 * @param {String} userToken - user token
 * @returns {Promise} A promise that resolves with the organization details or rejects with an error.
 */

const fetchDefaultOrgDetails = function (organisationIdentifier, userToken) {
	return new Promise(async (resolve, reject) => {
		try {
			let url
			if (!isNaN(organisationIdentifier)) {
				url =
                    userServiceUrl +
					messageConstants.endpoints.ORGANIZATION_READ +
					'?organisation_id=' +
					organisationIdentifier
			} else {
				url =
                    userServiceUrl +
					messageConstants.endpoints.ORGANIZATION_READ +
					'?organisation_code=' +
					organisationIdentifier
			}
			const options = {
				headers: {
					// 'X-auth-token': 'bearer ' + userToken,
					internal_access_token: process.env.INTERNAL_ACCESS_TOKEN,
				},
			}
			request.get(url, options, userReadCallback)
			let result = {
				success: true,
			}
			function userReadCallback(err, data) {
				if (err) {
					result.success = false
				} else {
					let response = JSON.parse(data.body)
					if (response.responseCode === httpStatusCode['ok_userService'].message) {
						result['data'] = response.result
					} else {
						result.success = false
					}
				}

				return resolve(result)
			}
			setTimeout(function () {
				return resolve(
					(result = {
						success: false,
					})
				)
			}, messageConstants.common.SERVER_TIME_OUT)
		} catch (error) {
			return reject(error)
		}
	})
}

/**
 * Fetches the tenant details for a given tenant ID along with org it is associated with.
 * @param {string} tenantId - The code/id of the organization.
 * @param {String} userToken - user token
 * @param {Boolean} aggregateValidOrgs - boolean value to populate valid orgs from response
 * @returns {Promise} A promise that resolves with the organization details or rejects with an error.
 */

const fetchTenantDetails = function (tenantId, userToken, aggregateValidOrgs = false) {
	return new Promise(async (resolve, reject) => {
		try {
			let url =
            userServiceUrl +
            messageConstants.endpoints.TENANT_READ +
            '/' +
            tenantId
			const options = {
				headers: {
                    "content-type": "application/json",
					'X-auth-token':  userToken
				},
			}
			request.get(url, options, userReadCallback)
			let result = {
				success: true,
			}
			function userReadCallback(err, data) {
				if (err) {
					result.success = false
				} else {
					let response = JSON.parse(data.body)
					if (response.responseCode === httpStatusCode['ok_userService'].message) {
						if (aggregateValidOrgs == true) {
							if (response.result.organizations && response.result.organizations.length) {
								// convert the types of items to string
								let validOrgs = response.result.organizations.map((data) => {
									return data.code.toString()
								})
								result['data'] = validOrgs
							} else {
								result['data'] = []
							}
						} else {
							result['data'] = response.result
						}
					} else {
						result.success = false
					}
				}

				return resolve(result)
			}
			setTimeout(function () {
				return resolve(
					(result = {
						success: false,
					})
				)
			}, messageConstants.common.SERVER_TIME_OUT)
		} catch (error) {
			return reject(error)
		}
	})
}


/**
 * Fetches the tenant details for a given tenant ID along with org it is associated with.
 * @param {String} tenantId - tenantId details
 * @returns {Promise} A promise that resolves with the organization details or rejects with an error.
 */

const fetchPublicTenantDetails = function (tenantId) {
	return new Promise(async (resolve, reject) => {
		try {
			let url =
            userServiceUrl +
            messageConstants.endpoints.PUBLIC_BRANDING
			const options = {
				headers: {
                    "content-type": "application/json",
					'tenantid':tenantId
				},
			}
			request.get(url, options, publicBranding)
			let result = {
				success: true,
			}
			function publicBranding(err, data) {
				if (err) {
					result.success = false
				} else {
					let response = JSON.parse(data.body)
					if (response.responseCode === httpStatusCode['ok_userService'].message) {
						result['data'] = response.result
					} else {
						result.success = false
					}
				}

				return resolve(result)
			}
			setTimeout(function () {
				return resolve(
					(result = {
						success: false,
					})
				)
			}, messageConstants.common.SERVER_TIME_OUT)
		} catch (error) {
			return reject(error)
		}
	})
}


/**
 * Fetches user profile by userId/username and tenantId.
 * @param {String} tenantId - tenantId details
 * @param {String} userId - userId details
 * @param {String} username - username details
 * @returns {Promise} A promise that resolves with the organization details or rejects with an error.
 */

const getUserProfileByIdentifier = function (tenantId, userId = null, username) {
  return new Promise(async (resolve, reject) => {
    try {
      let params = userId ? `/${userId}?tenant_code=${tenantId}` : `?tenant_code=${tenantId}&username=${username}`;

      let url = `${userServiceUrl}${messageConstants.endpoints.PROFILE_READ_BY_ID}${params}`;
      const options = {
        headers: {
          'content-type': 'application/json',
          internal_access_token: process.env.INTERNAL_ACCESS_TOKEN,
        },
      };

      request.get(url, options, apiCallBackFunction);
      let result = {
        success: true,
      };
      function apiCallBackFunction(err, data) {
        if (err) {
          result.success = false;
        } else {
          let response = JSON.parse(data.body);

          if (response.responseCode === httpStatusCode['ok_userService'].message) {
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
  profile:profile,
  fetchDefaultOrgDetails,
  fetchTenantDetails,
  fetchPublicTenantDetails,
  getUserProfileByIdentifier
};
