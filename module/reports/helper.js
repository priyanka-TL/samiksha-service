/**
 * name : reportsController.js
 * author : Aman
 * created-date : 22-Dec-2018
 * Description : Reports related information.
 */

// Dependencies
let moment = require('moment');
const filesHelper = require(MODULES_BASE_PATH + '/files/helper');

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

  // Instance observation report
  static instaceObservationReport = async function (req, res) {
    return new Promise(async function (resolve, reject) {
      try {
        let projection =["completedDate","questionName","questionAnswer","school","schoolName","entityType","observationName","observationId","questionResponseType","questionResponseLabel","observationSubmissionId","questionId","questionExternalId","instanceId","instanceParentQuestion","instanceParentResponsetype","instanceParentId","instanceParentEcmSequence","instanceParentExternalId"]
        let entity_observation_query = {"filter":{"type":"and","fields":[{"type":"selector","dimension":"school","value":""},{"type":"selector","dimension":"observationId","value":""}]},"aggregations":[],"postAggregations":[],"intervals":["1901-01-01T00:00:00+00:00/2101-01-01T00:00:00+00:00"]}

        // let bodyParam = gen.utils.getDruidQuery("instance_observation_query");
        // console.log({ DruidQuery: bodyParam });
        // if (process.env.OBSERVATION_DATASOURCE_NAME) {
        //   bodyParam.dataSource = process.env.OBSERVATION_DATASOURCE_NAME;
        // }
  
        //Apply submissionId filter
        // bodyParam.filter.fields[0].value = req.body.submissionId.replace(
        //   /[^a-zA-Z0-9_-]/g,
        //   ""
        // );
       let matchQuery ={
        "$match":{
            _id: req.body.submissionId,
        }
       }
    matchQuery["$match"]={data:1}
    console.log(matchQuery,matchQuery["$match"])
        //Push criteriaId or questionId filter based on the report Type (question wise and criteria wise)
        if (
          req.body.criteriaWise == false &&
          req.body.filter &&
          req.body.filter.questionId &&
          req.body.filter.questionId.length > 0
        ) {
          bodyParam.filter.fields.push({
            type: "in",
            dimension: "questionExternalId",
            values: req.body.filter.questionId.replace(/[^a-zA-Z0-9_-]/g, ""),
          });
        }
  
        if (
          req.body.criteriaWise == true &&
          req.body.filter &&
          req.body.filter.criteria &&
          req.body.filter.criteria.length > 0
        ) {
          bodyParam.filter.fields.push({
            type: "in",
            dimension: "criteriaId",
            values: req.body.filter.criteria,
          });
        }
  
        let criteriaLevelReport = false;
        if (req.body.scores == true) {
          let getReportType = await getCriteriaLevelReportKey({
            submissionId: req.body.submissionId.replace(/[^a-zA-Z0-9_-]/g, ""),
          });
          if (!getReportType.length) {
            console.log({ getReportType: "NotFound" });
            return resolve({
              result: false,
              message: filesHelper.submission_not_found_message,
            });
          } else {
            criteriaLevelReport =
              getReportType[0].criteriaLevelReport == "true";
          }
        }
        console.log({ criteriaLevelReport });
  
        if (criteriaLevelReport == false) {
          bodyParam.filter.fields.push({
            type: "not",
            field: { type: "selector", dimension: "questionAnswer", value: "" },
          });
        }
  
        bodyParam.dimensions = [
          "programName",
          "solutionName",
          req.body.entityType.replace(/[^a-zA-Z0-9_-]/g, "") + "Name",
        ];
        if (!bodyParam.dimensions.includes("districtName")) {
          bodyParam.dimensions.push("districtName");
        }
  
        //Push dimensions to the query based on report type
        if (req.body.scores == false && req.body.criteriaWise == false) {
          bodyParam.dimensions.push(
            "questionName",
            "questionAnswer",
            "school",
            "remarks",
            "entityType",
            "observationName",
            "observationId",
            "questionResponseType",
            "questionResponseLabel",
            "questionId",
            "questionExternalId",
            "instanceId",
            "instanceParentQuestion",
            "instanceParentResponsetype",
            "instanceParentId",
            "questionSequenceByEcm",
            "instanceParentExternalId",
            "instanceParentEcmSequence",
            "completedDate"
          );
        }
  
        if (
          req.body.scores == true &&
          req.body.criteriaWise == false &&
          criteriaLevelReport == false
        ) {
          bodyParam.dimensions.push(
            "questionName",
            "questionAnswer",
            "questionExternalId",
            "questionResponseType",
            "minScore",
            "maxScore",
            "totalScore",
            "scoreAchieved",
            "observationName",
            "completedDate"
          );
          bodyParam.filter.fields.push({
            type: "or",
            fields: [
              {
                type: "selector",
                dimension: "questionResponseType",
                value: "radio",
              },
              {
                type: "selector",
                dimension: "questionResponseType",
                value: "multiselect",
              },
              {
                type: "selector",
                dimension: "questionResponseType",
                value: "slider",
              },
            ],
          });
        }
  
        if (req.body.scores == false && req.body.criteriaWise == true) {
          bodyParam.dimensions.push(
            "questionName",
            "questionAnswer",
            "school",
            "remarks",
            "entityType",
            "observationName",
            "observationId",
            "questionResponseType",
            "questionResponseLabel",
            "questionId",
            "questionExternalId",
            "instanceId",
            "instanceParentQuestion",
            "instanceParentResponsetype",
            "instanceParentId",
            "questionSequenceByEcm",
            "instanceParentExternalId",
            "instanceParentEcmSequence",
            "criteriaName",
            "criteriaId",
            "instanceParentCriteriaName",
            "instanceParentCriteriaId",
            "completedDate"
          );
        }
  
        if (
          req.body.scores == true &&
          req.body.criteriaWise == true &&
          criteriaLevelReport == false
        ) {
          bodyParam.dimensions.push(
            "questionName",
            "questionAnswer",
            "questionExternalId",
            "questionResponseType",
            "minScore",
            "maxScore",
            "totalScore",
            "scoreAchieved",
            "observationName",
            "criteriaName",
            "criteriaId",
            "completedDate"
          );
          bodyParam.filter.fields.push({
            type: "or",
            fields: [
              {
                type: "selector",
                dimension: "questionResponseType",
                value: "radio",
              },
              {
                type: "selector",
                dimension: "questionResponseType",
                value: "multiselect",
              },
              {
                type: "selector",
                dimension: "questionResponseType",
                value: "slider",
              },
            ],
          });
        }
  
        if (req.body.scores == true && criteriaLevelReport == true) {
          bodyParam.filter.fields.push({
            type: "selector",
            dimension: "childType",
            value: "criteria",
          });
          bodyParam.dimensions.push(
            "observationSubmissionId",
            "completedDate",
            "domainName",
            "criteriaDescription",
            "level",
            "label",
            "childExternalid",
            "childName",
            "childType",
            "solutionId",
            "criteriaScore"
          );
        }
  
        if (!bodyParam.dimensions.includes("completedDate")) {
          bodyParam.dimensions.push("completedDate");
        }
  
        //pass the query get the result from druid
        let options = gen.utils.getDruidConnection();
        options.method = "POST";
        options.body = bodyParam;
        console.log({ druidConnection: options });
        let data = await rp(options);
  
        if (!data.length) {
          let message;
          let getSubmissionStatusResponse =
            await assessmentService.getObservationSubmissionStatusById(
              req.body.submissionId,
              req.headers["x-authenticated-user-token"]
            );
          console.log({ getSubmissionStatusResponse });
  
          if (
            getSubmissionStatusResponse.result &&
            getSubmissionStatusResponse.result.status ==
              filesHelper.submission_status_completed
          ) {
            message = filesHelper.submission_not_found_message;
          } else {
            message = "SUBMISSION_ID_NOT_FOUND";
          }
  
          return resolve({
            result: false,
            message: message,
          });
        } else {
          let response;
          let chartData;
  
          let evidenceData = await getEvidenceData({
            submissionId: req.body.submissionId,
          });
          console.log({ getEvidenceData: true });
          //Send report based on input
          console.log({
            scores: req.body.scores,
            criteriaWise: req.body.criteriaWise,
            criteriaLevelReport,
          });
          if (req.body.scores == false && req.body.criteriaWise == false) {
            chartData = await helperFunc.instanceReportChart(data);
            chartData.entityName = data[0].event[req.body.entityType + "Name"];
  
            if (evidenceData.result) {
              response = await helperFunc.evidenceChartObjectCreation(
                chartData,
                evidenceData.data,
                req.headers["x-authenticated-user-token"]
              );
            } else {
              response = chartData;
            }
  
            if (req.body.pdf) {
              let pdfReport = await pdfHandler.instanceObservationPdfGeneration(
                response
              );
              return resolve(pdfReport);
            } else {
              return resolve(response);
            }
          }
  
          if (
            req.body.scores == true &&
            req.body.criteriaWise == false &&
            criteriaLevelReport == false
          ) {
            chartData = await helperFunc.instanceScoreReportChartObjectCreation(
              data
            );
            chartData.entityName = data[0].event[req.body.entityType + "Name"];
  
            if (evidenceData.result) {
              response = await helperFunc.evidenceChartObjectCreation(
                chartData,
                evidenceData.data,
                req.headers["x-authenticated-user-token"]
              );
            } else {
              response = chartData;
            }
  
            if (req.body.pdf) {
              let pdfHeaderInput = {
                totalScore: response.totalScore,
                scoreAchieved: response.scoreAchieved,
              };
              let pdfReport =
                await pdfHandler.instanceObservationScorePdfGeneration(
                  response,
                  pdfHeaderInput
                );
              return resolve(pdfReport);
            } else {
              return resolve(response);
            }
          }
  
          if (req.body.scores == false && req.body.criteriaWise == true) {
            let reportType = "criteria";
            chartData = await helperFunc.instanceReportChart(data, reportType);
            chartData.entityName = data[0].event[req.body.entityType + "Name"];
  
            if (evidenceData.result) {
              response = await helperFunc.evidenceChartObjectCreation(
                chartData,
                evidenceData.data,
                req.headers["x-authenticated-user-token"]
              );
            } else {
              response = chartData;
            }
  
            response = await helperFunc.getCriteriawiseReport(response);
  
            if (req.body.pdf) {
              let pdfReport =
                await pdfHandler.instanceCriteriaReportPdfGeneration(response);
              return resolve(pdfReport);
            } else {
              return resolve(response);
            }
          }
  
          if (
            req.body.scores == true &&
            req.body.criteriaWise == true &&
            criteriaLevelReport == false
          ) {
            let reportType = "criteria";
            chartData = await helperFunc.instanceScoreReportChartObjectCreation(
              data,
              reportType
            );
            chartData.entityName = data[0].event[req.body.entityType + "Name"];
  
            if (evidenceData.result) {
              response = await helperFunc.evidenceChartObjectCreation(
                chartData,
                evidenceData.data,
                req.headers["x-authenticated-user-token"]
              );
            } else {
              response = chartData;
            }
  
            response = await helperFunc.getCriteriawiseReport(response);
  
            if (req.body.pdf) {
              let pdfHeaderInput = {
                totalScore: response.totalScore,
                scoreAchieved: response.scoreAchieved,
              };
  
              let pdfReport = await pdfHandler.instanceScoreCriteriaPdfGeneration(
                response,
                pdfHeaderInput
              );
              return resolve(pdfReport);
            } else {
              return resolve(response);
            }
          }
  
          if (req.body.scores == true && criteriaLevelReport == true) {
            let response = {
              result: true,
              programName: data[0].event.programName,
              solutionName: data[0].event.solutionName,
              solutionId: data[0].event.solutionId,
              completedDate: data[0].event.completedDate,
              entityName: data[0].event[req.body.entityType + "Name"],
            };
  
            chartData = await helperFunc.entityLevelReportData(data);
  
            for (const element of data) {
              if (response.completedDate) {
                if (
                  new Date(element.event.completedDate) >
                  new Date(response.completedDate)
                ) {
                  response.completedDate = element.event.completedDate;
                }
              }
            }
  
            response.reportSections = chartData.result;
  
            if (response.reportSections.length == 0) {
              return resolve({
                result: false,
                message:
                  "Report can't be generated since Score values does not exists for the submission",
              });
            }
  
            if (response.reportSections[1].chart.totalSubmissions == 1) {
              response.reportSections[0].chart.submissionDateArray = [];
            }
  
            if (req.body.pdf) {
              let pdfReport = await pdfHandler.assessmentAgainPdfReport(response);
              console.log({ pdfReport });
              return resolve(pdfReport);
            } else {
              response.improvementProjectSuggestions = [];
              let impSuggestions = await checkIfImpSuggesionExists(
                req.body.submissionId
              );
  
              if (impSuggestions.length > 0) {
                response.improvementProjectSuggestions =
                  await helperFunc.improvementProjectsObjectCreate(
                    impSuggestions
                  );
              }
              return resolve(response);
            }
          }
        }
      } catch (err) {
        return resolve({
          result: false,
          message: err.message,
        });
      }
    });
  };
};
