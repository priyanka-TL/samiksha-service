/**
 * name : helper.js
 * author : Aman
 * created-date : 20-May-2020
 * Description : All users helper functionality.
 */

// Dependencies

const entityAssessorsHelper = require(MODULES_BASE_PATH + '/entityAssessors/helper');
const programsHelper = require(MODULES_BASE_PATH + '/programs/helper');
const solutionsHelper = require(MODULES_BASE_PATH + '/solutions/helper');
const observationsHelper = require(MODULES_BASE_PATH + '/observations/helper');
const submissionsHelper = require(MODULES_BASE_PATH + '/submissions/helper');
const entitiesHelper = require(MODULES_BASE_PATH + '/entities/helper');
const observationSubmissionsHelper = require(MODULES_BASE_PATH + '/observationSubmissions/helper');
const surveysHelper = require(MODULES_BASE_PATH + '/surveys/helper');
const userExtensionsHelper = require(MODULES_BASE_PATH + '/userExtension/helper');
const surveySubmissionsHelper = require(MODULES_BASE_PATH + '/surveySubmissions/helper');
const shikshalokamHelper = require(MODULES_BASE_PATH + '/shikshalokam/helper');
const programsQueries = require(DB_QUERY_BASE_PATH + '/programs');
const solutionsQueries = require(DB_QUERY_BASE_PATH + '/solutions');
const userProfileConfig = require('@config/userProfileConfig')

/**
 * UserHelper
 * @class
 */
