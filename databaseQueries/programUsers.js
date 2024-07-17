/**
 * name : programUsers.js
 * author : Praveen
 * created-date : 13-June-2024
 * Description : program users helper for DB interactions.
 */

module.exports = class programUsers {

    /**
      * program users details.
      * @method
      * @name programUsersDocument
      * @param {Array} [filterData = "all"] - program users filter query.
      * @param {Array} [fieldsArray = "all"] - projected fields.
      * @param {Array} [skipFields = "none"] - field not to include
      * @returns {Array} program users details.
     */
     
   static programUsersDocument(
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
            });
        }
 
         let programJoinedData = await database.models.programUsers
           .find(queryObject, projection)
           .lean();
         return resolve(programJoinedData);
       } catch (error) {
         return reject(error);
       }
     });
   }
  
   /**
   * Update programUsers document.
   * @method
   * @name updateProgramUserDocument
   * @param {Object} query        - query to find document
   * @param {Object} updateObject - fields to update
   * @param {Object} returnData   - Options for the update operation, default is { new: false }
   * @returns {Promise<Object>}   - The updated document 
   * 
   */

  static updateProgramUserDocument(query = {}, updateObject = {}, returnData = { new: false }) {
    return new Promise(async (resolve, reject) => {
      try {
        if (Object.keys(query).length == 0) {
          throw new Error(messageConstants.apiResponses.UPDATE_QUERY_REQUIRED);
        }

        if (Object.keys(updateObject).length == 0) {
          throw new Error(messageConstants.apiResponses.UPDATE_OBJECT_REQUIRED);
        }

        let updateResponse = await database.models.programUsers.findOneAndUpdate(query, updateObject, returnData).lean();

        return resolve(updateResponse);
      } catch (error) {
        return reject(error);
      }
    });
  }
 };