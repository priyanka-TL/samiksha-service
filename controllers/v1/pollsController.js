/**
 * name : pollsController.js
 * author : Deepa
 * created-date : 01-Aug-2020
 * Description : Polls information
 */

// Dependencies
const pollsHelper = require(MODULES_BASE_PATH + '/polls/helper');

/**
 * Polls
 * @class
 */
module.exports = class Polls extends Abstract {
  constructor() {
    super(pollsSchema);
  }

  static get name() {
    return 'polls';
  }

  /**
    * @api {get} /assessment/api/v1/polls/metaForm Poll Creation Meta Form
    * @apiVersion 1.0.0
    * @apiName Poll Creation Meta Form
    * @apiGroup Polls
    * @apiHeader {String} X-authenticated-user-token Authenticity token
    * @apiSampleRequest /assessment/api/v1/polls/metaForm
    * @apiUse successBody
    * @apiUse errorBody
    * @apiParamExample {json} Response:
    * {
    * "staus": 200,
    * "message": "Form fetched successfully",
    * "result": [
       {
        field: "name",
        label: "Name of the Poll",
        value: "",
        visible: true,
        editable: true,
        validation: {
          required: true
        },
        input: "text"
      },
      {
        field: "creator",
        label: "Name of the Creator",
        value: "",
        visible: true,
        editable: true,
        validation: {
          required: true
        },
        input: "text"
      },
      {
        field: "endDate",
        label: "End Date",
        value: 1,
        visible: true,
        editable: true,
        validation: {
          required: true
        },
         input: "radio",
         options: [
          {
            value : 1,
            label : "one day"
          },
          {
            value : 2,
            label : "two days"
          },
          {
            value : 3,
            label : "three days"
          },
          {
            value : 4,
            label : "four days"
          },
          {
            value : 5,
            label : "five days"
          },
          {
            value : 6,
            label : "six days"
          },
          {
            value : 7,
            label : "seven days"
          }
        ]
      },
      {
        field : "question",
        label : "Question",
        value : "",
        visible : true,
        editable : true,
        validation : {
          required : true
        },
        input : "text"
      }
    ]
    }
    */

  /**
   * Poll Creation Meta Form
   * @method
   * @name metaForm
   * @param {Object} req -request Data.
   * @returns {JSON} - Poll Creation Meta Form.
   */

  async metaForm(req) {
    return new Promise(async (resolve, reject) => {
      try {
        let pollCreationForm = await pollsHelper.metaForm();

        return resolve({
          message: pollCreationForm.message,
          result: pollCreationForm.data,
        });
      } catch (error) {
        return reject({
          status: error.status || httpStatusCode.internal_server_error.status,
          message: error.message || httpStatusCode.internal_server_error.message,
          errorObject: error,
        });
      }
    });
  }

  /**
     * @api {post} /assessment/api/v1/polls/create Create Poll
     * @apiVersion 1.0.0
     * @apiName Create Poll
     * @apiGroup Polls
     * @apiHeader {String} X-authenticated-user-token Authenticity token
     * @apiSampleRequest /assessment/api/v1/polls/create
     * @apiParamExample {json} Request-Body:
     * {
     *   "name": "Feedback",
     *   "creator": "deepa",
         "questions": [{
             "question": "Which app do you use the most ?",
             "responseType": "radio",
             "options": [{ "value": "","label":"samiksha"},
                         { "value": "","label":"unnati"},
                         { "value": "","label":"bodh"}] 
         }],
          "endDate": 2,
          "metaInformation": {}
     * }
     * @apiParamExample {json} Response:
     * { 
     *  "status": 200,
     *  "message": "Poll created successfully",
     *  "result": {
     *      "link": "https://dev.apps.shikshalokam.org/samiksha/take-poll/b8bdd9b22b2571a425ea535f5ac84b72"
     *   }
     * }
     * @apiUse successBody
     * @apiUse errorBody
     */

  /**
   * Create Poll
   * @method
   * @name create
   * @param {Object} req - request Data.
   * @param req.body - poll creation  object
   * @returns {String} - Sharable link.
   */

  create(req) {
    return new Promise(async (resolve, reject) => {
      try {
        let createDocument = await pollsHelper.create(req.body, req.userDetails.userId, req.headers['appname']);

        return resolve({
          message: createDocument.message,
          result: createDocument.data,
        });
      } catch (error) {
        return reject({
          status: error.status || httpStatusCode.internal_server_error.status,
          message: error.message || httpStatusCode.internal_server_error.message,
          errorObject: error,
        });
      }
    });
  }

  /**
   * @api {get} /assessment/api/v1/polls/list List polls
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
   * List active polls.
   * @method
   * @name list
   * @param {Object} req -request Data.
   * @returns {JSON} - active polls list.
   */

  list(req) {
    return new Promise(async (resolve, reject) => {
      try {
        let pollsList = await pollsHelper.list(req.userDetails.userId);

        return resolve({
          message: pollsList.message,
          result: pollsList.data,
        });
      } catch (error) {
        return reject({
          status: error.status || httpStatusCode.internal_server_error.status,
          message: error.message || httpStatusCode.internal_server_error.message,
          errorObject: error,
        });
      }
    });
  }

  /**
   * @api {get} /assessment/api/v1/polls/delete/:pollId Delete an poll
   * @apiVersion 1.0.0
   * @apiName Delete an poll
   * @apiGroup Polls
   * @apiHeader {String} X-authenticated-user-token Authenticity token
   * @apiSampleRequest /assessment/api/v1/polls/delete/5b98fa069f664f7e1ae7498c
   * @apiParamExample {json} Response:
   * {
   *  "status": 200,
   *  "message": "Poll deleted successfully"
   * }
   * @apiUse successBody
   * @apiUse errorBody
   */

  /**
   * Delete poll.
   * @method
   * @name delete
   * @param {Object} req -request Data.
   * @param {String} req.params._id - pollId.
   * @returns {String} - message
   */

  delete(req) {
    return new Promise(async (resolve, reject) => {
      try {
        let result = await pollsHelper.delete(req.params._id, req.userDetails.userId);

        return resolve({
          message: result.message,
        });
      } catch (error) {
        return reject({
          status: error.status || httpStatusCode.internal_server_error.status,
          message: error.message || httpStatusCode.internal_server_error.message,
          errorObject: error,
        });
      }
    });
  }

  /**
     * @api {get} /assessment/api/v1/polls/getPollQuestions/:pollId Get the poll questions
     * @apiVersion 1.0.0
     * @apiName Get the poll questions
     * @apiGroup Polls
     * @apiHeader {String} X-authenticated-user-token Authenticity token
     * @apiSampleRequest /assessment/api/v1/polls/getpollQuestions/5f2bcc04456a2a770c4a5f3b
     * @apiParamExample {json} Response:
     * {
     *  "status": 200,
     *  "message": "Poll questions fetched successfully",
     *  "result": {
            "questions": [{
               "qid": "0c59eb10-e5cc-11ea-bd85-039b643a3785",
               "question": "Which app do you use the most?",
               "responseType": "radio",
               "options": [{ "value": "","label":"samiksha"},
                           { "value": "","label":"unnati"},
                           { "value": "","label":"bodh"}] 
            }],
            "pollLink": "https://dev.apps.shikshalokam.org/samiksha/take-poll/b8bdd9b22b2571a425ea535f5ac84b72"
        }
     * }
     * @apiUse successBody
     * @apiUse errorBody
     */

  /**
   * Get the poll questions
   * @method
   * @name getPollQuestions
   * @param {Object} req -request Data.
   * @param {String} req.params._id - pollId.
   * @returns {JSON} - poll questions and options
   */

  getPollQuestions(req) {
    return new Promise(async (resolve, reject) => {
      try {
        let pollQuestions = await pollsHelper.getPollQuestions(req.params._id, req.headers['appname']);

        return resolve({
          message: pollQuestions.message,
          result: pollQuestions.data,
        });
      } catch (error) {
        return reject({
          status: error.status || httpStatusCode.internal_server_error.status,
          message: error.message || httpStatusCode.internal_server_error.message,
          errorObject: error,
        });
      }
    });
  }

  /**
     * @api {get} /assessment/api/v1/polls/getPollQuestionsByLink/:link Get the poll questions by link
     * @apiVersion 1.0.0
     * @apiName Get the poll questions by link
     * @apiGroup Polls
     * @apiHeader {String} X-authenticated-user-token Authenticity token
     * @apiSampleRequest /assessment/api/v1/polls/getpollQuestionsByLink/392f95246771664a81335f1be7d109f3
     * @apiParamExample {json} Response:
     * {
     *  "status": 200,
     *  "message": "Poll questions fetched successfully",
     *  "result": {
     *      "questions": [{
               "qid": "0c59eb10-e5cc-11ea-bd85-039b643a3785",
               "question": "Which app do you use the most?",
               "responseType": "radio",
               "options": [{ "value": "","label":"samiksha"},
                         { "value": "","label":"unnati"},
                         { "value": "","label":"bodh"}] 
            }],
            "pollId" : "5f4fb7e0c6934f216f74f8d1",
            "submissionId": "5b4fb7e0c6934f216f74f7e8"
        }
     * }
     * @apiUse successBody
     * @apiUse errorBody
     */

  /**
   * Get the poll questions by link
   * @method
   * @name getPollQuestionsByLink
   * @param {Object} req -request Data.
   * @param {String} req.params._id - link.
   * @returns {JSON} - poll questions and options
   */

  getPollQuestionsByLink(req) {
    return new Promise(async (resolve, reject) => {
      try {
        let pollQuestions = await pollsHelper.getPollQuestionsByLink(req.params._id, req.userDetails.userId);

        return resolve({
          message: pollQuestions.message,
          result: pollQuestions.data,
        });
      } catch (error) {
        return reject({
          status: error.status || httpStatusCode.internal_server_error.status,
          message: error.message || httpStatusCode.internal_server_error.message,
          errorObject: error,
        });
      }
    });
  }

  /**
     * @api {get} /assessment/api/v1/polls/report/:pollId Poll Report
     * @apiVersion 1.0.0
     * @apiName Poll Report
     * @apiGroup Polls
     * @apiHeader {String} X-authenticated-user-token Authenticity token
     * @apiSampleRequest /assessment/api/v1/polls/report/5f2bcc04456a2a770c4a5f3b
     * @apiParamExample {json} Response:
     * {
       "message": "Poll report created successfully",
       "status": 200,
       "result": [
        {
            "chart": {
                "type": "bar"
            },
            "title": {},
            "accessibility": {
                "announceNewData": {
                    "enabled": false
                }
            },
            "xAxis": {
                "type": "category"
            },
            "legend": {
                "enabled": false
            },
            "credits": {
                "enabled": false
            },
            "plotOptions": {
                "series": {
                    "borderWidth": 0,
                    "dataLabels": {
                        "enabled": true,
                        "format": "{point.y:.1f}%"
                    }
                }
            },
            "series": [
                {
                    "colorByPoint": true,
                    "data": [
                        {
                            "name": "Samiksha",
                            "y": 100
                        }
                    ]
                }
            ]
        }
    ]
}
     * @apiUse successBody
     * @apiUse errorBody
     */

  /**
   * Poll Report
   * @method
   * @name report
   * @param {Object} req - request Data.
   * @param {String} req.params._id - pollId
   * @returns {JSON} - poll report data
   */

  report(req) {
    return new Promise(async (resolve, reject) => {
      try {
        let pollReport = await pollsHelper.report(req.params._id);

        return resolve({
          message: pollReport.message,
          result: pollReport.data,
        });
      } catch (error) {
        return reject({
          status: error.status || httpStatusCode.internal_server_error.status,
          message: error.message || httpStatusCode.internal_server_error.message,
          errorObject: error,
        });
      }
    });
  }
};