module.exports = class UserHelper {
  /**
   * Details user information.
   * @method
   * @name userDetailsInformation
   * @param {String} userId
   * @returns {Object} consists of observation,solutions,entities,programs and assessorData,submissions and observation submissions data.
   * associated to the user.
   */

  static userDetailsInformation(userId) {
    return new Promise(async (resolve, reject) => {
      try {
        let assessorsData = await entityAssessorsHelper.assessorsDocument(
          {
            userId: userId,
          },
          ['programId', 'solutionId', 'entities', 'createdAt']
        );

        let programIds = [];
        let solutionIds = [];
        let entityIds = [];

        if (assessorsData.length > 0) {
          assessorsData.forEach((assessor) => {
            programIds.push(assessor.programId);
            solutionIds.push(assessor.solutionId);
            entityIds = entityIds.concat(assessor.entities);
          });
        }

        let submissions = await submissionsHelper.submissionDocuments(
          {
            solutionId: { $in: solutionIds },
            entityId: { $in: entityIds },
          },
          [
            'status',
            '_id',
            'entityId',
            'solutionId',
            'title',
            'submissionNumber',
            'completedDate',
            'createdAt',
            'updatedAt',
          ],
          'none',
          {
            createdAt: -1,
          }
        );

        let observationsData = await observationsHelper.observationDocuments(
          {
            createdBy: userId,
            status: messageConstants.common.PUBLISHED,
          },
          [
            'entities',
            'solutionId',
            'programId',
            'entityId',
            'name',
            'description',
            'status',
            'observationId',
            'createdAt',
            'updatedAt',
          ]
        );

        let observationIds = [];
        let observationSolutions = [];
        let observationEntities = [];

        if (observationsData.length > 0) {
          observationsData.forEach((observation) => {
            observationIds.push(observation._id);
            observation['isObservation'] = true;
            programIds.push(observation.programId);
            observationSolutions.push(observation.solutionId);
            observationEntities = observationEntities.concat(observation.entities);
          });
        }

        let observationSubmissions = await observationSubmissionsHelper.observationSubmissionsDocument(
          {
            observationId: { $in: observationIds },
            entityId: { $in: observationEntities },
          },
          [
            'status',
            'submissionNumber',
            'entityId',
            'createdAt',
            'updatedAt',
            'observationInformation.name',
            'observationId',
            'title',
            'completedDate',
            'ratingCompletedAt',
          ],
          {
            createdAt: -1,
          }
        );

        solutionIds = solutionIds.concat(observationSolutions);
        entityIds = entityIds.concat(observationEntities);

        let surveysData = await surveysHelper.surveyDocuments(
          {
            createdBy: userId,
            status: messageConstants.common.PUBLISHED,
            programId: { $exists: true },
          },
          ['solutionId', 'programId', 'name', 'description', 'status', 'endDate', 'createdAt', 'updatedAt']
        );

        let surveyIds = [];
        let surveySolutions = [];

        if (surveysData.length > 0) {
          surveysData.forEach((survey) => {
            surveyIds.push(survey._id);
            survey['isSurvey'] = true;
            programIds.push(survey.programId);
            surveySolutions.push(survey.solutionId);
          });
        }

        let surveySubmissions = await surveySubmissionsHelper.surveySubmissionDocuments(
          {
            surveyId: { $in: surveyIds },
          },
          ['status', 'createdAt', 'updatedAt', 'name', 'surveyId', 'completedDate', 'endDate'],
          {
            createdAt: -1,
          }
        );

        solutionIds = solutionIds.concat(surveySolutions);

        if (!programIds.length > 0) {
          throw {
            status: httpStatusCode.ok.status,
            message: messageConstants.apiResponses.PROGRAM_NOT_MAPPED_TO_USER,
          };
        }

        if (!solutionIds.length > 0) {
          throw {
            status: httpStatusCode.ok.status,
            message: messageConstants.apiResponses.SOLUTION_NOT_MAPPED_TO_USER,
          };
        }

        let programs = await programsHelper.programDocument(programIds, ['name', 'externalId', 'description']);

        if (!programs.length > 0) {
          throw {
            status: httpStatusCode.ok.status,
            message: messageConstants.apiResponses.PROGRAM_NOT_FOUND,
          };
        }

        let programsData = programs.reduce(
          (ac, program) => ({
            ...ac,
            [program._id.toString()]: program,
          }),
          {}
        );

        let solutions = await solutionsQueries.solutionDocuments(
          {
            _id: { $in: solutionIds },
            status: messageConstants.common.ACTIVE_STATUS,
            isDeleted: false,
          },
          [
            'name',
            'description',
            'externalId',
            'type',
            'subType',
            'solutionId',
            'allowMultipleAssessemts',
            'isAPrivateProgram',
            'entityType',
            'entityTypeId',
          ]
        );

        if (!solutions.length > 0) {
          throw {
            status: httpStatusCode.ok.status,
            message: messageConstants.apiResponses.SOLUTION_NOT_FOUND,
          };
        }

        // let solutionsData = solutions.reduce(
        //     (ac, solution) => ({
        //         ...ac,
        //         [solution._id.toString()]: solution
        //     }), {});

        let removedSolutions = await userExtensionsHelper.userExtensionDocuments(
          {
            userId: userId,
          },
          ['removedFromHomeScreen']
        );

        let userRemovedSolutionsFromHomeScreen = new Array();

        if (
          Array.isArray(removedSolutions) &&
          removedSolutions.length > 0 &&
          Array.isArray(removedSolutions[0].removedFromHomeScreen) &&
          removedSolutions[0].removedFromHomeScreen.length > 0
        ) {
          removedSolutions[0].removedFromHomeScreen.forEach((solutionId) => {
            userRemovedSolutionsFromHomeScreen.push(solutionId.toString());
          });
        }

        let solutionsData = {};

        for (let pointerToSolutionsArray = 0; pointerToSolutionsArray < solutions.length; pointerToSolutionsArray++) {
          let solution = solutions[pointerToSolutionsArray];
          solution.showInHomeScreen = true;
          if (
            userRemovedSolutionsFromHomeScreen.length > 0 &&
            userRemovedSolutionsFromHomeScreen.indexOf(solution._id.toString()) > -1
          ) {
            solution.showInHomeScreen = false;
          }

          solutionsData[solution._id.toString()] = solution;
        }

        let entitiesData = {};
        if (entityIds.length > 0) {
          let entities = await entitiesHelper.entityDocuments(
            {
              _id: { $in: entityIds },
            },
            [
              '_id',
              'metaInformation.externalId',
              'metaInformation.name',
              'metaInformation.city',
              'metaInformation.state',
              'entityType',
            ]
          );

          if (entities.length > 0) {
            entitiesData = entities.reduce(
              (ac, entity) => ({
                ...ac,
                [entity._id.toString()]: entity,
              }),
              {}
            );
          }
        }

        return resolve({
          entityAssessors: assessorsData,
          observations: observationsData,
          surveys: surveysData,
          programsData: programsData,
          solutionsData: solutionsData,
          entitiesData: entitiesData,
          submissions: submissions,
          observationSubmissions: observationSubmissions,
          surveySubmissions: surveySubmissions,
        });
      } catch (error) {
        return reject(error);
      }
    });
  }

  /**
   * list user programs.
   * @method
   * @name programs
   * @param {Object} bodyData - body data
   * @param {String} pageNo - page number
   * @param {String} pageSize - page size
   * @param {String} searchText - search text
   * @param {String} userId - user id
   * @returns {Object} list of user programs.
   */

  static programs(bodyData, pageNo, pageSize, searchText, userId) {
    return new Promise(async (resolve, reject) => {
      try {
        let programDetails = {};
        let targetedProgramIds = [];
        let alreadyStartedProgramsIds = [];
        let programCount = 0;
        //get all programs which user has joined irrespective of targeted and non targeted programs
        // let alreadyStartedPrograms = await this.getUserJoinedPrograms(
        //   searchText,
        //   userId
        // );

        // if (alreadyStartedPrograms.success && alreadyStartedPrograms.data) {
        //   alreadyStartedProgramsIds = alreadyStartedPrograms.data;
        // }

        // getting all program details matching the user profile. not passing pageSize and pageNo to get all data.
        let targetedPrograms = await programsHelper.forUserRoleAndLocation(
          bodyData,
          '', // not passing page size
          '', // not passing page number
          searchText
          //   ["_id"]
        );
        // targetedPrograms.data contain all programIds targeted to current user profile.
        if (targetedPrograms.success && targetedPrograms.data && targetedPrograms.data.count > 0) {
          targetedProgramIds = gen.utils.arrayOfObjectToArrayOfObjectId(targetedPrograms.data.data);
        }
        // filter tagregeted program ids if any targetedProgramIds are prsent in alreadyStartedPrograms then remove that
        // let allTargetedProgramButNotJoined = _.differenceWith(
        //   targetedProgramIds,
        //   alreadyStartedProgramsIds,
        //   _.isEqual
        // );

        //find total number of programs related to user
        // let userRelatedPrograms = alreadyStartedProgramsIds.concat(
        //   allTargetedProgramButNotJoined
        // );
        //total number of programs
        programCount = targetedProgramIds;
        if (!(programCount.length > 0)) {
          throw {
            message: messageConstants.apiResponses.PROGRAM_NOT_FOUND,
            count: 0,
          };
        }
        // Splitting the userRelatedPrograms array based on the page number and size.
        // The returned data is not coming in the order of userRelatedPrograms elements when all the IDs are passed.
        // We can't add a sort to the programDocuments function because it will also sort programs joined from the previous profile, which should come at the end of the list for us.
        // We have two requirements:
        // 1. Current profile programs should come in the order of their creation.
        // 2. Previous profile programs should always come last.
        let startIndex = pageSize * (pageNo - 1);
        let endIndex = startIndex + pageSize;
        targetedProgramIds = targetedProgramIds.slice(startIndex, endIndex);

        //fetching all the programsDocuments
        let userRelatedProgramsData = await programsQueries.programDocuments(
          { _id: { $in: targetedProgramIds } },
          ['name', 'externalId', 'metaInformation'],
          'none', //not passing skip fields
          '', // not passing pageSize
          '' // not passing pageNo
        );
        if (!(userRelatedProgramsData.length > 0)) {
          throw {
            message: messageConstants.apiResponses.PROGRAM_NOT_FOUND,
            count: programCount.length,
          };
        }

        // programDocuments function will not return result in the order which ids are passed. This code block will ensure that the response is rearranged in correct order
        // We can't implement sort logic in programDocuments function because userRelatedPrograms can contain prev profile programs also
        // let programsResult = userRelatedPrograms.map((id) => {
        //   return userRelatedProgramsData.find(
        // 	(data) => data._id.toString() === id.toString()
        //   );
        // });
        let programsResult = userRelatedProgramsData;

        programDetails.data = programsResult;
        programDetails.count = programCount.length;
        programDetails.description = messageConstants.apiResponses.PROGRAM_DESCRIPTION;

        return resolve({
          success: true,
          message: messageConstants.apiResponses.USER_PROGRAMS_FETCHED,
          data: programDetails,
        });
      } catch (error) {
        return resolve({
          success: false,
          message: error.message,
          data: {
            description: messageConstants.common.TARGETED_SOLUTION_TEXT,
            data: [],
            count: error.count,
          },
        });
      }
    });
  }

  /**
   * User targeted solutions.
   * @method
   * @name solutions
   * @param {String} programId - program id.
   * @param {Object} requestedData requested data.
   * @param {String} pageSize page size.
   * @param {String} pageNo page no.
   * @param {String} search search text.
   * @param {String} token user token.
   * @param {String} userId user userId.
   * @returns {Object} targeted user solutions.
   */

  static solutions(programId, requestedData, pageSize, pageNo, search, userId, type) {
    return new Promise(async (resolve, reject) => {
      try {
        let programData = await programsQueries.programDocuments(
          {
            _id: programId,
          },
          ['name', 'requestForPIIConsent', 'rootOrganisations', 'endDate', 'description']
        );

        if (!programData.length > 0) {
          return resolve({
            status: httpStatusCode['bad_request'].status,
            message: messageConstants.apiResponses.PROGRAM_NOT_FOUND,
          });
        }

        let totalCount = 0;
        let mergedData = [];
        const solutionsHelper = require(MODULES_BASE_PATH + '/solutions/helper');

        // fetching all the targted solutions in program
        let autoTargetedSolutions = await solutionsHelper.forUserRoleAndLocation(
          requestedData, //user Role information
          '', // type of solution user is looking for
          '', //subtype of solutions
          programId, //program for solutions
          messageConstants.common.DEFAULT_PAGE_SIZE, //page size
          messageConstants.common.DEFAULT_PAGE_NO, //page no
          search //search text
        );

        let projectSolutionIdIndexMap = {};

        if (autoTargetedSolutions.data.data && autoTargetedSolutions.data.data.length > 0) {
          totalCount = autoTargetedSolutions.data.data.length;
          mergedData = autoTargetedSolutions.data.data;
        }

        const solutionIds = [];
        const getAllResources = [];

        /**
         
         * @function userSurveys
         * @function userObservations
         *
         * @param token string: userToken
         * @param programId string: programId
         *
         * @returns {Promise}
         */
        // Creates an array of promises based on users Input
        switch (type) {
          case messageConstants.common.SURVEY:
            getAllResources.push(this.surveys(userId, programId));
            break;
          case messageConstants.common.OBSERVATION:
            getAllResources.push(this.observations(userId, programId));
            break;
          default:
            getAllResources.push(this.surveys(userId, programId));
            getAllResources.push(this.observations(userId, programId));
        }
        //here will wait till all promises are resolved
        const allResources = await Promise.all(getAllResources);

        //Will find all solutionId from response
        allResources.forEach((resources) => {
          // this condition is required because it returns response in different object structure
          if (resources.success === true && resources.data.length > 0) {
            resources.data.forEach((resource) => {
              solutionIds.push(resource.solutionId);
            });
          }
        });

        // getting all the targted solutionIds from targted solutions
        const allTargetedSolutionIds = gen.utils.convertArrayObjectIdtoStringOfObjectId(mergedData);

        //finding solutions which are not targtted but user has submitted.
        const resourcesWithPreviousProfile = _.differenceWith(solutionIds, allTargetedSolutionIds);

        /**
         * @function solutionDocuments
         * @param {Object} of solutionIds
         * @project [Array] of projections
         *
         * @return [{Objects}] array of solutions documents
         * // will get all the solutions documents based on all profile
         */
        const solutionsWithPreviousProfile = await solutionsQueries.solutionDocuments(
          { _id: { $in: resourcesWithPreviousProfile } },
          [
            'name',
            'description',
            'programName',
            'programId',
            'externalId',
            'type',
            'language',
            'creator',
            'endDate',
            'link',
            'referenceFrom',
            'entityType',
          ]
        );
        //Pushing all the solutions document which user started with previous profile
        mergedData.push(...solutionsWithPreviousProfile);
        //incressing total count of solutions in program
        totalCount += solutionsWithPreviousProfile.length;

        mergedData = mergedData.map((targetedData, index) => {
          delete targetedData.programId;
          delete targetedData.programName;
          return targetedData;
        });

        if (mergedData.length > 0) {
          let startIndex = pageSize * (pageNo - 1);
          let endIndex = startIndex + pageSize;
          mergedData = mergedData.slice(startIndex, endIndex);
        }

        // get all solutionIds of type survey
        let surveySolutionIds = [];
        mergedData.forEach((element) => {
          if (element.type === messageConstants.common.SURVEY) {
            surveySolutionIds.push(element._id);
          }
        });

        if (surveySolutionIds.length > 0) {
          let userSurveySubmission = await surveysHelper.userAssigned(
            userId, //userToken
            '', //search text
            '', //filter
            false, //surveyReportPage
            surveySolutionIds //solutionIds
          );

          if (
            userSurveySubmission.success &&
            userSurveySubmission.data &&
            userSurveySubmission.data.data &&
            userSurveySubmission.data.data.length > 0
          ) {
            for (
              let surveySubmissionPointer = 0;
              surveySubmissionPointer < userSurveySubmission.data.data.length;
              surveySubmissionPointer++
            ) {
              for (let mergedDataPointer = 0; mergedDataPointer < mergedData.length; mergedDataPointer++) {
                if (
                  mergedData[mergedDataPointer].type == messageConstants.common.SURVEY &&
                  userSurveySubmission.data.data[surveySubmissionPointer].solutionId ==
                    mergedData[mergedDataPointer]._id
                ) {
                  mergedData[mergedDataPointer].submissionId =
                    userSurveySubmission.data.data[surveySubmissionPointer].submissionId;
                  break;
                }
              }
            }
          }
        }

        let result = {
          programName: programData[0].name,
          programId: programId,
          programEndDate: programData[0].endDate,
          description: programData[0].description
            ? programData[0].description
            : messageConstants.common.TARGETED_SOLUTION_TEXT,
          rootOrganisations:
            programData[0].rootOrganisations && programData[0].rootOrganisations.length > 0
              ? programData[0].rootOrganisations[0]
              : '',
          data: mergedData,
          count: totalCount,
        };
        if (programData[0].hasOwnProperty('requestForPIIConsent')) {
          result.requestForPIIConsent = programData[0].requestForPIIConsent;
        }

        return resolve({
          message: messageConstants.apiResponses.PROGRAM_SOLUTIONS_FETCHED,
          success: true,
          result: result,
        });
      } catch (error) {
        return resolve({
          success: false,
          result: {
            description: messageConstants.common.TARGETED_SOLUTION_TEXT,
            data: [],
            count: 0,
          },
        });
      }
    });
  }
  /**
   * Entity types and entities detail information
   * @method
   * @name entities
   * @param {string} userId - logged in user Id.
   * @returns {Array} - Entity types and entities detail information.
   */

  static entities(userId) {
    return new Promise(async (resolve, reject) => {
      try {
        let userDetails = await this.userDetailsInformation(userId);

        let submissions = {};
        let observationSubmissions = {};

        if (userDetails.submissions.length > 0) {
          submissions = _submissions(userDetails.submissions);
        }

        if (userDetails.observationSubmissions.length > 0) {
          observationSubmissions = _observationSubmissions(userDetails.observationSubmissions);
        }

        let result = {
          entityTypes: _entityTypesKeyValue(Object.values(userDetails.entitiesData)),
          entities: {},
        };

        let users = userDetails.entityAssessors.concat(userDetails.observations);

        for (let user = 0; user < users.length; user++) {
          let userData = users[user];
          let program = users[user].programId && userDetails.programsData[users[user].programId.toString()];

          let solution = users[user].solutionId && userDetails.solutionsData[users[user].solutionId.toString()];

          if (solution && program && userData.entities.length > 0) {
            userData.entities.forEach((entity) => {
              let entitiesData = userDetails.entitiesData;

              if (entitiesData[entity.toString()]) {
                if (!result.entities[entitiesData[entity.toString()].entityType]) {
                  result.entities[entitiesData[entity.toString()].entityType] = [];
                }

                let entityExternalId = entitiesData[entity.toString()]['metaInformation']['externalId'];

                let entityIndex = result.entities[entitiesData[entity.toString()].entityType].findIndex(
                  (entity) => entity.externalId === entityExternalId
                );

                if (entityIndex < 0) {
                  let entityInformation = _entityInformation(userDetails.entitiesData[entity.toString()]);
                  entityInformation['solutions'] = [];

                  result.entities[entitiesData[entity.toString()].entityType].push(entityInformation);

                  entityIndex = result.entities[entitiesData[entity.toString()].entityType].length - 1;
                }

                let solutionIndex = result.entities[entitiesData[entity.toString()].entityType][
                  entityIndex
                ].solutions.findIndex((solutionData) => solutionData._id.toString() === solution._id.toString());

                if (solutionIndex < 0) {
                  let solutionOrObservationInformation = users[user].isObservation
                    ? _observationInformation(program, users[user], solution)
                    : _solutionInformation(program, solution);

                  let submission;

                  if (users[user].isObservation) {
                    submission = _observationSubmissionInformation(
                      observationSubmissions,
                      users[user]._id,
                      entity.toString()
                    );
                  } else {
                    submission = _submissionInformation(submissions, solution._id, entity);
                  }

                  let solutionData = {
                    ...solutionOrObservationInformation,
                    ...submission,
                  };

                  result.entities[entitiesData[entity.toString()].entityType][entityIndex].solutions.push(solutionData);
                }
              }
            });
          }
        }

        return resolve({
          message: messageConstants.apiResponses.USER_ENTITIES_FETCHED_SUCCESSFULLY,

          result: result,
        });
      } catch (error) {
        return reject(error);
      }
    });
  }

  /**
   * get surveySubmission Documents documents started by user.
   * @method
   * @name surveySubmissions
   * @param  {String} userId - userId of user.
   * @param  {String} solutionId - solution Id.
   * @returns {result} - all the surveySubmission in particular solution which user has submitted.
   */

  static surveySubmissions(userId, solutionId) {
    return new Promise(async (resolve, reject) => {
      try {
        let surveySubmission = await surveySubmissionsHelper.surveySubmissionDocuments(
          {
            createdBy: userId,
            solutionId: solutionId,
          },
          [
            'surveyId',
            'solutionId',
            'surveyInformation.name',
            'surveyInformation.endDate',
            'surveyInformation.description',
            'status',
            '_id',
          ]
        );

        return resolve({
          success: true,
          message: messageConstants.apiResponses.SURVEY_SUBMISSION_FOUND,
          data: surveySubmission,
        });
      } catch (err) {
        return resolve({
          success: false,
          message: err.message,
          data: false,
        });
      }
    });
  }
  /**
   * List of all private programs created by user
   * @method
   * @name privatePrograms
   * @param {string} userId   - logged in user Id.
   * @param {Number} pageSize - pageSize.
   * @param {Number} pageNo   - pageNumber.
   * @param {String} searchText   - searchText.
   * @returns {Array} - List of all private programs created by user.
   */

  static privatePrograms(userId, pageSize, pageNo, searchText) {
    return new Promise(async (resolve, reject) => {
      try {
        let userPrivatePrograms = await programsHelper.userPrivatePrograms(userId, pageNo, pageSize, searchText);
        return resolve({
          message: messageConstants.apiResponses.PRIVATE_PROGRAMS_LIST,
          count: userPrivatePrograms.count,
          result: userPrivatePrograms.data,
        });
      } catch (error) {
        return reject(error);
      }
    });
  }

  /**
   * Create user program and solution
   * @method
   * @name createProgramAndSolution
   * @param {string} userId - logged in user Id.
   * @param {object} programData - data needed for creation of program.
   * @param {object} solutionData - data needed for creation of solution.
   * @returns {Array} - Created user program and solution.
   */

  static createProgramAndSolution(userId, data, userToken) {
    return new Promise(async (resolve, reject) => {
      try {
        let userPrivateProgram = '';
        let dateFormat = gen.utils.epochTime();

        const organisationAndRootOrganisation = await shikshalokamHelper.getOrganisationsAndRootOrganisations(
          userToken,
          userId
        );

        if (data.programId && data.programId !== '') {
          userPrivateProgram = await programsHelper.list(
            {
              _id: data.programId,
            },
            ['externalId', 'name', 'description']
          );

          if (!userPrivateProgram.length > 0) {
            return resolve({
              message: messageConstants.apiResponses.PROGRAM_NOT_FOUND,
              result: {},
            });
          }

          userPrivateProgram = userPrivateProgram[0];
        } else {
          let programData = {
            name: data.programName,
            isAPrivateProgram: true,
            status: messageConstants.common.ACTIVE_STATUS,
            externalId: data.programExternalId ? data.programExternalId : data.programName + '-' + dateFormat,
            description: data.programDescription ? data.programDescription : data.programName,
            userId: userId,
          };

          programData.createdFor = organisationAndRootOrganisation.createdFor;
          programData.rootOrganisations = organisationAndRootOrganisation.rootOrganisations;

          userPrivateProgram = await programsHelper.create(programData);
        }

        let solutionData = {
          name: data.solutionName,
          externalId: data.solutionExternalId ? data.solutionExternalId : data.solutionName + '-' + dateFormat,
          description: data.solutionDescription ? data.solutionDescription : data.solutionName,
          programId: userPrivateProgram._id,
          programExternalId: userPrivateProgram.externalId,
          programName: userPrivateProgram.name,
          programDescription: userPrivateProgram.description,
        };

        solutionData.entities = solutionData.entities && solutionData.entities.length > 0 ? solutionData.entities : [];

        solutionData.createdFor = organisationAndRootOrganisation.createdFor;
        solutionData.rootOrganisations = organisationAndRootOrganisation.rootOrganisations;

        const solution = await solutionsHelper.create(solutionData);

        if (solution._id) {
          await database.models.programs.updateOne(
            {
              _id: userPrivateProgram._id,
            },
            {
              $addToSet: { components: ObjectId(solution._id) },
            }
          );
        }

        return resolve({
          message: messageConstants.apiResponses.USER_PROGRAM_AND_SOLUTION_CREATED,
          result: {
            program: userPrivateProgram,
            solution: solution,
          },
        });
      } catch (error) {
        return reject(error);
      }
    });
  }

  /**
   * Get surveys documents started by user.
   * @method
   * @name surveys
   * @param  {String} userId - userId of user.
   * @param  {String} programId - program Id.
   * @returns {result} - all the survey which user has started in that program.
   */
  static surveys(userId, programId) {
    return new Promise(async (resolve, reject) => {
      try {
        /**
         * Get Survey document based on filtered data provided.
         * @name surveyDocuments
         * @param {Array} [surveyFilter = "all"] - survey ids.
         * @param {Array} [fieldsArray = "all"] - projected fields.
         * @param {Array} [sortedData = "all"] - sorted field.
         * @param {Array} [skipFields = "none"] - field not to include
         * @returns {Array} List of surveys.
         */
        let surveyData = await surveysHelper.surveyDocuments(
          {
            createdBy: userId,
            programId: new ObjectId(programId),
          },
          ['solutionId', 'solutionExternalId', 'programId', 'programExternalId']
        );

        return resolve({
          success: true,
          message: messageConstants.apiResponses.SURVEYS_FETCHED,
          data: surveyData,
        });
      } catch (err) {
        return resolve({
          success: false,
          message: err.message,
          data: false,
        });
      }
    });
  }

  /**
   * get observation documents started by user.
   * @method
   * @name observations
   * @param  {String} userId - userId of user.
   * @param  {String} programId - program Id.
   * @returns {result} - all the observation which user has started in that program.
   */

  static observations(userId, programId) {
    return new Promise(async (resolve, reject) => {
      try {
        /**
         * Get Observation document based on filtered data provided.
         * @name observationDocuments
         * @param {Object} [findQuery = "all"] -filter data.
         * @param {Array} [fields = "all"] - Projected fields.
         * @returns {Array} - List of observations.
         */
        let observationData = await observationsHelper.observationDocuments(
          {
            createdBy: userId,
            programId: new ObjectId(programId),
          },
          ['solutionId', 'solutionExternalId', 'programId', 'programExternalId']
        );

        return resolve({
          success: true,
          message: messageConstants.apiResponses.OBSERVATION_FETCHED,
          data: observationData,
        });
      } catch (err) {
        return resolve({
          success: false,
          message: err.message,
          data: false,
        });
      }
    });
  }

  /**
   * deleteUserPIIData function to delete users Data.
   * @method
   * @name deleteUserPIIData
   * @param {userDeleteEvent} - userDeleteEvent message object 
   * {
        "entity": "user",
        "eventType": "delete",
        "entityId": 101,
        "changes": {},
        "created_by": 4,
        "organization_id": 22,
        "tenant_code": "shikshagraha",
        "status": "INACTIVE",
        "deleted": true,
        "id": 101,
        "username" : "user_shqwq1ssddw"
    }* @returns {Promise} success Data.
   */

  static deleteUserPIIData(userDeleteEvent) {
    return new Promise(async (resolve, reject) => {
      try {

        let userId = userDeleteEvent.id
				if (!userId) {
					throw {
						status: httpStatusCode.bad_request.status,
						message: messageConstants.apiResponses.USER_ID_MISSING,
					}
				}

        const filter = { createdBy: userId }

        // Create update objects for each collection
        const userProfileOps = _buildUpdateOperations(userProfileConfig, messageConstants.common.USER_PROFILE_KEY);
        const nestedProfileOps = _buildUpdateOperations(userProfileConfig, messageConstants.common.USER_PROFILE_KEY_OBS);

        // Merge updates for observation submissions
        const observationUpdateOperations = {
            ...(userProfileOps.$set || nestedProfileOps.$set ? { $set: { ...userProfileOps.$set, ...nestedProfileOps.$set } } : {}),
            ...(userProfileOps.$unset || nestedProfileOps.$unset ? { $unset: { ...userProfileOps.$unset, ...nestedProfileOps.$unset } } : {})
        }

        let updateDataStatus = await Promise.all([surveySubmissionsHelper.updateMany(filter,userProfileOps),
            observationsHelper.updateMany(filter,userProfileOps),
            observationSubmissionsHelper.updateMany(filter,observationUpdateOperations)
        ])

        const isAnyModified = updateDataStatus?.some(status => status?.modifiedCount > 0);
        return resolve({
            success: true,
            message: isAnyModified
                ? messageConstants.apiResponses.DATA_DELETED_SUCCESSFULLY
                : messageConstants.apiResponses.FAILED_TO_DELETE_DATA
        });

      } catch (err) {
        console.log(err,'err')
        return resolve({
          status: err.status ? err.status : httpStatusCode['internal_server_error'].status,
          message: err.message || err,
          success: false,
        });
      }
    });
  }
};

