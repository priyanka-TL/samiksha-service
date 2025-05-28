/**
 * name : criteriaController.js
 * author : Akash
 * created-date : 22-Nov-2018
 * Description : Criteria related information.
 */

// Dependencies
const csv = require('csvtojson');
const FileStream = require(ROOT_PATH + '/generics/fileStream');
const criteriaHelper = require(MODULES_BASE_PATH + '/criteria/helper');

/**
 * Criteria
 * @class
 */
module.exports = class Criteria extends Abstract {
  constructor() {
    super(criteriaSchema);
  }

  static get name() {
    return 'criteria';
  }

  /**
   * @api {post} /assessment/api/v1/criteria/upload Upload Criteria CSV
   * @apiVersion 1.0.0
   * @apiName Upload Criteria CSV
   * @apiGroup Criteria
   * @apiParam {File} criteria Mandatory criteria file of type CSV.
   * @apiUse successBody
   * @apiUse errorBody
   */

  /**
   * Insert bulk criteria.
   * @method
   * @name upload
   * @param {Object} req - All requested Data.
   * @param {Object} req.files - requested files.
   * @returns {CSV} A CSV with name Criteria-Upload is saved inside
   * public/reports/currentDate
   */

  async upload(req) {
    return new Promise(async (resolve, reject) => {
      try {
        let tenantFilter = req.userDetails.tenantAndOrgInfo
        if (!req.files || !req.files.criteria) {
          throw messageConstants.apiResponses.CRITERIA_FILE_NOT_FOUND;
        }

        let criteriaData = await csv().fromString(req.files.criteria.data.toString());

        const fileName = `Criteria-Upload`;
        let fileStream = new FileStream(fileName);
        let input = fileStream.initStream();

        (async function () {
          await fileStream.getProcessorPromise();
          return resolve({
            isResponseAStream: true,
            fileNameWithPath: fileStream.fileNameWithPath(),
          });
        })();

        let updatedCriteria = await criteriaHelper.upload(criteriaData, req.userDetails.id, req.userDetails.userToken,tenantFilter);

        if (updatedCriteria.length > 0) {
          updatedCriteria.forEach((criteria) => {
            input.push(criteria);
          });
        }

        input.push(null);
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
   * @api {post} /assessment/api/v1/criteria/create Create Questions
   * @apiVersion 1.0.0
   * @apiName Create criteria
   * @apiGroup Criteria
   * @apiUse successBody
   * @apiUse errorBody
   */

  /**
   * create criteria.
   * @method
   * @name create
   * @param {Object} req - requested data.
   * @param {Object} req.body - requested body data.
   * @returns {Object}
   */

  create(req) {
    return new Promise(async (resolve, reject) => {
      try {
        let tenantData = req.userDetails.tenantAndOrgInfo
        const bodyData = {
          ...req.body,
          tenantId: tenantData.tenantId,
          orgId: tenantData.orgId[0],
        };
        let criteriaDocuments = await criteriaHelper.create(bodyData);
        return resolve({
          result: criteriaDocuments,
        });
      } catch (error) {
        reject({
          message: error,
        });
      }
    });
  }

  /**
   * @api {post} /assessment/api/v1/criteria/update?externalId=:criteriaExternalId&frameworkIdExists=:FrameworkIdExists Create Questions 
   * @apiVersion 1.0.0
   * @apiName Update criteria
   * @apiGroup Criteria
   * @apiSampleRequest /assessment/api/v1/criteria/update?externalId=SS/I/a2&frameworkIdExists=true
   * @apiUse successBody
   * @apiUse errorBody
   * @apiParamExample {json} Request-Body:
   * {
   * "name" : "Construction,Potholes and Electricity "
   * }
   * @apiParamExample {json} Response:
   * {
    "message": "Criteria updated successfully",
    "status": 200
    }
   */

  /**
   * Update criteria.
   * @method
   * @name create
   * @param {Object} req - requested data.
   * @param {Object} req.query.externalId - criteria id.
   * @param {Object} req.query.frameworkIdExists - framework criteria or not.
   * @param {Object} req.body - requested criteria update data.
   * @returns {Object}
   */

  async update(req) {
    return new Promise(async (resolve, reject) => {
      try {
        let tenantData = req.userDetails.tenantAndOrgInfo
        let criteriaData = await criteriaHelper.update(
          req.query.externalId,
          req.query.frameworkIdExists ? Boolean(req.query.frameworkIdExists) : false,
          req.body,
          req.userDetails.id,
          tenantData
        );

        return resolve(criteriaData);
      } catch (error) {
        reject({
          status: error.status || httpStatusCode.internal_server_error.status,
          message: error.message || httpStatusCode.internal_server_error.message,
          errorObject: error,
        });
      }
    });
  }
};
