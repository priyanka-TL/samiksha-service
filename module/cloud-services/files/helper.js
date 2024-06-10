/**
 * name : files/helper.js
 * author : prajwal
 * created-date : 25-Apr-2024
 * Description : All files related helper functionality.Including uploading file
 * to cloud service.
 */

// Dependencies

let filesHelpers = require(MODULES_BASE_PATH + '/files/helper')
const cloudStorage = process.env.CLOUD_STORAGE_PROVIDER
const bucketName = process.env.CLOUD_STORAGE_BUCKETNAME
const bucktType = process.env.CLOUD_STORAGE_BUCKET_TYPE

/**
 * FilesHelper
 * @class
 */

module.exports = class FilesHelper {
	/**
	 * Get all signed urls.
	 * @method
	 * @name preSignedUrls
	 * @param {Array} payloadData       - payload for files data.
	 * @param {String} userId           - Logged in user id.
	 * @returns {Array}                 - consists of all signed urls & filePaths.
	 */

	static async preSignedUrls(payloadData, userId = '') {
			try {
				let payloadIds = Object.keys(payloadData)

				let result = {
					cloudStorage: cloudStorage,
					[payloadIds[0]]: {},
				}

				for (let pointerToPayload = 0; pointerToPayload < payloadIds.length; pointerToPayload++) {
					let payloadId = payloadIds[pointerToPayload]
					// Generate unique folderPath to all the file names in payloadData
					let folderPath = 'project/' + payloadId + '/' + userId + '/' + gen.utils.generateUUId() + '/'
					// Call preSignedUrls helper file to get the signedUrl
					let imagePayload = await filesHelpers.preSignedUrls(
						payloadData[payloadId].files,
						bucketName,
						cloudStorage,
						folderPath,
						parseInt(process.env.PRESIGNED_URL_EXPIRY_IN_SECONDS), //expireIn PARAMS
						'' //permission PARAMS
					)

					if (!imagePayload.success) {
						return {
							status: httpStatusCode.bad_request.status,
							message: messageConstants.apiResponses.FAILED_PRE_SIGNED_URL,
							result: {},
						}
					}

					if (!result[payloadId]) {
						result[payloadId] = {}
					}

					result[payloadId]['files'] = imagePayload.result
				}

				return {
					message: messageConstants.apiResponses.URL_GENERATED,
					data: result,
				}
			} catch (error) {
				throw error;
			}

	}

	/**
	 * Get Downloadable URL from cloud.
	 * @method
	 * @name getDownloadableUrl
	 * @param {Array} payloadData       - payload for files data.
	 * @returns {JSON}                  - Response with status and message.
	 */

	static async getDownloadableUrl(payloadData) {
			try {
				// if bucktType is private call preSignedUrls function with read permission
				if (bucktType === messageConstants.common.PRIVATE) {
					let downloadableUrl = await filesHelpers.preSignedUrls(
						payloadData,
						bucketName,
						cloudStorage,
						'',
						parseInt(process.env.DOWNLOADABLE_URL_EXPIRY_IN_SECONDS), //expireIn PARAMS
						messageConstants.common.READ_PERMISSION, //permission PARAMS
						true //true if filePath is passed
					)

					if (!downloadableUrl.success) {
						return {
							status: httpStatusCode.bad_request.status,
							message: messageConstants.apiResponses.FAILED_TO_CREATE_DOWNLOADABLEURL,
							result: {},
						}
					}

					let resultArray = [];

					downloadableUrl.result.forEach((resultInstance)=>{
						resultArray.push({
							filePath:resultInstance.payload.sourcePath,
							url:resultInstance.url
						})
					})

					return {
						message: messageConstants.apiResponses.CLOUD_SERVICE_SUCCESS_MESSAGE,
						result:resultArray
					}
				}
				// if bucketType is public go with the normal flow of calling getDownloadableUrl function
				let downloadableUrl = await filesHelpers.getDownloadableUrl(
					payloadData,
					bucketName,
					cloudStorage,
					parseInt(process.env.DOWNLOADABLE_URL_EXPIRY_IN_SECONDS)
				)
				if (!downloadableUrl.success) {
					return {
						status: httpStatusCode.bad_request.status,
						message: messageConstants.apiResponses.FAILED_TO_CREATE_DOWNLOADABLEURL,
						result: {},
					}
				}

				return {
					message: messageConstants.apiResponses.CLOUD_SERVICE_SUCCESS_MESSAGE,
					result: downloadableUrl.result,
				}
			} catch (error) {
				return {
					status: error.status || httpStatusCode.internal_server_error.status,
					message: error.message || httpStatusCode.internal_server_error.message,
					errorObject: error,
				}
			}
	}
}
