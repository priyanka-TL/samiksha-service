/**
 * name : configurationsController.js
 * author : Akash
 * created-date : 22-Nov-2018
 * Description : App configurations.
 */

const configurationsHelper = require(MODULES_BASE_PATH + '/configurations/helper')

/**
 * Configurations
 * @class
 */
module.exports = class Configurations extends Abstract {
  constructor() {
    super(configurationsSchema);
  }

  static get name() {
    return 'configurations';
  }

  /**
    * @api {get} /assessment/api/v1/configurations/navigation Navigation configurations
    * @apiVersion 1.0.0
    * @apiName Navigation configurations
    * @apiGroup Configurations
    * @apiSampleRequest /assessment/api/v1/configurations/navigation
    * @apiUse successBody
    * @apiUse errorBody
    * @apiParamExample {json} Response:
    * "tabActions": [
    * {
        "name": "Configuration",
        "id": "configuration",
        "accessibility": true,
        "tabActions": [
            {
            "name": "Criteria",
            "id": "criteria",
            "accessibility": true,
            "tabActions": []
            },
            {
            "name": "Question",
            "id": "question",
            "accessibility": false,
            "tabActions": []
            }
        ]
    * }
    ]
    */

  /**
   * App navigation links.
   * @method
   * @name navigation
   * @param {Object} req - All requested Data.
   * @param {Array} req.userDetails.allRoles - Array of loggedin useer roles
   * @returns {JSON} returns a navigation action required for samiksha app.
   */

  async navigation(req) {
    return new Promise(async (resolve, reject) => {
      try {
        _.pull(req.userDetails.allRoles, 'PUBLIC');
        const userRole = req.userDetails.allRoles[0];
        if (!userRole) {
          return resolve({
            status: httpStatusCode.bad_request.status,
            message: httpStatusCode.bad_request.message,
          });
        }
        let tabControlsDocument = await database.models.configurations.findOne({ name: 'navigation' }).lean();
        if (!tabControlsDocument) {
          return resolve({
            status: httpStatusCode.bad_request.status,
            message: messageConstants.apiResponses.CONFIGURATIONS_NOT_FOUND,
          });
        }
        return resolve({
          message: messageConstants.apiResponses.CONFIGURATIONS_FETCHED,
          result: tabControlsDocument.result.tabGroups[userRole]
            ? tabControlsDocument.result.tabGroups[userRole]
            : tabControlsDocument.result.tabGroups['DEFAULT'],
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
  	/**
  * @api {post} /survey/v1/configurations/read
  * @apiVersion 1.0.0
  * @apiName read
  * @apiGroup Admin
  * @apiHeader {String} X-auth-token Authenticity token
  * @apiSampleRequest /survey/v1/configurations/read
  * @apiUse successBody
  * @apiUse errorBody
  * @apiParamExample {json} Response:
    {
		"message": "Configuration fetched successfully",
		"status": 200,
		"result": {
			"_id": "66b9ad30ce28500bff2dd82f",
			"code": "keysAllowedForTargeting",
			"meta": {
				"profileKeys": [
					"state",
					"district",
					"zone"
				]
			}
		}
	}
  */

	/**
	 * Reading configuration
	 * @method
	 * @name read
	 * @returns {Object} success/failure message.
	 */

	async read(req) {
		return new Promise(async (resolve, reject) => {
			try {
				const configDetails = await configurationsHelper.read('keysAllowedForTargeting')
				return resolve(configDetails)
			} catch (error) {
				return reject({
					status: error.status || httpStatusCode.internal_server_error.status,
					message: error.message || httpStatusCode.internal_server_error.message,
					errorObject: error,
				})
			}
		})
	}

/**
  * @api {post} /survey/v1/configurations/createOrUpdate
  * @apiVersion 1.0.0
  * @apiName createOrUpdate
  * @apiGroup Admin
  * @apiHeader {String} X-auth-token Authenticity token
  * @apiSampleRequest /survey/v1/configurations/createOrUpdate
  * @apiUse successBody
  * @apiUse errorBody
  * @apiParamExample {json} Response:
{
    "message": "Configuration fetched successfully",
    "status": 200,
    "result": {
        "_id": "670e1bbffd3e0bdfcbe02f75",
        "code": "keyCode1",
        "__v": 0,
        "createdAt": "2024-10-15T07:37:35.547Z",
        "deleted": false,
        "meta": {
            "profileKeys": [
                "block"
            ]
        },
        "updatedAt": "2024-10-15T07:37:35.547Z"
    }
}
  */

	/**
	 * update configuration
	 * @method
	 * @name createOrUpdate
	 * @returns {Object} success/failure message.
	 */
  async createOrUpdate(req) {
		return new Promise(async (resolve, reject) => {
			try {
				const configDetails = await configurationsHelper.createOrUpdate(req.body.code,req.body.profileKeys)
				return resolve(configDetails)
			} catch (error) {
				return reject({
					status: error.status || httpStatusCode.internal_server_error.status,
					message: error.message || httpStatusCode.internal_server_error.message,
					errorObject: error,
				})
			}
		})
	}
};