/**
 * Create the operation object
 * @method
 * @name _buildUpdateOperations - helper functionality for create operation
 * @param {Object} fieldConfig - config data
 * @param {Object} prefix - list of masked data keys.
 * @returns {Array} - Entity types key-value pair.
 */

function _buildUpdateOperations(fieldConfig, prefix = '') {
    const setOperations = {};
    const unsetOperations = {};

    // Mask data keys with specific or default values
    if (Array.isArray(fieldConfig.preserveAndMask)) {
        for (const key of fieldConfig.preserveAndMask) {
            // Use specific masked value if available, otherwise default
            const value =
                fieldConfig.specificMaskedValues && fieldConfig.specificMaskedValues[key] !== undefined
                    ? fieldConfig.specificMaskedValues[key]
                    : fieldConfig.defaultMaskedDataPlaceholder;

            setOperations[`${prefix}${key}`] = value;
        }
    }

    // Unset keys
    if (Array.isArray(fieldConfig.fieldsToRemove)) {
        for (const key of fieldConfig.fieldsToRemove) {
            unsetOperations[`${prefix}${key}`] = 1;
        }
    }

    return {
        $set: Object.keys(setOperations).length > 0 ? setOperations : undefined,
        $unset: Object.keys(unsetOperations).length > 0 ? unsetOperations : undefined,
    };
}

