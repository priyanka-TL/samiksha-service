/**
 * name : staticLinksController.js
 * author : Akash
 * created-date : 26-mar-2019
 * Description : Static links related information.
 */

// Dependencies
const staticLinksHelper = require(MODULES_BASE_PATH + "/staticLinks/helper")
const v1StaticLinks = require(ROOT_PATH + "/controllers/v1/staticLinksController");

/**
    * StaticLinks
    * @class
*/
module.exports = class StaticLinks extends v1StaticLinks {

  /**
  * @api {get} /assessment/api/v2/staticLinks/list Static Link list
  * @apiVersion 1.0.0
  * @apiName Static Link list
  * @apiGroup Static Links
  * @apiHeader {String} X-authenticated-user-token Authenticity token
  * @apiSampleRequest /assessment/api/v2/staticLinks/list
  * @apiParamExample {json} Response:
  * {
    "message": "Static Links fetched successfully.",
    "status": 200,
    "result": {
        "privacyPolicy": {
            "_id": "5d259439a9bc1209d0184390",
            "value": "privacyPolicy",
            "link": "https://shikshalokam.org/wp-content/uploads/2019/01/data_privacy_policy.html",
            "title": "Privacy Policy"
        },
        "faq": {
            "_id": "5d259439a9bc1209d0184392",
            "value": "faq",
            "link": "",
            "title": "FAQ"
        },
        "tutorial-video": {
            "_id": "5e7c5cacf67cd8715381299f",
            "value": "tutorial-video",
            "link": "",
            "title": "Tutorial Video",
            "metaInformation": {
                "videos": [
                    {
                        "value": "video1",
                        "title": "How to create observations and see reports?",
                        "link": "https://youtu.be/ovqDe_G7ct8"
                    }
                ]
            }
        }
    }
  }
  * @apiUse successBody
  * @apiUse errorBody
  */

    /**
   * List static links.
   * @method
   * @name list
   * @returns {Array} List of all static links. 
   */

  list(req) {
    return new Promise(async (resolve, reject) => {

      try {

        let result = await staticLinksHelper.list(
          req.headers.apptype,
          req.headers.appname,
          messageConstants.common.VERSION_2
        );

        return resolve(result);

      } catch (error) {

        return reject({
          status: error.status || httpStatusCode.internal_server_error.status,
          message: error.message || httpStatusCode.internal_server_error.message,
          errorObject: error
        })

      }


    })
  }

};
