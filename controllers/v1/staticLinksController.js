/**
 * name : staticLinksController.js
 * author : Akash
 * created-date : 22-feb-2019
 * Description : Static links related information.
 */

// Dependencies
const csv = require("csvtojson");
const staticLinksHelper = require(MODULES_BASE_PATH + "/staticLinks/helper")
const FileStream = require(ROOT_PATH + "/generics/fileStream");

/**
    * StaticLinks
    * @class
*/
module.exports = class StaticLinks extends Abstract {
  constructor() {
    super(staticLinksSchema);
  }

  static get name() {
    return "staticLinks";
  }

  /**
  * @api {get} /assessment/api/v1/staticLinks/list Static Link list
  * @apiVersion 1.0.0
  * @apiName Static Link list
  * @apiGroup Static Links
  * @apiHeader {String} X-authenticated-user-token Authenticity token
  * @apiSampleRequest /assessment/api/v1/staticLinks/list
  * @apiParamExample {json} Response:
  * "result": [
      {
       "_id": "5d259439a9bc1209d0184390",
       "value": "privacyPolicy",
       "link": "https://shikshalokam.org/wp-content/uploads/2019/01/data_privacy_policy.html",
       "title": "Privacy Policy"
      },
      {
       "_id": "5d259439a9bc1209d0184391",
       "value": "termsOfUse",
       "link": "https://shikshalokam.org/wp-content/uploads/2019/05/Final-ShikshaLokam-Terms-of-Use-MCM-08052019-Clean-copy-1.html",
       "title": "Terms of Use"
      }
    ]
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
          req.headers.appname
        )

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

  /**
  * @api {post} /assessment/api/v1/staticLinks/bulkCreate Upload Static Links Information CSV
  * @apiVersion 1.0.0
  * @apiName Upload Static Links Information CSV
  * @apiGroup Static Links
  * @apiParam {File} staticLinks Mandatory static links file of type CSV.
  * @apiSampleRequest /assessment/api/v1/staticLinks/bulkCreate
  * @apiUse successBody
  * @apiUse errorBody
  */

   /**
   * Create bulk static links via csv.
   * @method
   * @name bulkCreate
   * @param {Object} req - request data.
   * @param {CSV} req.files.staticLinks - static links data. 
   * @returns {CSV} 
   */

  bulkCreate(req) {
    return new Promise(async (resolve, reject) => {

      try {

        let staticLinksCSVData = await csv().fromString(req.files.staticLinks.data.toString());

        if (!staticLinksCSVData || staticLinksCSVData.length < 1) {
          throw messageConstants.apiResponses.FILE_DATA_MISSING;
        }

        let newStaticLinkData = await staticLinksHelper.bulkCreate(staticLinksCSVData, req.userDetails);

        if (newStaticLinkData.length > 0) {

          const fileName = `StaticLink-Upload`;
          let fileStream = new FileStream(fileName);
          let input = fileStream.initStream();

          (async function () {
            await fileStream.getProcessorPromise();
            return resolve({
              isResponseAStream: true,
              fileNameWithPath: fileStream.fileNameWithPath()
            });
          }());

          await Promise.all(newStaticLinkData.map(async staticLink => {
            input.push(staticLink);
          }))

          input.push(null);

        } else {
          throw messageConstants.apiResponses.SOMETHING_WENT_WRONG;
        }

      } catch (error) {

        return reject({
          status: error.status || httpStatusCode.internal_server_error.status,
          message: error.message || httpStatusCode.internal_server_error.message,
          errorObject: error
        })

      }


    })
  }

  /**
  * @api {post} /assessment/api/v1/staticLinks/bulkUpdate Upload Static Links Information CSV
  * @apiVersion 1.0.0
  * @apiName Upload Static Links Information CSV
  * @apiGroup Static Links
  * @apiParam {File} staticLinks     Mandatory static links file of type CSV.
  * @apiSampleRequest /assessment/api/v1/staticLinks/bulkUpdate
  * @apiUse successBody
  * @apiUse errorBody
  */

   /**
   * Upsate bulk static links via csv.
   * @method
   * @name bulkUpdate
   * @param {Object} req - request data.
   * @param {CSV} req.files.staticLinks - static links data. 
   * @returns {CSV} 
   */

  bulkUpdate(req) {
    return new Promise(async (resolve, reject) => {

      try {

        let staticLinksCSVData = await csv().fromString(req.files.staticLinks.data.toString());

        if (!staticLinksCSVData || staticLinksCSVData.length < 1) {
          throw messageConstants.apiResponses.FILE_DATA_MISSING;
        }

        let newStaticLinkData = await staticLinksHelper.bulkUpdate(staticLinksCSVData, req.userDetails);

        if (newStaticLinkData.length > 0) {

          const fileName = `StaticLink-Upload`;
          let fileStream = new FileStream(fileName);
          let input = fileStream.initStream();

          (async function () {
            await fileStream.getProcessorPromise();
            return resolve({
              isResponseAStream: true,
              fileNameWithPath: fileStream.fileNameWithPath()
            });
          }());

          await Promise.all(newStaticLinkData.map(async staticLink => {
            input.push(staticLink);
          }))

          input.push(null);

        } else {
          throw messageConstants.apiResponses.SOMETHING_WENT_WRONG;
        }

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
