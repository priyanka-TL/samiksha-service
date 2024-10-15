/**
 * name         : helper.js
 * author       : Saish
 * created-date : 15-OCT-2024
 * Description  : Configuration controller helper.
 */

// Dependencies
/**
 * ConfigurationsHelper
 * @class
 */
const configurationQueries = require(DB_QUERY_BASE_PATH + '/configurations')
module.exports = class ConfigurationsHelper {
	/**
	 * Read configuration.
	 * @method
	 * @name read
	 * @param {String} code - Configuration code.
	 * @returns {JSON}      - success/failure message.
	 */
	static read(code) {
		return new Promise(async (resolve, reject) => {
			try {
				// filter for fetching data
				const filter = {
					code: code,
				}

				const configurationDetails = await configurationQueries.findDocument(filter, ['code', 'meta'])
				// check if configuration is present or not
				if (!configurationDetails.length > 0) {
					return resolve({
						status: httpStatusCode.bad_request.status,
						message: messageConstants.apiResponses.CONFIGURATION_NOT_AVAILABLE,
					})
				}
				return resolve({
					message: messageConstants.apiResponses.CONFIGURATION_FETCHED_SUCCESSFULLY,
					result: configurationDetails[0],
				})
			} catch (error) {
                console.log(error)
				return resolve({
					status: error.status ? error.status : httpStatusCode.internal_server_error.status,
					success: false,
					message: error.message,
					data: {},
				})
			}
		})
	}
	/**
	 * create or Update configuration.
	 * @method
	 * @name read
	 * @param {String} code - Configuration code.
	 * @param {String} scopeKeys - scopeKeys
	 * @returns {JSON}      - success/failure message.
	 */
	static createOrUpdate(code,scopeKeys) {
		return new Promise(async (resolve, reject) => {
			try {
				let result = await configurationQueries.createOrUpdate(code,scopeKeys)
				return resolve({
					message: messageConstants.apiResponses.CONFIGURATION_FETCHED_SUCCESSFULLY,
					result: result,
				})
			} catch (error) {
				return resolve({
					status: error.status ? error.status : httpStatusCode.internal_server_error.status,
					success: false,
					message: error.message,
					data: {},
				})
			}
		})
	}
}