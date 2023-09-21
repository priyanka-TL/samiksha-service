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
};
