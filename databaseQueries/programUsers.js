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
 
 };