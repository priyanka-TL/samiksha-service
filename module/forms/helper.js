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

module.exports = class FormsHelper {
 /**
   * List of forms
   * @method
   * @name formDocuments
   * @param {Object} filterData - filter form data.
   * @param {Array} fieldsArray - projected field.
   * @param {Array} skipFields - field to be skip.
   * @returns {Array} List of forms. 
   */
  
  static formDocuments(
    filterData = "all", 
    fieldsArray = "all",
    skipFields = "none"
  ) {
    return new Promise(async (resolve, reject) => {
        try {
    
            let queryObject = (filterData != "all") ? filterData : {};
    
            let projection = {}
    
            if (fieldsArray != "all") {
                fieldsArray.forEach(field => {
                    projection[field] = 1;
                });
            }

            if( skipFields !== "none" ) {
              skipFields.forEach(field=>{
                projection[field] = 0;
              })
            }
    
            let formDocuments = 
            await database.models.forms.find(
              queryObject, 
              projection
            ).lean();
            
            return resolve(formDocuments);
            
        } catch (error) {
            return reject(error);
        }
    });
  }
}