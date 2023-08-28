/**
 * name : searchController.js
 * author : Aman
 * created-date : 03-July-2020
 * Description : All library search related information.
 */

// Dependencies

const librarySearchHelper = require(MODULES_BASE_PATH + "/library/search/helper");

module.exports = class Search {

     /**
    * @api {get} /assessment/api/v1/library/search/solutions?search=:searchText&limit=1&page=1 Search library solutions.
    * @apiVersion 1.0.0
    * @apiName Search library solutions
    * @apiGroup Library solutions
    * @apiSampleRequest /assessment/api/v1/library/search/solutions?search=sl&limit=1&page=1
    * @apiUse successBody
    * @apiUse errorBody
    * @apiParamExample {json} Response:
    * {
    "message": "Library categories fetched successfully",
    "status": 200,
    "result": {
        "data": [
            {
                "_id": "5d15b0d7463d3a6961f91747",
                "externalId": "SL-Shalasiddhi-TEMPLATE",
                "name": "SL-Shalasiddhi",
                "description": "SL-Shalasiddhi"
            }
        ],
        "count": 3
    }
    }
    */

      /**
      * Search library solutions
      * @method
      * @name solutions
      * @returns {JSON} returns a list of searched library solutions.
     */

    async solutions(req) {
        return new Promise(async (resolve, reject) => {
            try {
                
                let librarySolutions = 
                await librarySearchHelper.search(
                    req.searchText,
                    req.pageSize, 
                    req.pageNo
                );

                return resolve(librarySolutions);

            } catch (error) {
                return reject({
                    status: error.status || httpStatusCode.internal_server_error.status,
                    message: error.message || httpStatusCode.internal_server_error.message,
                    errorObject: error
                });
            }
        })
    }
}