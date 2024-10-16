/**
 * name : admin/helper.js
 * author : Ankit Shahu
 * created-date : 20-09-2023
 * Description : All admin related helper functions.
 */

//Dependencies

/**
 * adminHelper
 * @class
 */


const ConfigurationsHelper = require(MODULES_BASE_PATH+"/configurations/helper");

module.exports = class adminHelper {
  /**
   * List of data based on collection.
   * @method
   * @name list
   * @param {Object} filterQueryObject - filter query data.
   * @param {Object} [projection = {}] - projected data.
   * @returns {Promise} returns a promise.
   */

  static list(
    collection,
    query = 'all',
    fields = 'all',
    skipFields = 'none',
    limitingValue = 100,
    skippingValue = 0,
    sortedData = '',
  ) {
    return new Promise(async (resolve, reject) => {
      try {
        let queryObject = {};

        if (query != 'all') {
          queryObject = query;
        }

        let projectionObject = {};

        if (fields != 'all') {
          fields.forEach((element) => {
            projectionObject[element] = 1;
          });
        }

        if (skipFields != 'none') {
          skipFields.forEach((element) => {
            projectionObject[element] = 0;
          });
        }

        return resolve({
          collection: collection,
          queryObject: queryObject,
          projectionObject: projectionObject,
          limitingValue: limitingValue,
          skippingValue: skippingValue,
        });
      } catch (error) {
        return resolve({
          success: false,
          message: error.message,
          data: false,
        });
      }
    });
  }

  static convertStringToObjectIdInQuery(query, mongoIdKeys) {
    for (let pointerToArray = 0; pointerToArray < mongoIdKeys.length; pointerToArray++) {
      let eachKey = mongoIdKeys[pointerToArray];
      let currentQuery = query[eachKey];

      if (typeof currentQuery === 'string') {
        query[eachKey] = gen.utils.convertStringToObjectId(currentQuery);
      } else if (typeof currentQuery === 'object') {
        let nestedKey = Object.keys(query[eachKey]);
        if (nestedKey) {
          let convertedIds = [];
          nestedKey = nestedKey[0];
          query[eachKey][nestedKey] = gen.utils.arrayIdsTobjectIds(currentQuery[nestedKey]);
        }
      }
    }

    return query;
  }

  /**
   * creates indexes based on collection and keys
   * @method
   * @name list
   * @param {String} collection - name of the collection.
   * @param {Array} [keys] - keys in array to be indexed.
   * @returns {Object} returns a object.
   */
  static async createIndex(collection,keys){
    let presentIndex = await database.models[collection].listIndexes({}, { key: 1 });
    let indexes = presentIndex.map((indexedKeys) => {
      return Object.keys(indexedKeys.key)[0];
    });
    let indexNotPresent = _.differenceWith(keys, indexes);
    if (indexNotPresent.length > 0) {
      indexNotPresent.forEach(async (key) => {
        await database.models.solutions.db.collection(collection).createIndex({ [key]: 1 });
      });

      if (collection === messageConstants.common.SOLUTION_MODEL_NAME) {
        // Filter keys that start with "scope." and extract the part after "scope."
        const scopeKeys = keys
          .filter((key) => key.startsWith('scope.')) // Filter out keys that start with "scope."
          .map((key) => key.split('scope.')[1]) // Extract the part after "scope."
        if (scopeKeys.length > 0) {
           await ConfigurationsHelper.createOrUpdate('keysAllowedForTargeting', scopeKeys)
        }
      }

      return {
        message: messageConstants.apiResponses.KEYS_INDEXED_SUCCESSFULL,
        success: true,
      }

  }else{
    return {
      message: messageConstants.apiResponses.KEYS_ALREADY_INDEXED_SUCCESSFULL,
      success: true,
    }
  }

}
}