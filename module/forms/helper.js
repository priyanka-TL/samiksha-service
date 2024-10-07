/**
 * name : helper.js
 * author : Aman
 * created-date : 04-Jun-2020
 * Description : Forms helper
 */

/**
 * FormsHelper
 * @class
 */


const formQueries = require(DB_QUERY_BASE_PATH + '/forms')
const userService = require(ROOT_PATH + '/generics/services/users');


module.exports = class FormsHelper {
  	/**
	 * Get default org id.
	 * @method
	 * @name getDefaultOrgId
	 * @param {String} userToken
	 * @returns {Number} - Default Organization Id
	 */
	static getDefaultOrgId(userToken) {
		return new Promise(async (resolve, reject) => {
			try {
				// call user-service to fetch default organization details
				let defaultOrgDetails = await userService.fetchDefaultOrgDetails(
					process.env.DEFAULT_ORGANISATION_CODE,
					userToken
				)
				console.log(defaultOrgDetails,'defaultOrgDetails')
				if (defaultOrgDetails.success && defaultOrgDetails.data) {
					return resolve(defaultOrgDetails.data.id)
				} else resolve(null) 
			} catch (error) {
				throw error
			}
		})
	}
  	/**
	 * Create Form.
	 * @method
	 * @name create
	 * @param {Object} bodyData
	 * @param {Number} orgId
	 * @returns {JSON} - Form creation data.
	 */
	static create(bodyData, orgId) {
		return new Promise(async (resolve, reject) => {
			try {
				bodyData['organizationId'] = orgId
				const form = await formQueries.createForm(bodyData)
				if (!form || !form._id) {
					throw {
						status: httpStatusCode.bad_request.status,
						message: messageConstants.apiResponses.FORM_NOT_CREATED,
					}
				}

				// await utils.internalDel('formVersion')

				// await KafkaProducer.clearInternalCache('formVersion')

				return resolve({
					success: true,
					message: messageConstants.apiResponses.FORM_CREATED_SUCCESSFULLY,
					data: form,
					result: form,
				})
			} catch (error) {
				return resolve({
					message: error.message,
					success: false,
				})
			}
		})
	}

  	/**
	 * Update Form.
	 * @method
	 * @name update
	 * @param {String} _id
	 * @param {Object} bodyData
	 * @param {Number} orgId
	 * @returns {JSON} - Update form data.
	 */
	static update(_id, bodyData, orgId) {
		return new Promise(async (resolve, reject) => {
			try {
				// validate _id field
				_id = _id === ':_id' ? null : _id
				let filter = {}
				if (_id) {
					filter = {
						_id: new ObjectId(_id),
						organizationId: orgId,
					}
				} else {
					filter = {
						type: bodyData.type,
						// subType: bodyData.subType,
						organizationId: orgId,
					}
				}
				// create update object to pass to db query
				let updateData = {}
				updateData['$set'] = bodyData
				const updatedForm = await formQueries.updateOneForm(filter, updateData, { new: true })
				if (!updatedForm || !updatedForm._id) {
					return resolve({
						status: httpStatusCode.bad_request.status,
						message: messageConstants.apiResponses.FORM_NOT_UPDATED,
					})
				}
				return resolve({
					success: true,
					message: messageConstants.apiResponses.FORM_UPDATED_SUCCESSFULLY,
					data: updatedForm,
					result: updatedForm,
				})
			} catch (error) {
				return resolve({
					message: error.message,
					success: false,
				})
			}
		})
	}
	/**
	 * Read Form.
	 * @method
	 * @name read
	 * @param {String} _id
	 * @param {Object} bodyData
	 * @param {Number} orgId
	 * @param {String} userToken
	 * @returns {JSON} - Read form data.
	 */
	static read(_id, bodyData, orgId, userToken) {
		return new Promise(async (resolve, reject) => {
			try {
				// validate _id field
				_id = _id === ':_id' ? null : _id
				let filter = {}
				if (_id) {
					filter = { _id: new ObjectId(_id), organizationId: orgId }
				} else {
					filter = { ...bodyData, organizationId: orgId }
				}
				const form = await formQueries.findOneForm(filter)
				let defaultOrgForm
				if (!form || !form._id) {
					// call getDefaultOrgId() to get default organization details from user-service
					const defaultOrgId = await this.getDefaultOrgId(userToken)
					console.log(defaultOrgId,'<--defaultOrgId')
					if (!defaultOrgId) {
						return resolve({
							success: false,
							message: messageConstants.apiResponses.DEFAULT_ORG_ID_NOT_SET,
						})
					}
					filter = _id
						? { _id: ObjectId(_id), organizationId: defaultOrgId }
						: { ...bodyData, organizationId: defaultOrgId }
					defaultOrgForm = await formQueries.findOneForm(filter)
				}
				if (!form && !defaultOrgForm) {
					throw {
						status: httpStatusCode.bad_request.status,
						message: messageConstants.apiResponses.FORM_NOT_FOUND,
					}
				}
				return resolve({
					success: true,
					message: messageConstants.apiResponses.FORM_FETCHED_SUCCESSFULLY,
					data: form ? form : defaultOrgForm,
					result: form ? form : defaultOrgForm,
				})
			} catch (error) {
				return resolve({
					status: error.status || httpStatusCode.internal_server_error.status,
					message: error.message || httpStatusCode.internal_server_error.message,
				})
			}
		})
	}
	/**
	 * Read Form Version.
	 * @method
	 * @name readAllFormsVersion
	 * @returns {JSON} - Read form data.
	 */
	static readAllFormsVersion() {
		return new Promise(async (resolve, reject) => {
			try {
				const filter = 'all'
				const projectFields = ['_id', 'type', 'version']
				// db query to get forms version of all documents
				const getAllFormsVersion = await formQueries.formDocuments(filter, projectFields)
				if (!getAllFormsVersion || !getAllFormsVersion.length > 0) {
					throw {
						status: httpStatusCode.bad_request.status,
						message: messageConstants.apiResponses.FORM_VERSION_NOT_FETCHED,
					}
				}
				return resolve({
					success: true,
					message: messageConstants.apiResponses.FORM_VERSION_FETCHED_SUCCESSFULLY,
					data: getAllFormsVersion ? getAllFormsVersion : [],
					result: getAllFormsVersion ? getAllFormsVersion : [],
				})
			} catch (error) {
				return resolve({
					status: error.status || httpStatusCode.internal_server_error.status,
					message: error.message || httpStatusCode.internal_server_error.message,
				})
			}
		})
	}
  /**
   * List of forms
   * @method
   * @name formDocuments
   * @param {Object} filterData - filter form data.
   * @param {Array} fieldsArray - projected field.
   * @param {Array} skipFields - field to be skip.
   * @returns {Array} List of forms.
   */

  static formDocuments(filterData = 'all', fieldsArray = 'all', skipFields = 'none') {
    return new Promise(async (resolve, reject) => {
      try {
        let queryObject = filterData != 'all' ? filterData : {};

        let projection = {};

        if (fieldsArray != 'all') {
          fieldsArray.forEach((field) => {
            projection[field] = 1;
          });
        }

        if (skipFields !== 'none') {
          skipFields.forEach((field) => {
            projection[field] = 0;
          });
        }

        let formDocuments = await database.models.forms.find(queryObject, projection).lean();

        return resolve(formDocuments);
      } catch (error) {
        return reject(error);
      }
    });
  }
};
