/**
 * name : programsController.js
 * author : Akash
 * created-date : 20-Jan-2019
 * Description : Programs related information
 */

// Dependencies
const submissionsHelper = require(MODULES_BASE_PATH + '/submissions/helper');
const insightsHelper = require(MODULES_BASE_PATH + '/insights/helper');
const solutionsHelper = require(MODULES_BASE_PATH + '/solutions/helper');
const programsHelper = require(MODULES_BASE_PATH + '/programs/helper');
const userService = require(ROOT_PATH + '/generics/services/users');
/**
 * Programs
 * @class
 */
module.exports = class Programs extends Abstract {
  constructor() {
    super(programsSchema);
  }

  static get name() {
    return 'programs';
  }

  find(req) {
    return super.find(req);
  }

  /**
  * @api {get} /samiksha/v1/programs/list List all the programs
  * @apiVersion 1.0.0
  * @apiName Fetch Program List
  * @apiGroup Program
  * @apiParamExample {json} Response:
    "result": [
      {
        "_id": "5b98d7b6d4f87f317ff615ee",
        "externalId": "PROGID01",
        "name": "DCPCR School Development Index 2018-19",
        "description": "DCPCR School Development Index 2018-19",
        "assessments": [
          {
            "_id": "5b98fa069f664f7e1ae7498c",
            "externalId": "EF-DCPCR-2018-001",
            "name": "DCPCR Assessment Framework 2018",
            "description": "DCPCR Assessment Framework 2018"
          }
        ]
      }
    ]
  * @apiUse successBody
  * @apiUse errorBody
  */

  /**
   * List programs.
   * @method
   * @name list
   * @param {Object} req - Requested data.
   * @param {Array} req.query.page - Page number.
   * @param {Array} req.query.limit - Page Limit.
   * @param {Array} req.query.search - Search text.
   * @returns {JSON} List programs data.
   */

  async list(req) {
    return new Promise(async (resolve, reject) => {
      try {

        let tenantDetails = await userService.fetchPublicTenantDetails(req.userDetails.tenantData.tenantId);
        if (!tenantDetails.success || !tenantDetails?.data?.meta) {
          throw ({
            status: httpStatusCode.internal_server_error.status,
            message: messageConstants.apiResponses.FAILED_TO_FETCH_TENANT_DETAILS,
          });
        }
        let tenantPublicDetailsMetaField = tenantDetails.data.meta;
        let queryResult = gen.utils.targetingQuery(
          req.body,
          tenantPublicDetailsMetaField,
          messageConstants.common.MANDATORY_SCOPE_FIELD,
          messageConstants.common.OPTIONAL_SCOPE_FIELD
        )

        let listOfPrograms = await programsHelper.list(
          {
            tenantId: req.userDetails.tenantData.tenantId,
            ...queryResult, // targetingQuery
          }, //filter
          '', // projection
          req.pageNo, //middleware convert req.params.page as req.PageNo
          req.pageSize, //middleware convert req.params.linit as req.PageSize
          req.query.searchText
        );

        listOfPrograms['result'] = listOfPrograms.data;

        return resolve(listOfPrograms);
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
  * @api {post} /samiksha/v1/programs/create Create Program
  * @apiVersion 1.0.0
  * @apiName create
  * @apiGroup Programs
  * @apiSampleRequest /samiksha/v1/programs/create
  * @apiHeader {String} X-authenticated-user-token Authenticity token 
  * @apiParamExample {json} Request-Body:
  * {
      "externalId" : "PROGID01",
      "name" : "DCPCR School Development Index 2018-19",
      "description" : "DCPCR School Development Index 2018-19",
      "isDeleted" : false,
      "resourceType" : [ 
          "program"
      ],
      "language" : [ 
          "English"
      ],
      "keywords" : [],
      "concepts" : [],
      "userId":"a082787f-8f8f-42f2-a706-35457ca6f1fd",
      "imageCompression" : {
          "quality" : 10
      },
      "components" : [ 
          "5b98fa069f664f7e1ae7498c"
      ],
      "scope" : {
          "entityType" : "state",
          "entities" : ["5d6609ef81a57a6173a79e78"],
          "roles" : ["HM"]
      }
      "startDate" : "2023-04-06T09:35:00.000Z",
      "endDate" : ""2024-04-06T09:35:00.000Z" // optional
    }
  * @apiParamExample {json} Response:
   {
    "message": "Program created successfully",
    "status": 200,
    "result": {
        "_id": "5ff09aa4a43c952a32279234"
    }
   } 
  * @apiUse successBody
  * @apiUse errorBody
  */

  /**
   * Create program.
   * @method {POST}
   * @name create
   * @param {Object} req - requested data.
   * @returns {JSON} - created program document.
   */

  async create(req) {
    return new Promise(async (resolve, reject) => {
      try {
        req.body.userId = req.userDetails.userId;
        req.body.tenantData = req.userDetails.tenantAndOrgInfo;

        if(req.body.tenantId){
          delete req.body.tenantId;
        }

        if(req.body.orgId){
          delete req.body.orgId;
        }

        let programCreationData = await programsHelper.create(
          req.body,
          true, // checkDate,
          req.userDetails
        );

        return resolve({
          message: messageConstants.apiResponses.PROGRAMS_CREATED,
          result: _.pick(programCreationData, ['_id']),
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
  * @api {post} /samiksha/v1/programs/update/:programId Update Program
  * @apiVersion 1.0.0
  * @apiName Update
  * @apiGroup Programs
  * @apiSampleRequest /samiksha/v1/programs/update/5ff09aa4a43c952a32279234
  * @apiHeader {String} X-authenticated-user-token Authenticity token 
  * @apiParamExample {json} Request-Body:
  * {
      "externalId" : "PROGID01",
      "name" : "DCPCR School Development Index 2018-19",
      "description" : "DCPCR School Development Index 2018-19",
      "isDeleted" : false,
      "resourceType" : [ 
          "program"
      ],
      "language" : [ 
          "English"
      ],
      "keywords" : [],
      "concepts" : [],
      "userId":"a082787f-8f8f-42f2-a706-35457ca6f1fd",
      "imageCompression" : {
          "quality" : 10
      },
      "components" : [ 
          "5b98fa069f664f7e1ae7498c"
      ],
      "scope" : {
          "entityType" : "state",
          "entities" : ["5d6609ef81a57a6173a79e78"],
          "roles" : ["HM"]
      }
      "startDate" : "2023-04-06T09:35:00.000Z",
      "endDate" : ""2024-04-06T09:35:00.000Z" // optional
    }
  * @apiParamExample {json} Response:
  {
    "message": "Program updated successfully",
    "status": 200,
    "result": {
        "_id": "5ff09aa4a43c952a32279234"
    }
   } 
  * @apiUse successBody
  * @apiUse errorBody
  */

  /**
   * Update program.
   * @method
   * @name update
   * @param {Object} req - requested data.
   * @param {Object}
   * @returns {JSON} -
   */

  async update(req) {
    try {
      let tenantFilter =  req.userDetails.tenantAndOrgInfo;
      let programUpdationData = await programsHelper.update(
        req.params._id,
        req.body,
        req.userDetails.userId,
        true, //checkDate
        tenantFilter,
        req.userDetails
      );

      programUpdationData.result = programUpdationData.data;
      return programUpdationData;
    } catch (error) {
      throw {
        status: error.status || httpStatusCode.internal_server_error.status,
        message: error.message || httpStatusCode.internal_server_error.message,
        errorObject: error,
      };
    }
  }

  /**
    * @api {post} /samiksha/v1/programs/addRolesInScope/:programId Add roles in programs
    * @apiVersion 1.0.0
    * @apiName 
    * @apiGroup Programs
    * @apiParamExample {json} Request-Body:
    * {
    * "roles" : ["DEO","SPD"]
    }
    * @apiHeader {String} X-authenticated-user-token Authenticity token
    * @apiSampleRequest /samiksha/v1/programs/addRolesInScope/5ffbf8909259097d48017bbf
    * @apiUse successBody
    * @apiUse errorBody
    * @apiParamExample {json} Response:
    * {
        "message": "Successfully added roles in program scope",
        "status": 200
      }
    */

  /**

  /**
   * Add roles in program scope
   * @method
   * @name addRolesInScope
   * @param {Object} req - requested data.
   * @param {String} req.params._id - program id.
   * @param {Array} req.body.roles - Roles to be added.
   * @returns {Array} Program scope roles.
   */

  async addRolesInScope(req) {
    return new Promise(async (resolve, reject) => {
      try {
        let programDetails = await programsHelper.addRolesInScope(req.params._id, req.body.roles,req.userDetails.tenantData);

        return resolve(programDetails);
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
    * @api {post} /samiksha/v1/programs/addEntitiesInScope/:programId Add roles in programs
    * @apiVersion 1.0.0
    * @apiName 
    * @apiGroup Programs
    * @apiParamExample {json} Request-Body:
    * {
      "entities" : ["5f33c3d85f637784791cd830"]
    }
    * @apiHeader {String} X-authenticated-user-token Authenticity token
    * @apiSampleRequest /samiksha/v1/programs/addEntitiesInScope/5ffbf8909259097d48017bbf
    * @apiUse successBody
    * @apiUse errorBody
    * @apiParamExample {json} Response:
    * {
        "message": "Successfully added entities in program scope",
        "status": 200
      }
    */

  /**
   * Add entities in program scope
   * @method
   * @name addEntitiesInScope
   * @param {Object} req - requested data.
   * @param {String} req.params._id - program id.
   * @param {Array} req.body.entities - Entities to be added.
   * @returns {Array} Program scope roles.
   */

  async addEntitiesInScope(req) {
    return new Promise(async (resolve, reject) => {
      try {
        let tenantFilter =  req.userDetails.tenantAndOrgInfo;
        let programDetails = await programsHelper.addEntitiesInScope(
          req.params._id,
          req.body.entities,
          tenantFilter
        );

        return resolve(programDetails);
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
    * @api {post} /samiksha/v1/programs/removeRolesInScope/:programId Add roles in programs
    * @apiVersion 1.0.0
    * @apiName 
    * @apiGroup Programs
    * @apiParamExample {json} Request-Body:
    * {
    * "roles" : ["DEO","SPD"]
    }
    * @apiHeader {String} X-authenticated-user-token Authenticity token
    * @apiSampleRequest /samiksha/v1/programs/removeRolesInScope/5ffbf8909259097d48017bbf
    * @apiUse successBody
    * @apiUse errorBody
    * @apiParamExample {json} Response:
    * {
        "message": "Successfully removed roles in program scope",
        "status": 200
      }
    */

  /**
   * Remove roles in program scope
   * @method
   * @name removeRolesInScope
   * @param {Object} req - requested data.
   * @param {String} req.params._id - program id.
   * @param {Array} req.body.roles - Roles to be added.
   * @returns {Array} Program scope roles.
   */

  async removeRolesInScope(req) {
    return new Promise(async (resolve, reject) => {
      try {
        let programDetails = await programsHelper.removeRolesInScope(req.params._id, req.body.roles, req.userDetails.tenantData);

        return resolve(programDetails);
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
    * @api {post} /samiksha/v1/programs/removeEntitiesInScope/:programId Add roles in programs
    * @apiVersion 1.0.0
    * @apiName 
    * @apiGroup Programs
    * @apiParamExample {json} Request-Body:
    * {
      "entities" : ["5f33c3d85f637784791cd830"]
    }
    * @apiHeader {String} X-authenticated-user-token Authenticity token
    * @apiSampleRequest /samiksha/v1/programs/removeEntitiesInScope/5ffbf8909259097d48017bbf
    * @apiUse successBody
    * @apiUse errorBody
    * @apiParamExample {json} Response:
    * {
        "message": "Successfully removed entities in program scope",
        "status": 200
      }
    */

  /**
   * Remove entities in program scope
   * @method
   * @name removeEntitiesInScope
   * @param {Object} req - requested data.
   * @param {String} req.params._id - program id.
   * @param {Array} req.body.entities - Entities to be added.
   * @returns {Array} Program scope roles.
   */

  async removeEntitiesInScope(req) {
    return new Promise(async (resolve, reject) => {
      try {
        let programDetails = await programsHelper.removeEntitiesInScope(req.params._id, req.body.entities,req.userDetails.tenantData);

        return resolve(programDetails);
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
    * @api {get} /samiksha/v1/programs/details/:programId Program Details
    * @apiVersion 1.0.0
    * @apiName Program Details
    * @apiGroup Programs
    * @apiHeader {String} X-authenticated-user-token Authenticity token
    * @apiSampleRequest /samiksha/v1/programs/details/5ffbf8909259097d48017bbf
    * @apiUse successBody
    * @apiUse errorBody
    * @apiParamExample {json} Response:
    * {
    "message": "Program details fetched successfully",
    "status": 200,
    "result": {

      }
    }
    */

  /**
   * Details of the program
   * @method
   * @name details
   * @param {Object} req - requested data.
   * @param {String} req.params._id - program id.
   * @returns {Array} Program scope roles.
   */

  async details(req) {
    return new Promise(async (resolve, reject) => {
      try {
        let programData = await programsHelper.details(req.params._id,req.userDetails.tenantData);

        programData['result'] = programData.data;

        return resolve(programData);
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
    * @api {get} /samiksha/v1/programs/join/:programId 
    * @apiVersion 1.0.0
    * @apiName Program Join
    * @apiGroup Programs
    * @apiParamExample {Json} RequestBody
    * {
         "userRoleInformation": {
               "district": "2f76dcf5-e43b-4f71-a3f2-c8f19e1fce03",
                "block": "966c3be4-c125-467d-aaff-1eb1cd525923",
                "state": "bc75cc99-9205-463e-a722-5326857838f8",
                "school": "28226200910",
                "role": "HM,DEO,MEO,CRP,Complex HM,SPD"
          },
         "isResource": true,
         "consentShared": true
      }
    * @apiHeader {String} X-authenticated-user-token Authenticity token
    * @apiHeader {String} X-App-Ver Appversion
    * @apiSampleRequest /samiksha/v1/programs/join/5ffbf8909259097d48017bbf
    * @apiUse successBody
    * @apiUse errorBody
    * @apiParamExample {json} Response:
    * 
    */

  /**
   * join program
   * @method
   * @name join
   * @param {Object} req - requested data.
   * @param {String} req.params._id - program id.
   * @returns {Object} Program join status.
   */

  async join(req) {
    return new Promise(async (resolve, reject) => {
      try {
        let programJoin = await programsHelper.join(
          req.params._id,
          req.body,
          req.userDetails.userId,
          req.userDetails.userToken,
          req.headers['x-app-id'] ? req.headers['x-app-id'] : req.headers.appname ? req.headers.appname : '',
          req.headers['x-app-ver'] ? req.headers['x-app-ver'] : req.headers.appversion ? req.headers.appversion : '',
          req.headers['internal-access-token'] ? true : req.headers.internalAccessToken ? true : false,
          req.userDetails.tenantData
        );
        programJoin['result'] = programJoin.data;
        return resolve(programJoin);
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
  * @api {get} /samiksha/v1/programs/entityList?solutionId=""&search="" Fetch Entity List
  * @apiVersion 1.0.0
  * @apiName Fetch Entity List 
  * @apiGroup Program
  * @apiParam {String} solutionId Solution ID.
  * @apiParam {String} Page Page.
  * @apiParam {String} Limit Limit.
  * @apiSampleRequest /samiksha/v1/programs/entityList?solutionId=5c5693fd28466d82967b9429&search=
  * @apiParamExample {json} Response:
    "result": {
        "totalCount": 54,
        "entityInformation": [
          {
            "externalId": "EXC1001",
            "addressLine1": "Chaitanya Nagar, Gajuwaka, Visakhapatnam, Andhra Pradesh",
            "name": "Chalapathi School",
            "administration": "",
            "status": ""
          }
        ]
      }  
  * @apiUse successBody
  * @apiUse errorBody
  */

  /**
   * List of entity.
   * @method
   * @name entityList
   * @param req - request data.
   * @param req.query.solutionId -solutionId
   * @returns {JSON} - Entity list.
   */

  async entityList(req) {
    return new Promise(async (resolve, reject) => {
      try {
        let solutionId = req.query.solutionId;

        let result = {};

        let solutionDocument = await database.models.solutions
          .findOne({ _id: ObjectId(solutionId) }, { entities: 1 })
          .lean();

        let limitValue = !req.pageSize ? '' : req.pageSize;
        let skipValue = !req.pageNo ? '' : req.pageSize * (req.pageNo - 1);

        let queryObject = {};
        queryObject['_id'] = { $in: solutionDocument.entities };
        if (req.searchText != '') {
          queryObject['$or'] = [
            { 'metaInformation.name': new RegExp(req.searchText, 'i') },
            { 'metaInformation.externalId': new RegExp(req.searchText, 'i') },
          ];
        }

        let entityDocuments = await database.models.entities
          .find(queryObject, {
            'metaInformation.name': 1,
            'metaInformation.addressLine1': 1,
            'metaInformation.administration': 1,
            'metaInformation.externalId': 1,
          })
          .limit(limitValue)
          .skip(skipValue)
          .lean();

        let totalCount = await database.models.entities.countDocuments(queryObject);

        let submissionDocument = await database.models.submissions
          .find({ entityId: { $in: entityDocuments.map((entity) => entity._id) } }, { status: 1, entityId: 1 })
          .lean();

        let submissionEntityMap = _.keyBy(submissionDocument, 'entityId');

        result['totalCount'] = totalCount;

        result['entityInformation'] = entityDocuments.map((eachEntityDocument) => {
          let status = submissionEntityMap[eachEntityDocument._id.toString()]
            ? submissionEntityMap[eachEntityDocument._id.toString()].status
            : '';
          return {
            externalId: eachEntityDocument.metaInformation.externalId,
            addressLine1: eachEntityDocument.metaInformation.addressLine1,
            name: eachEntityDocument.metaInformation.name,
            administration: eachEntityDocument.metaInformation.administration,
            status: submissionsHelper.mapSubmissionStatus(status) || status,
          };
        });

        return resolve({ message: messageConstants.apiResponses.ENTITY_LIST, result: result });
      } catch (error) {
        return reject({
          status: error.status || httpStatusCode.internal_server_error.status,
          message: error.message || httpStatusCode.internal_server_error.message,
        });
      }
    });
  }

  /**
  * @api {get} /samiksha/v1/programs/userEntityList?solutionId="" Fetch User Entity List
  * @apiVersion 1.0.0
  * @apiName Fetch User Entity List 
  * @apiGroup Program
  * @apiParam {String} SolutionId Solution ID.
  * @apiParam {String} Page Page.
  * @apiParam {String} Limit Limit.
  * @apiSampleRequest /samiksha/v1/programs/userEntityList?solutionId=5b98fa069f664f7e1ae7498c
  * @apiParamExample {json} Response:
  * "result": {
        "entities": [
          {
           "_id": "5bfe53ea1d0c350d61b78d3d",
           "isSingleEntityHighLevel": true,
           "isSingleEntityDrillDown": true,
           "externalId": "1412153",
           "addressLine1": "Karam Vihar Hari Enclave Sultan Puri",
           "addressLine2": "",
           "city": "Urban",
           "name": "Nav Jyoti Public School, Karam Vihar Hari Enclave Sultan Puri Delhi"
          }
        ]
      }
  * @apiUse successBody
  * @apiUse errorBody
  */

  /**
   * List of entity assigned to logged in user.
   * @method
   * @name userEntityList
   * @param req - request data.
   * @param req.query.solutionId -solutionId
   * @param req.userDetails.userId - logged in user id.
   * @returns {JSON} - Logged in user entity list.
   */

  async userEntityList(req) {
    return new Promise(async (resolve, reject) => {
      try {
        let solutionId = req.query.solutionId;

        let solutionDocument = await database.models.solutions
          .findOne(
            { _id: ObjectId(solutionId) },
            {
              _id: 1,
              entities: 1,
              programExternalId: 1,
            },
          )
          .lean();

        let entityAssessorQueryObject = [
          {
            $match: {
              userId: req.userDetails.userId,
              solutionId: solutionDocument._id,
            },
          },
          {
            $lookup: {
              from: 'entities',
              localField: 'entities',
              foreignField: '_id',
              as: 'entityDocuments',
            },
          },
          {
            $project: {
              entities: 1,
              'entityDocuments._id': 1,
              'entityDocuments.metaInformation.externalId': 1,
              'entityDocuments.metaInformation.name': 1,
              'entityDocuments.metaInformation.addressLine1': 1,
              'entityDocuments.metaInformation.addressLine2': 1,
              'entityDocuments.metaInformation.city': 1,
              'entityDocuments.state': 1,
            },
          },
        ];

        const assessorsDocument = await database.models.entityAssessors.aggregate(entityAssessorQueryObject);

        let entityIds = assessorsDocument[0].entityDocuments.map((eachEntityDocument) => eachEntityDocument._id);

        let insightDocument = await insightsHelper.insightsDocument(solutionDocument.programExternalId, entityIds);

        let singleEntityDrillDown;

        if (insightDocument.length > 0) {
          let solutionDocument = await solutionsHelper.checkIfSolutionIsRubricDriven(insightDocument[0].solutionId);

          singleEntityDrillDown = solutionDocument ? true : false;
        }

        assessorsDocument[0].entityDocuments.forEach((eachEntityDocument) => {
          if (
            insightDocument.length > 0 &&
            insightDocument.some((eachInsight) => eachInsight.entityId.toString() == eachEntityDocument._id.toString())
          ) {
            eachEntityDocument['isSingleEntityHighLevel'] = true;
            eachEntityDocument['isSingleEntityDrillDown'] = singleEntityDrillDown;
          } else {
            eachEntityDocument['isSingleEntityHighLevel'] = false;
            eachEntityDocument['isSingleEntityDrillDown'] = false;
          }
          eachEntityDocument = _.merge(eachEntityDocument, { ...eachEntityDocument.metaInformation });
          delete eachEntityDocument.metaInformation;
        });

        return resolve({
          message: messageConstants.apiResponses.ENTITY_LIST,
          result: {
            entities: assessorsDocument[0].entityDocuments,
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
  * @api {get} /samiksha/v1/programs/userList?solutionId=:solutionInternalId&search=:searchText&page=:page&limit=:limit Fetch User List
  * @apiVersion 1.0.0
  * @apiName Fetch User Entity List 
  * @apiGroup Program
  * @apiParam {String} ProgramId Program ID.
  * @apiParam {String} Page Page.
  * @apiParam {String} Limit Limit.
  * @apiSampleRequest /samiksha/v1/programs/userList?solutionId=5b98fa069f664f7e1ae7498c&search=&page=1&limit=1
  * @apiParamExample {json} Response:
    "result": {
      "totalCount": 3055,
      "assessorInformation": [
      {
        "_id": "5bfe69021d0c350d61b78e68",
        "userId": "32172a5c-8bfe-4520-9089-355de77aac71",
        "__v": 0,
        "createdAt": "2019-01-01T00:00:00.000Z",
        "createdBy": "e7719630-0457-47ca-a5ce-8190ffb34f13",
        "externalId": "SPM001",
        "parentId": "",
        "programId": "5c9d0937a43629432ce631db",
        "role": "PROGRAM_MANAGER",
        "updatedAt": "2019-01-01T00:00:00.000Z",
        "updatedBy": "e7719630-0457-47ca-a5ce-8190ffb34f13",
        "solutionId": null,
        "entityTypeId": "5ce23d633c330302e720e65f",
        "entityType": "school"
      }
        ]
      }
  * @apiUse successBody
  * @apiUse errorBody
  */

  /**
   * List of assessors.
   * @method
   * @name userList
   * @param req - request data.
   * @param req.query.solutionId -solution id
   * @param req.searchText - searched text based on assessorName and assessorExternalId.
   * @param req.pageSize - page size limit.
   * @param req.pageNo - page no.
   * @returns {JSON} - Logged in user entity list.
   */

  async userList(req) {
    return new Promise(async (resolve, reject) => {
      try {
        let solutionId = req.query.solutionId;
        let assessorName = {};
        let assessorExternalId = {};

        if (req.searchText != '') {
          assessorName['assessorInformation.name'] = new RegExp(req.searchText, 'i');
          assessorExternalId['assessorInformation.externalId'] = new RegExp(req.searchText, 'i');
        }

        let solutionDocument = await database.models.solutions.aggregate([
          {
            $match: {
              _id: ObjectId(solutionId),
            },
          },
          {
            $project: {
              entities: 1,
            },
          },
          {
            $addFields: { entityIdInObjectIdForm: '$entities' },
          },
          {
            $lookup: {
              from: 'entityAssessors',
              localField: 'entityIdInObjectIdForm',
              foreignField: 'entities',
              as: 'assessorInformation',
            },
          },
          {
            $project: {
              'assessorInformation.entities': 0,
              'assessorInformation.deleted': 0,
            },
          },
          {
            $unwind: '$assessorInformation',
          },
          {
            $match: { $or: [assessorName, assessorExternalId] },
          },
          {
            $facet: {
              totalCount: [{ $count: 'count' }],
              assessorInformationData: [{ $skip: req.pageSize * (req.pageNo - 1) }, { $limit: req.pageSize }],
            },
          },
        ]);

        if (!solutionDocument) {
          throw 'Bad request';
        }

        let result = {};

        result['totalCount'] = solutionDocument[0].totalCount[0].count;

        result['assessorInformation'] = solutionDocument[0].assessorInformationData.map(
          (eachAssessor) => eachAssessor.assessorInformation,
        );

        return resolve({
          message: messageConstants.apiResponses.ASSESSOR_LIST,
          result: result,
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
  * @api {get} /samiksha/v1/programs/entityBlocks?solutionId="" Fetch Zone
  * @apiVersion 1.0.0
  * @apiName Fetch Zone 
  * @apiGroup Program
  * @apiParam {String} SolutionId Solution ID.
  * @apiParam {String} Page Page.
  * @apiParam {String} Limit Limit.
  * @apiSampleRequest /samiksha/v1/programs/entityBlocks?solutionId=5b98fa069f664f7e1ae7498c
  * @apiParamExample {json} Response:
  * "result": {
      "zones": [
        {
         "id": "7",
         "label": "Zone - 7"
        },
        {
          "id": "8",
          "label": "Zone - 8"
        }
      ]
    }
  * @apiUse successBody
  * @apiUse errorBody
  */

  /**
   * Entity associated with block.
   * @method
   * @name entityBlocks
   * @param req - request data.
   * @param req.query.solutionId -solution id
   * @returns {JSON} - List of entity blocks.
   */

  async entityBlocks(req) {
    return new Promise(async (resolve, reject) => {
      try {
        let solutionId = req.query.solutionId;

        let solutionDocument = await database.models.solutions
          .findOne(
            { _id: ObjectId(solutionId) },
            {
              _id: 1,
              entities: 1,
            },
          )
          .lean();

        if (!solutionDocument) {
          throw httpStatusCode.bad_request.message;
        }

        let distinctEntityBlocks = await database.models.entities
          .distinct('metaInformation.blockId', { _id: { $in: solutionDocument.entities } })
          .lean();

        let result = {};

        result['zones'] = distinctEntityBlocks.map((zoneId) => {
          return {
            id: zoneId,
            label: 'Zone - ' + zoneId,
          };
        });

        return resolve({
          message: messageConstants.apiResponses.ZONE_LIST,
          result: result,
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
  * @api {get} /samiksha/v1/programs/blockEntity?solutionId=""&blockId="" Block Entity
  * @apiVersion 1.0.0
  * @apiName Block Entity 
  * @apiGroup Program
  * @apiParam {String} SolutionId Solution ID.
  * @apiParam {String} Page Page.
  * @apiParam {String} Limit Limit.
  * @apiSampleRequest /samiksha/v1/programs/blockEntity?solutionId=5b98fa069f664f7e1ae7498c&blockId=1
  * @apiParamExample {json} Response:
  * "result": {
      "entities": [
        {
          "_id": "5bfe53ea1d0c350d61b78e4a",
          "name": "Govt. Girls Sr. Sec. School, Nicholson Road, Delhi",
          "externalId": "1207043",
          "addressLine1": "Nicholson Road",
          "addressLine2": "",
          "city": "Urban",
          "isSingleEntityHighLevel": true,
          "isSingleEntityDrillDown": true
        }
      ]
    }
  * @apiUse successBody
  * @apiUse errorBody
  */

  /**
   * List of entity in one particular block.
   * @method
   * @name blockEntity
   * @param req - request data.
   * @param req.query.solutionId -solution id
   * @param req.query.blockId -block id
   * @returns {JSON} - List of entity blocks.
   */

  async blockEntity(req) {
    return new Promise(async (resolve, reject) => {
      try {
        let solutionId = req.query.solutionId;
        let blockId = req.query.blockId;

        let solutionDocument = await database.models.solutions
          .findOne(
            { _id: ObjectId(solutionId) },
            {
              _id: 1,
              entities: 1,
              programExternalId: 1,
            },
          )
          .lean();

        if (!solutionDocument) {
          throw httpStatusCode.bad_request.message;
        }

        let entitiesInBlock = await database.models.entities.aggregate([
          {
            $match: {
              _id: { $in: solutionDocument.entities },
              'metaInformation.blockId': blockId,
            },
          },
          {
            $project: {
              _id: 1,
              name: '$metaInformation.name',
              externalId: '$metaInformation.externalId',
              addressLine1: '$metaInformation.addressLine1',
              addressLine2: '$metaInformation.addressLine2',
              city: '$metaInformation.city',
            },
          },
        ]);

        let entitiesIdArray = entitiesInBlock.map((eachEntitiesInBlock) => eachEntitiesInBlock._id);

        let insightDocument = await insightsHelper.insightsDocument(
          solutionDocument.programExternalId,
          entitiesIdArray,
        );

        let singleEntityDrillDown;

        if (insightDocument.length > 0) {
          let solutionDocument = await solutionsHelper.checkIfSolutionIsRubricDriven(insightDocument[0].solutionId);
          singleEntityDrillDown = solutionDocument ? true : false;
        }

        let result = {};

        entitiesInBlock.forEach((eachEntityInBlock) => {
          if (
            insightDocument.length > 0 &&
            insightDocument.some((eachInsight) => eachInsight.entityId.toString() == eachEntityInBlock._id.toString())
          ) {
            eachEntityInBlock['isSingleEntityHighLevel'] = true;
            eachEntityInBlock['isSingleEntityDrillDown'] = singleEntityDrillDown;
          } else {
            eachEntityInBlock['isSingleEntityHighLevel'] = false;
            eachEntityInBlock['isSingleEntityDrillDown'] = false;
          }
        });

        result['entities'] = entitiesInBlock;

        return resolve({
          message: 'List of entities fetched successfully',
          result: result,
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
  * @api {post} /samiksha/v1/programs/listByIds List programs by ids
  * @apiVersion 1.0.0
  * @apiName List programs by ids
  * @apiGroup Program
  * @apiParamExample {json} Request:
  * {
  *   "programIds" : ["5b98d7b6d4f87f317ff615ee"]
  * }
  * @apiSampleRequest /samiksha/v1/programs/listByIds
  * @apiParamExample {json} Response:
  * {
    "message": "Program information list fetched successfully.",
    "status": 200,
    "result": [
        {
            "_id": "5b98d7b6d4f87f317ff615ee",
            "externalId": "PROGID01",
            "name": "DCPCR School Development Index 2018-19",
            "description": "DCPCR School Development Index 2018-19",
            "owner": "a082787f-8f8f-42f2-a706-35457ca6f1fd",
            "createdBy": "a082787f-8f8f-42f2-a706-35457ca6f1fd",
            "updatedBy": "a082787f-8f8f-42f2-a706-35457ca6f1fd",
            "isDeleted": false,
            "status": "active",
            "resourceType": [
                "program"
            ],
            "language": [
                "English"
            ],
            "keywords": [],
            "concepts": [],
            "createdFor": [
                "0126427034137395203",
                "0124487522476933120"
            ],
            "imageCompression": {
                "quality": 10
            },
            "updatedAt": "2019-01-03T06:07:17.660Z",
            "startDate": "2018-06-28T06:03:48.590Z",
            "endDate": "2020-06-28T06:03:48.591Z",
            "createdAt": "2019-06-28T06:03:48.616Z",
            "isAPrivateProgram": false
        }
    ]
  }
  * @apiUse successBody
  * @apiUse errorBody
  */

  /**
   * List programs by ids.
   * @method
   * @name listByIds
   * @param {Object} req - request data.
   * @param {Array} req.body.solutionIds - Solution ids.
   * @returns {JSON} - List programs by ids.
   */

  async listByIds(req) {
    return new Promise(async (resolve, reject) => {
      try {
        let programsData = await programsHelper.listByIds(req.body.programIds,req.userDetails.tenantData);

        programsData.result = programsData.data;

        return resolve(programsData);
      } catch (error) {
        return reject({
          status: error.status || httpStatusCode.internal_server_error.status,
          message: error.message || httpStatusCode.internal_server_error.message,
        });
      }
    });
  }

  /**
   * @api {post} /samiksha/v1/programs/removeSolutions/:programId Remove solutions from Program
   * @apiVersion 1.0.0
   * @apiName removeSolution
   * @apiGroup Program
   * @apiSampleRequest /samiksha/v1/programs/removeSolutions/5fbe2b964006cc174d10960c
   * @apiHeader {String} X-authenticated-user-token Authenticity token
   * @apiUse successBody
   * @apiUse errorBody
   */

  /**
   * Remove solutions from program.
   * @method
   * @name removeSolutions
   * @param {Object} req - requested data.
   * @param {String} req.params._id -  program internal id.
   * @param {Array} req.body.solutionIds - solution ids.
   * @returns {JSON} -
   */

  async removeSolutions(req) {
    return new Promise(async (resolve, reject) => {
      try {
        let programData = await programsHelper.removeSolutions(req.params._id, req.body.solutionIds);

        programData.result = programData.data;
        return resolve(programData);
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
   * List of Programs and targetted ones.
   * @method
   * @name targetedPrograms
   * @param {Object} req - request data.
   * @returns {JSON} List of Programs with targetted ones.
   * @apiParamExample {json} Request:
   * {
   *    "role": "mentee,admin,org_admin,session_manager,public,cluster_academic_coordinator,block_education_officer,district_education_officer"
   * }
   * @apiParamExample {json} Response:
   *{
    "message": "Successfully targeted programs fetched",
    "status": 200,
    "result": {
        "data": [
            {
                "_id": "669652d5d652fd358878c327",
                "externalId": "TESTING_BY_DEV_TEAM_7",
                "name": "Testing by dev team ap",
                "description": "testing by dev team",
                "owner": "1",
                "createdBy": "1",
                "status": "active",
                "resourceType": [
                    "program"
                ]
            },
            {
                "_id": "669416ca370c5dc57fbfa60f",
                "externalId": "TESTING_BY_DEV_TEAM_11",
                "name": "Testing by dev team ap",
                "description": "testing by dev team",
                "owner": "1",
                "createdBy": "1",
                "status": "active",
                "resourceType": [
                    "program"
                ]
            },
            {
                "_id": "666b37db325b16f72031da39",
                "externalId": "TESTING_BY_DEV_TEAM_7",
                "name": "Testing by dev team ap",
                "description": "testing by dev team",
                "owner": "1",
                "createdBy": "1",
                "status": "active",
                "resourceType": [
                    "program"
                ]
            },
            {
                "_id": "66618ae29c879e018e9ead88",
                "externalId": "TESTING_BY_DEV_TEAM_7",
                "name": "Testing by dev team ap",
                "description": "testing by dev team",
                "owner": "1",
                "createdBy": "1",
                "status": "active",
                "resourceType": [
                    "program"
                ]
            }
        ],
        "count": 4
    }
}
   */

  async targetedPrograms(req) {
    return new Promise(async (resolve, reject) => {
      try {
        let programs = await programsHelper.targetedPrograms(
          req.body,
          req.userDetails.userId,
          req.pageSize,
          req.pageNo,
          req.searchText,
          req.query.filter,
          req.userDetails.tenantData
        );

        programs['result'] = programs.data;

        return resolve(programs);
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
