/**
 * name : sharedLinksController.js
 * author : Akash
 * created-date : 22-feb-2019
 * Description : Shared links related information.
 */

// Dependencies
const {v4:uuid} = require('uuid');
/**
 * SharedLink
 * @class
 */
module.exports = class SharedLink extends Abstract {
  constructor() {
    super(sharedLinksSchema);
  }

  static get name() {
    return 'sharedLink';
  }

  /**
   * @api {get} /assessment/api/v1/sharedLinks/generate Create a shared link
   * @apiVersion 1.0.0
   * @apiName Create shared link
   * @apiGroup Shared Links
   * @apiUse successBody
   * @apiUse errorBody
   */

  /**
   * Generate links that can be shared.
   * @method
   * @name generate
   * @param {Object} req - requested data.
   * @param {String} req.body.privateURL - private url.
   * @param {String} req.body.publicURL - public url.
   * @param {String} req.body.reportName - name of the report.
   * @returns {JSON} - consists of link id.
   */

  generate(req) {
    return new Promise(async (resolve, reject) => {
      try {
        if (!req.body.privateURL || !req.body.publicURL || !req.body.reportName) {
          throw { status: httpStatusCode.bad_request.status, message: httpStatusCode.bad_request.message };
        }

        let shareableData;

        let queryParams = req.body.publicURL.includes('?') ? req.body.publicURL.split('?')[1] : '';

        shareableData = await database.models.sharedLink.findOne({
          privateURL: req.body.privateURL,
          publicURL: req.body.publicURL,
          reportName: req.body.reportName,
          queryParams: queryParams,
          'userDetails.id': req.userDetails.id,
          isActive: true,
        });

        if (!shareableData) {
          let linkId = uuid();

          let linkViews = {
            ip: req.headers['x-real-ip'],
            userAgent: req.headers['user-agent'],
            createdAt: new Date(),
          };

          let dataObject = {
            privateURL: req.body.privateURL,
            publicURL: req.body.publicURL,
            linkId: linkId,
            isActive: true,
            reportName: req.body.reportName,
            queryParams: queryParams,
            accessedCount: 0,
            userDetails: _.pick(req.userDetails, [
              'id',
              'accessiblePrograms',
              'allRoles',
              'firstName',
              'lastName',
              'email',
            ]),
            linkViews: [linkViews],
          };

          shareableData = await database.models.sharedLink.create(dataObject);
        }

        return resolve({
          status: httpStatusCode.ok.status,
          result: {
            linkId: shareableData.linkId,
          },
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
   * @api {get} /assessment/api/v1/sharedLinks/verify Create a shared link
   * @apiVersion 1.0.0
   * @apiName Verify shared link
   * @apiGroup Shared Links
   * @apiUse successBody
   * @apiUse errorBody
   */

  /**
   * Generate links that can be shared.
   * @method
   * @name verify
   * @param {Object} req - requested data.
   * @param {String} req.headers.linkid - link id
   * @returns {JSON} - consists of private url,public url and link id.
   */

  verify(req) {
    return new Promise(async (resolve, reject) => {
      try {
        let linkId = req.headers.linkid;

        if (!linkId) {
          throw { status: httpStatusCode.bad_request.status, message: httpStatusCode.bad_request.message };
        }

        let shareableData;

        shareableData = await database.models.sharedLink.findOne({ linkId: linkId, isActive: true }).lean();

        if (!shareableData) {
          throw {
            status: httpStatusCode.bad_request.status,
            message: messageConstants.apiResponses.NO_DATA_FOUND,
          };
        }

        let isChanged = false;

        shareableData.linkViews.forEach((user) => {
          if (user.ip == req.headers['x-real-ip']) {
            isChanged = true;
          }
        });

        if (isChanged == false) {
          shareableData.linkViews.push({
            ip: req.headers['x-real-ip'],
            userAgent: req.headers['user-agent'],
            createdAt: new Date(),
          });
        }

        let updateObject = _.omit(shareableData, ['createdAt']);

        if (isChanged == true) {
          updateObject.accessedCount++;

          shareableData = await database.models.sharedLink.findOneAndUpdate({ linkId: linkId }, updateObject, {
            upsert: true,
            new: true,
            setDefaultsOnInsert: true,
            returnNewDocument: true,
          });
        }

        let publicURL =
          shareableData.publicURL +
          (shareableData.publicURL.includes('?') ? '&' : '?') +
          `linkId=${shareableData.linkId}`;

        return resolve({
          status: httpStatusCode.ok.status,
          result: {
            privateURL: shareableData.privateURL,
            publicURL: publicURL,
            linkId: shareableData.linkId,
          },
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
