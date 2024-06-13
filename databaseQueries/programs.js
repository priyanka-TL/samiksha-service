/**
 * name : programs.js
 * author : Praveen
 * created-date : 13-June-2024
 * Description : program helper for DB interactions.
 */

// Dependencies 

/**
    * Programs
    * @class
*/



module.exports= class Programs{
   /**
   * Programs Document.
   * @method
   * @name programDocuments
   * @param {Array} [filterQuery = "all"] - solution ids.
   * @param {Array} [fieldsArray = "all"] - projected fields.
   * @param {Array} [skipFields = "none"] - field not to include.
   * @param {Number} pageNo - page no.
   * @param {Number} pageSize - page size.
   * @returns {Array} List of programs.
   */

  static programDocuments(filterQuery = 'all', fieldsArray = 'all', skipFields = 'none', pageNo = '', pageSize = '') {
    return new Promise(async (resolve, reject) => {
      try {
        let queryObject = filterQuery != 'all' ? filterQuery : {};

        let projection = {};
        let pagination = {};
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
        if (pageNo !== '' && pageSize !== '') {
          pagination = {
            skip: pageSize * (pageNo - 1),
            limit: pageSize,
          };
        }

        let programData = await database.models.programs.find(queryObject, projection, pagination).lean();

        return resolve(programData);
      } catch (error) {
        return reject(error);
      }
    });
  }


    /**
     * find and update.
     * @method
     * @name findOneAndUpdate
     * @param {Array} [filterData = "all"] - programs filter query.
     * @param {Array} [setData = {}] - set fields.
     * @param {Array} [returnData = true/false] - returnData
     * @returns {Array} program details.
     */

   static findOneAndUpdate(
    filterData = "all", 
    setData ,
    returnData={new:false}
   ){
    return new Promise(async (resolve, reject) => {
        try{
            let queryObject = (filterData != "all") ? filterData : {};

            let updatedData = await database.models.programs.findOneAndUpdate(
                queryObject,
                setData,
                returnData
            ).lean();

            return resolve(updatedData)

        }catch (error) {
            return reject(error);
        }
    })

   }



    /**
     * aggregate function.
     * @method
     * @name getAggregate
     * @param {Array} [matchQuery = []] - matchQuerry array
     * @returns {Array} program details.
     */


   static getAggregate(
    matchQuery
   ){
    return new Promise(async (resolve, reject) => {
        try{

            let aggregatedData = await database.models.programs.aggregate(
                matchQuery
            )
            return resolve(aggregatedData)

        }catch (error) {
            return reject(error);
        }
    })

   }


    /**
     * listIndexes function.
     * @method
     * @name listIndexes
     * @returns {Array} list of indexes.
     */


    static listIndexesFunc(
    ){
        return new Promise(async (resolve, reject) => {
            try{

                let indexData = await database.models.programs.listIndexes();

                return resolve(indexData)

            }catch (error) {
                return reject(error);
            }
        })

    }



    /**
     * create function.
     * @method
     * @name createProgram
     * @returns {Object} created program.
     */


    static createProgram(
        programData
        ){
        return new Promise(async (resolve, reject) => {
            try{
    
                let program = await database.models.programs.create(programData);
    
                return resolve(program)
    
            }catch (error) {
                return reject(error);
            }
        })
    
    }
}