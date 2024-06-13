/**
 * name : solutions.js
 * author : Praveen
 * created-date : 13-Jun-2024
 * Description : solutions helper for DB interactions.
 */

// Dependencies

/**
 * Solutions
 * @class
 */

module.exports = class Solutions {
  /**
   * find Solution .
   * @method
   * @name solutionDocuments
   * @param {Array} [filterData = "all"] - solutions filter query.
   * @param {Array} [fieldsArray = "all"] - projected fields.
   * @param {Array} [skipFields = "none"] - field not to include
   * @returns {Array} solutions details.
   */

  static solutionDocuments(filterData = 'all', fieldsArray = 'all', skipFields = 'none') {
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
        let solutionsDoc = await database.models.solutions.find(queryObject, projection).lean();

        return resolve(solutionsDoc);
      } catch (error) {
        return reject(error);
      }
    });
  }

  /**
   * findOne Solution .
   * @method
   * @name findOne
   * @param {Array} [filterData = "all"] - solutions filter query.
   * @param {Array} [fieldsArray = "all"] - projected fields.
   * @param {Array} [skipFields = "none"] - field not to include
   * @returns {Array} solutions details.
   */

  static findOne(filterData = 'all', fieldsArray) {
    return new Promise(async (resolve, reject) => {
      try {
        let queryObject = filterData != 'all' ? filterData : {};
        let solutionsDoc = await database.models.solutions.findOne(queryObject, fieldsArray);

        return resolve(solutionsDoc);
      } catch (error) {
        return reject(error);
      }
    });
  }

  /**
   * Update solution document.
   * @method
   * @name updateSolutionDocument
   * @param {Object} query - query to find document
   * @param {Object} updateObject - fields to update
   * @returns {String} - message.
   */

  static updateSolutionDocument(query = {}, updateObject = {}, returnData = { new: false }) {
    return new Promise(async (resolve, reject) => {
      try {
        if (Object.keys(query).length == 0) {
          throw new Error(messageConstants.apiResponses.UPDATE_QUERY_REQUIRED);
        }

        if (Object.keys(updateObject).length == 0) {
          throw new Error(messageConstants.apiResponses.UPDATE_OBJECT_REQUIRED);
        }

        let updateResponse = await database.models.solutions.findOneAndUpdate(query, updateObject, returnData).lean();

        return resolve(updateResponse);
      } catch (error) {
        return reject(error);
      }
    });
  }

  /**
   * find solutions
   * @method
   * @name getAggregate
   * @param {Array} query - aggregation query.
   * @returns {Array} List of solutions.
   */

  static getAggregate(query = []) {
    return new Promise(async (resolve, reject) => {
      try {
        let solutionDocuments = await database.models.solutions.aggregate(query);

        return resolve(solutionDocuments);
      } catch (error) {
        return reject(error);
      }
    });
  }

  /**
   * create solutions
   * @method
   * @name createSolution
   * @param {Object} solutionData - solution data.
   * @returns {Object} solution object.
   */
  static createSolution(solutionData) {
    return new Promise(async (resolve, reject) => {
      try {
        let solutionDocument = await database.models.solutions.create(solutionData);

        return resolve(solutionDocument);
      } catch (error) {
        return reject(error);
      }
    });
  }

  /**
   * listIndexes function.
   * @method
   * @name listIndexes
   * @returns {Array} list of indexes.
   */

  static listIndexesFunc() {
    return new Promise(async (resolve, reject) => {
      try {
        let indexData = await database.models.solutions.listIndexes();

        return resolve(indexData);
      } catch (error) {
        return reject(error);
      }
    });
  }
};
