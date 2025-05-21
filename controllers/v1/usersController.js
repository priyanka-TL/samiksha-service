/**
 * name : usersController.js
 * author : Aman
 * created-date : 20-May-2020
 * Description : Users related information.
 */

// Dependencies

const usersHelper = require(MODULES_BASE_PATH + '/users/helper');

/**
 * Users
 * @class
 */
module.exports = class Users {
  constructor() {}

  static get name() {
    return 'users';
  }

  /**
    * @api {get} /assessment/api/v1/users/programs/:userId List of user programs
    * @apiVersion 1.0.0
    * @apiName List of user programs
    * @apiGroup Users
    * @apiHeader {String} X-authenticated-user-token Authenticity token
    * @apiSampleRequest /assessment/api/v1/users/programs/e97b5582-471c-4649-8401-3cc4249359bb
    * @apiUse successBody
    * @apiUse errorBody
    * @apiParamExample {json} Response:
    *  {
    * "message": "Successfully fetched user programs",
    * {
    "status": 200,
    "result": [
        {
            "_id": "5b98d7b6d4f87f317ff615ee",
            "name": "DCPCR School Development Index 2018-19",
            "externalId": "PROGID01",
            "description": "DCPCR School Development Index 2018-19",
            "solutions": [
                {
                    "programName": "DCPCR School Development Index 2018-19",
                    "programId": "5b98d7b6d4f87f317ff615ee",
                    "_id": "5b98fa069f664f7e1ae7498c",
                    "name": "DCPCR Assessment Framework 2018",
                    "externalId": "EF-DCPCR-2018-001",
                    "description": "DCPCR Assessment Framework 2018",
                    "type": "assessment",
                    "subType": "institutional",
                    "entities": [
                        {
                            "_id": "5bfe53ea1d0c350d61b78d5c",
                            "name": "Tulip Public School, Pckt 20 Sec.24 Rohini, Delhi",
                            "externalId": "1413311",
                            "entityType": "school",
                            "submissionId": "5e9537f7cd48090a5339a640",
                            "submissionStatus": "inprogress"
                        },
                        {
                            "_id": "5d80ee3bbbcc4b1bf8e79ddf",
                            "name": "PUNJAB GSSS K.B.D.S. BOYS",
                            "externalId": "3020800103",
                            "entityType": "school",
                            "totalSubmissionCount": 1,
                            "submissions": [
                                {
                                    "submissionId": "5ebb6df88ea4e621b754c86c",
                                    "submissionStatus": "completed",
                                    "submissionNumber": 1,
                                    "entityId": "5d80ee3bbbcc4b1bf8e79ddf",
                                    "createdAt": "2020-05-13T03:48:08.380Z",
                                    "updatedAt": "2020-05-13T03:48:36.665Z",
                                    "observationName": "PACE AP MEO d-1",
                                    "observationId": "5ea1a24369ce5e39c315268b"
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ]
}
  */

  /**
   * Programs list information
   * @method
   * @name programs
   * @returns {JSON} list of programs information.
   */

  programs(req) {
    return new Promise(async (resolve, reject) => {
      try {
        let isAPrivateProgram = gen.utils.convertStringToBoolean(req.query.isAPrivateProgram);
        if (isAPrivateProgram) {
          let programsData = await usersHelper.privatePrograms(
            userId,
            req.pageSize,
            req.pageNo,
            req.searchText
          );
          return resolve(programsData);
        } else {
          let userPrograms = await usersHelper.programs(
            req.body,
            req.pageNo,
            req.pageSize,
            req.searchText,
            req.userDetails.userId
          );

          userPrograms.result = userPrograms.data;
          return resolve(userPrograms);
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
   * @api {post} /survey/v1/users/solutions/:programId?page=:page&limit=:limit&search=:searchText
   * @apiVersion 1.0.0
   * @apiName User solutions
   * @apiGroup Users
   * @apiHeader {String} X-auth-token Authenticity token
   * @apiSampleRequest /survey/v1/users/solutions/5ff438b04698083dbfab7284?page=1&limit=10
   * @apiParamExample {json} Request-Body:
   * {
        "state": "665d8df5c6892808846230e7",
        "district": "668240135fb8bc3e93ceae39",
        "block": "6682771aa845ef3e891db070",
        "cluster": "668242835fb8bc3e93ceae44",
        "role": "mentee,program_creator,block_education_officer,principle,district_education_officer"
    }
   * @apiUse successBody
   * @apiUse errorBody
   * @apiParamExample {json} Response:
   * {
    "message": "Program solutions fetched successfully",
    "status": 200,
    "result": {
        "programName": "Testing by dev team ap",
        "programId": "669a9836c5da53e877b8969e",
        "description": "testing by dev team",
        "rootOrganisations": "",
        "data": [
            {
                "_id": "66c2eb3e39f69eb48f2980f7",
                "externalId": "Test-survey2-1724050238923",
                "name": "Test survey 1",
                "description": "Test survey 1",
                "language": [
                    "English"
                ],
                "type": "survey",
                "endDate": "2026-12-25T00:00:00.000Z",
                "link": "abad9308b93222bb9d0ccc8e79efdbe8",
                "entityType": ""
            },
            {
                "_id": "66d055bbdf92822366029c1c",
                "externalId": "606d92fa-42d8-11ec-ac61-29082024-15-57-OBSERVATION-TEMPLATE-1724929467852",
                "name": "dev_testing",
                "description": "dev testing",
                "language": [
                    "English"
                ],
                "entityType": "school",
                "type": "observation",
                "endDate": "2025-08-29T11:04:27.852Z",
                "link": "464f9f5d68282096a190b583748cf8ec"
             }
        ],
        "count": 2
      }
    }
   **/

  /**
   * User targeted solutions.
   * @method
   * @name solutions
   * @param  {req}  - requested data.
   * @returns {json} List of targeted solutions.
   */

  solutions(req) {
    return new Promise(async (resolve, reject) => {
      try {
        let targetedSolutions = await usersHelper.solutions(
          req.params._id,
          req.body,
          req.pageSize,
          req.pageNo,
          req.searchText,
          req.userDetails.userId
        );

        return resolve(targetedSolutions);
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
    * @api {get} /assessment/api/v1/users/entities/:userId List of user entities
    * @apiVersion 1.0.0
    * @apiName List of user entities
    * @apiGroup Users
    * @apiHeader {String} X-authenticated-user-token Authenticity token
    * @apiSampleRequest /assessment/api/v1/users/entities/e97b5582-471c-4649-8401-3cc4249359bb
    * @apiUse successBody
    * @apiUse errorBody
    * @apiParamExample {json} Response:
    * {
    "message": "Successfully fetched user entities",
    "status": 200,
    "result": {
        "entityTypes": [
            {
                "name": "School",
                "key": "school"
            }
        ],
        "entities": {
            "school": [
                {
                    "_id": "5bfe53ea1d0c350d61b78d5c",
                    "name": "Tulip Public School, Pckt 20 Sec.24 Rohini, Delhi",
                    "externalId": "1413311",
                    "entityType": "school",
                    "solutions": [
                        {
                            "programName": "DCPCR School Development Index 2018-19",
                            "programId": "5b98d7b6d4f87f317ff615ee",
                            "_id": "5b98fa069f664f7e1ae7498c",
                            "name": "DCPCR Assessment Framework 2018",
                            "externalId": "EF-DCPCR-2018-001",
                            "description": "DCPCR Assessment Framework 2018",
                            "type": "assessment",
                            "subType": "institutional",
                            "submissionId": "5e9537f7cd48090a5339a640",
                            "submissionStatus": "inprogress"
                        }
                    ]
                }
            ]
        }
    }
}
  */

  /**
   * List of user entities.
   * @method
   * @name entities
   * @param {Object} req -request Data.
   * @param {String} req.params._id - user id
   * @returns {JSON} List of user entities.
   */

  entities(req) {
    return new Promise(async (resolve, reject) => {
      try {
        let entitiesData = await usersHelper.entities(req.params._id ? req.params._id : req.userDetails.userId);

        return resolve(entitiesData);
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
     * @api {get} /assessment/api/v1/users/privatePrograms/:userId List of user private programs
     * @apiVersion 2.0.0
     * @apiName List of user private programs
     * @apiGroup Programs
     * @apiHeader {String} X-authenticated-user-token Authenticity token
     * @apiSampleRequest /assessment/api/v1/users/privatePrograms/e97b5582-471c-4649-8401-3cc4249359bb
     * @apiParamExample {json} Response:
     * {
     "message": "List of private programs",
     "status": 200,
     "result": [
        {
            "_id": "5edf0d14c57dab7f639f3e0d",
            "externalId": "EF-DCPCR-2018-001-TEMPLATE-2020-06-09 09:46:20",
            "name": "My program",
            "description": "DCPCR Assessment Framework 2018"
        }
     ]}
     * @apiUse successBody
     * @apiUse errorBody
     */

  /**
   * Private Programs .
   * @method
   * @name privatePrograms
   * @param {Object} req -request Data.
   * @param {String} req.params._id - user id
   * @returns {JSON} - List of programs created by user.
   */

  async privatePrograms(req) {
    return new Promise(async (resolve, reject) => {
      try {
        let programsData = await usersHelper.privatePrograms(
          req.params._id && req.params._id != '' ? req.params._id : req.userDetails.userId
        );

        return resolve(programsData);
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
     * @api {post} /assessment/api/v1/users/createProgramAndSolution/:userId Users created program and solution.
     * @apiVersion 2.0.0
     * @apiName Users created program and solution.
     * @apiGroup Programs
     * @apiHeader {String} X-authenticated-user-token Authenticity token
     * @apiSampleRequest /assessment/api/v1/users/createProgramAndSolution/e97b5582-471c-4649-8401-3cc4249359bb
     * @apiParamExample {json} Request-Body:
     * {
     * "programId" : "",
     * "programName" : "Test project program",
     * "solutionName" : "Test project solution"
     }
     * @apiUse successBody
     * @apiUse errorBody
     * @apiParamExample {json} Response:
     * {
    "status": 200,
    "result": {
        "program": {
            "resourceType": [
                "Program"
            ],
            "language": [
                "English"
            ],
            "keywords": [
                "keywords 1",
                "keywords 2"
            ],
            "concepts": [],
            "createdFor": [],
            "components": [],
            "isAPrivateProgram": true,
            "rootOrganisations": [],
            "_id": "5f44b08cdbe917732246149f",
            "deleted": false,
            "externalId": "Test project program-1598337164794",
            "name": "Test project program",
            "description": "Test project program",
            "status": "active",
            "imageCompression": {
                "quality": 10
            },
            "updatedAt": "2020-08-25T06:32:44.796Z",
            "createdAt": "2020-08-25T06:32:44.796Z",
            "__v": 0
        },
        "solution": {
            "resourceType": [],
            "language": [],
            "keywords": [],
            "concepts": [],
            "createdFor": [],
            "themes": [],
            "flattenedThemes": [],
            "entities": [],
            "registry": [],
            "isRubricDriven": false,
            "enableQuestionReadOut": false,
            "captureGpsLocationAtQuestionLevel": false,
            "isAPrivateProgram": false,
            "allowMultipleAssessemts": false,
            "isDeleted": false,
            "rootOrganisations": [],
            "_id": "5f44b08cdbe91773224614a0",
            "deleted": false,
            "name": "Test project solution",
            "externalId": "Test project solution-1598337164794",
            "description": "Test project solution",
            "programId": "5f44b08cdbe917732246149f",
            "programExternalId": "Test project program-1598337164794",
            "programName": "Test project program",
            "programDescription": "Test project program",
            "updatedAt": "2020-08-25T06:32:44.801Z",
            "createdAt": "2020-08-25T06:32:44.801Z",
            "__v": 0
        }
    }}
     */

  /**
   * Create user program and solution.
   * @method
   * @name createProgramAndSolution
   * @param {Object} req -request Data.
   * @param {String} req.params._id - user id
   * @returns {JSON} - Created user program and solution.
   */

  async createProgramAndSolution(req) {
    return new Promise(async (resolve, reject) => {
      try {
        let createdProgramAndSolution = await usersHelper.createProgramAndSolution(
          req.params._id && req.params._id != '' ? req.params._id : req.userDetails.id,
          req.body,
          req.userDetails.userToken
        );

        return resolve(createdProgramAndSolution);
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
     * @api {post} /assessment/api/v1/users/deleteUserPIIData Delete user data
     * @apiVersion 2.0.0
     * @apiName Delete user data
     * @apiGroup Users
     * @apiHeader {String} internal-access-token Internal access token
     * @apiSampleRequest /assessment/api/v1/users/deleteUserPIIData
     * @apiUse successBody
     * @apiUse errorBody
     * @apiParamExample {json} Response:
     * {
            "message": "Data deleted successfully.",
            "status": 200
        }
     */

  /**
   * Delete user data
   * @method
   * @name deleteUserPIIData
   * @param {Object} req -request Data.
   * @returns {JSON} - User data deletion response
   */

  async deleteUserPIIData(req) {
    return new Promise(async (resolve, reject) => {
      try {
        let result = await usersHelper.deleteUserPIIData(
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