/**
 * Entity types .
 * @method
 * @name _entityTypesKeyValue - submission helper functionality
 * @param {Array} entities - list of entities.
 * @returns {Array} - Entity types key-value pair.
 */

function _entityTypesKeyValue(entities) {
  let result = [];

  entities.forEach((entity) => {
    let findEntityTypesIndex = result.findIndex((type) => type.key === entity.entityType);

    if (findEntityTypesIndex < 0) {
      result.push({
        name: gen.utils.camelCaseToTitleCase(entity.entityType),
        key: entity.entityType,
      });
    }
  });

  return result;
}

/**
 * observations submissions data.
 * @method
 * @name _observationSubmissions - observations helper functionality
 * @param {Array} observationSubmissions - observation submissions.
 * @returns {Array} - observations submissions data.
 */

function _observationSubmissions(observationSubmissions) {
  let submissions = {};

  observationSubmissions.forEach((submission) => {
    if (!submissions[submission.observationId.toString()]) {
      submissions[submission.observationId.toString()] = {};
    }

    if (!submissions[submission.observationId.toString()][submission.entityId.toString()]) {
      submissions[submission.observationId.toString()][submission.entityId.toString()] = {};
      submissions[submission.observationId.toString()][submission.entityId.toString()]['submissions'] = [];
    }

    submissions[submission.observationId.toString()][submission.entityId.toString()]['submissions'].push({
      _id: submission._id,
      status: submission.status,
      submissionNumber: submission.submissionNumber,
      entityId: submission.entityId,
      createdAt: submission.createdAt,
      updatedAt: submission.updatedAt,
      observationName:
        submission.observationInformation && submission.observationInformation.name
          ? submission.observationInformation.name
          : '',
      observationId: submission.observationId,
      title: submission.title,
      submissionDate: submission.completedDate ? submission.completedDate : '',
      ratingCompletedAt: submission.ratingCompletedAt ? submission.ratingCompletedAt : '',
    });
  });

  return submissions;
}

