/**
 * name : reportsController.js
 * author : Saish & Praveen
 * created-date : 22-Dec-2018
 * updated-date : 20-Nov-2024
 * Description : Reports related information.
 */

// Dependencies
let moment = require('moment');
const filesHelper = require(MODULES_BASE_PATH + '/files/helper');
const surveySubmissionsHelper = require(MODULES_BASE_PATH + '/surveySubmissions/helper');
const questionsHelper = require(MODULES_BASE_PATH + '/questions/helper');
const programsHelper = require(MODULES_BASE_PATH + '/programs/helper');
const helperFunc = require('../../helper/chart_data');
const solutionsQueries = require(DB_QUERY_BASE_PATH + '/solutions');
const observationSubmissionsHelper = require(MODULES_BASE_PATH + '/observationSubmissions/helper');
const pdfHelper = require('../../helper/pdfGeneration');
const criteriaHelper = require(MODULES_BASE_PATH + '/criteria/helper');

/**
 * ReportsHelper
 * @class
 */
module.exports = class ReportsHelper {
  /**
   * Convert gmt to ist.
   * @method
   * @name gmtToIst
   * @param {TimeRanges} gmtTime - gmtTime
   * @returns {TimeRanges} - converted gmtTime to ist
   */

  static gmtToIst(gmtTime) {
    try {
      let istStart = moment(gmtTime).tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss');

      if (istStart == 'Invalid date') {
        istStart = '-';
      }

      return istStart;
    } catch (error) {
      return error;
    }
  }

  /**
   * Convert gmt to ist.
   * @method
   * @name getFilePublicBaseUrl
   * @returns {String} - public base url
   */

  static getFilePublicBaseUrl() {
    return new Promise(async (resolve, reject) => {
      try {
        const url = filesHelper.getFilePublicBaseUrl();

        return resolve(url);
      } catch (error) {
        return reject(error);
      }
    });
  }

  /**
   * Generate a survey submission report
   * @param {Object} req - The request object
   * @param {Object} res - The response object
   * @returns {Promise<Object>} The survey submission report
   */
  static async surveySubmissionReport(req, res) {
    if (!req.query.submissionId) {
      let response = {
        result: false,
        message: 'submissionId is a required field',
      };
      return response;
    } else {
      let submissionId = req.query.submissionId;

      let surveySubmissionsDocumentArray = await surveySubmissionsHelper.surveySubmissionDocuments({
        _id: submissionId,
        status: 'completed',
      });

      let surveySubmissionsDocument = surveySubmissionsDocumentArray[0];

      if (!surveySubmissionsDocument) {
        throw { message: messageConstants.apiResponses.SUBMISSION_NOT_FOUND };
      }

      //adding question options, externalId to answers array
      if (surveySubmissionsDocument.answers && Object.keys(surveySubmissionsDocument.answers).length > 0) {
        surveySubmissionsDocument = await questionsHelper.addOptionsToSubmission(surveySubmissionsDocument);
      }

      let solutionDocument = await solutionsQueries.solutionDocuments(
        {
          _id: surveySubmissionsDocument.solutionId,
        },
        ['name', 'scoringSystem', 'description', 'questionSequenceByEcm']
      );

      if (!solutionDocument.length) {
        throw messageConstants.apiResponses.SOLUTION_NOT_FOUND;
      }

      solutionDocument = solutionDocument[0];
      surveySubmissionsDocument['solutionInfo'] = solutionDocument;

      if (surveySubmissionsDocument.programId && surveySubmissionsDocument.programId != '') {
        let programDocument = await programsHelper.list(
          {
            _id: surveySubmissionsDocument.programId,
          },
          ['name', 'description',"externalId"]
        );

        surveySubmissionsDocument['programInfo'] = programDocument[0];
      }

      let report = await helperFunc.generateSubmissionReportWithoutDruid(surveySubmissionsDocument);

      let responseObj = {};

      responseObj.response = {
        surveyName: surveySubmissionsDocument.surveyInformation.name,
        report: report,
      };

      return {
        status: httpStatusCode.ok.status,
        message: responseObj.response,
      };
    }
  }
  /**
   * Generate an entity observation report
   * @param {Object} req - The request object
   * @returns {Promise<Object>} The entity observation report
   */
  static async entityObservationReport(req) {
    let entityId = req.body.entityId;
    let observationId = req.body.observationId;
    let criteriaWise = req.body.criteriaWise;

    let queryObject = {
      entityId: entityId,
      observationId: observationId,
      status: 'completed',
      tenantId: req.userDetails.tenantData.tenantId,
      orgId: req.userDetails.tenantData.orgId,
    };

    let submissionDocumentArr = await observationSubmissionsHelper.observationSubmissionsDocument(queryObject);
    let submissionDocument = submissionDocumentArr[0];

    // Initialize an empty array to collect all improvement project suggestions
    let improvementProjectSuggestions = [];

    if (submissionDocument.criteria) {
      for (const criterias of submissionDocument.criteria) {
        // Build a query to find the criteria document by its unique _id
        let criteriaFindQuery = {
          _id: criterias._id,
        };

        // Define which fields to return from the database
        let criteriaProjectionArray = ['name', 'rubric'];

        // Fetch the criteria document from the database using a helper function
        let allCriteriaDocument = await criteriaHelper.criteriaDocument(criteriaFindQuery, criteriaProjectionArray);

        // Process the returned document(s)
        allCriteriaDocument.map((criteria) => {
          criteria.criteriaId = criteria._id;
          criteria.criteriaName = criteria.name;
          criteria.level = criteria.rubric.levels[criterias.score].level;
          criteria.label = criteria.rubric.levels[criterias.score].label;
          if (criteria.rubric.levels[criterias.score]['improvement-projects']) {
            criteria.improvementProjects = criteria.rubric.levels[criterias.score]['improvement-projects'];
          }

          // Clean up the object by removing unneeded properties
          delete criteria.rubric;
          delete criteria._id;
          delete criteria.name;
        });

        // Since we're only expecting one match, push the first document to the suggestions array
        improvementProjectSuggestions.push(allCriteriaDocument[0]);
      }
    }
    if (!submissionDocument) {
      throw { message: messageConstants.apiResponses.SUBMISSION_NOT_FOUND };
    }

    let solutionDocument = await solutionsQueries.solutionDocuments({
      _id: submissionDocument.solutionId,
      tenantId: req.userDetails.tenantData.tenantId,
      orgIds: { $in: ['ALL', req.userDetails.tenantData.orgId] },
    });

    let programDocument = await programsHelper.details(submissionDocument.programId);

    /*

    Adding filter code
    */
    let submissionArr = submissionDocumentArr.map((record)=>{
      return {_id:record._id,
            name:record.title
      }
    })
    let filters = await createFilterData()
    filters[0].filter.data = submissionArr
    let responseObject = {
      result: true,
      entityType: submissionDocument.entityType,
      entityId: entityId,
      entityName: submissionDocument.entityInformation.name,
      solutionName:solutionDocument[0].name,
      observationId: observationId,
      programName: programDocument.data?.name,
      totalSubmissions: submissionDocumentArr.length,
      filters,
      improvementProjectSuggestions : improvementProjectSuggestions
    };

    let result;
    if (req.body.scores === true) {
      result = await helperFunc.generateObservationReportForRubricWithoutDruid(submissionDocumentArr);
    } else {
      result = await helperFunc.generateObservationReportForNonRubricWithoutDruid(
        submissionDocumentArr,
        true,
        criteriaWise,
        'entity'
      );
    }
    let filteredResults;
    let filtereingFunction = await this.filterCriteriaAndQuestion(req,result,filters)
    filteredResults =filtereingFunction.filteredResults
    result = filtereingFunction.results
    responseObject.reportSections = result;
   
    filters[2].filter.data =filteredResults

    if (req.body.pdf && criteriaWise) {
      let pdfGenerationStatus = await pdfHelper.entityCriteriaPdfReportGeneration(responseObject);
      return pdfGenerationStatus;
    }

    if (req.body.pdf) {
      let pdfGenerationStatus
      if(req.body.scores){
         pdfGenerationStatus = await pdfHelper.assessmentPdfGeneration(responseObject)

      }else{
       pdfGenerationStatus = await pdfHelper.pdfGeneration(responseObject);
      }
      return pdfGenerationStatus;
    }

    return responseObject;
  }
  /**
   * Generate an instance observation report
   * @param {Object} req - The request object
   * @returns {Promise<Object>} The instance observation report
   */
  static async instaceObservationReport(req) {

    let submissionId = req.body.submissionId;
    let entityType = req.body.entityType;
    let criteriaWise = req.body.criteriaWise;

    let queryObject = {
      _id:submissionId,
      entityType:entityType,
      status: 'completed',
      tenantId:req.userDetails.tenantData.tenantId,
      orgId:req.userDetails.tenantData.orgId
    };

    let submissionDocumentArr = await observationSubmissionsHelper.observationSubmissionsDocument(queryObject);

    let submissionDocument = submissionDocumentArr[0];

    let improvementProjectSuggestions = [];

    if (submissionDocument.criteria) {
      for (const criterias of submissionDocument.criteria) {
        // Build a query to find the criteria document by its unique _id
        let criteriaFindQuery = {
          _id: criterias._id,
        };

        // Define which fields to return from the database
        let criteriaProjectionArray = ['name', 'rubric'];

        // Fetch the criteria document from the database using a helper function
        let allCriteriaDocument = await criteriaHelper.criteriaDocument(criteriaFindQuery, criteriaProjectionArray);

        // Process the returned document(s)
        allCriteriaDocument.map((criteria) => {
          criteria.criteriaId = criteria._id;
          criteria.criteriaName = criteria.name;
          criteria.level = criteria.rubric.levels[criterias.score].level;
          criteria.label = criteria.rubric.levels[criterias.score].label;
          if (criteria.rubric.levels[criterias.score]['improvement-projects']) {
            criteria.improvementProjects = criteria.rubric.levels[criterias.score]['improvement-projects'];
          }

          // Clean up the object by removing unneeded properties
          delete criteria.rubric;
          delete criteria._id;
          delete criteria.name;
        });

        // Since we're only expecting one match, push the first document to the suggestions array
        improvementProjectSuggestions.push(allCriteriaDocument[0]);
      }
    }
    if(!submissionDocument){
      throw { message: messageConstants.apiResponses.SUBMISSION_NOT_FOUND};
    }

    let solutionDocument = await solutionsQueries.solutionDocuments(
      {
        _id: submissionDocument.solutionId,
        tenantId: req.userDetails.tenantData.tenantId,
        orgIds:{"$in":['ALL',req.userDetails.tenantData.orgId]}
      }
    );

    let programDocument = await programsHelper.details(submissionDocument.programId);

    /*

    Adding filter code
    */
    let submissionArr = submissionDocumentArr.map((record)=>{
      return {_id:record._id,
            name:record.title
      }
    })
    // Getting filtersArray
    let filters = await createFilterData()
    //Adding submissionArr to filters
    filters[0].filter.data = submissionArr

    let responseObject = {
      result: true,
      entityType: submissionDocument.entityType,
      entityId: submissionDocument.entityId,
      entityName: submissionDocument.entityInformation?.name,
      solutionName:solutionDocument[0].name,
      observationId: submissionDocument.observationId,
      programName: programDocument.data?.name,
      totalSubmissions: submissionDocumentArr.length,
      filters,
      improvementProjectSuggestions : improvementProjectSuggestions
    };
    let result;
    if (req.body.scores === true) {
      result = await helperFunc.generateObservationReportForRubricWithoutDruid(submissionDocumentArr);
    } else {
      result = await helperFunc.generateObservationReportForNonRubricWithoutDruid(submissionDocumentArr,true,criteriaWise,'instance');
    }

    let filteredResults;
    //Getting the results based on the filters
    let filtereingFunction = await this.filterCriteriaAndQuestion(req,result,filters)
    filteredResults =filtereingFunction.filteredResults
    result = filtereingFunction.results
    //Assigning the filteredResults to the  responseObject
    responseObject.reportSections = result; 
    filters[2].filter.data =filteredResults;
    // Removing submissions Array if its for only one submissionReport
    if(!req.body.observationId){
      filters.shift()
    }

    if (req.body.pdf && criteriaWise) {
      let pdfGenerationStatus = await pdfHelper.instanceCriteriaReportPdfGeneration({
        ...responseObject,
        response: result,
      });
      return pdfGenerationStatus;
    }

    if (req.body.pdf) {
      let pdfGenerationStatus
      if(req.body.scores){
         pdfGenerationStatus = await pdfHelper.assessmentPdfGeneration(responseObject,submissionId)
      }else{
       pdfGenerationStatus = await pdfHelper.instanceObservationPdfGeneration(responseObject);
      }
      return pdfGenerationStatus;
    }
    return responseObject;
  }
  /**
   * Generate an entity observation report
   * @name filterCriteriaAndQuestion
   * @param {Object} req - The request object
   * @param {Object} reportData -  Report data without filtered
   * @param {Array} filters  - FilterArray which will be contain details about the filter
   * @returns {Promise<Object>} - Object of filtered results and filter Array
   */
  static async filterCriteriaAndQuestion(req,reportData,filters){
    try{
      let filteredResults;
      let result = reportData
      // if filter has questionWise filter
      if (req.body.filter &&  req.body.filter.questionId && req.body.filter.questionId.length > 0) {
        result = result.filter((eachResult) =>
          req.body.filter.questionId.includes(eachResult.order)
        );
        filteredResults = result.map((eachResult)=>{
          let data={
            "name":eachResult.question,
            "_id":eachResult.order,
         } 
         return data
        })
        filters[1].filter.keyToSend ="questionWise"
      // if filter has criteriaWise filter
      }else if(req.body.filter && req.body.filter.criteria&&req.body.filter.criteria.length > 0){
        result = result.filter((eachResult) =>
          req.body.filter.criteria.includes(eachResult.criteriaId)
        );
        filteredResults = result.map((eachResult)=>{
          let data={
            "name":eachResult.criteriaName,
            "_id":eachResult.criteriaId,
         } 
         return data
        })
        filters[2].filter.keyToSend ="criteria"
        filters[1].filter.keyToSend ="criteriaWise"
       // If filter is empty or not specified
      }else{
        // If its a questionwise data filtering for responseFilterObject
        if(!(req.body.criteriaWise)){
         filteredResults = result.map((eachResult)=>{
          let data={
            "name":eachResult.question,
            "_id":eachResult.order,
         } 
         return data
        })
      }else{
      // If its a criteriawise data filtering for responseFilterObject
        filters[2].filter.keyToSend ="criteria"
        filters[1].filter.keyToSend ="criteriaWise"
        filteredResults = result.map((eachResult)=>{
          let data={
            "name":eachResult.criteriaName,
            "_id":eachResult.criteriaId,
         } 
         return data
        })
      }
  
      }
      return({
        "filteredResults": filteredResults,
        'results': result
      })
    }catch(e){
      console.log(e)
    }

  }
};

// Filter Array
async function createFilterData(){
    let filter =[
      {
         "order":"",
         "filter":{
            "type":"dropdown",
            "title":"",
            "keyToSend":"submissionId",
            "data":[]
         }
      },
      {
         "order":"",
         "filter":{
            "type":"segment",
            "title":"",
            "keyToSend":"questionWise",
            "data":[
               "questionWise",
               "criteriaWise"
            ]
         }
      },
      {
         "order":"",
         "filter":{
            "type":"modal",
            "title":"",
            "keyToSend":"questionId",
            "data":[
            ]
         }
      }
   ]
   return filter
}