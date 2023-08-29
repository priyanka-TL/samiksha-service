/**
 * name : userExtensionController.js
 * author : Akash
 * created-date : 01-feb-2019
 * Description : User extension related functionality.
 */

// Dependencies
const csv = require('csvtojson');
const userExtensionHelper = require(MODULES_BASE_PATH + '/userExtension/helper');
const FileStream = require(ROOT_PATH + '/generics/fileStream');
const entitiesHelper = require(MODULES_BASE_PATH + '/entities/helper');

/**
 * UserExtension
 * @class
 */
module.exports = class UserExtension extends Abstract {
  constructor() {
    super(userExtensionSchema);
  }

  static get name() {
    return 'userExtension';
  }

  /**
  * @api {get} /assessment/api/v1/userExtension/getProfile/{{userId}} Get user profile
  * @apiVersion 1.0.0
  * @apiName Get user profile
  * @apiGroup User Extension
  * @apiHeader {String} X-authenticated-user-token Authenticity token
  * @apiSampleRequest /assessment/api/v1/userExtension/getProfile/e97b5582-471c-4649-8401-3cc4249359bb
  * @apiUse successBody
  * @apiUse errorBody
  * @apiParamExample {json} Response:
  * {
  *  "_id": "5d5e4758f89df53a1d26b454",
     "externalId": "a1",
     "roles": [
        {
         "_id": "5d5e47051f5a363a0a187029",
         "code": "HM",
         "title": "Headmaster",
         "immediateSubEntityType": "school",
         "entities": [
          {
            "_id": "5bfe53ea1d0c350d61b78d0f",
            "externalId": "1208138",
            "name": "Shri Shiv Middle School, Shiv Kutti, Teliwara, Delhi",
            "childrenCount": 0,
             "entityType": "school",
             "entityTypeId": "5ce23d633c330302e720e65f",
             "subEntityGroups": [
              "parent"
              ]
            }
          ]
       }
     ],
     "acl": {
       "HM": {
         "school": {
           "tags": [
             "primary",
             "middle"
            ]
          }
        }
      }
  * }
  */

  /**
   * Get profile of user.
   * @method
   * @name getProfile
   * @param {Object} req - request data.
   * @param {String} req.params._id - user id.
   * @returns {JSON} User profile data.
   */

  getProfile(req) {
    return new Promise(async (resolve, reject) => {
      try {
        let result = await userExtensionHelper.profileWithEntityDetails({
          userId: req.params._id && req.params._id != '' ? req.params._id : req.userDetails.userId,
          status: 'active',
          isDeleted: false,
        });

        return resolve({
          message: messageConstants.apiResponses.USER_EXTENSION_FETCHED,
          result: result,
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
   * @api {post} /assessment/api/v1/userExtension/bulkUpload Bulk Upload User Roles
   * @apiVersion 1.0.0
   * @apiName Bulk Upload User Roles
   * @apiGroup User Extension
   * @apiParam {File} userRoles Mandatory user roles file of type CSV.
   * @apiSampleRequest /assessment/api/v1/userExtension/bulkUpload
   * @apiUse successBody
   * @apiUse errorBody
   */

  /**
   * Bulk upload user.
   * @method
   * @name bulkUpload
   * @param {Object} req - request data.
   * @param {Array} req.files.userRoles - userRoles data.
   * @returns {CSV} user uploaded data.
   */

  bulkUpload(req) {
    return new Promise(async (resolve, reject) => {
      try {
        let userRolesCSVData = await csv().fromString(req.files.userRoles.data.toString());

        if (!userRolesCSVData || userRolesCSVData.length < 1) {
          throw messageConstants.apiResponses.FILE_DATA_MISSING;
        }

        let newUserRoleData = await userExtensionHelper.bulkCreateOrUpdate(userRolesCSVData, req.userDetails);

        if (newUserRoleData.length > 0) {
          const fileName = `UserRole-Upload`;
          let fileStream = new FileStream(fileName);
          let input = fileStream.initStream();

          (async function () {
            await fileStream.getProcessorPromise();
            return resolve({
              isResponseAStream: true,
              fileNameWithPath: fileStream.fileNameWithPath(),
            });
          })();

          await Promise.all(
            newUserRoleData.map(async (userRole) => {
              input.push(userRole);
            }),
          );

          input.push(null);
        } else {
          throw messageConstants.apiResponses.SOMETHING_WENT_WRONG;
        }
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
   * @api {get} /assessment/api/v1/userExtension/entities/:userId?entityType=:entityType&limit=:limit&page=:page&search=:searchText User Extension Entity details
   * @apiVersion 1.0.0
   * @apiName User Extension Entity details
   * @apiGroup User Extension
   * @apiSampleRequest /assessment/api/v1/userExtension/entities/e97b5582-471c-4649-8401-3cc4249359bb?entityType=school&limit=10&page=1&search=school
   * @apiUse successBody
   * @apiUse errorBody
   * @apiParamExample {json} Response:
   * "result": [
   * {
     "_id": "5bfe53ea1d0c350d61b78d0f",
     "entityTypeId": "5ce23d633c330302e720e65f",
     "entityType": "school",
     "metaInformation": {
     "externalId": "1208138",
     "addressLine1": "Shiv Kutti, Teliwara",
     "addressLine2": "",
     "administration": "Aided",
     "city": "Urban",
     "country": "India",
     "name": "Shri Shiv Middle School, Shiv Kutti, Teliwara, Delhi"
      }
     }
    ],
    "count": 1
   */

  /**
   * Entities in user extension.
   * @method
   * @name entities
   * @param {Object} req - request data.
   * @param {String} req.params._id - user id.
   * @param {String} req.query.entityType - entity type.
   * @param {Number} req.pageSize - page limit.
   * @param {Number} req.pageNo - page number.
   * @param {String} req.searchText - search data.
   * @returns {JSON} List of entities in user extension.
   */

  entities(req) {
    return new Promise(async (resolve, reject) => {
      try {
        let userId = req.params._id ? req.params._id : req.userDetails.id;
        let entityType = req.query.entityType ? req.query.entityType : 'school';

        let userExtensionEntities = await userExtensionHelper.entities(
          userId,
          entityType,
          req.pageSize,
          req.pageNo,
          req.searchText,
        );

        return resolve(userExtensionEntities);
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
  * @api {get} /assessment/api/v1/userExtension/update/{{userId}} Update user profile
  * @apiVersion 1.0.0
  * @apiName Update user profile
  * @apiGroup User Extension
  * @apiHeader {String} X-authenticated-user-token Authenticity token
  * @apiSampleRequest /assessment/api/v1/userExtension/update/e97b5582-471c-4649-8401-3cc4249359bb
  * @apiUse successBody
  * @apiUse errorBody
  * @apiParamExample {json} Response:
  
  */

  /**
   * Get profile of user.
   * @method
   * @name update
   * @param {Object} req - request data.
   * @param {String} req.params._id - user id.
   * @returns {JSON} User profile data.
   */

  update(req) {
    return new Promise(async (resolve, reject) => {
      try {
        let result = await userExtensionHelper.update(
          req.params._id && req.params._id != '' ? req.params._id : req.userDetails.userId,
          req.body,
        );

        return resolve(result);
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