/**
 * observations submissions information.
 * @method
 * @name _observationSubmissionInformation - observations helper functionality
 * @param {Object} submissions - observation submissions key-value pair.
 * @param {String} observationId - solution internal id.
 * @param {String} entityId - entity internal id.
 * @returns {Object} - observations submissions information.
 */

function _observationSubmissionInformation(submissions, observationId, entityId) {
  return {
    totalSubmissionCount:
      submissions[observationId] &&
      submissions[observationId][entityId] &&
      submissions[observationId][entityId].submissions.length > 0
        ? submissions[observationId][entityId].submissions.length
        : 0,

    submissions:
      submissions[observationId] &&
      submissions[observationId][entityId] &&
      submissions[observationId][entityId].submissions.length > 0
        ? submissions[observationId][entityId].submissions.slice(0, 10)
        : [],
  };
}

/**
 * list of submissions.
 * @method
 * @name _submissions
 * @param {Array} submissions - list of submissions.
 * @returns {Array} - submissions data.
 */

function _submissions(submissions) {
  let submissionData = {};

  submissions.forEach((submission) => {
    if (!submissionData[submission.solutionId.toString()]) {
      submissionData[submission.solutionId.toString()] = {};
    }

    if (!submissionData[submission.solutionId.toString()][submission.entityId.toString()]) {
      submissionData[submission.solutionId.toString()][submission.entityId.toString()] = {};
      submissionData[submission.solutionId.toString()][submission.entityId.toString()]['submissions'] = [];
    }

    submissionData[submission.solutionId.toString()][submission.entityId.toString()]['submissions'].push({
      submissionNumber: submission.submissionNumber,
      title: submission.title,
      _id: submission._id,
      status: submission.status,
      createdAt: submission.createdAt,
      updatedAt: submission.updatedAt,
      submissionDate: submission.completedDate ? submission.completedDate : '',
    });
  });

  return submissionData;
}

