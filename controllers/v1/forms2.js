
/**
 * name : forms.js
 * author : Vishnu
 * created-date : 07-May-2024
 * Description :  Forms Controller.
 */

// dependencies
let formsHelpers = require(MODULES_BASE_PATH + '/forms/helper')

/**
 * Forms service.
 * @class
 */

module.exports = class Forms extends Abstract {
	constructor() {
		super('forms')
	}
	static get name() {
		return 'forms'
	}
	/**
	 * @api {post} /project/v1/forms/create
	 * @apiVersion 1.0.0
	 * @apiName create
	 * @apiGroup Forms
	 * @apiParamExample {json} Request-Body:
	 * @apiHeader {String} X-authenticated-user-token Authenticity token
	 * @apiSampleRequest /project/v1/forms/create
	 * @apiUse successBody
	 * @apiUse errorBody
	 * @apiParamExample {json} Request-Body:
		{
			"type" : "aaa",
			"subType" : "bbb",
			"data" : {
				"name" : "xyz",
				"values" : [1,2,3,4]
			}
		}

    * @apiParamExample {json} Response:
		{
			"message": "Form created successfully",
			"status": 200,
			"result": {
				"version": 0,
				"_id": "663cc73584f1a0eb4e97e3db",
				"deleted": false,
				"type": "aaa",
				"subType": "bbb",
				"data": {
					"name": "xyz",
					"values": [
						1,
						2,
						3,
						4
					]
				},
				"organizationId": 1,
				"updatedAt": "2024-05-09T12:53:09.920Z",
				"createdAt": "2024-05-09T12:53:09.920Z",
				"__v": 0
			}
		}
	*/
	/**
	 * create form
	 * @method
	 * @name create
	 * @param {Object} req.body -request data.
	 * @param {Number} req.userDetails.userInformation.organizationId -organization id.
	 * @returns {JSON} - forms creation object.
	 */

	async create(req) {
		return new Promise(async (resolve, reject) => {
			try {
				let createdForm = await formsHelpers.create(req.body, req.userDetails.userInformation.organizationId)

				return resolve(createdForm)
			} catch (error) {
				return resolve({
					status: error.status || HTTP_STATUS_CODE.internal_server_error.status,
					message: error.message || HTTP_STATUS_CODE.internal_server_error.message,
					errorObject: error,
				})
			}
		})
	}

	/**
	 * @api {post} /project/v1/forms/update/:_id
	 * @apiVersion 1.0.0
	 * @apiName update
	 * @apiGroup Forms
	 * @apiParamExample {json} Request-Body:
	 * @apiHeader {String} X-authenticated-user-token Authenticity token
	 * @apiSampleRequest /project/v1/forms/update/663cc73584f1a0eb4e97e3db
	 * @apiUse successBody
	 * @apiUse errorBody
	 * @apiParamExample {json} Request-Body:
		{
			"type" : "cccc",
			"subType" : "ppp",
			"organizationId" : 1,
			"data" : {
				"name" : "xyz"
			}
		}

    * @apiParamExample {json} Response:
		{
			"message": "Form updated successfully",
			"status": 200,
			"result": {
				"_id": "663cc73584f1a0eb4e97e3db",
				"version": 0,
				"deleted": false,
				"type": "cccc",
				"subType": "ppp",
				"data": {
					"name": "xyz"
				},
				"organizationId": 1,
				"updatedAt": "2024-05-09T12:57:53.636Z",
				"createdAt": "2024-05-09T12:53:09.920Z",
				"__v": 0
			}
		}
	*/

	/**
	 * updates form
	 * @method
	 * @name update
	 * @param {String} req.params._id - form id.
	 * @param {Object} req.body - request data.
	 * @param {Number} req.userDetails.userInformation.organizationId -organization id.
	 * @returns {JSON} - forms updation response.
	 */

	async update(req) {
		return new Promise(async (resolve, reject) => {
			try {
				const updatedForm = await formsHelpers.update(
					req.params._id,
					req.body,
					req.userDetails.userInformation.organizationId
				)
				return resolve(updatedForm)
			} catch (error) {
				return resolve({
					status: error.status || HTTP_STATUS_CODE.internal_server_error.status,
					message: error.message || HTTP_STATUS_CODE.internal_server_error.message,
					errorObject: error,
				})
			}
		})
	}

	/**
	 * @api {get} /project/v1/forms/read/:_id
	 * @apiVersion 1.0.0
	 * @apiName read
	 * @apiGroup Forms
	 * @apiParamExample {json} Request-Body:
	 * @apiHeader {String} X-authenticated-user-token Authenticity token
	 * @apiSampleRequest /project/v1/forms/read/663cc73584f1a0eb4e97e3db
	 * @apiUse successBody
	 * @apiUse errorBody
	 * @apiParamExample {json} Request-Body:
		{
			"type" : "cccc",
			"subType" : "ppp"
		}

    * @apiParamExample {json} Response:
		{
			"message": "Form fetched successfully",
			"status": 200,
			"result": {
				"version": 0,
				"deleted": false,
				"_id": "663cc73584f1a0eb4e97e3db",
				"type": "cccc",
				"subType": "ppp",
				"data": {
					"name": "xyz"
				},
				"organizationId": 1,
				"updatedAt": "2024-05-09T12:57:53.636Z",
				"createdAt": "2024-05-09T12:53:09.920Z",
				"__v": 0
			}
		}
	*/

	/**
	 * reads form
	 * @method
	 * @name read
	 * @param {String} req.params._id - form id.
	 * @param {Object} req.body - request data.
	 * @param {Number} req.userDetails.userInformation.organizationId -organization id.
	 * @param {String} req.userDetails.userToken -userToken.
	 * @returns {JSON} - form object.
	 */

	async read(req) {
		return new Promise(async (resolve, reject) => {
			try {
				if (!req.params._id && Object.keys(req.body).length === 0) {
					const formData = await formsHelpers.readAllFormsVersion()
					return resolve(formData)
				} else {
					const formData = await formsHelpers.read(
						req.params._id,
						req.body,
						req.userDetails.userInformation.organizationId,
						req.userDetails.userToken
					)
					return resolve(formData)
				}
			} catch (error) {
				return resolve({
					status: error.status || HTTP_STATUS_CODE.internal_server_error.status,
					message: error.message || HTTP_STATUS_CODE.internal_server_error.message,
					errorObject: error,
				})
			}
		})
	}
}
