/**
 * name : profile.js
 * author : Saish Borkar
 * created-date : 13-Jun-2024
 * Description :  profile Controller.
 */

// dependencies
let profileHelper = require(MODULES_BASE_PATH + '/profile/helper')

/**
 * profile service.
 * @class
 */
module.exports = class profile {
	static get name() {
		return 'profile'
	}

	/**
	 * @api {get} /project/v1/profile/read
	 * @apiVersion 1.0.0
	 * @apiName read
	 * @apiGroup read
	 * @apiParamExample {json} Request-Body:
	 * @apiHeader {String} X-authenticated-user-token Authenticity token
	 * @apiSampleRequest /project/v1/profile/read
	 * @apiUse successBody
	 * @apiUse errorBody
	
    * @apiParamExample {json} Response:
		{
			"message": "Data fetched successfully",
			"status": 200,
			"result": {
			"id": 1,
			"email": "rahul@yahoo.com",
			"email_verified": "false",
			"name": "Priyanka",
			"gender": null,
			"about": "This is teswt",
			"share_link": null,
			"status": "ACTIVE",
			"image": null,
			"has_accepted_terms_and_conditions": true,
			"languages": [
				{
					"value": "en_in",
					"label": "English"
				}
			],
			"meta": {},
			"location_ids": null,
			"created_at": "2024-06-11T06:52:31.427Z",
			"updated_at": "2024-06-12T09:42:58.693Z",
			"deleted_at": null,
			"organization": {
				"id": 1,
				"name": "Default Organization",
				"code": "default_code"
			},
			"user_roles": [
				{
					"id": 7,
					"title": "org_admin",
					"user_type": 1,
					"status": "ACTIVE",
					"organization_id": 1,
					"visibility": "PUBLIC"
				},
				{
					"id": 5,
					"title": "mentee",
					"user_type": 0,
					"status": "ACTIVE",
					"organization_id": 1,
					"visibility": "PUBLIC"
				}
			],
				{
					"module": "form",
					"request_type": [
						"POST",
						"DELETE",
						"GET",
						"PUT",
						"PATCH"
					],
					"service": "user"
				},
				{
					"module": "cloud-services",
					"request_type": [
						"POST",
						"DELETE",
						"GET",
						"PUT",
						"PATCH"
					],
					"service": "user"
				},
				{
					"module": "organization",
					"request_type": [
						"POST",
						"GET"
					],
					"service": "user"
				},
				{
					"module": "org-admin",
					"request_type": [
						"POST",
						"DELETE",
						"GET",
						"PUT",
						"PATCH"
					],
					"service": "user"
				},
				{
					"module": "notification",
					"request_type": [
						"POST",
						"DELETE",
						"GET",
						"PUT",
						"PATCH"
					],
					"service": "user"
				},
				{
					"module": "account",
					"request_type": [
						"GET",
						"POST"
					],
					"service": "user"
				},
				{
					"module": "user-role",
					"request_type": [
						"GET",
						"POST",
						"DELETE",
						"PUT",
						"PATCH"
					],
					"service": "user"
				}
			],
			"block": [
				{
					"value": "5fd1b52ab53a6416aaeefb1f",
					"label": "SARUBUJJILI"
				},
				{
					"value": "5fd1b52ab53a6416aaeefb24",
					"label": "NARASANNAPETA"
				}
			],
			"state": {
				"value": "5f33c3d85f637784791cd830",
				"label": "Maharashtra"
			},
			"school": [
				{
					"value": "5fd1b52ab53a6416aaeefb26",
					"label": "SARAVAKOTA"
				}
			],
			"district": {
				"value": "5fd098e2e049735a86b748ae",
				"label": "VISAKHAPATNAM"
			}
		}
		}
	*/

	/**
	 * @function read
	 * @description This function handles the read operation for user profiles.
	 * It returns a Promise that resolves with user profile data or rejects with an error.
	 *
	 * @param {Object} req - The request object containing user details.
	 * @returns {Promise<Object>} - A Promise that resolves with the user profile data or an error response.
	 */
	async read(req) {
		// Return a new Promise, as the function is asynchronous
		return new Promise(async (resolve, reject) => {
			try {
				// Call the read function from profileHelper with the user's details
				let tenantData = req.userDetails.tenantData
				const userId = req.userDetails.userId
				const profileData = await profileHelper.read(userId,req.userDetails.userToken,tenantData)

				// If successful, resolve the Promise with a success message and the fetched data
				return resolve({
					success: true,
					message: messageConstants.apiResponses.DATA_FETCHED_SUCCESSFULLY,
					result: profileData,
				})
			} catch (error) {
				// If an error occurs, return an error response with status, message, and the error object
				return reject({
					status: error.status || httpStatusCode.internal_server_error.status,
					message: error.message || httpStatusCode.internal_server_error.message,
					errorObject: error,
				})
			}
		})
	}
}