/**
 * submissions information
 * @method
 * @name _submissionInformation
 * @param {Array} submissions - list of submissions.
 * @param {String} solutionId - solution id.
 * @param {String} entityId - entity id.
 * @returns {Array} - submissions data.
 */

function _submissionInformation(submissions, solutionId, entityId) {
  return {
    totalSubmissionCount:
      submissions[solutionId] &&
      submissions[solutionId][entityId] &&
      submissions[solutionId][entityId].submissions.length > 0
        ? submissions[solutionId][entityId].submissions.length
        : 0,

    submissions:
      submissions[solutionId] &&
      submissions[solutionId][entityId] &&
      submissions[solutionId][entityId].submissions.length > 0
        ? submissions[solutionId][entityId].submissions.slice(0, 10)
        : [],
  };
}

/**
 * program information
 * @method
 * @name _programInformation - program information
 * @param {Object} program - program data.
 * @param {String} program._id - program internal id.
 * @param {String} program.name - program name.
 * @param {String} program.description - program description.
 * @returns {Object} - program information
 */

function _programInformation(program) {
  return {
    _id: program._id,
    name: program.name,
    externalId: program.externalId,
    description: program.description,
    solutions: [],
  };
}

/**
 * solution information
 * @method
 * @name _solutionInformation - program information
 * @param {Object} program - program data.
 * @param {String} program._id - program internal id.
 * @param {String} program.name - program name.
 * @param {Object} solution - solution data.
 * @param {String} solution.externalId - solution external id.
 * @param {String} solution._id - solution internal id.
 * @param {String} solution.name - solution name.
 * @param {String} solution.description - solution description.
 * @param {String} solution.type - solution type.
 * @param {String} solution.subType - solution subType.
 * @returns {Object} - solution information
 */

