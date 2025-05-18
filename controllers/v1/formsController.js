/**
 * name : formsController.js
 * author : Akash
 * created-date : 22-Nov-2018
 * Description : All forms related information.
 */

// Dependencies

const formsHelper = require(MODULES_BASE_PATH + '/forms/helper');

/**
 * Forms
 * @class
 */
module.exports = class Forms extends Abstract {
  constructor() {
    super(formsSchema);
  }

  static get name() {
    return 'forms';
  }

  	/**
	 * @api {post} /survey/v1/forms/create
	 * @apiVersion 1.0.0
	 * @apiName create
	 * @apiGroup Forms
	 * @apiParamExample {json} Request-Body:
	 * @apiHeader {String} X-authenticated-user-token Authenticity token
	 * @apiSampleRequest /survey/v1/forms/create
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
	 * @param {Number} req.userDetails.organizationId -organization id.
	 * @returns {JSON} - forms creation object.
	 */

	async create(req) {
		return new Promise(async (resolve, reject) => {
			try {
				let tenantData = req.userDetails.tenantAndOrgInfo
				let createdForm = await formsHelper.create(req.body, tenantData)

				return resolve(createdForm)
			} catch (error) {
				return resolve({
					status: error.status || httpStatusCode.internal_server_error.status,
					message: error.message || httpStatusCode.internal_server_error.message,
					errorObject: error,
				})
			}
		})
	}
  	/**
	 * @api {post} /survey/v1/forms/update/:_id
	 * @apiVersion 1.0.0
	 * @apiName update
	 * @apiGroup Forms
	 * @apiParamExample {json} Request-Body:
	 * @apiHeader {String} X-authenticated-user-token Authenticity token
	 * @apiSampleRequest /survey/v1/forms/update/663cc73584f1a0eb4e97e3db
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
	 * @param {Number} req.userDetails.organizationId -organization id.
	 * @returns {JSON} - forms updation response.
	 */

	async update(req) {
		return new Promise(async (resolve, reject) => {
			try {
				let tenantData = req.userDetails.tenantAndOrgInfo
				const updatedForm = await formsHelper.update(
					req.params._id,
					req.body,
					tenantData
				)
				return resolve(updatedForm)
			} catch (error) {
				return resolve({
					status: error.status || httpStatusCode.internal_server_error.status,
					message: error.message || httpStatusCode.internal_server_error.message,
					errorObject: error,
				})
			}
		})
	}
  	/**
	 * @api {get} /survey/v1/forms/read/:_id
	 * @apiVersion 1.0.0
	 * @apiName read
	 * @apiGroup Forms
	 * @apiParamExample {json} Request-Body:
	 * @apiHeader {String} X-authenticated-user-token Authenticity token
	 * @apiSampleRequest /survey/v1/forms/read/663cc73584f1a0eb4e97e3db
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
	 * @param {Number} req.userDetails.organizationId -organization id.
	 * @param {String} req.userDetails.userToken -userToken.
	 * @returns {JSON} - form object.
	 */

	async read(req) {
		return new Promise(async (resolve, reject) => {
			try {
				let tenantData = req.userDetails.tenantAndOrgInfo
				if (!req.params._id && Object.keys(req.body).length === 0) {
					const formData = await formsHelper.readAllFormsVersion()
					return resolve(formData)
				} else {
					const formData = await formsHelper.read(
						req.params._id,
						req.body,
						tenantData,
						req.userDetails.userToken
					)
					return resolve(formData)
				}
			} catch (error) {
				return resolve({
					status: error.status || httpStatusCode.internal_server_error.status,
					message: error.message || httpStatusCode.internal_server_error.message,
					errorObject: error,
				})
			}
		})
	}
  /**
   * @api {post} /assessment/api/v1/forms/find
   * Find forms.
   * @apiVersion 0.0.1
   * @apiName Find forms.
   * @apiGroup Forms
   * @apiHeader {String} X-authenticated-user-token Authenticity token
   * @apiParamExample {json} Request-Body:
   * {
    "query" : {
        "name" : "projects"
    },
    "projection" : ["value"]
    }
   * @apiSampleRequest /assessment/api/v1/forms/find
   * @apiUse successBody
   * @apiUse errorBody
   * @apiParamExample {json} Response: 
   * {
   * "status": 200,
    "result": [
    {
        "field" : "title",
        "label" : "Title",
        "value" : "",
        "visible" : true,
        "editable" : true,
        "input" : "text",
        "validation" : {
            "required" : true
        }
    },
    {
        "field" : "description",
        "label" : "Description",
        "value" : "",
        "visible" : true,
        "editable" : true,
        "input" : "textarea",
        "validation" : {
            "required" : true
        }
    },
    {
        "field" : "categories",
        "label" : "Categories",
        "value" : "",
        "visible" : true,
        "editable" : true,
        "input" : "select",
        "options" : [],
        "validation" : {
            "required" : false
        }
    }
  ]
    }
   */

  /**
   * Find forms.
   * @method
   * @name find
   * @param {Object} req - Requested data.
   * @param {Object} req.body.query - Filtered data.
   * @param {Array} req.body.projection - Projected data.
   * @param {Array} req.body.skipFields - Field to skip.
   * @returns {JSON} Find solutions data.
   */

  async find(req) {
    return new Promise(async (resolve, reject) => {
      try {
        let formsData = await formsHelper.formDocuments(req.body.query, req.body.projection, req.body.skipFields);

        return resolve({
          message: messageConstants.apiResponses.FORMS_FETCHED,
          result: formsData,
        });
      } catch (error) {
        return reject({
          status: error.status || httpStatusCode.internal_server_error.status,
          message: error.message || httpStatusCode.internal_server_error.message,
          errorObject: error,
        });
      }
    });
  }
};
