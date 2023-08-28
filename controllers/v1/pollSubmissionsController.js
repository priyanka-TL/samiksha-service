/**
 * name : pollSubmissionsController.js
 * author : Deepa
 * created-date : 01-Aug-2020
 * Description : Poll Submissions information
 */

// Dependencies
const pollSubmissionsHelper = require(MODULES_BASE_PATH + "/pollSubmissions/helper");


/**
    * PollSubmissions
    * @class
*/
module.exports = class PollSubmissions extends Abstract {

    constructor() {
        super(pollSubmissionsSchema);
    }

    static get name() {
        return "pollSubmissions";
    }

    /**
     * @api {post} /assessment/api/v1/pollSubmissions/make/:pollId  Submit Poll
     * @apiVersion 1.0.0
     * @apiName Submit Poll
     * @apiGroup Poll Submissions
     * @apiHeader {String} X-authenticated-user-token Authenticity token
     * @apiSampleRequest /assessment/api/v1/pollSubmissions/make/5b98fa069f664f7e1ae7498c
     * @apiParamExample {json} Request-Body:
     * {
     * "0c59eb10-e5cc-11ea-bd85-039b643a3785" : {
         "qid": "0c59eb10-e5cc-11ea-bd85-039b643a3785",
         "question": "Which app do you use the most?",
         "responseType": "radio",
         "value": "R1"
        }
     * }
     * @apiParamExample {json} Response:
     * {
     *  "status": 200,
     *  "message": "Poll submitted successfully"
     * }
     * @apiUse successBody
     * @apiUse errorBody
     */
     
    /**
    * Poll Submission
    * @method
    * @name make
    * @param {Object} req - request Data. 
    * @param {String} req.params._id - pollId
    * @param {Array} req.body - Questions and answers
    * @returns {String} - message
    */

   make(req) {
    return new Promise(async (resolve, reject) => {

        try {

            let pollSubmissionResult = await pollSubmissionsHelper.make(
                req.params._id,
                req.body,
                req.userDetails.userId
            );

            return resolve({
                message: pollSubmissionResult.message
            });

        } catch (error) {

            return reject({
                status: error.status || httpStatusCode.internal_server_error.status,
                message: error.message || httpStatusCode.internal_server_error.message,
                errorObject: error
            });
        }
    })
}
    

     /**
     * @api {get} /assessment/api/v1/pollSubmissions/list List polls
     * @apiVersion 1.0.0
     * @apiName List polls
     * @apiGroup Polls
     * @apiHeader {String} X-authenticated-user-token Authenticity token
     * @apiSampleRequest /assessment/api/v1/polls/list
     * @apiParamExample {json} Response:
     * {
     *  "status": 200,
     *  "message": "Polls list fetched successfully",
     *  "result": [{
     *      "_id": "5f3a72359e156a44ee7565b8",
     *      "name": "Feedback"
     *     }]
     * }
     * @apiUse successBody
     * @apiUse errorBody
     */
     
    /**
    * List created and submitted polls.
    * @method
    * @name list
    * @param {Object} req -request Data. 
    * @returns {JSON} - active polls list.
    */

   list(req) {
    return new Promise(async (resolve, reject) => {

        try {

            let pollsList = await pollSubmissionsHelper.list(
               req.userDetails.userId
            );

            return resolve({
                message: pollsList.message,
                result: pollsList.data
            });

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