function _solutionInformation(program, solution) {
  return {
    programName: program.name,
    programId: program._id,
    _id: solution._id,
    name: solution.name,
    externalId: solution.externalId,
    description: solution.description,
    type: solution.type,
    subType: solution.subType,
    allowMultipleAssessemts: solution.allowMultipleAssessemts ? solution.allowMultipleAssessemts : false,
    showInHomeScreen: solution.showInHomeScreen ? solution.showInHomeScreen : false,
    isAPrivateProgram: solution.isAPrivateProgram ? solution.isAPrivateProgram : false,
    entityType: solution.entityType,
    entityTypeId: solution.entityTypeId,
  };
}

/**
 * observation information
 * @method
 * @name _observationInformation - observation information
 * @param {Object} program - program data.
 * @param {String} program._id - program internal id.
 * @param {String} program.name - program name.
 * @param {Object} observation - observation data.
 * @param {String} observation.externalId - observation external id.
 * @param {String} observation._id - observation internal id.
 * @param {String} observation.name - observation name.
 * @param {String} observation.description - observation description.
 * @returns {Object} - observation information
 */

function _observationInformation(program, observation, solution) {
  return {
    programName: program.name,
    programId: program._id,
    _id: observation._id,
    name: observation.name,
    externalId: observation.externalId,
    description: observation.description,
    type: solution.type,
    subType: solution.subType,
    solutionExternalId: solution.externalId,
    solutionId: solution._id,
    showInHomeScreen: solution.showInHomeScreen ? solution.showInHomeScreen : false,
    isAPrivateProgram: solution.isAPrivateProgram ? solution.isAPrivateProgram : false,
    entityType: solution.entityType,
    entityTypeId: solution.entityTypeId,
  };
}

