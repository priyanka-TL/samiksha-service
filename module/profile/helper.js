// calling entities service for entity-managament
const entityManagementService = require(ROOT_PATH + '/generics/services/entity-management');
// calling user service api
const userService = require(ROOT_PATH + '/generics/services/users');

module.exports = class ProfileHelper {
	/**
	 * @function read
	 * @description Fetches and processes user profile data, including location details.
	 * @param {Object} userId - The userId ccontaining the userId.
	 * @param {String} userToken - The userToken 
	 * @returns {Promise<Object>} - A promise that resolves with the processed user profile data or an error object.
	 * @throws {Error} - Throws an error if the user details cannot be fetched or processed.
	 **/
	static read(userId,userToken) {
		return new Promise(async (resolve, reject) => {
			try {
				// Fetch user profile details using userService.profile function
				const userResponse = await userService.profile(userId,userToken)

				// Check if the user profile fetch was successful
				if (!userResponse.success) {
					throw {
						message: messageConstants.apiResponses.USER_DATA_FETCH_UNSUCCESSFUL,
						status: httpStatusCode.bad_request.status,
					}
				}
				// Store the fetched user details
				const userDetails = userResponse.data

				// Check if meta is present and not empty
				if (userDetails.meta && Object.keys(userDetails.meta).length > 0) {
					const locationIds = await this.extractLocationIdsFromMeta(userDetails.meta)

					if (locationIds.length < 0) {
						throw {
							message: messageConstants.common.STATUS_FAILURE,
							status: httpStatusCode.bad_request.status,
						}
					}
					// Construct the filter for querying entity documents using the $in operator
					const filterData = {
						_id: {
							$in: locationIds,
						},
					}
					// Define the fields to be projected in the entity documents
					const projection = ['_id', 'metaInformation.name', 'metaInformation.externalId']
					// Use the entityDocuments function to fetch entity details
					const response = await entityManagementService.entityDocuments(filterData, projection)

					// Check if the response is successful and has data
					const entityDetails = response.data
					if (!entityDetails || entityDetails.length < 0) {
						throw {
							message: messageConstants.common.STATUS_FAILURE,
							status: httpStatusCode.bad_request.status,
						}
					}

					// Process the user details to replace meta data with entity details
					const processedResponse = await this.processUserDetailsResponse(userDetails, entityDetails)

					return resolve(processedResponse)
				} else {
					delete userDetails.location // Remove location key from userDetails
					return resolve(userDetails)
				}
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

	/**
	 * Extracts location IDs from the meta information.
	 * @param {Object} meta - Meta information containing location IDs.
	 * @returns {Array} - An array of location IDs.
	 */
	static async extractLocationIdsFromMeta(meta) {
		const locationIds = []
		for (const key in meta) {
			if (Array.isArray(meta[key])) {
				// If the meta value is an array, add all elements to locationIds
				locationIds.push(...meta[key])
			} else if (typeof meta[key] === 'string') {
				// If the meta value is a string, add it to locationIds
				locationIds.push(meta[key])
			}
		}
		return locationIds
	}

	/**
	 * Replaces meta information in user details with actual entity details.
	 * @param {Object} userDetails - User details containing meta information.
	 * @param {Array} entityDetails - Array of entity details.
	 * @returns {Object} - Updated user details with entity information.
	 */
	static async processUserDetailsResponse(userDetails, entityDetails) {
		// Get all keys from the meta object in userDetails
		const metaKeys = Object.keys(userDetails.meta)
		// Loop through each key in the meta object
		for (const key of metaKeys) {
			// Get the IDs associated with the current meta key
			const ids = userDetails.meta[key]
			// Check if the meta value is an array of IDs
			if (Array.isArray(ids)) {
				// Replace each ID in the array with the corresponding entity details
				userDetails[key] = ids.map((id) => {
					// Find the entity that matches the current ID
					const entity = entityDetails.find((entity) => entity._id === id)
					// Return the formatted entity details or a placeholder if not found
					return entity
						? {
								value: entity._id,
								label: entity.metaInformation.name,
								externalId: entity.metaInformation.externalId,
						  }
						: { value: id, label: 'Unknown', externalId: 'Unknown' }
				})
			} else if (typeof ids === 'string') {
				// If the meta value is a string, replace it with entity details
				const entity = entityDetails.find((entity) => entity._id === ids)
				// Update the userDetails with the formatted entity details or a placeholder if not found
				userDetails[key] = entity
					? {
							value: entity._id,
							label: entity.metaInformation.name,
							externalId: entity.metaInformation.externalId,
					  }
					: { value: ids, label: 'Unknown', externalId: 'Unknown' }
			}
		}
		// Clear meta information and remove location field
		userDetails.meta = {}
		delete userDetails.location
		return userDetails
	}
}