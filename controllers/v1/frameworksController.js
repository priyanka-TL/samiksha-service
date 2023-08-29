/**
 * name : frameworksController.js
 * author : Aman
 * created-date : 22-Dec-2018
 * Description : All frameworks related information.
 */

const solutionsHelper = require(MODULES_BASE_PATH + '/solutions/helper');
const frameworksHelper = require(MODULES_BASE_PATH + '/frameworks/helper');
const FileStream = require(ROOT_PATH + '/generics/fileStream');
const csv = require('csvtojson');

/**
 * Frameworks
 * @class
 */
module.exports = class Frameworks extends Abstract {
  constructor() {
    super(frameworksSchema);
  }

  static get name() {
    return 'frameworks';
  }

  /**
   * @api {post} /assessment/api/v1/frameworks/uploadThemes/{frameworkExternalID} Upload Themes For Frameworks
   * @apiVersion 1.0.0
   * @apiName Upload Themes For Frameworks
   * @apiGroup Frameworks
   * @apiParam {File} themes Mandatory file upload with themes data.
   * @apiSampleRequest /assessment/api/v1/frameworks/uploadThemes/EF-DCPCR-2018-001
   * @apiHeader {String} X-authenticated-user-token Authenticity token
   * @apiUse successBody
   * @apiUse errorBody
   */

  /**
   * Upload themes for frameworks.
   * @method
   * @name uploadThemes
   * @param {Object} req -request Data.
   * @param {CSV} req.files.themes - themes csv file.
   * @returns {CSV}
   */

  async uploadThemes(req) {
    return new Promise(async (resolve, reject) => {
      try {
        const fileName = `Theme-Upload-Result`;
        let fileStream = new FileStream(fileName);
        let input = fileStream.initStream();

        (async function () {
          await fileStream.getProcessorPromise();
          return resolve({
            isResponseAStream: true,
            fileNameWithPath: fileStream.fileNameWithPath(),
          });
        })();

        let frameworkDocument = await database.models.frameworks
          .findOne({ externalId: req.params._id }, { _id: 1 })
          .lean();

        if (!frameworkDocument) {
          return resolve({
            status: httpStatusCode.not_found.status,
            message: messageConstants.apiResponses.FRAMEWORK_NOT_FOUND,
          });
        }

        let headerSequence;
        let themes = await csv()
          .fromString(req.files.themes.data.toString())
          .on('header', (headers) => {
            headerSequence = headers;
          });

        let frameworkThemes = await solutionsHelper.uploadTheme(
          'frameworks',
          frameworkDocument._id,
          themes,
          headerSequence,
        );

        for (
          let pointerToFrameworkTheme = 0;
          pointerToFrameworkTheme < frameworkThemes.length;
          pointerToFrameworkTheme++
        ) {
          input.push(frameworkThemes[pointerToFrameworkTheme]);
        }

        input.push(null);
      } catch (error) {
        reject({
          status: error.status || httpStatusCode.internal_server_error.status,
          message: error.message || httpStatusCode.internal_server_error.message,
          errorObject: error,
        });
      }
    });
  }

  /**
   * @api {post} /assessment/api/v1/frameworks/create create Frameworks
   * @apiVersion 1.0.0
   * @apiName create Frameworks
   * @apiGroup Frameworks
   * @apiParam {File} Mandatory framework file of type json.
   * @apiSampleRequest /assessment/api/v1/frameworks/create
   * @apiHeader {String} X-authenticated-user-token Authenticity token
   * @apiUse successBody
   * @apiUse errorBody
   */

  /**
   * Create framework.
   * @method
   * @name create
   * @param {Object} req -request Data.
   * @param {JSON} req.files.framework - framework json files.
   * @returns {JSON} - message and status of framework created.
   */

  async create(req) {
    return new Promise(async (resolve, reject) => {
      try {
        let frameworkData = JSON.parse(req.files.framework.data.toString());

        if (!frameworkData.externalId) {
          throw messageConstants.apiResponses.REQUIRED_FRAMEWORK_EXTERNALID;
        }

        if (!frameworkData.name) {
          throw messageConstants.apiResponses.REQUIRED_FRAMEWORK_NAME;
        }

        if (!frameworkData.description) {
          throw messageConstants.apiResponses.REQUIRED_FRAMEWORK_DESCRIPTION;
        }
        if (!frameworkData.entityType) {
          throw messageConstants.apiResponses.REQUIRED_ENTITY_TYPE_FOR_FRAMEWORK;
        }

        // let entityDocument = await database.models.entityTypes.findOne({
        //   name: frameworkData.entityType
        // }, { _id: 1 }).lean();

        let queryObject = {
          externalId: frameworkData.externalId,
          name: frameworkData.name,
          description: frameworkData.description,
          entityType: frameworkData.entityType,
        };

        let frameworkMandatoryFields = frameworksHelper.mandatoryField();

        let frameworkDocument = await database.models.frameworks.findOne(queryObject, { _id: 1 }).lean();

        if (frameworkDocument) {
          throw messageConstants.apiResponses.FRAMEWORK_EXISTS;
        }

        Object.keys(frameworkMandatoryFields).forEach((eachMandatoryField) => {
          if (frameworkData[eachMandatoryField] === undefined) {
            frameworkData[eachMandatoryField] = frameworkMandatoryFields[eachMandatoryField];
          }
        });

        // frameworkData["entityTypeId"] = entityDocument._id;
        frameworkData['createdBy'] = req.userDetails.id;
        frameworkData.isDeleted = false;

        frameworkDocument = await database.models.frameworks.create(frameworkData);

        return resolve({
          status: httpStatusCode.ok.status,
          message: messageConstants.apiResponses.FRAMEWORK_INSERTED,
        });
      } catch (error) {
        reject({
          status: error.status || httpStatusCode.internal_server_error.status,
          message: error.message || httpStatusCode.internal_server_error.message,
          errorObject: error,
        });
      }
    });
  }

  /**
   * @api {post} /assessment/api/v1/frameworks/update?frameworkExternalId={frameworkExternalId} Update Frameworks
   * @apiVersion 1.0.0
   * @apiName update Frameworks
   * @apiGroup Frameworks
   * @apiParam {File} Mandatory framework file of type json.
   * @apiSampleRequest /assessment/api/v1/frameworks/update?frameworkExternalId=TAF-2019
   * @apiHeader {String} X-authenticated-user-token Authenticity token
   * @apiUse successBody
   * @apiUse errorBody
   */

  /**
   * Update framework.
   * @method
   * @name update
   * @param {Object} req -request Data.
   * @param {JSON} req.files.framework - framework json files.
   * @returns {JSON} - message and status of framework created.
   */

  async update(req) {
    return new Promise(async (resolve, reject) => {
      try {
        let frameworkData = JSON.parse(req.files.framework.data.toString());

        let queryObject = {
          externalId: req.query.frameworkExternalId,
        };

        let frameworkDocument = await database.models.frameworks.findOne(queryObject, { themes: 0 }).lean();

        if (!frameworkDocument) {
          return resolve({
            status: httpStatusCode.bad_request.status,
            message: messageConstants.apiResponses.FRAMEWORK_NOT_FOUND,
          });
        }

        let updateObject = _.merge(_.omit(frameworkDocument, 'createdAt'), frameworkData);
        updateObject.updatedBy = req.userDetails.id;

        frameworkDocument = await database.models.frameworks.findOneAndUpdate(
          {
            _id: frameworkDocument._id,
          },
          updateObject,
        );

        return resolve({
          status: httpStatusCode.ok.status,
          message: messageConstants.apiResponses.FRAMEWORK_UPDATED,
        });
      } catch (error) {
        reject({
          status: error.status || httpStatusCode.internal_server_error.status,
          message: error.message || httpStatusCode.internal_server_error.message,
          errorObject: error,
        });
      }
    });
  }

  /**
   * @api {post} /assessment/api/v1/frameworks/create create Frameworks
   * @apiVersion 1.0.0
   * @apiName create Frameworks
   * @apiGroup Frameworks
   * @apiParam {File} Mandatory framework file of type json.
   * @apiSampleRequest /assessment/api/v1/frameworks/create
   * @apiHeader {String} X-authenticated-user-token Authenticity token
   * @apiUse successBody
   * @apiUse errorBody
   */

  /**
   * Create framework.
   * @method
   * @name create
   * @param {Object} req -request Data.
   * @param {JSON} req.body - framework creation data.
   * @returns {JSON} - status of framework created.
   */

  async make(req) {
    return new Promise(async (resolve, reject) => {
      try {
        let frameworkDocuments = await frameworksHelper.create(req.body);
        return resolve({
          result: frameworkDocuments,
        });
      } catch (error) {
        reject({
          status: error.status || httpStatusCode.internal_server_error.status,
          message: error.message || httpStatusCode.internal_server_error.message,
          errorObject: error,
        });
      }
    });
  }

  /**
   * @api {post} /assessment/api/v1/frameworks/delete/:frameworkExternalId delete Framework
   * @apiVersion 1.0.0
   * @apiName delete Framework
   * @apiGroup Frameworks
   * @apiHeader {String} internal-access-token Authenticity token
   * @apiSampleRequest /assessment/api/v1/frameworks/delete/cbd074fa-dd11-11ea-a3bf-000d3af02677
   * @apiHeader {String} X-authenticated-user-token Authenticity token
   * @apiUse successBody
   * @apiUse errorBody
   */

  /**
   * Delete framework.
   * @method
   * @name delete
   * @param {Object} req -request Data.
   * @param {String} req.params._id- framework External Id
   * @returns {JSON} - message and status of framework deleted.
   */

  async delete(req) {
    return new Promise(async (resolve, reject) => {
      try {
        let result = await frameworksHelper.delete(req.params._id);

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
};
