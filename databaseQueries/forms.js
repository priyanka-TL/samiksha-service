/**
 * name : forms.js.
 * author : Prajwal.
 * created-date : 08-May-2024.
 * Description : Database queries for Forms.
 */

module.exports = class Forms {
	/**
	 * form details.
	 * @method
	 * @name formDocuments
	 * @param {Object} [filterData = "all"] - forms filter query.
	 * @param {Array} [fieldsArray = "all"] - projected fields.
	 * @param {Array} [skipFields = "none"] - field not to include
	 * @returns {Array} form details.
	 */
	static formDocuments(filterData = 'all', fieldsArray = 'all', skipFields = 'none') {
		return new Promise(async (resolve, reject) => {
			try {
				let queryObject = filterData != 'all' ? filterData : {}

				let projection = {}
				if (fieldsArray != 'all') {
					fieldsArray.map((key) => {
						projection[key] = 1
					})
				}
				if (skipFields != 'none') {
					skipFields.map((key) => {
						projection[key] = 0
					})
				}
				const formDocument = await database.models.forms.find(queryObject, projection).lean()
				return resolve(formDocument)
			} catch (error) {
				return reject(error)
			}
		})
	}

	/**
	 * create form.
	 * @method
	 * @name createForm
	 * @param {Object} [bodyData] - form data.
	 * @returns {Object} newly created form details.
	 */
	static createForm(bodyData) {
		return new Promise(async (resolve, reject) => {
			try {
				let formDocument = await database.models.forms.create(bodyData)
				return resolve(formDocument)
			} catch (error) {
				return reject(error)
			}
		})
	}

	/**
	 * find a form document.
	 * @method
	 * @name findOneForm
	 * @param {Object} [filterData = "all"] - forms filter query.
	 * @param {Array} [fieldsArray = "all"] - projected fields.
	 * @param {Array} [skipFields = "none"] - field not to include.
	 * @returns {Object} form details.
	 */
	static findOneForm(filterData = 'all', fieldsArray = 'all', skipFields = 'none') {
		return new Promise(async (resolve, reject) => {
			try {
				let queryObject = filterData != 'all' ? filterData : {}

				let projection = {}
				if (fieldsArray != 'all') {
					fieldsArray.map((key) => {
						projection[key] = 1
					})
				}
				if (skipFields != 'none') {
					skipFields.map((key) => {
						projection[key] = 0
					})
				}

				const formData = await database.models.forms.findOne(queryObject, projection)
				return resolve(formData)
			} catch (error) {
				return reject(error)
			}
		})
	}

	/**
	 * update a form.
	 * @method
	 * @name updateOneForm
	 * @param {Object} [filterData = "all"] - forms filter query.
	 * @param {Object} setData- fields to be updated.
	 * @param {Object} [returnData = {new : true}] - boolean value true/false to return the updated document or not
	 * @returns {Object} newly created form details.
	 */
	static updateOneForm(filterData = 'all', setData, returnData = { new: false }) {
		return new Promise(async (resolve, reject) => {
			try {
				let queryObject = filterData != 'all' ? filterData : {}
				let updatedData = await database.models.forms.findOneAndUpdate(queryObject, setData, returnData).lean()
				return resolve(updatedData)
			} catch (error) {
				console.log(error)
				return reject(error)
			}
		})
	}
}