/**
 * survey information
 * @method
 * @name _surveyInformation - survey information
 * @param {Object} program - program data.
 * @param {String} program._id - program internal id.
 * @param {String} program.name - program name.
 * @param {Object} survey - survey data.
 * @param {String} survey.externalId - survey external id.
 * @param {String} survey._id - survey internal id.
 * @param {String} survey.name - survey name.
 * @param {String} survey.description - survey description.
 * @returns {Object} - survey information
 */

function _surveyInformation(program, survey, solution) {
  return {
    programName: program.name,
    programId: program._id,
    _id: survey._id,
    name: survey.name,
    externalId: survey.externalId,
    description: survey.description,
    type: solution.type,
    subType: solution.subType,
    solutionExternalId: solution.externalId,
    solutionId: solution._id,
    entityType: solution.entityType ? solution.entityType : '',
    entityTypeId: solution.entityTypeId ? solution.entityTypeId : '',
    showInHomeScreen: solution.showInHomeScreen ? solution.showInHomeScreen : false,
  };
}

/**
 * Entities data
 * @method
 * @name _entities - Entities data
 * @param {Array} entities - entities
 * @param {Object} entitiesData - entity internalId to data.
 * @param {String} solutionOrObservationId - solution or observation id.
 * @param {Object} submissions - submissions data.
 * @param {Object} [observation = false] - either observation submissions or submissions.
 * @returns {Array} - Entities data
 */

function _entities(entities, entitiesData, solutionOrObservationId, submissions, observation = false) {
  let result = [];

  if (entities.length > 0) {
    entities.forEach((entityId) => {
      if (entitiesData[entityId.toString()]) {
        let entityIndex = result.findIndex(
          (entity) => entity.externalId === entitiesData[entityId.toString()].externalId
        );

        if (entityIndex < 0) {
          let entityObj = _entityInformation(entitiesData[entityId.toString()]);

          let submission;

          if (observation) {
            submission = _observationSubmissionInformation(submissions, solutionOrObservationId, entityId);
          } else {
            submission = _submissionInformation(submissions, solutionOrObservationId, entityId);
          }

          entityObj = {
            ...entityObj,
            ...submission,
          };

          result.push(entityObj);
        }
      }
    });
  }

  return result;
}

/**
 * entity information
 * @method
 * @name _entityInformation
 * @param {Object} entityDetails - entity details key-value pair.
 * @returns {Object} - entity information
 */

function _entityInformation(entityDetails) {
  return {
    _id: entityDetails._id,
    name: entityDetails.metaInformation.name ? entityDetails.metaInformation.name : '',
    externalId: entityDetails.metaInformation.externalId,
    entityType: entityDetails.entityType,
  };
}

/**
 * surveys submissions data.
 * @method
 * @name _surveySubmissions - surveys helper functionality
 * @param {Array} surveySubmissions - survey submissions.
 * @returns {Array} - surveys submissions data.
 */

function _surveySubmissions(surveySubmissions) {
  let submissions = {};

  surveySubmissions.forEach((submission) => {
    if (!submissions[submission.surveyId.toString()]) {
      submissions[submission.surveyId.toString()] = {};
      submissions[submission.surveyId.toString()]['submissions'] = [];
    }

    submissions[submission.surveyId.toString()]['submissions'].push({
      _id: submission._id,
      status: submission.status,
      createdAt: submission.createdAt,
      updatedAt: submission.updatedAt,
      name: submission.name,
      surveyId: submission.surveyId,
      submissionDate: submission.completedDate ? submission.completedDate : '',
      endDate: submission.endDate,
    });
  });

  return submissions;
}
