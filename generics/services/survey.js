/**
 * name : survey.js
 * author : Saish
 * Date : March 24 2025
 * Description : All projects related api call.
 */

const request = require('request')
const surveyServiceUrl = process.env.ELEVATE_SURVEY_SERVICE_URL

/**
  * Profile Read
  * @function
  * @name profileRead
  * @param {String} userToken - logged in user token.
  * @returns {JSON} - returns profile infromation
*/

// Function to read the user profile based on the given userId
const profileRead = function (userToken) {

	return new Promise(async (resolve, reject) => {
		try {
			// Construct the URL for the user service
			let url = `${surveyServiceUrl}/${process.env.SERVICE_NAME}${messageConstants.endpoints.PROFILE_READ}`

			// Set the options for the HTTP GET request
			const options = {
				headers: {
					'content-type': 'application/json',
					'x-auth-token': userToken,
				},
			}
			let result = {
				success: true,
			}
			request.get(url, options, userReadCallback)
			
			// Handle callback fucntion
			function userReadCallback(err, data) {
				if (err) {
					result.success = false
				} else {
					let response = JSON.parse(data.body)
					console.log(response, 'response')
					if (response.status === httpStatusCode['ok'].status) {
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
	profileRead: profileRead,
}
