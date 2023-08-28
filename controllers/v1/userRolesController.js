/**
 * name : userRolesController.js
 * author : Akash
 * created-date : 01-feb-2019
 * Description : User roles related information.
 */

// Dependencies
const csv = require("csvtojson");
const userRolesHelper = require(MODULES_BASE_PATH + "/userRoles/helper")
const FileStream = require(ROOT_PATH + "/generics/fileStream");

/**
    * UserRoles
    * @class
*/
module.exports = class UserRoles extends Abstract {
  constructor() {
    super(userRolesSchema);
  }

  static get name() {
    return "userRoles";
  }

  /**
  * @api {get} /assessment/api/v1/userRoles/list User Roles list
  * @apiVersion 1.0.0
  * @apiName User Roles list
  * @apiGroup User Roles
  * @apiHeader {String} X-authenticated-user-token Authenticity token
  * @apiSampleRequest /assessment/api/v1/userRoles/list
  * @apiUse successBody
  * @apiUse errorBody
  * @apiParamExample {json} Response:
  *  "result": [
        {
          "_id": "5d5e47051f5a363a0a187029",
          "code": "HM",
          "entityTypes": [
            {
             "entityTypeId": "5ce23d633c330302e720e65f",
             "entityType": "school"
             }
          ],
          "title": "Headmaster"
        }
      ]
  */

    /**
   * list user roles.
   * @method
   * @name list
   * @returns {JSON} list of user roles. 
   */

  list(req) {
    return new Promise(async (resolve, reject) => {

      try {

        let result = await userRolesHelper.list({
          status: "active",
          isDeleted: false
        }, {
            code: 1,
            title: 1,
            entityTypes: 1
          });

        return resolve({
          message: messageConstants.apiResponses.USER_ROLES_FETCHED,
          result: result
        });

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
  * @api {post} /assessment/api/v1/userRoles/bulkCreate Bulk Create User Roles
  * @apiVersion 1.0.0
  * @apiName Bulk Create User Roles
  * @apiGroup User Roles
  * @apiParam {File} userRoles Mandatory user roles file of type CSV.
  * @apiSampleRequest /assessment/api/v1/userRoles/bulkCreate
  * @apiUse successBody
  * @apiUse errorBody
  */

    /**
   * Bulk create user roles.
   * @method
   * @name bulkCreate
   * @param {Object} req -request data.
   * @param {Object} req.files.userRoles -userRoles data.
   * @returns {CSV} Bulk create user roles data. 
   */

  bulkCreate(req) {
    return new Promise(async (resolve, reject) => {

      try {

        let userRolesCSVData = await csv().fromString(req.files.userRoles.data.toString());

        if (!userRolesCSVData || userRolesCSVData.length < 1) {
          throw messageConstants.apiResponses.FILE_DATA_MISSING;
        }

        let newUserRoleData = await userRolesHelper.bulkCreate(userRolesCSVData, req.userDetails);

        if (newUserRoleData.length > 0) {

          const fileName = `UserRole-Upload`;
          let fileStream = new FileStream(fileName);
          let input = fileStream.initStream();

          (async function () {
            await fileStream.getProcessorPromise();
            return resolve({
              isResponseAStream: true,
              fileNameWithPath: fileStream.fileNameWithPath()
            });
          }());

          await Promise.all(newUserRoleData.map(async userRole => {
            input.push(userRole);
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
        });

      }


    })
  }

  /**
  * @api {post} /assessment/api/v1/userRoles/bulkUpdate Bulk Update User Roles
  * @apiVersion 1.0.0
  * @apiName Bulk Update User Roles
  * @apiGroup User Roles
  * @apiParam {File} userRoles Mandatory user roles file of type CSV.
  * @apiSampleRequest /assessment/api/v1/userRoles/bulkUpdate
  * @apiUse successBody
  * @apiUse errorBody
  */

   /**
   * Bulk update user roles.
   * @method
   * @name bulkUpdate
   * @param {Object} req -request data.
   * @param {Object} req.files.userRoles -userRoles data.
   * @returns {CSV} Bulk update user roles data. 
   */

  bulkUpdate(req) {
    return new Promise(async (resolve, reject) => {

      try {

        let userRolesCSVData = await csv().fromString(req.files.userRoles.data.toString());

        if (!userRolesCSVData || userRolesCSVData.length < 1) {
          throw messageConstants.apiResponses.FILE_DATA_MISSING;
        }

        let newUserRoleData = await userRolesHelper.bulkUpdate(userRolesCSVData, req.userDetails);

        if (newUserRoleData.length > 0) {

          const fileName = `UserRole-Upload`;
          let fileStream = new FileStream(fileName);
          let input = fileStream.initStream();

          (async function () {
            await fileStream.getProcessorPromise();
            return resolve({
              isResponseAStream: true,
              fileNameWithPath: fileStream.fileNameWithPath()
            });
          }());

          await Promise.all(newUserRoleData.map(async userRole => {
            input.push(userRole);
          }));

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
  * @api {get} /assessment/api/v1/userRoles/find Find user roles 
  * @apiVersion 1.0.0
  * @apiName Find user roles.
  * @apiGroup User Roles
  * @apiHeader {String} X-authenticated-user-token Authenticity token
  * @apiSampleRequest /assessment/api/v1/userRoles/find
  * @apiParamExample {json} Request-Body:
  * {
    "query" : {
        "code" : "ZL"
    },
    "projection" : {
        "code" : 1,
        "title" : 1
    }
  }
  * @apiUse successBody
  * @apiUse errorBody
  * @apiParamExample {json} Response:
  * {
    "message": "User roles fetched successfully.",
    "status": 200,
    "result": [
        {
            "_id": "5d7a2d806371783ceb11064f",
            "code": "ZL",
            "title": "Zone Leader"
        }
    ]
  }
  */

    /**
   * find user roles.
   * @method
   * @name find
   * @returns {JSON} list of user roles. 
   */

  find(req) {
    return new Promise(async (resolve, reject) => {

      try {

        let result = await userRolesHelper.list(
          req.body.query,
          req.body.projection,
          req.body.skipFields
        );

        return resolve({
          message: messageConstants.apiResponses.USER_ROLES_FETCHED,
          result: result
        });

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
