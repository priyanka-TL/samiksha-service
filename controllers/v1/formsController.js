/**
 * name : formsController.js
 * author : Akash
 * created-date : 22-Nov-2018
 * Description : All forms related information.
 */

// Dependencies

const formsHelper = require(MODULES_BASE_PATH + '/forms/helper');

/**
 * Forms
 * @class
 */
module.exports = class Forms extends Abstract {
  constructor() {
    super(formsSchema);
  }

  static get name() {
    return 'forms';
  }

  /**
   * @api {post} /assessment/api/v1/forms/find
   * Find forms.
   * @apiVersion 0.0.1
   * @apiName Find forms.
   * @apiGroup Forms
   * @apiHeader {String} X-authenticated-user-token Authenticity token
   * @apiParamExample {json} Request-Body:
   * {
    "query" : {
        "name" : "projects"
    },
    "projection" : ["value"]
    }
   * @apiSampleRequest /assessment/api/v1/forms/find
   * @apiUse successBody
   * @apiUse errorBody
   * @apiParamExample {json} Response: 
   * {
   * "status": 200,
    "result": [
    {
        "field" : "title",
        "label" : "Title",
        "value" : "",
        "visible" : true,
        "editable" : true,
        "input" : "text",
        "validation" : {
            "required" : true
        }
    },
    {
        "field" : "description",
        "label" : "Description",
        "value" : "",
        "visible" : true,
        "editable" : true,
        "input" : "textarea",
        "validation" : {
            "required" : true
        }
    },
    {
        "field" : "categories",
        "label" : "Categories",
        "value" : "",
        "visible" : true,
        "editable" : true,
        "input" : "select",
        "options" : [],
        "validation" : {
            "required" : false
        }
    }
  ]
    }
   */

  /**
   * Find forms.
   * @method
   * @name find
   * @param {Object} req - Requested data.
   * @param {Object} req.body.query - Filtered data.
   * @param {Array} req.body.projection - Projected data.
   * @param {Array} req.body.skipFields - Field to skip.
   * @returns {JSON} Find solutions data.
   */

  async find(req) {
    return new Promise(async (resolve, reject) => {
      try {
        let formsData = await formsHelper.formDocuments(req.body.query, req.body.projection, req.body.skipFields);

        return resolve({
          message: messageConstants.apiResponses.FORMS_FETCHED,
          result: formsData,
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
