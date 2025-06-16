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
 * @returns {Promise} A promise that resolves with the organization details or rejects with an error.
 */

const fetchTenantDetails = function (tenantId, userToken) {
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

const fetchProfileBasedOnUserIdOrName = function (tenantId,userId=null,username) {
	return new Promise(async (resolve, reject) => {
		try {

			let params;
			if(userId){
				params =`/${userId}?tenant_code=${tenantId}`
			}else {
				params =`?tenant_code=${tenantId}&username=${username}`
			}

			let url =
            userServiceUrl +
            messageConstants.endpoints.FETCH_USER_PROFILE_INFO + params
			const options = {
				headers: {
                    "content-type": "application/json",
					internal_access_token: process.env.INTERNAL_ACCESS_TOKEN,
					'x-auth-token': `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImlkIjoxLCJuYW1lIjoiTmV2aWwiLCJzZXNzaW9uX2lkIjo2MzY0LCJvcmdhbml6YXRpb25faWRzIjpbIjEiXSwib3JnYW5pemF0aW9uX2NvZGVzIjpbImRlZmF1bHRfY29kZSJdLCJ0ZW5hbnRfY29kZSI6ImRlZmF1bHQiLCJvcmdhbml6YXRpb25zIjpbeyJpZCI6MSwibmFtZSI6IkRlZmF1bHQgT3JnYW5pemF0aW9uIiwiY29kZSI6ImRlZmF1bHRfY29kZSIsImRlc2NyaXB0aW9uIjoiRGVmYXVsdCAgU0wgT3JnYW5pc2F0aW9uIiwic3RhdHVzIjoiQUNUSVZFIiwicmVsYXRlZF9vcmdzIjpudWxsLCJ0ZW5hbnRfY29kZSI6ImRlZmF1bHQiLCJtZXRhIjpudWxsLCJjcmVhdGVkX2J5IjpudWxsLCJ1cGRhdGVkX2J5IjpudWxsLCJyb2xlcyI6W3siaWQiOjUsInRpdGxlIjoibWVudGVlIiwibGFiZWwiOm51bGwsInVzZXJfdHlwZSI6MCwic3RhdHVzIjoiQUNUSVZFIiwib3JnYW5pemF0aW9uX2lkIjoxLCJ2aXNpYmlsaXR5IjoiUFVCTElDIiwidGVuYW50X2NvZGUiOiJkZWZhdWx0IiwidHJhbnNsYXRpb25zIjpudWxsfSx7ImlkIjo2LCJ0aXRsZSI6ImFkbWluIiwibGFiZWwiOm51bGwsInVzZXJfdHlwZSI6MSwic3RhdHVzIjoiQUNUSVZFIiwib3JnYW5pemF0aW9uX2lkIjoxLCJ2aXNpYmlsaXR5IjoiUFVCTElDIiwidGVuYW50X2NvZGUiOiJkZWZhdWx0IiwidHJhbnNsYXRpb25zIjpudWxsfSx7ImlkIjoyNSwidGl0bGUiOiJsZWFybmVyIiwibGFiZWwiOiJMZWFybmVyIiwidXNlcl90eXBlIjowLCJzdGF0dXMiOiJBQ1RJVkUiLCJvcmdhbml6YXRpb25faWQiOjEsInZpc2liaWxpdHkiOiJQVUJMSUMiLCJ0ZW5hbnRfY29kZSI6ImRlZmF1bHQiLCJ0cmFuc2xhdGlvbnMiOm51bGx9XX1dfSwiaWF0IjoxNzUwMDY4MDIyLCJleHAiOjE3NTAxNTQ0MjJ9.AF-iwKy_Ri_jmdLUV338DnsaGdlkANCu5wRotYChg4E`

			}
		}

			request.get(url, options, apiCallBackFunction)
			let result = {
				success: true,
			}
			function apiCallBackFunction(err, data) {
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


module.exports = {
  profile:profile,
  fetchDefaultOrgDetails,
  fetchTenantDetails,
  fetchPublicTenantDetails,
  fetchProfileBasedOnUserIdOrName
};
