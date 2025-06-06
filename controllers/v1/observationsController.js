/**
 * name : observationsController.js
 * author : Akash
 * created-date : 22-Nov-2018
 * Description : Observations information.
 */

// Dependencies

const observationsHelper = require(MODULES_BASE_PATH + '/observations/helper');
const entitiesHelper = require(MODULES_BASE_PATH + '/entities/helper');
const assessmentsHelper = require(MODULES_BASE_PATH + '/assessments/helper');
const solutionsHelper = require(MODULES_BASE_PATH + '/solutions/helper');
const userExtensionHelper = require(MODULES_BASE_PATH + '/userExtension/helper');
const csv = require('csvtojson');
const FileStream = require(ROOT_PATH + '/generics/fileStream');
const assessorsHelper = require(MODULES_BASE_PATH + '/entityAssessors/helper');
const programsHelper = require(MODULES_BASE_PATH + '/programs/helper');
const validateEntities = process.env.VALIDATE_ENTITIES ? process.env.VALIDATE_ENTITIES : 'OFF';
const entityManagementService = require(ROOT_PATH + '/generics/services/entity-management');

/**
 * Observations
 * @class
 */
module.exports = class Observations extends Abstract {
  constructor() {
    super(observationsSchema);
  }

  /**
    * @api {get} /assessment/api/v1/observations/solutions/:entityTypeId?search=:searchText&limit=1&page=1 Observation Solution
    * @apiVersion 1.0.0
    * @apiName Observation Solution
    * @apiGroup Observations
    * @apiHeader {String} X-authenticated-user-token Authenticity token
    * @apiSampleRequest /assessment/api/v1/observations/solutions/5cd955487e100b4dded3ebb3?search=Framework&pageSize=10&pageNo=1
    * @apiUse successBody
    * @apiUse errorBody
    * @apiParamExample {json} Response:
    * "result": [
        {
            "data": [
                {
                    "_id": "5c6bd309af0065f0e0d4223b",
                    "externalId": "TAF-2019",
                    "name": "Teacher Assessment Framework",
                    "description": "Teacher Assessment Framework",
                    "keywords": [
                        "Framework",
                        "Priyanka",
                        "Assessment"
                    ],
                    "entityTypeId": "5ce23d633c330302e720e661",
                    "programId": "5c6bd365af0065f0e0d42280"
                }
            ],
            "count": 1
        }
    ]
    */

  /**
   * Observation solutions.
   * @method
   * @name solutions
   * @param {Object} req -request Data.
   * @param {String} req.params._id - entity type id.
   * @returns {JSON} - Solution Details.
   */

  async solutions(req) {
    return new Promise(async (resolve, reject) => {
      try {
        let response = {};
        let messageData;
        let matchQuery = {};

        matchQuery['$match'] = {};

        if (req.params._id) {
          matchQuery['$match']['entityTypeId'] = new ObjectId(req.params._id);
        }

        matchQuery['$match']['type'] = 'observation';
        matchQuery['$match']['isReusable'] = true;
        matchQuery['$match']['status'] = 'active';

        matchQuery['$match']['$or'] = [];
        matchQuery['$match']['$or'].push(
          { name: new RegExp(req.searchText, 'i') },
          { description: new RegExp(req.searchText, 'i') },
          { keywords: new RegExp(req.searchText, 'i') }
        );

        let solutionDocument = await solutionsHelper.search(matchQuery, req.pageSize, req.pageNo);

        messageData = messageConstants.apiResponses.SOLUTION_FETCHED;

        if (!solutionDocument[0].count) {
          solutionDocument[0].count = 0;
          messageData = messageConstants.apiResponses.SOLUTION_NOT_FOUND;
        }

        response.result = solutionDocument;
        response['message'] = messageData;

        return resolve(response);
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
   * @api {get} /assessment/api/v1/observations/metaForm/:solutionId Observation Creation Meta Form
   * @apiVersion 1.0.0
   * @apiName Observation Creation Meta Form
   * @apiGroup Observations
   * @apiHeader {String} X-authenticated-user-token Authenticity token
   * @apiSampleRequest /assessment/api/v1/observations/metaForm
   * @apiUse successBody
   * @apiUse errorBody
   * @apiParamExample {json} Response:
   * {
   * "message": "Observation meta fetched successfully.",
   * "status": 200,
   * "result": [
   * {
   * "field": "name",
   * "label": "Title",
   * "value": "",
   * "visible": true,
   * "editable": true,
   * "input": "text",
   * "validation": {
   * "required": true
   * }
   * },
   * {
   * "field": "description",
   * "label": "Description",
   * "value": "",
   * "visible": true,
   * "editable": true,
   * "input": "textarea",
   * "validation": {
   * "required": true
   * }
   * },{
   * "field": "status",
   * "label": "Status",
   * "value": "draft",
   * "visible": false,
   * "editable": true,
   * "input": "radio",
   * "validation": {
   * "required": true
   * },
   * "options": [
   * {
   * "value": "published",
   * "label": "Published"
   * },
   * {
   * "value": "draft",
   * "label": "Published"
   * },
   * {
   * "value": "completed",
   * "label": "Completed"
   * }
   * ]
   * }
   * ]}
   */

  /**
   * Observation meta form.
   * @method
   * @name metaForm
   * @param {Object} req -request Data.
   * @returns {JSON} - Observation meta form.
   */

  async metaForm(req) {
    return new Promise(async (resolve, reject) => {
      try {
        let solutionsData = await database.models.solutions
          .findOne(
            {
              _id: ObjectId(req.params._id),
              isReusable: true,
              type: messageConstants.common.OBSERVATION,
            },
            {
              observationMetaFormKey: 1,
            }
          )
          .lean();

        if (!solutionsData._id) {
          let responseMessage = httpStatusCode.bad_request.message;
          return resolve({
            status: httpStatusCode.bad_request.status,
            message: responseMessage,
          });
        }

        let observationsMetaForm = await database.models.forms
          .findOne(
            {
              name:
                solutionsData.observationMetaFormKey && solutionsData.observationMetaFormKey != ''
                  ? solutionsData.observationMetaFormKey
                  : 'defaultObservationMetaForm',
            },
            { value: 1 }
          )
          .lean();

        return resolve({
          message: messageConstants.apiResponses.OBSERVATION_META_FETCHED,
          result: observationsMetaForm.value,
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
   * @api {post} /assessment/api/v1/observations/create?solutionId=:solutionInternalId Create Observation
   * @apiVersion 1.0.0
   * @apiName Create Observation
   * @apiGroup Observations
   * @apiParamExample {json} Request-Body:
   * {
   *	    "data": {
   *          "name": String,
   *          "description": String,
   *          "startDate": String,
   *          "endDate": String,
   *          "status": String,
   *          "entities":["5beaa888af0065f0e0a10515","5beaa888af0065f0e0a10516"]
   *      }
   * }
   * @apiUse successBody
   * @apiUse errorBody
   */

  /**
   * Create Observation.
   * @method
   * @name create
   * @param {Object} req -request Data.
   * @returns {JSON} - Created observation data.
   */

  create(req) {
    return new Promise(async (resolve, reject) => {
      try {
        let result = await observationsHelper.create(
          req.query.solutionId,
          req.body.data,
          req.userDetails.userId,
          req.userDetails.userToken
          // req.query.programId
        );

        return resolve({
          message: messageConstants.apiResponses.OBSERVATION_CREATED,
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
     * @api {get} /assessment/api/v1/observations/list Observations list
     * @apiVersion 1.0.0
     * @apiName Observations list
     * @apiGroup Observations
     * @apiHeader {String} X-authenticated-user-token Authenticity token
     * @apiSampleRequest /assessment/api/v1/observations/list
     * @apiParamExample {json} Response:
        "result": [
            {
                "_id": "5d09c34d1f7fd5a2391f7251",
                "entities": [],
                "name": "Observation 1",
                "description": "Observation Description",
                "status": "published",
                "solutionId": "5b98fa069f664f7e1ae7498c"
            },
            {
                "_id": "5d1070326f6ed50bc34aec2c",
                "entities": [
                    {
                        "_id": "5cebbefe5943912f56cf8e16",
                        "submissionStatus": "pending",
                        "submissions": [],
                        "name": "asd"
                    },
                    {
                        "_id": "5cebbf275943912f56cf8e18",
                        "submissionStatus": "pending",
                        "submissions": [],
                        "name": "asd"
                    }
                ],
                "status": "published",
                "endDate": "2019-06-24T00:00:00.000Z",
                "name": "asdasd",
                "description": "asdasdasd",
                "solutionId": "5c6bd309af0065f0e0d4223b"
            }
        ]
     * @apiUse successBody
     * @apiUse errorBody
     */

  /**
   * List Observation.
   * @method
   * @name list
   * @param {Object} req -request Data.
   * @returns {JSON} - List observation data.
   */

  async list(req) {
    return new Promise(async (resolve, reject) => {
      try {
        let observations = new Array();

        observations = await observationsHelper.listV1(req.userDetails.userId);

        let responseMessage = messageConstants.apiResponses.OBSERVATION_LIST;

        return resolve({
          message: responseMessage,
          result: observations,
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
   * @api {post} /assessment/api/v1/observations/addEntityToObservation/:observationId Map entities to observations
   * @apiVersion 1.0.0
   * @apiName Map entities to observations
   * @apiGroup Observations
   * @apiParamExample {json} Request-Body:
   * {
   *	    "data": ["5beaa888af0065f0e0a10515","5beaa888af0065f0e0a10516"]
   * }
   * @apiUse successBody
   * @apiUse errorBody
   */

  /**
   * Add entity to observation.
   * @method
   * @name addEntityToObservation
   * @param {Object} req -request Data.
   * @param {String} req.params._id -Observation id.
   * @returns {JSON} message - regarding either entity is added to observation or not.
   */

  async addEntityToObservation(req) {
    return new Promise(async (resolve, reject) => {
      try {
        let result = await observationsHelper.addEntityToObservation(req.params._id, req.body.data, req.userDetails.id);

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

  /**
   * @api {post} /assessment/api/v1/observations/removeEntityFromObservation/:observationId Un Map entities to observations
   * @apiVersion 1.0.0
   * @apiName Un Map entities to observations
   * @apiGroup Observations
   * @apiParamExample {json} Request-Body:
   * {
   *	    "data": ["5beaa888af0065f0e0a10515","5beaa888af0065f0e0a10516"]
   * }
   * @apiUse successBody
   * @apiUse errorBody
   */

  /**
   * Remove entity from observation.
   * @method
   * @name removeEntityFromObservation
   * @param {Object} req -request Data.
   * @param {String} req.params._id -observation id.
   * @returns {JSON} observation remoevable message
   */

  async removeEntityFromObservation(req) {
    return new Promise(async (resolve, reject) => {
      try {
        let result = await observationsHelper.removeEntityFromObservation(
          req.params._id,
          req.body.data,
          req.userDetails.id
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

  /**
   * @api {post} /assessment/api/v1/observations/updateEntities/:observationId Map entities to observations
   * @apiVersion 1.0.0
   * @apiName Map entities to observations
   * @apiGroup Observations
   * @apiParamExample {json} Request-Body:
   * {
   *	    "data": ["5beaa888af0065f0e0a10515","5beaa888af0065f0e0a10516"]
   * }
   * @apiUse successBody
   * @apiUse errorBody
   */

  /**
   * Add entity to observation.
   * @method
   * @name updateEntities
   * @param {Object} req -request Data.
   * @param {String} req.params._id -Observation id.
   * @returns {JSON} message - regarding either entity is added to observation or not.
   */

  async updateEntities(req) {
    return new Promise(async (resolve, reject) => {
      try {
        let response = {};
        if (req.method === 'POST') {
          response = await observationsHelper.addEntityToObservation(
            req.params._id,
            req.body.data,
            req.userDetails.userId
          );
        } else if (req.method === 'DELETE') {
          response = await observationsHelper.removeEntityFromObservation(
            req.params._id,
            req.body.data ? req.body.data : (req.query.entityId ? req.query.entityId.split(',') : []),
            req.userDetails.userId
          );
        }

        return resolve(response);
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
     * @api {get} /assessment/api/v1/observations/searchEntities/:observationId?search=:searchText&limit=1&page=1 Search Entities
     * @apiVersion 1.0.0
     * @apiName Search Entities
     * @apiGroup Observations
     * @apiHeader {String} X-authenticated-user-token Authenticity token
     * @apiSampleRequest /assessment/api/v1/observations/searchEntities/5d1a002d2dfd8135bc8e1615?search=&limit=100&page=1
     * @apiUse successBody
     * @apiUse errorBody
     * @apiParamExample {json} Response:
        {
            "message": "Entities fetched successfully",
            "status": 200,
            "result": [
                {
                    "data": [
                        {
                            "_id": "5c5b1581e7e84d1d1be9175f",
                            "name": "Vijaya krishna.T",
                            "selected": false
                        }
                    ],
                    "count": 435
                }
            ]
        }
     */

  /**
   * Search entities in observation.
   * @method
   * @name searchEntities
   * @param {Object} req -request Data.
   * @param {String} req.params._id -observation id.
   * @returns {JSON} List of entities in observations.
   */

  async searchEntitiesOld(req) {
    return new Promise(async (resolve, reject) => {
      try {
        let response = {
          result: {},
        };

        let observationDocument = await database.models.observations
          .findOne(
            {
              _id: req.params._id,
              createdBy: req.userDetails.userId,
              status: { $ne: 'inactive' },
            },
            {
              entityTypeId: 1,
              entities: 1,
            },
          )
          .lean();

        if (!observationDocument) {
          throw {
            status: httpStatusCode.bad_request.status,
            message: messageConstants.apiResponses.OBSERVATION_NOT_FOUND,
          };
        }

        let userAclInformation = await userExtensionHelper.userAccessControlList(req.userDetails.userId);

        let tags = [];

        if (userAclInformation.success && Object.keys(userAclInformation.acl).length > 0) {
          Object.values(userAclInformation.acl).forEach((acl) => {
            tags = tags.concat(acl);
          });
        }

        let entityDocuments = await entitiesHelper.search(
          observationDocument.entityTypeId,
          req.searchText,
          req.pageSize,
          req.pageNo,
          false,
          tags,
        );

        let observationEntityIds = observationDocument.entities.map((entity) => entity.toString());

        entityDocuments[0].data.forEach((eachMetaData) => {
          eachMetaData.selected = observationEntityIds.includes(eachMetaData._id.toString()) ? true : false;
          if (eachMetaData.districtName && eachMetaData.districtName != '') {
            eachMetaData.name += ', ' + eachMetaData.districtName;
          }

          if (eachMetaData.externalId && eachMetaData.externalId !== '') {
            eachMetaData.name += ', ' + eachMetaData.externalId;
          }
        });

        let messageData = messageConstants.apiResponses.ENTITY_FETCHED;
        if (!entityDocuments[0].count) {
          entityDocuments[0].count = 0;
          messageData = messageConstants.apiResponses.ENTITY_NOT_FOUND;
        }
        response.result = entityDocuments;
        response['message'] = messageData;

        return resolve(response);
      } catch (error) {
        return reject({
          status: error.status || httpStatusCode.internal_server_error.status,
          message: error.message || httpStatusCode.internal_server_error.message,
          errorObject: error,
        });
      }
    });
  }

  async searchEntities(req) {
    return new Promise(async (resolve, reject) => {
      try{
        
        let searchEntitiesResult = await entitiesHelper.searchEntitiesHelper(req);
        resolve(searchEntitiesResult);
      }catch(error){
        
        return reject({
          status: error.status || httpStatusCode.internal_server_error.status,
          message: error.message || httpStatusCode.internal_server_error.message,
          errorObject: error,
        });
      }
    });
  }

       /**
    * @api {post} /survey/api/v1/observations/targetedEntity/:solutionId Targeted entity.
    * @apiVersion 1.0.0
    * @apiName Targeted entity.
    * @apiGroup Observations
    * @apiParamExample {json} Request-Body:
    {
    "cluster": "22763910-f79f-4746-900b-b429fb7f9d24",
    "district": "24c36610-0640-45a3-b88e-fa92c9ebbec2",
    "state": "bc75cc99-9205-463e-a722-5326857838f8",
    "block": "e5be5e9c-3eea-4822-8754-9009c47c6782",
    "school": "b840c173-5d17-4ebf-b76e-567763ff2c4e",
    "role": "senior_teacher,test2"
    }
    * @apiHeader {String} X-auth-token Authenticity token
    * @apiSampleRequest /survey/api/v1/observations/targetedEntity/601d41607d4c835cf8b724ad
    * @apiUse successBody
    * @apiUse errorBody
    * @apiParamExample {json} Response:
{
    "message": "Targeted Entity Types Fetched",
    "status": 200,
    "result": [
        {
            "_id": "5fd1b52ab53a6416aaeefb84",
            "entityType": "block",
            "entityName": "ADDATEEGALA"
        }
    ]
}
    */

     /**
   * Targeted entity
   * @method
   * @name targetedEntity
   * @param {Object} req - requested data.
   * @param {Object} req.body - requested bidy data.
   * @returns {Array} Details entity.
   */
  async targetedEntity(req) {
    return new Promise(async (resolve, reject) => {
      try{
        let searchEntitiesResult = await observationsHelper.targetedEntity(req);  
        resolve(searchEntitiesResult);
      }catch(error){       
        return reject({
          status: error.status || httpStatusCode.internal_server_error.status,
          message: error.message || httpStatusCode.internal_server_error.message,
          errorObject: error,
        });
      }
    });
  }


  /**
   * @api {get} /assessment/api/v1/observations/assessment/:observationId?entityId=:entityId&submissionNumber=submissionNumber&ecmMethod=ecmMethod Assessments
   * @apiVersion 1.0.0
   * @apiName Assessments
   * @apiGroup Observations
   * @apiHeader {String} X-authenticated-user-token Authenticity token
   * @apiParam {String} entityId Entity ID.
   * @apiParam {Int} submissionNumber Submission Number.
   * @apiSampleRequest /assessment/api/v1/observations/assessment/5d286eace3cee10152de9efa?entityId=5d286b05eb569501488516c4&submissionNumber=1&ecmMethod=OB
   * @apiUse successBody
   * @apiUse errorBody
   */

  /**
   * Assessment for observation.
   * @method
   * @name assessment
   * @param {Object} req -request Data.
   * @param {String} req.params._id -observation id.
   * @param {String} req.query.entityId - entity id.
   * @param {String} req.query.submissionNumber - submission number
   * @returns {JSON} - Observation Assessment details.
   */

  async assessment(req) {
    return new Promise(async (resolve, reject) => {
      try {
        let response = {
          message: messageConstants.apiResponses.ASSESSMENT_FETCHED,
          result: {},
        };

        let observationDocument = await database.models.observations
          .findOne({
            _id: req.params._id,
            createdBy: req.userDetails.userId,
            status: { $ne: 'inactive' },
            entities: req.query.entityId,
          })
          .lean();

        if (!observationDocument) {
          return resolve({
            status: httpStatusCode.bad_request.status,
            message: messageConstants.apiResponses.OBSERVATION_NOT_FOUND,
          });
        }

        let entityDocument = { metaInformation: {} };
        if (validateEntities == 'ON') {
          let entityQueryObject = {
            _id: req.query.entityId,
            entityType: observationDocument.entityType,
          };
        let entitiesDetails = await entityManagementService.entityDocuments(
          entityQueryObject,
          ['metaInformation','entityTypeId','entityType','registryDetails'],
        );

        if(!entitiesDetails.success){
          throw new Error(messageConstants.apiResponses.ENTITY_SERVICE_DOWN)
        }
      
         let entitiesData = entitiesDetails.data;

          if (!entitiesData.length > 0) {
            let responseMessage = messageConstants.apiResponses.ENTITY_NOT_FOUND;
            return resolve({
              status: httpStatusCode.bad_request.status,
              message: responseMessage,
            });
          }
          entityDocument = entitiesData[0];
        }else{

          entityDocument =  {
            _id: req.query.entityId,
            metaInformation:{}
          }

        }

        if (entityDocument.registryDetails && Object.keys(entityDocument.registryDetails).length > 0) {
          entityDocument.metaInformation.registryDetails = entityDocument.registryDetails;
        }

        const submissionNumber =
          req.query.submissionNumber && req.query.submissionNumber > 1 ? parseInt(req.query.submissionNumber) : 1;

        let solutionQueryObject = {
          _id: observationDocument.solutionId,
          status: 'active',
        };

        let solutionDocumentProjectionFields = await observationsHelper.solutionDocumentProjectionFieldsForDetailsAPI();

        let solutionDocument = await database.models.solutions
          .findOne(solutionQueryObject, solutionDocumentProjectionFields)
          .lean();

        if (!solutionDocument) {
          let responseMessage = messageConstants.apiResponses.SOLUTION_NOT_FOUND;
          return resolve({
            status: httpStatusCode.bad_request.status,
            message: responseMessage,
          });
        }

        if (req.query.ecmMethod && req.query.ecmMethod !== '') {
          if (!solutionDocument.evidenceMethods[req.query.ecmMethod]) {
            return resolve({
              status: httpStatusCode.bad_request.status,
              message: messageConstants.apiResponses.ECM_NOT_EXIST,
            });
          }
        }

        let programId = null;
        let programExternalId = null;
        let programInformation = null;

        if(observationDocument.programId){

        let programQueryObject = {
          _id: observationDocument.programId,
          status: "active"
        };

        let programDocument = await programsHelper.list(programQueryObject, [
           "externalId",
           "name",
           "description",
           "imageCompression",
           "isAPrivateProgram",
         ]);

         programDocument = programDocument.data.data
         
         if (!programDocument[0]._id) {
           throw messageConstants.apiResponses.PROGRAM_NOT_FOUND;
         }

         programInformation =  {
             ..._.omit(programDocument[0], [
               "_id",
               "components",
               "isAPrivateProgram",
             ]),
           },
         programId =  programDocument[0]._id
         programExternalId =  programDocument[0].externalId

        }

        /*
                <- Currently not required for bodh-2:10 as roles is not given in user 
                */

        // let currentUserAssessmentRole = await assessmentsHelper.getUserRole(req.userDetails.allRoles);
        // let profileFieldAccessibility = (solutionDocument.roles && solutionDocument.roles[currentUserAssessmentRole] && solutionDocument.roles[currentUserAssessmentRole].acl && solutionDocument.roles[currentUserAssessmentRole].acl.entityProfile) ? solutionDocument.roles[currentUserAssessmentRole].acl.entityProfile : "";

        // let entityProfileForm = await database.models.entityTypes.findOne(
        //     solutionDocument.entityTypeId,
        //     {
        //         profileForm: 1
        //     }
        // ).lean();

        // if (!entityProfileForm) {
        //     let responseMessage = messageConstants.apiResponses.ENTITY_PROFILE_FORM_NOT_FOUND;
        //     return resolve({
        //         status: httpStatusCode.bad_request.status,
        //         message: responseMessage
        //     });
        // }

        // let form = [];
        // let entityDocumentTypes = (entityDocument.metaInformation.types) ? entityDocument.metaInformation.types : ["A1"];
        let entityDocumentQuestionGroup = entityDocument.metaInformation.questionGroup
          ? entityDocument.metaInformation.questionGroup
          : ['A1'];
        // let entityProfileFieldsPerEntityTypes = solutionDocument.entityProfileFieldsPerEntityTypes;
        // let filteredFieldsToBeShown = [];

        // if (entityProfileFieldsPerEntityTypes) {
        //     entityDocumentTypes.forEach(entityType => {
        //         if (entityProfileFieldsPerEntityTypes[entityType]) {
        //             filteredFieldsToBeShown.push(...entityProfileFieldsPerEntityTypes[entityType]);
        //         }
        //     })
        // }

        // entityProfileForm.profileForm.forEach(profileFormField => {
        //     if (filteredFieldsToBeShown.includes(profileFormField.field)) {
        //         profileFormField.value = (entityDocument.metaInformation[profileFormField.field]) ? entityDocument.metaInformation[profileFormField.field] : "";
        //         profileFormField.visible = profileFieldAccessibility ? (profileFieldAccessibility.visible.indexOf("all") > -1 || profileFieldAccessibility.visible.indexOf(profileFormField.field) > -1) : true;
        //         profileFormField.editable = profileFieldAccessibility ? (profileFieldAccessibility.editable.indexOf("all") > -1 || profileFieldAccessibility.editable.indexOf(profileFormField.field) > -1) : true;
        //         form.push(profileFormField);
        //     }
        // })

        response.result.entityProfile = {
          _id: entityDocument._id ? entityDocument._id : req.query.entityId,
          entityTypeId: entityDocument.entityTypeId,
          entityType: entityDocument.entityType ? entityDocument.entityType : observationDocument.entityType,
          // form: form
        };

        let solutionDocumentFieldList = await observationsHelper.solutionDocumentFieldListInResponse();

        response.result.solution = await _.pick(solutionDocument, solutionDocumentFieldList);
        // response.result.program = programDocument[0];

        let submissionDocument = {
          entityId: entityDocument._id,
          entityExternalId: entityDocument.metaInformation.externalId ? entityDocument.metaInformation.externalId : '',
          entityInformation: entityDocument.metaInformation,
          solutionId: solutionDocument._id,
          solutionExternalId: solutionDocument.externalId,
          programId: programId,
          programExternalId: programExternalId,
          isAPrivateProgram: solutionDocument.isAPrivateProgram,
          programInformation: programInformation,
          frameworkId: solutionDocument.frameworkId,
          frameworkExternalId: solutionDocument.frameworkExternalId,
          entityTypeId: solutionDocument.entityTypeId,
          entityType: solutionDocument.entityType,
          observationId: observationDocument._id,
          scoringSystem: solutionDocument.scoringSystem,
          isRubricDriven: solutionDocument.isRubricDriven,
          observationInformation: {
            ..._.omit(observationDocument, ['_id', 'entities', 'deleted', '__v']),
          },
          createdBy: observationDocument.createdBy,
          evidenceSubmissions: [],
          entityProfile: {},
          status: 'started',
          userProfile: observationDocument?.userProfile ?? {},
          themes: solutionDocument.themes
        };

        if (solutionDocument.hasOwnProperty('criteriaLevelReport')) {
          submissionDocument['criteriaLevelReport'] = solutionDocument['criteriaLevelReport'];
        }

        if (solutionDocument.referenceFrom === messageConstants.common.PROJECT) {
          submissionDocument['referenceFrom'] = messageConstants.common.PROJECT;
          submissionDocument['project'] = solutionDocument.project;
        }

        let assessment = {};
        assessment.name = solutionDocument.name;
        assessment.description = solutionDocument.description;
        assessment.externalId = solutionDocument.externalId;
        assessment.pageHeading = solutionDocument.pageHeading;
        assessment.endDate = solutionDocument.endDate;
    
        let criteriaId = new Array();
        let criteriaObject = {};
        let criteriaIdArray = gen.utils.getCriteriaIdsAndWeightage(solutionDocument.themes);

        criteriaIdArray.forEach((eachCriteriaId) => {
          criteriaId.push(eachCriteriaId.criteriaId);
          criteriaObject[eachCriteriaId.criteriaId.toString()] = {
            weightage: eachCriteriaId.weightage,
          };
        });

        let criteriaQuestionDocument = await database.models.criteriaQuestions
          .find(
            { _id: { $in: criteriaId } },
            {
              resourceType: 0,
              language: 0,
              keywords: 0,
              concepts: 0,
              createdFor: 0,
            }
          )
          .lean();

        let evidenceMethodArray = {};
        let submissionDocumentEvidences = {};
        let submissionDocumentCriterias = [];
        Object.keys(solutionDocument.evidenceMethods).forEach((solutionEcm) => {
          if (!(solutionDocument.evidenceMethods[solutionEcm].isActive === false)) {
            solutionDocument.evidenceMethods[solutionEcm].startTime = '';
            solutionDocument.evidenceMethods[solutionEcm].endTime = '';
            solutionDocument.evidenceMethods[solutionEcm].isSubmitted = false;
            solutionDocument.evidenceMethods[solutionEcm].submissions = new Array();
          } else {
            delete solutionDocument.evidenceMethods[solutionEcm];
          }
        });
        submissionDocumentEvidences = solutionDocument.evidenceMethods;

        criteriaQuestionDocument.forEach((criteria) => {
          criteria.weightage = criteriaObject[criteria._id.toString()].weightage;

          submissionDocumentCriterias.push(_.omit(criteria, ['evidences']));

          criteria.evidences.forEach((evidenceMethod) => {
            if (submissionDocumentEvidences[evidenceMethod.code] && evidenceMethod.code) {
              if (!evidenceMethodArray[evidenceMethod.code]) {
                evidenceMethod.sections.forEach((ecmSection) => {
                  ecmSection.name = solutionDocument.sections[ecmSection.code];
                });
                _.merge(evidenceMethod, submissionDocumentEvidences[evidenceMethod.code]);
                evidenceMethodArray[evidenceMethod.code] = evidenceMethod;
              } else {
                evidenceMethod.sections.forEach((evidenceMethodSection) => {
                  let sectionExisitsInEvidenceMethod = 0;
                  let existingSectionQuestionsArrayInEvidenceMethod = [];

                  evidenceMethodArray[evidenceMethod.code].sections.forEach((exisitingSectionInEvidenceMethod) => {
                    if (exisitingSectionInEvidenceMethod.code == evidenceMethodSection.code) {
                      sectionExisitsInEvidenceMethod = 1;
                      existingSectionQuestionsArrayInEvidenceMethod = exisitingSectionInEvidenceMethod.questions;
                    }
                  });

                  if (!sectionExisitsInEvidenceMethod) {
                    evidenceMethodSection.name = solutionDocument.sections[evidenceMethodSection.code];
                    evidenceMethodArray[evidenceMethod.code].sections.push(evidenceMethodSection);
                  } else {
                    evidenceMethodSection.questions.forEach((questionInEvidenceMethodSection) => {
                      existingSectionQuestionsArrayInEvidenceMethod.push(questionInEvidenceMethodSection);
                    });
                  }
                });
              }
            }
          });
        });

        submissionDocument.evidences = submissionDocumentEvidences;
        submissionDocument.evidencesStatus = Object.values(submissionDocumentEvidences);
        submissionDocument.criteria = submissionDocumentCriterias;
        submissionDocument.submissionNumber = submissionNumber;

        submissionDocument['appInformation'] = {};

        if (req.headers['x-app-id'] || req.headers.appname) {
          submissionDocument['appInformation']['appName'] = req.headers['x-app-id']
            ? req.headers['x-app-id']
            : req.headers.appname;
        }

        if (req.headers['x-app-ver'] || req.headers.appversion) {
          submissionDocument['appInformation']['appVersion'] = req.headers['x-app-ver']
            ? req.headers['x-app-ver']
            : req.headers.appversion;
        }

        let submissionDoc = await observationsHelper.findSubmission(submissionDocument);

        assessment.submissionId = submissionDoc.result._id;

        if (req.query.ecmMethod && req.query.ecmMethod !== '') {
          if (evidenceMethodArray[req.query.ecmMethod]) {
            evidenceMethodArray = {
              [req.query.ecmMethod]: evidenceMethodArray[req.query.ecmMethod],
            };
          }
        }

        const parsedAssessment = await assessmentsHelper.parseQuestionsV2(
          Object.values(evidenceMethodArray),
          entityDocumentQuestionGroup,
          submissionDoc.result.evidences,
          solutionDocument && solutionDocument.questionSequenceByEcm ? solutionDocument.questionSequenceByEcm : false,
          entityDocument.metaInformation
        );

        assessment.evidences = parsedAssessment.evidences;
        assessment.submissions = parsedAssessment.submissions;
        if (parsedAssessment.generalQuestions && parsedAssessment.generalQuestions.length > 0) {
          assessment.generalQuestions = parsedAssessment.generalQuestions;
        }

        response.result.assessment = assessment;

        return resolve(response);
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
   * @api {get} /assessment/api/v1/observations/complete/:observationId Mark As Completed
   * @apiVersion 1.0.0
   * @apiName Mark As Completed
   * @apiGroup Observations
   * @apiHeader {String} X-authenticated-user-token Authenticity token
   * @apiSampleRequest /assessment/api/v1/observations/complete/:observationId
   * @apiUse successBody
   * @apiUse errorBody
   */

  /**
   * Observation mark as complete.
   * @method
   * @name complete
   * @param {Object} req -request Data.
   * @param {String} req.params._id -observation id.
   * @returns {JSON}
   */

  async complete(req) {
    return new Promise(async (resolve, reject) => {
      try {
        await database.models.observations.updateOne(
          {
            _id: new ObjectId(req.params._id),
            status: { $ne: 'completed' },
            createdBy: req.userDetails.id,
          },
          {
            $set: {
              status: 'completed',
            },
          }
        );

        return resolve({
          message: messageConstants.apiResponses.OBSERVATION_MARKED_COMPLETE,
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
   * @api {get} /assessment/api/v1/observations/importFromFramework?frameworkId:frameworkExternalId&entityType=entityType Create observation solution from framework.
   * @apiVersion 1.0.0
   * @apiName Create observation solution from framework.
   * @apiGroup Observations
   * @apiHeader {String} X-authenticated-user-token Authenticity token
   * @apiParam {String} frameworkId Framework External ID.
   * @apiParam {String} entityType Entity Type.
   * @apiSampleRequest /assessment/api/v1/observations/importFromFramework?frameworkId=CRO-VERSION2-2019&entityType=school
   * @apiUse successBody
   * @apiUse errorBody
   */

  /**
   * Import observation from framework.
   * @method
   * @name importFromFramework
   * @param {Object} req -request Data.
   * @param {String} req.query.frameworkId -framework id.
   * @param {String} req.query.entityType - entity type name.
   * @returns {JSON}
   */

  async importFromFramework(req) {
    return new Promise(async (resolve, reject) => {
      try {
        if (
          !req.query.frameworkId ||
          req.query.frameworkId == '' ||
          !req.query.entityType ||
          req.query.entityType == ''
        ) {
          throw messageConstants.apiResponses.INVALID_PARAMETER;
        }

        let frameworkDocument = await database.models.frameworks
          .findOne({
            externalId: req.query.frameworkId,
          })
          .lean();

        if (!frameworkDocument._id) {
          throw messageConstants.apiResponses.FRAMEWORK_NOT_FOUND;
        }

        // let entityTypeDocument = await database.models.entityTypes.findOne({
        //     name: req.query.entityType,
        //     isObservable: true
        // }, {
        //         _id: 1,
        //         name: 1
        //     }).lean();

        // if (!entityTypeDocument._id) {
        //     throw messageConstants.apiResponses.ENTITY_TYPES_NOT_FOUND;
        // }

        let criteriasIdArray = gen.utils.getCriteriaIds(frameworkDocument.themes);

        let frameworkCriteria = await database.models.criteria.find({ _id: { $in: criteriasIdArray } }).lean();

        let solutionCriteriaToFrameworkCriteriaMap = {};

        await Promise.all(
          frameworkCriteria.map(async (criteria) => {
            criteria.frameworkCriteriaId = criteria._id;

            let newCriteriaId = await database.models.criteria.create(_.omit(criteria, ['_id']));

            if (newCriteriaId._id) {
              solutionCriteriaToFrameworkCriteriaMap[criteria._id.toString()] = newCriteriaId._id;
            }
          })
        );

        let updateThemes = function (themes) {
          themes.forEach((theme) => {
            let criteriaIdArray = new Array();
            let themeCriteriaToSet = new Array();
            if (theme.children) {
              updateThemes(theme.children);
            } else {
              criteriaIdArray = theme.criteria;
              criteriaIdArray.forEach((eachCriteria) => {
                eachCriteria.criteriaId = solutionCriteriaToFrameworkCriteriaMap[eachCriteria.criteriaId.toString()]
                  ? solutionCriteriaToFrameworkCriteriaMap[eachCriteria.criteriaId.toString()]
                  : eachCriteria.criteriaId;
                themeCriteriaToSet.push(eachCriteria);
              });
              theme.criteria = themeCriteriaToSet;
            }
          });
          return true;
        };

        let newSolutionDocument = _.cloneDeep(frameworkDocument);

        updateThemes(newSolutionDocument.themes);

        newSolutionDocument.type = 'observation';
        newSolutionDocument.subType =
          frameworkDocument.subType && frameworkDocument.subType != '' ? frameworkDocument.subType : '';

        newSolutionDocument.externalId = frameworkDocument.externalId + '-OBSERVATION-TEMPLATE';

        newSolutionDocument.frameworkId = frameworkDocument._id;
        newSolutionDocument.frameworkExternalId = frameworkDocument.externalId;

        // newSolutionDocument.entityTypeId = entityTypeDocument._id;
        // newSolutionDocument.entityType = entityTypeDocument.name;
        newSolutionDocument.isReusable = true;

        let newBaseSolution = await database.models.solutions.create(_.omit(newSolutionDocument, ['_id']));

        if (newBaseSolution._id) {
          let result = {
            templateId: newBaseSolution._id,
          };

          let response = {
            message: messageConstants.apiResponses.OBSERVATION_SOLUTION,
            result: result,
          };

          return resolve(response);
        } else {
          throw messageConstants.apiResponses.ERROR_CREATING_OBSERVATION;
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
   * @api {post} /assessment/api/v1/observations/bulkCreate Bulk Create Observations CSV
   * @apiVersion 1.0.0
   * @apiName Bulk Create Observations CSV
   * @apiGroup Observations
   * @apiParam {File} observation  Mandatory observation file of type CSV.
   * @apiUse successBody
   * @apiUse errorBody
   */

  /**
   * Upload bulk observations via csv.
   * @method
   * @name bulkCreate
   * @param {Object} req -request Data.
   * @param {CSV} req.files.observation -Observations csv data .
   * @returns {CSV} - Same uploaded csv with extra field status indicating the particular
   * column is uploaded or not.
   */

  async bulkCreate(req) {
    return new Promise(async (resolve, reject) => {
      try {
        if (!req.files || !req.files.observation) {
          let responseMessage = httpStatusCode.bad_request.message;
          return resolve({
            status: httpStatusCode.bad_request.status,
            message: responseMessage,
          });
        }

        const fileName = `Observation-Upload-Result`;
        let fileStream = new FileStream(fileName);
        let input = fileStream.initStream();

        (async function () {
          await fileStream.getProcessorPromise();
          return resolve({
            isResponseAStream: true,
            fileNameWithPath: fileStream.fileNameWithPath(),
          });
        })();

        let observationData = await csv().fromString(req.files.observation.data.toString());

        let users = [];
        let usersKeycloakIdMap = {};
        let solutionExternalIds = [];
        let entityIds = [];

        observationData.forEach((eachObservationData) => {
          if (
            !eachObservationData['keycloak-userId'] &&
            eachObservationData.user &&
            !users.includes(eachObservationData.user)
          ) {
            users.push(eachObservationData.user);
          } else if (eachObservationData['keycloak-userId'] && eachObservationData['keycloak-userId'] != '') {
            usersKeycloakIdMap[eachObservationData['keycloak-userId']] = true;
          }
          solutionExternalIds.push(eachObservationData.solutionExternalId);
          if (eachObservationData.entityId && eachObservationData.entityId != '') {
            entityIds.push(new ObjectId(eachObservationData.entityId));
          }
        });

        let userIdByExternalId;

        if (users.length > 0) {
          userIdByExternalId = await assessorsHelper.getInternalUserIdByExternalId(req.rspObj.userToken, users);
          if (Object.keys(userIdByExternalId).length > 0) {
            Object.values(userIdByExternalId).forEach((userDetails) => {
              usersKeycloakIdMap[userDetails] = true;
            });
          }
        }

        if (Object.keys(usersKeycloakIdMap).length > 0) {
          let userOrganisationDetails = await observationsHelper.getUserOrganisationDetails(
            Object.keys(usersKeycloakIdMap),
            req.rspObj.userToken
          );

          usersKeycloakIdMap = userOrganisationDetails.data;
        }

        let entityDocument;

        if (entityIds.length > 0) {
          let entityQuery = {
            _id: {
              $in: entityIds,
            },
          };

          let entityProjection = ['entityTypeId', 'entityType'];

          entityDocument = await entitiesHelper.entityDocuments(entityQuery, entityProjection);
        }

        let entityObject = {};

        if (entityDocument && Array.isArray(entityDocument) && entityDocument.length > 0) {
          entityDocument.forEach((eachEntityDocument) => {
            entityObject[eachEntityDocument._id.toString()] = eachEntityDocument;
          });
        }

        let solutionQuery = {
          externalId: {
            $in: solutionExternalIds,
          },
          status: 'active',
          isDeleted: false,
          isReusable: false,
          type: 'observation',
          programId: { $exists: true },
        };

        let solutionProjection = [
          'externalId',
          'frameworkExternalId',
          'frameworkId',
          'name',
          'description',
          'type',
          'subType',
          'entityTypeId',
          'entityType',
          'programId',
          'programExternalId',
        ];

        let solutionDocument = await solutionsHelper.solutionDocuments(solutionQuery, solutionProjection);

        let solutionObject = {};

        if (solutionDocument.length > 0) {
          solutionDocument.forEach((eachSolutionDocument) => {
            solutionObject[eachSolutionDocument.externalId] = eachSolutionDocument;
          });
        }

        for (let pointerToObservation = 0; pointerToObservation < observationData.length; pointerToObservation++) {
          let solution;
          let entityDocument = {};
          let observationHelperData;
          let currentData = observationData[pointerToObservation];
          let csvResult = {};
          let status;
          let userId;
          let userOrganisations;

          Object.keys(currentData).forEach((eachObservationData) => {
            csvResult[eachObservationData] = currentData[eachObservationData];
          });

          try {
            if (currentData['keycloak-userId'] && currentData['keycloak-userId'] !== '') {
              userId = currentData['keycloak-userId'];
            } else {
              if (userIdByExternalId[currentData.user] === '') {
                throw new Error('Keycloak id for user is not present');
              }

              userId = userIdByExternalId[currentData.user];
            }

            if (userId == '') {
              throw new Error(messageConstants.apiResponses.USER_NOT_FOUND);
            }

            if (
              !usersKeycloakIdMap[userId] ||
              !Array.isArray(usersKeycloakIdMap[userId].rootOrganisations) ||
              usersKeycloakIdMap[userId].rootOrganisations.length < 1
            ) {
              throw new Error(messageConstants.apiResponses.USER_ORGANISATION_DETAILS_NOT_FOUND);
            } else {
              userOrganisations = usersKeycloakIdMap[userId];
            }

            if (solutionObject[currentData.solutionExternalId] !== undefined) {
              solution = solutionObject[currentData.solutionExternalId];
            } else {
              throw new Error(messageConstants.apiResponses.SOLUTION_NOT_FOUND);
            }

            if (currentData.entityId && currentData.entityId != '') {
              if (entityObject[currentData.entityId.toString()] !== undefined) {
                entityDocument = entityObject[currentData.entityId.toString()];
              } else {
                throw new Error(messageConstants.apiResponses.ENTITY_NOT_FOUND);
              }
            }

            observationHelperData = await observationsHelper.bulkCreate(
              userId,
              solution,
              entityDocument,
              userOrganisations
            );
            status = observationHelperData.status;
          } catch (error) {
            status = error.message;
          }

          csvResult['status'] = status;
          input.push(csvResult);
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
   * @api {post} /assessment/api/v1/observations/update/:observationId Update Observation Details
   * @apiVersion 1.0.0
   * @apiName Update Observation Details
   * @apiGroup Observations
   * @apiSampleRequest /assessment/api/v1/observations/update/5cd955487e100b4dded3ebb3
   * @apiUse successBody
   * @apiUse errorBody
   */

  /**
   * Update observations.
   * @method
   * @name update
   * @param {Object} req -request Data.
   * @param {String} req.body.name -name of the observation to update.
   * @param {String} req.body.description -description of the observation to update.
   * @returns {JSON} message
   */

  async update(req) {
    return new Promise(async (resolve, reject) => {
      try {
        let updateQuery = {};
        updateQuery['$set'] = {};

        if (req.body.name) {
          updateQuery['$set']['name'] = req.body.name;
        }

        if (req.body.description) {
          updateQuery['$set']['description'] = req.body.description;
        }

        let observationDocument = await database.models.observations
          .findOneAndUpdate(
            {
              _id: req.params._id,
              createdBy: req.userDetails.userId,
              status: { $ne: 'inactive' },
            },
            updateQuery
          )
          .lean();

        if (!observationDocument) {
          throw messageConstants.apiResponses.OBSERVATION_NOT_FOUND;
        }

        return resolve({
          message: messageConstants.apiResponses.OBSERVATION_UPDATED,
        });
      } catch (error) {
        return reject({
          status: error.status || httpStatusCode.internal_server_error.status,
          message: error.message || httpStatusCode.internal_server_error.message,
        });
      }
    });
  }

  /**
   * @api {get} /assessment/api/v1/observations/delete/:observationId Delete an Observation
   * @apiVersion 1.0.0
   * @apiName Delete an Observation
   * @apiGroup Observations
   * @apiHeader {String} X-authenticated-user-token Authenticity token
   * @apiSampleRequest /assessment/api/v1/observations/delete/:observationId
   * @apiUse successBody
   * @apiUse errorBody
   */

  /**
   * Delete observations.
   * @method
   * @name delete
   * @param {Object} req -request Data.
   * @param {String} req.params._id -observation id.
   * @returns {JSON} message
   */

  async delete(req) {
    return new Promise(async (resolve, reject) => {
      try {
        await database.models.observations.updateOne(
          {
            _id: new ObjectId(req.params._id),
            createdBy: req.userDetails.id,
          },
          {
            $set: {
              status: 'inactive',
            },
          }
        );

        return resolve({
          message: messageConstants.apiResponses.OBSERVATION_DELETED,
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
     * @api {get} /assessment/api/v1/observations/pendingObservations Pending Observations
     * @apiVersion 1.0.0
     * @apiName Pending Observations
     * @apiGroup Observations
     * @apiHeader {String} X-authenticated-user-token Authenticity token
     * @apiSampleRequest /assessment/api/v1/observations/pendingObservations
     * @apiUse successBody
     * @apiUse errorBody
     * @apiParamExample {json} Response:
        {
            "message": "Pending Observations",
            "status": 200,
            "result": [
                {
                    "_id": "5d31a14dbff58d3d65ede344",
                    "userId": "e97b5582-471c-4649-8401-3cc4249359bb",
                    "solutionId": "5c6bd309af0065f0e0d4223b",
                    "createdAt": "2019-07-19T10:54:05.638Z",
                    "entityId": "5cebbefe5943912f56cf8e16",
                    "observationId": "5d1070326f6ed50bc34aec2c"
                }
            ]
        }
    */

  /**
   * Observations status not equal to completed.
   * @method
   * @name pendingObservations
   * @returns {JSON} List of pending observations.
   */

  async pendingObservations() {
    return new Promise(async (resolve, reject) => {
      try {
        let pendingObservationDocuments = await observationsHelper.pendingObservations();

        return resolve({
          message: messageConstants.apiResponses.PENDING_OBSERVATION,
          result: pendingObservationDocuments,
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
    * @api {get} /assessment/api/v1/observations/completedObservations Completed Observations
    * @apiVersion 1.0.0
    * @apiName Completed Observations
    * @apiGroup Observations
    * @apiParam {String} fromDate From Date
    * @apiHeader {String} X-authenticated-user-token Authenticity token
    * @apiSampleRequest /assessment/api/v1/observations/completedObservations
    * @apiUse successBody
    * @apiUse errorBody
    * @apiParamExample {json} Response:
        {
            "message": "Completed Observations",
            "status": 200,
            "result": [
                {
                    "_id": "5d2702e60110594953c1614a",
                    "userId": "e97b5582-471c-4649-8401-3cc4249359bb",
                    "solutionId": "5c6bd309af0065f0e0d4223b",
                    "createdAt": "2019-06-27T08:55:16.718Z",
                    "entityId": "5cebbefe5943912f56cf8e16",
                    "observationId": "5d1483c9869c433b0440c5dd"
                }
            ]
        }
    */

  /**
   * Completed Observations.
   * @method
   * @name completedObservations
   * @returns {JSON} List of completed observations.
   */

  async completedObservations(req) {
    return new Promise(async (resolve, reject) => {
      try {
        let completedObservationDocuments = await observationsHelper.completedObservations(
          req.query.fromDate,
          req.query.toDate
        );

        return resolve({
          message: messageConstants.apiResponses.COMPLETED_OBSERVATION,
          result: completedObservationDocuments,
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
* @api {get} /assessment/api/v1/observations/details/:observationId 
* Observations details.
* @apiVersion 1.0.0
* @apiGroup Observations
* @apiHeader {String} X-authenticated-user-token Authenticity token
* @apiSampleRequest /assessment/api/v1/observations/details/5de8a220c210d4700813e695
* @apiUse successBody
* @apiUse errorBody
* @apiParamExample {json} Response:
{
    "message": "Observation details fetched successfully",
    "status": 200,
    "result": {
        "_id": "5d282bbcc1e91c71b6c025ee",
        "entities": [
            {
                "_id": "5d5bacc27b68e809c81f4994",
                "deleted": false,
                "entityTypeId": "5d28233dd772d270e55b4072",
                "entityType": "school",
                "metaInformation": {
                    "externalId": "1355120",
                    "districtId": "",
                    "districtName": "",
                    "zoneId": "NARELA",
                    "name": "SHAHBAD DAIRY C-I",
                    "types": [
                        "A1"
                    ],
                    "addressLine1": "",
                    "city": "New Delhi",
                    "pincode": "",
                    "state": "New Delhi",
                    "country": "India"
                },
                "updatedBy": "7996ada6-4d46-4e77-b350-390dee883892",
                "createdBy": "7996ada6-4d46-4e77-b350-390dee883892",
                "updatedAt": "2019-08-20T08:18:10.985Z",
                "createdAt": "2019-08-20T08:18:10.985Z",
                "__v": 0
            }
        ],
        "deleted": false,
        "name": "CRO-2019 By",
        "description": "CRO-2019m",
        "status": "inactive",
        "solutionId": "5d282bbcc1e91c71b6c025e6",
        "solutionExternalId": "CRO-2019-TEMPLATE",
        "frameworkId": "5d28233fd772d270e55b4199",
        "frameworkExternalId": "CRO-2019",
        "entityTypeId": "5d28233dd772d270e55b4072",
        "entityType": "school",
        "createdBy": "6e24b29b-8b81-4b70-b1b5-fa430488b1cf",
        "updatedAt": "2019-10-16T06:34:54.224Z",
        "createdAt": "2019-07-01T14:05:11.706Z",
        "startDate": "2018-07-12T06:05:50.963Z",
        "endDate": "2020-07-12T06:05:50.963Z",
        "__v": 0,
        "count": 11
    }
}
*/
  /**
   *  Observation details.
   * @method
   * @name details
   * @param  {Request} req request body.
   * @returns {JSON} Response consists of message,status and result.
   * Result will have the details of the observations including entities details.
   */

  /**
   * Observation details.
   * @method
   * @name details
   * @param {Object} req request data
   * @param {String} req.params._id observation id.
   * @returns {JSON} List of completed observations.
   */

  async details(req) {
    return new Promise(async (resolve, reject) => {
      try {
        let observationDetails = await observationsHelper.details(req.params._id);

        return resolve({
          message: messageConstants.apiResponses.OBSERVATION_FETCHED,
          result: observationDetails,
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
    * @api {post} /assessment/api/v1/observations/bulkCreateByUserRoleAndEntity 
    * Bulk create observations by entity and role.
    * @apiVersion 1.0.0
    * @apiGroup Observations
    * @apiSampleRequest /assessment/api/v1/observations/bulkCreateByUserRoleAndEntity
    * @apiParamExample {json} Request:
    * {
    *  "entityId": "5f2449eb626a540f40817ef5",
    *  "role": "CRP",
    *  "solutionExternalId": "TAF-solution"
     }
    * @apiUse successBody
    * @apiUse errorBody
    */

  /**
   * Bulk create observations by entity and role.
   * @method
   * @name bulkCreateByUserRoleAndEntity
   * @param {Object} req - request data.
   * @param {String} req.body.entityId - entityId
   * @param {String} req.body.role - role
   * @param {String} req.body.solutionExternalId - solution external id
   * @returns {CSV} Assigned observations to user.
   */

  async bulkCreateByUserRoleAndEntity(req) {
    return new Promise(async (resolve, reject) => {
      try {
        let observations = await observationsHelper.bulkCreateByUserRoleAndEntity(req.body, req.rspObj.userToken);

        return resolve(observations);
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
  * @api {get} /assessment/api/v1/observations/submissionStatus/:observationId?entityId=:entityId
  * @apiVersion 1.0.0
  * @apiName Get Observation Submission Status
  * @apiGroup Observations
  * @apiSampleRequest /assessment/api/v1/observations/submissionStatus/5d1a002d2dfd8135bc8e1617?entityId=5cee7d1390013936552f6a8f
  * @apiUse successBody
  * @apiUse errorBody
  * @apiParamExample {json} Response:
  * {
    "message": "Successfully fetched observation submissions",
    "status": 200,
    "result": [
        {
            "_id": "5cee8c5390013936552f6a92",
            "status": "started",
            "submissionNumber": 1
        }
    ]
 }

  */
  /**
   * Get observation submission status
   * @method
   * @name submissionStatus
   * @param {Object} req - requested data.
   * @param {String} req.params._id - observation submission id.
   * @returns {JSON} consists of status of the observation submission.
   */

  async submissionStatus(req) {
    return new Promise(async (resolve, reject) => {
      try {
        let submissionDocument = await observationsHelper.submissionStatus(
          req.params._id,
          req.query.entityId,
          req.userDetails.userId
        );

        submissionDocument.result = submissionDocument.data;

        return resolve(submissionDocument);
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
    * @api {post} /assessment/api/v1/observations/getObservation?page=:page&limit=:limit&search=:search
    * List of observations and targetted ones.
    * @apiVersion 1.0.0
    * @apiGroup Observations
    * @apiSampleRequest /assessment/api/v1/observations/getObservation?page=1&limit=10&search=a
    * @apiParamExample {json} Request:
    * {
    *   "role" : "HM",
   		"state" : "236f5cff-c9af-4366-b0b6-253a1789766a",
        "district" : "1dcbc362-ec4c-4559-9081-e0c2864c2931",
        "school" : "c5726207-4f9f-4f45-91f1-3e9e8e84d824"
    }
    * @apiParamExample {json} Response:
    {
    "message": "Targeted observations fetched successfully",
    "status": 200,
    "result": {
        "data": [
            {
                "_id": "5f9288fd5e25636ce6dcad66",
                "name": "obs1",
                "description": "observation1",
                "solutionId": "5f9288fd5e25636ce6dcad65",
                "programId": "5d287326652f311044f41dbb"
            },
            {
                "_id": "5fc7aa9e73434430731f6a10",
                "solutionId": "5fb4fce4c7439a3412ff013b",
                "programId": "5f5b216a9c70bd2973aee29f",
                "name": "My Solution",
                "description": "My Solution Description"
            }
        ],
        "count": 2
    }
}
    * @apiUse successBody
    * @apiUse errorBody
    */

  /**
   * List of observations and targetted ones.
   * @method
   * @name getObservation
   * @param {Object} req - request data.
   * @returns {JSON} List of observations with targetted ones.
   */

  async getObservation(req) {
    return new Promise(async (resolve, reject) => {
      try {
        let observations = await observationsHelper.getObservation(
          req.body,
          req.userDetails.userId,
          req.userDetails.userToken,
          req.pageSize,
          req.pageNo,
          req.searchText
        );

        observations['result'] = observations.data;

        return resolve(observations);
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
    * @api {get} /assessment/api/v1/observations/userAssigned?page=:page&limit=:limit&search=:search&filter=:filter
    * List of user assigned observations.
    * @apiVersion 1.0.0
    * @apiGroup Observations
    * @apiSampleRequest /assessment/api/v1/observations/userAssigned?page=1&limit=10&search=a&filter=assignedToMe
    * @apiParamExample {json} Response:
    {
    "message": "List of user assigned observations",
    "status": 200,
    "result": {
        "data": [
            {
                "_id": "5f9288fd5e25636ce6dcad66",
                "name": "obs1",
                "description": "observation1",
                "solutionId": "5f9288fd5e25636ce6dcad65",
                "programId": "5d287326652f311044f41dbb"
            },
            {
                "_id": "5fc7aa9e73434430731f6a10",
                "solutionId": "5fb4fce4c7439a3412ff013b",
                "programId": "5f5b216a9c70bd2973aee29f",
                "name": "My Solution",
                "description": "My Solution Description"
            }
        ],
        "count": 2
    }
}
    * @apiUse successBody
    * @apiUse errorBody
    */

  /**
   * List of user assigned observations.
   * @name userAssigned
   * @param {Object} req - request data.
   * @returns {JSON} List of observations with targetted ones.
   */

  async userAssigned(req) {
    return new Promise(async (resolve, reject) => {
      try {
        let observations = await observationsHelper.userAssigned(
          req.userDetails.userId,
          req.pageNo,
          req.pageSize,
          req.searchText,
          req.query.filter
        );

        observations['result'] = observations.data;

        return resolve(observations);
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
    * @api {post} /assessment/api/v1/observations/entities/:observationId?solutionId=:solutionId
    * List of observations entities.
    * @apiVersion 1.0.0
    * @apiGroup Observations
    * @apiSampleRequest /assessment/api/v1/observations/entities?solutionId=5fec29afd1d6d98686a07156
    * @apiParamExample {json} Request:
    * {
    *   "role" : "HM",
   		"state" : "236f5cff-c9af-4366-b0b6-253a1789766a",
        "district" : "1dcbc362-ec4c-4559-9081-e0c2864c2931",
        "school" : "c5726207-4f9f-4f45-91f1-3e9e8e84d824"
    }
    * @apiParamExample {json} Response:
    {
    "message": "Observation entities fetched successfully",
    "status": 200,
    "result": {
        "_id": "60004c685c1630103719a1ea",
        "entities": [
            {
                "_id": "5db1dd3e8a8e070bedca6c44",
                "externalId": "1514114",
                "name": "PROFESSORS GLOBAL SCHOOL, Kh No.46/11 Baprola Village, Delhi",
                "submissionsCount": 0
            }
        ]
    }}
    * @apiUse successBody
    * @apiUse errorBody
    */

  /**
   * List of entities in observation.
   * @method
   * @name entities
   * @param {Object} req - request data.
   * @returns {JSON} List of entities in observation.
   */

  async entities(req) {
    return new Promise(async (resolve, reject) => {
      try {
        let observations = await observationsHelper.entities(
          req.userDetails.userId,
          req.userDetails.userToken,
          req.params._id ? req.params._id : '',
          req.query.solutionId,
          req.body
        );

        observations['result'] = observations.data;

        return resolve(observations);
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
