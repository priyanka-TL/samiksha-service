/**
 * name : userExtension.js
 * author : Saish
 * created-date : 16-Jun-2025
 * Description : userExtension helper for DB interactions.
 */

// Dependencies

/**
 * Solutions
 * @class
 */

module.exports = class userExtension {
    /**
     * find userExtension .
     * @method
     * @name userExtensionDocuments
     * @param {Object} [filterData = "all"] - userExtension filter query.
     * @param {Array} [fieldsArray = "all"] - projected fields.
     * @param {Array} [skipFields = "none"] - field not to include
     * @returns {Array} userExtension details.
     */
  
    static userExtensionDocuments(filterData = 'all', fieldsArray = 'all', skipFields = 'none') {
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

          let userExtensionDoc = await database.models.userExtension.find(queryObject, projection).lean();
  
          return resolve(userExtensionDoc);
        } catch (error) {
          return reject(error);
        }
      });
    }
  
    /**
     * findOne userExtension .
     * @method
     * @name findOne
     * @param {Object} [filterData = "all"]  - match query.
     * @param {Array} [fieldsArray = "all"]  - projection details.
     * @returns {Array}                      -userExtensions details.
     */
  
    static findOne(filterData = 'all', fieldsArray) {
      return new Promise(async (resolve, reject) => {
        try {
          let queryObject = filterData != 'all' ? filterData : {};
          let userExtensionDoc = await database.models.userExtension.findOne(queryObject, fieldsArray);
  
          return resolve(userExtensionDoc);
        } catch (error) {
          return reject(error);
        }
      });
    }
  
    /**
     * Update UserExtension document.
     * @method
     * @name updateUserExtensionDocument
     * @param {Object} query        - query to find document
     * @param {Object} updateObject - fields to update
     * @param {Object} returnData   - Options for the update operation, default is { new: false }
     * @returns {Promise<Object>}   - The updated document 
     * 
     */
  
    static updateUserExtensionDocument(query = {}, updateObject = {}, returnData = { new: false }) {
      return new Promise(async (resolve, reject) => {
        try {
          if (Object.keys(query).length == 0) {
            throw new Error(messageConstants.apiResponses.UPDATE_QUERY_REQUIRED);
          }
  
          if (Object.keys(updateObject).length == 0) {
            throw new Error(messageConstants.apiResponses.UPDATE_OBJECT_REQUIRED);
          }
  
          let updateResponse = await database.models.userExtension.findOneAndUpdate(query, updateObject, returnData).lean();
  
          return resolve(updateResponse);
        } catch (error) {
          return reject(error);
        }
      });
    }
  
    /**
     * find userExtension documents with aggregation.
     * @method
     * @name getAggregate
     * @param {Array} query - aggregation query.
     * @returns {Array} List of userExtension documents with aggregation..
     */
  
    static getAggregate(query = []) {
      return new Promise(async (resolve, reject) => {
        try {
            let userExtensionDocs = await database.models.userExtension.aggregate(query);
          return resolve(userExtensionDocs);
        } catch (error) {
          return reject(error);
        }
      });
    }
  
    /**
     * create userExtensions
     * @method
     * @name createUserExtensionDocument
     * @param {Object} userExtensionData - userExtension data.
     * @returns {Object} userExtension object.
     */
    static createUserExtensionDocument(userExtensionData) {
      return new Promise(async (resolve, reject) => {
        try {
          let userExtensionDocument = await database.models.userExtension.create(userExtensionData);
  
          return resolve(userExtensionDocument);
        } catch (error) {
          return reject(error);
        }
      });
    }
  
  };
  