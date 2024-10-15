/**
 * name         : configurations.js
 * author       : Saish
 * created-date : 15-OCT-2024
 * Description  : Configuration Related DB interations
 */

// Dependencies
/**
 * Configurations
 * @class
 */

module.exports = class Configurations {
	/**
	 * create or update configurations.
	 * @method
	 * @name update
	 * @param {String} [Code]   - Collection name.
	 * @param  {array} [data]   - Data to update/create the entry
	 * @returns {cursorObject}  - Configuration details.
	 */

	static createOrUpdate(code, profileKeys) {
		return new Promise(async (resolve, reject) => {
			try {
				// Use findOneAndUpdate for atomic upsert operation
				const updatedConfig = await database.models.configurations.findOneAndUpdate(
					{ code: code }, // Filter
					{
						$addToSet: { 'meta.profileKeys': { $each: profileKeys } }, // Add keys, ensuring no duplicates
					},
					{
						new: true, // Return the updated document
						upsert: true, // Create the document if it doesn't exist
					}
				)
				return resolve(updatedConfig)
			} catch (error) {
				throw error
			}
		})
	}

	/**
	 * find configuration documents.
	 * @method
	 * @name update
	 * @param {JSON} filterData     - Configuration filter query.
	 * @param {JSON} fieldsArray    - Projection fields.
	 * @returns {JSON}              - Configuration documents details.
	 */

	static findDocument(filterData, fieldsArray = []) {
		return new Promise(async (resolve, reject) => {
			try {
                console.log(filterData, fieldsArray,'filterData, fieldsArray')
				let configurationDetails = await database.models.configurations.find(filterData, fieldsArray).lean()
				return resolve(configurationDetails)
			} catch (error) {
				return reject(error)
			}
		})
	}
}