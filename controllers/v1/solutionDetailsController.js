/**
 * name : solutionDetailsController.js
 * author : Akash
 * created-date : 22-feb-2019
 * Description : Solution details related information.
 */

// Dependencies
const solutionsHelper = require(MODULES_BASE_PATH + '/solutions/helper');
const FileStream = require(ROOT_PATH + '/generics/fileStream');

/**
 * SolutionDetails
 * @class
 */
module.exports = class SolutionDetails {
  static get name() {
    return 'solutionDetails';
  }

  /**
   * @api {get} /assessment/api/v1/solutionDetails/entities?programId:programExternalId&solutionId:solutionExternalId&primary:primaryEntityFilter&type:subEntityType All Entities of a Solution
   * @apiVersion 1.0.0
   * @apiName Entities of a Solution
   * @apiGroup Solution Entity Details
   * @apiParam {String} programId Program External ID.
   * @apiParam {String} solutionId Solution External ID.
   * @apiParam {String} primary 0/1.
   * @apiParam {String} type Type of subentity
   * @apiHeader {String} X-authenticated-user-token Authenticity token
   * @apiSampleRequest /assessment/api/v1/solutionDetails/entities?programId=PROGID01&solutionId=EF-DCPCR-2018-001&primary=0&type=parent
   * @apiUse successBody
   * @apiUse errorBody
   */

  /**
   * Entities
   * @method
   * @name entities
   * @param {Object} req - requested data.
   * @param {String} req.query.programId - program external id.
   * @param {String} req.query.solutionId - solution external id.
   * @param {String} req.query.primary
   * @param {String} req.query.type - entity type name.
   * @returns {CSV}
   */

  async entities(req) {
    return new Promise(async (resolve, reject) => {
      try {
        if (!req.query.programId || req.query.programId == '' || !req.query.solutionId || req.query.solutionId == '') {
          throw messageConstants.apiResponses.INVALID_PARAMETER;
        }

        let findQuery = {
          externalId: req.query.solutionId,
          programExternalId: req.query.programId,
        };

        let entities = new Array();

        if (req.query.primary == 0 && req.query.type != '') {
          let allSubEntities = await solutionsHelper.allSubGroupEntityIdsByGroupName(
            req.query.solutionId,
            req.query.type,
          );
          entities = Object.keys(allSubEntities);
        } else {
          let solutionDocument = await database.models.solutions.findOne(findQuery, { entities: 1 }).lean();
          entities = solutionDocument.entities;
        }

        if (!entities.length) {
          return resolve({
            status: httpStatusCode.not_found.status,
            message: messageConstants.apiResponses.ENTITY_NOT_FOUND,
          });
        } else {
          const fileName = `entityInformation`;
          let fileStream = new FileStream(fileName);
          let input = fileStream.initStream();

          (async function () {
            await fileStream.getProcessorPromise();
            return resolve({
              isResponseAStream: true,
              fileNameWithPath: fileStream.fileNameWithPath(),
            });
          })();

          let chunkOfEntityIds = _.chunk(entities, 10);
          let entityDocuments;

          for (
            let pointerToChunkOfEntityIds = 0;
            pointerToChunkOfEntityIds < chunkOfEntityIds.length;
            pointerToChunkOfEntityIds++
          ) {
            entityDocuments = await database.models.entities
              .find(
                {
                  _id: {
                    $in: chunkOfEntityIds[pointerToChunkOfEntityIds],
                  },
                },
                {
                  metaInformation: 1,
                },
              )
              .lean();

            await Promise.all(
              entityDocuments.map(async (entityDocument) => {
                if (entityDocument.metaInformation) {
                  entityDocument.metaInformation['System Id'] = entityDocument._id.toString();
                  input.push(entityDocument.metaInformation);
                }
              }),
            );
          }

          input.push(null);
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
   * @api {get} /assessment/api/v1/solutionDetails/criteria/:solutionsId All Criteria of a Solution
   * @apiVersion 1.0.0
   * @apiName Criterias of a Solution
   * @apiGroup Solution Entity Details
   * @apiHeader {String} X-authenticated-user-token Authenticity token
   * @apiSampleRequest /assessment/api/v1/solutionDetails/criteria/Mantra-STL-2019-001
   * @apiUse successBody
   * @apiUse errorBody
   */

  /**
   * criteria
   * @method
   * @name criteria
   * @param {Object} req - requested data.
   * @param {String} req.params._id - solution external id.
   * @returns {CSV}
   */

  async criteria(req) {
    return new Promise(async (resolve, reject) => {
      try {
        let tenantFilter =  req.userDetails.tenantAndOrgInfo;
        let solutionDocument = await database.models.solutions
          .findOne(
            {
              externalId: req.params._id,
              tenantId: tenantFilter.tenantId
            },
            { themes: 1 },
          )
          .lean();

        let criteriaIds = gen.utils.getCriteriaIds(solutionDocument.themes);

        let criteriaDocument = await database.models.criteria
          .find(
            {
              _id: { $in: criteriaIds },
              tenantId: tenantFilter.tenantId
            },
            { name: 1, externalId: 1, rubric: 1, _id: 1 },
          )
          .lean();

        const fileName = `Solution-Criteria`;
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
          criteriaDocument.map(async (singleCriteria) => {
            let criteriaObject = {
              criteriaID: singleCriteria.externalId,
              criteriaInternalId: singleCriteria._id.toString(),
              criteriaName: singleCriteria.name,
            };

            Object.keys(singleCriteria.rubric.levels).forEach((eachRubricData) => {
              criteriaObject[eachRubricData] = singleCriteria.rubric.levels[eachRubricData].description;
            });

            input.push(criteriaObject);
          }),
        );

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
   * @api {get} /assessment/api/v1/solutionDetails/questions/:solutionsId All Questions of a Solution
   * @apiVersion 1.0.0
   * @apiName Questions of a Solution
   * @apiGroup Solution Entity Details
   * @apiHeader {String} X-authenticated-user-token Authenticity token
   * @apiSampleRequest /assessment/api/v1/solutionDetails/questions/Mantra-STL-2019-001
   * @apiUse successBody
   * @apiUse errorBody
   */

  /**
   * questions
   * @method
   * @name questions
   * @param {Object} req - requested data.
   * @param {String} req.params._id - solution external id.
   * @returns {CSV}
   */

  async questions(req) {
    return new Promise(async (resolve, reject) => {
      try {
        const fileName = `Questions-` + req.params._id;
        let fileStream = new FileStream(fileName);
        let input = fileStream.initStream();

        (async function () {
          await fileStream.getProcessorPromise();
          return resolve({
            isResponseAStream: true,
            fileNameWithPath: fileStream.fileNameWithPath(),
          });
        })();

        // get criteria name,ecm method,section,question id from criteria
        function getCriteriasDetails(criteria) {
          let criteriasDetails = {};
          let questionIds = [];
          criteria.forEach((eachCriteria) => {
            eachCriteria.evidences.forEach((eachEvidence) => {
              eachEvidence.sections.forEach((eachSection) => {
                eachSection.questions.forEach((eachQuestion) => {
                  criteriasDetails[eachQuestion.toString()] = {
                    criteriaExternalId: eachCriteria.externalId,
                    criteriaName: eachCriteria.name,
                    evidenceMethod: eachEvidence.code,
                    section: eachSection.code,
                  };

                  questionIds.push(eachQuestion);
                });
              });
            });
          });
          return {
            criteriasDetails: criteriasDetails,
            questionIds: questionIds,
          };
        }

        let solutionDocuments = await database.models.solutions
          .findOne(
            {
              externalId: req.params._id,
            },
            {
              themes: 1,
            },
          )
          .lean();

        let criteriaIds = gen.utils.getCriteriaIds(solutionDocuments.themes);

        let allCriteriaDocument = await database.models.criteria
          .find({ _id: { $in: criteriaIds } }, { name: 1, externalId: 1, evidences: 1 })
          .lean();

        let criteriaDocuments = getCriteriasDetails(allCriteriaDocument);

        let questionDocuments = await database.models.questions
          .find({
            _id: { $in: criteriaDocuments.questionIds },
          })
          .lean();

        let instanceParentQuestion = {};
        let parentQuestionData = {};

        questionDocuments.forEach((eachQuestionDocument) => {
          eachQuestionDocument.instanceQuestions.length &&
            eachQuestionDocument.instanceQuestions.forEach((eachInstanceQuestion) => {
              instanceParentQuestion[eachInstanceQuestion.toString()] = {
                parentExternalId: eachQuestionDocument.externalId,
              };
            });

          parentQuestionData[eachQuestionDocument._id.toString()] = {
            parentExternalId: eachQuestionDocument.externalId,
          };
        });

        for (let pointerToQuestionDoc = 0; pointerToQuestionDoc < questionDocuments.length; pointerToQuestionDoc++) {
          let csvObject = {};
          let questions = questionDocuments[pointerToQuestionDoc];

          if (criteriaDocuments.criteriasDetails[questions._id.toString()]) {
            csvObject['solutionId'] = req.params._id;
            csvObject['criteriaExternalId'] =
              criteriaDocuments.criteriasDetails[questions._id.toString()].criteriaExternalId;

            csvObject['name'] = criteriaDocuments.criteriasDetails[questions._id.toString()].criteriaName;

            csvObject['evidenceMethod'] = criteriaDocuments.criteriasDetails[questions._id.toString()].evidenceMethod;

            csvObject['section'] = criteriaDocuments.criteriasDetails[questions._id.toString()].section;

            csvObject['_SYSTEM_ID'] = questions._id.toString();

            if (instanceParentQuestion[questions._id.toString()]) {
              csvObject['instanceParentQuestionId'] = instanceParentQuestion[questions._id.toString()].parentExternalId;
            } else {
              csvObject['instanceParentQuestionId'] = 'NA';
            }

            if (questions.visibleIf.length > 0) {
              csvObject['hasAParentQuestion'] = 'Yes';
              csvObject['parentQuestionOperator'] = questions.visibleIf[0].operator;
              csvObject['parentQuestionValue'] = questions.visibleIf[0].value;
              csvObject['parentQuestionId'] =
                parentQuestionData[questions.visibleIf[0]._id.toString()].parentExternalId;
            } else {
              csvObject['hasAParentQuestion'] = 'No';
              csvObject['parentQuestionOperator'] = '';
              csvObject['parentQuestionValue'] = '';
              csvObject['parentQuestionId'] = '';
            }

            csvObject['externalId'] = questions.externalId;
            csvObject['question0'] = questions.question[0];
            csvObject['question1'] = questions.question[1];
            csvObject['tip'] = questions.tip;
            csvObject['instanceIdentifier'] = questions.instanceIdentifier ? questions.instanceIdentifier : '';
            csvObject['responseType'] = questions.responseType ? questions.responseType : '';
            csvObject['dateFormat'] = questions.dateFormat ? questions.dateFormat : '';
            csvObject['autoCapture'] = questions.autoCapture ? questions.autoCapture : '';

            csvObject['validation'] = questions.validation.required ? questions.validation.required : false;

            csvObject['validationIsNumber'] = questions.validation.isNumber ? questions.validation.isNumber : '';

            csvObject['validationRegex'] = questions.validation.regex ? questions.validation.regex : '';

            csvObject['validationMax'] = questions.validation.max ? questions.validation.max : '';

            csvObject['validationMin'] = questions.validation.min ? questions.validation.min : '';

            csvObject['fileIsRequired'] = questions.file.required ? questions.file.required : '';

            csvObject['fileUploadType'] = questions.file.type ? questions.file.type.join('') : '';

            csvObject['minFileCount'] = questions.file.minCount ? questions.file.minCount : '';

            csvObject['maxFileCount'] = questions.file.maxCount ? questions.file.maxCount : '';

            csvObject['caption'] = questions.file.caption ? questions.file.caption : '';

            csvObject['questionGroup'] = questions.questionGroup.join(',');
            csvObject['modeOfCollection'] = questions.modeOfCollection;
            csvObject['accessibility'] = questions.accessibility;
            csvObject['showRemarks'] = questions.showRemarks;
            csvObject['rubricLevel'] = questions.rubricLevel;
            csvObject['isAGeneralQuestion'] = questions.isAGeneralQuestion;
            csvObject['R1'] = '';
            csvObject['R2'] = '';
            csvObject['R3'] = '';
            csvObject['R4'] = '';
            csvObject['R5'] = '';
            csvObject['R6'] = '';
            csvObject['R7'] = '';

            if (questions.options && questions.options.length > 0) {
              for (let pointerToOptions = 0; pointerToOptions < questions.options.length; pointerToOptions++) {
                csvObject[questions.options[pointerToOptions].value] = questions.options[pointerToOptions].label;
              }
            }

            input.push(csvObject);
          }
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
};
