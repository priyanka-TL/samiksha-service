/**
 * name : insightsController.js
 * author : Akash
 * created-date : 22-Nov-2018
 * Description : All insights related information.
 */

// Dependencies
const moment = require('moment-timezone');
const insightsHelper = require(MODULES_BASE_PATH + '/insights/helper');

/**
 * Insights
 * @class
 */
module.exports = class Insights extends Abstract {
  constructor() {
    super(insightsSchema);
  }

  static get name() {
    return 'insights';
  }

  /**
   * @api {post} /assessment/api/v1/insights/generateFromSubmissionId/:submissionId Generates insights from submission
   * @apiVersion 1.0.0
   * @apiName Generates insights from submission
   * @apiHeader {String} X-authenticated-user-token Authenticity token
   * @apiSampleRequest /assessment/api/v1/insights/generateFromSubmissionId/5c5147ae95743c5718445eff
   * @apiGroup Insights
   * @apiUse successBody
   * @apiUse errorBody
   */

  /**
   * Generate insights from submission id.
   * @method
   * @name generateFromSubmissionId
   * @param {Object} req -request Data.
   * @param {String} req.params._id - submission id.
   * @returns {JSON} - Insights.
   */

  async generateFromSubmissionId(req) {
    return new Promise(async (resolve, reject) => {
      try {
        let response = await insightsHelper.generate(req.params._id);

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
   * @api {post} /assessment/api/v1/insights/singleEntityDrillDownReport/:programId?solutionId=""&entity="" Single entity drill down report
   * @apiVersion 1.0.0
   * @apiName Single entity drill down report
   * @apiHeader {String} X-authenticated-user-token Authenticity token
   * @apiSampleRequest /assessment/api/v1/insights/singleEntityDrillDownReport/5c5147ae95743c5718445eff
   * @apiGroup Insights
   * @apiUse successBody
   * @apiUse errorBody
   */

  /**
   * Single entity drill down.
   * @method
   * @name singleEntityDrillDownReport
   * @param {Object} req -request Data.
   * @param {String} req.query.solutionId - solution id.
   * @param {String} req.params._id - program id.
   * @param {String} req.query.entity - entity id.
   * @returns {JSON} - Insights.
   */

  async singleEntityDrillDownReport(req) {
    return new Promise(async (resolve, reject) => {
      try {
        let programId = req.params._id;
        let solutionId = req.query.solutionId;
        let entityId = req.query.entity;

        let insights = await database.models.insights.findOne({
          programExternalId: programId,
          solutionId: ObjectId(solutionId),
          entityId: ObjectId(entityId),
        });

        if (!insights) {
          throw messageConstants.apiResponses.INSIGHTS_NOT_FOUND;
        }

        let insightResult = {};

        let noRecordsFound = false;
        let hierarchyLevel = 0;

        while (noRecordsFound != true) {
          let recordsToProcess = insights.themeScores.filter((theme) => theme.hierarchyLevel == hierarchyLevel);
          if (recordsToProcess.length > 0) {
            if (!insightResult[hierarchyLevel]) {
              insightResult[hierarchyLevel] = {
                data: new Array(),
              };
            }
            recordsToProcess.forEach((record) => {
              if (!record.hierarchyTrack[hierarchyLevel - 1] || !record.hierarchyTrack[hierarchyLevel - 1].name) {
                insightResult[hierarchyLevel].data.push(record);
              } else {
                if (!insightResult[hierarchyLevel][record.hierarchyTrack[hierarchyLevel - 1].name]) {
                  insightResult[hierarchyLevel][record.hierarchyTrack[hierarchyLevel - 1].name] = {
                    data: new Array(),
                  };
                }
                insightResult[hierarchyLevel][record.hierarchyTrack[hierarchyLevel - 1].name].data.push(record);
              }
            });
            hierarchyLevel += 1;
          } else {
            noRecordsFound = true;
          }
        }

        let criteriaResult = new Array();

        insights.criteriaScores.forEach((criteria) => {
          let criteriaObject = criteriaResult.filter((criteriaGroup) =>
            _.isEqual(criteriaGroup.hierarchyTrack, criteria.hierarchyTrack),
          );
          if (criteriaObject.length > 0) {
            criteriaObject[0].data.push(_.omit(criteria, 'hierarchyTrack'));
          } else {
            criteria.data = new Array();
            criteria.data.push(_.omit(criteria, ['hierarchyTrack', 'data']));
            criteriaResult.push(_.pick(criteria, ['hierarchyTrack', 'data']));
          }
        });

        let responseObject = {};
        responseObject.heading = 'Performance report for - ' + insights.entityName;
        responseObject.isShareable = req.query && req.query.linkId ? false : true;
        responseObject.summary = [
          {
            title: 'Name of Entity',
            value: insights.entityName,
          },
          {
            title: 'Date of Assessment',
            value: moment(insights.ratingCompletedAt).format('DD-MM-YYYY'),
          },
        ];

        responseObject.solutionUrl = {
          label: 'Solution Framework Structure + rubric defintion',
          link: 'solutions/details/' + insights.solutionId.toString(),
        };

        responseObject.sections = new Array();

        let themeSummary = new Array();

        let themeSummarySectionHeaders = new Array();
        themeSummarySectionHeaders.push({
          name: 'name',
          value: '',
        });
        for (var k in insights.levelToScoreMapping) {
          themeSummarySectionHeaders.push({ name: k, value: insights.levelToScoreMapping[k].label });
        }

        let generateSections = function (content, hierarchyLevel) {
          if (content.data.length > 0) {
            let tableData = new Array();
            let subThemeLabel = '';
            let parentThemeType = '';
            let parentThemeName = '';
            content.data.forEach((row) => {
              subThemeLabel = row.label;
              parentThemeType = row.hierarchyTrack[row.hierarchyTrack.length - 1]
                ? row.hierarchyTrack[row.hierarchyTrack.length - 1].label
                : '';
              parentThemeName = row.hierarchyTrack[row.hierarchyTrack.length - 1]
                ? row.hierarchyTrack[row.hierarchyTrack.length - 1].name
                : '';
              row.score = Number(row.score);
              tableData.push(_.pick(row, ['name', 'score']));
            });

            let sectionHeading = hierarchyLevel > 0 ? parentThemeType + ' - ' + parentThemeName : '';
            let graphTitle =
              hierarchyLevel > 0 ? 'Performance in ' + parentThemeName : 'Performance by ' + subThemeLabel;
            let graphSubTitle =
              hierarchyLevel > 0
                ? 'Performance of entity in sub categories of ' + parentThemeName
                : 'Performance of entity acorss ' + subThemeLabel + ' in the entity development framework';

            let graphHAxisTitle =
              hierarchyLevel > 0
                ? 'Categories within  ' + parentThemeName
                : subThemeLabel + ' in the entity development framework';

            let eachSubSection = {
              table: true,
              graph: true,
              graphData: {
                title: graphTitle,
                subTitle: graphSubTitle,
                chartType: 'ColumnChart',
                chartOptions: {
                  is3D: true,
                  isStack: true,
                  vAxis: {
                    title: 'Percentage of development (out of 100%)',
                    minValue: 0,
                  },
                  hAxis: {
                    title: graphHAxisTitle,
                    showTextEvery: 1,
                  },
                },
              },
              data: tableData,
              tabularData: {
                headers: [
                  {
                    name: 'name',
                    value: subThemeLabel,
                  },
                  {
                    name: 'score',
                    value: 'Performance Index In %',
                  },
                ],
              },
            };

            responseObject.sections.push({
              heading: sectionHeading,
              subSections: [eachSubSection],
            });

            let tableSummaryTotal = {
              name: 'Total',
            };
            let tableSummaryPercentage = {
              name: '% for all themes',
            };
            for (var k in insights.levelToScoreMapping) {
              tableSummaryTotal[k] = 0;
              tableSummaryPercentage[k] = 0;
            }

            let summaryTableData = new Array();
            let totalThemeCount = 0;
            content.data.forEach((row) => {
              for (var k in insights.levelToScoreMapping) {
                row[k] = row.criteriaLevelCount[k];
                tableSummaryTotal[k] += row.criteriaLevelCount[k];
                totalThemeCount += row.criteriaLevelCount[k];
              }
              summaryTableData.push(_.pick(row, ['name', ...Object.keys(insights.levelToScoreMapping)]));
            });

            for (var k in insights.levelToScoreMapping) {
              tableSummaryPercentage[k] = Number(((tableSummaryTotal[k] / totalThemeCount) * 100).toFixed(2));
            }
            summaryTableData.push(tableSummaryTotal);
            summaryTableData.push(tableSummaryPercentage);

            let summaryTableSectionHeading =
              hierarchyLevel > 0
                ? 'Performance report for ' + insights.entityName + ' for each '
                : 'Performance Report for ' + insights.entityName + ' by ';

            let eachSummarySection = {
              table: true,
              graph: false,
              data: summaryTableData,
              tabularData: {
                headers: themeSummarySectionHeaders,
              },
            };

            themeSummary.push({
              heading: summaryTableSectionHeading,
              subSections: [eachSummarySection],
            });
          } else {
            Object.keys(content).forEach((subTheme) => {
              if (subTheme != 'data') {
                generateSections(content[subTheme], hierarchyLevel + 1);
              }
            });
          }
        };

        Object.keys(insightResult).forEach((hierarchyLevel) => {
          let eachLevelContent = insightResult[hierarchyLevel];
          generateSections(eachLevelContent, hierarchyLevel);
        });

        criteriaResult.forEach((criteriaGroup) => {
          let tableData = new Array();
          let criteriaParent = criteriaGroup.hierarchyTrack[criteriaGroup.hierarchyTrack.length - 1].label;

          let sectionSummary = new Array();
          criteriaGroup.hierarchyTrack.forEach((hierarchyLevel) => {
            sectionSummary.push({
              value: hierarchyLevel.name,
              label: hierarchyLevel.label,
            });
          });

          criteriaGroup.data.forEach((row) => {
            row.level = Number(row.level.substr(1));
            tableData.push(_.pick(row, ['name', 'level']));
          });

          let sectionHeading = 'Detailed report for each ' + criteriaParent;
          let graphTitle = 'Distribution of levels by criteria';
          let graphSubTitle = 'Performance index';

          let eachSubSection = {
            table: true,
            graph: true,
            graphData: {
              title: graphTitle,
              subTitle: graphSubTitle,
              chartType: 'ColumnChart',
              chartOptions: {
                is3D: true,
                isStack: true,
                vAxis: {
                  title: 'Level',
                  minValue: 0,
                },
                hAxis: {
                  title: 'Criteria',
                  showTextEvery: 1,
                },
              },
            },
            data: tableData,
            tabularData: {
              headers: [
                {
                  name: 'name',
                  value: 'Criteria',
                },
                {
                  name: 'level',
                  value: 'Levels',
                },
              ],
            },
          };

          responseObject.sections.push({
            heading: sectionHeading,
            summary: sectionSummary,
            subSections: [eachSubSection],
          });
        });

        responseObject.sections = _.concat(responseObject.sections, ...themeSummary);

        let response = {
          message: messageConstants.apiResponses.INSIGHTS_FETCHED,
          result: responseObject,
        };

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
   * @api {post} /assessment/api/v1/insights/singleEntityHighLevelReport/:programId?solutionId=""&entity="" Single entity high level report
   * @apiVersion 1.0.0
   * @apiName Single entity high level report
   * @apiHeader {String} X-authenticated-user-token Authenticity token
   * @apiSampleRequest /assessment/api/v1/insights/singleEntityHighLevelReport/PROGID01?entity=5c5147ae95743c5718445eff
   * @apiGroup Insights
   * @apiUse successBody
   * @apiUse errorBody
   */

  /**
   * Single entity high level.
   * @method
   * @name singleEntityHighLevelReport
   * @param {Object} req -request Data.
   * @param {String} req.query.solutionId - solution id.
   * @param {String} req.params._id - program id.
   * @param {String} req.query.entity - entity id.
   * @returns {JSON} - entity high level report.
   */

  async singleEntityHighLevelReport(req) {
    return new Promise(async (resolve, reject) => {
      try {
        let programId = req.params._id;
        let solutionId = req.query.solutionId;
        let entityId = req.query.entity;

        let insights = await database.models.insights.findOne({
          programExternalId: programId,
          solutionId: ObjectId(solutionId),
          entityId: ObjectId(entityId),
        });

        if (!insights) {
          throw messageConstants.apiResponses.INSIGHTS_NOT_FOUND;
        }

        let insightResult = {};
        let hierarchyLevel = 0;
        let themesToProcess = {};

        let recordsToProcess = insights.themeScores.filter((theme) => theme.hierarchyLevel == hierarchyLevel);
        if (recordsToProcess.length > 0) {
          if (!insightResult[hierarchyLevel]) {
            insightResult[hierarchyLevel] = {
              data: new Array(),
            };
          }
          recordsToProcess.forEach((record) => {
            themesToProcess[record.name] = {
              name: record.name,
              criteria: new Array(),
            };
            if (!record.hierarchyTrack[hierarchyLevel - 1] || !record.hierarchyTrack[hierarchyLevel - 1].name) {
              insightResult[hierarchyLevel].data.push(record);
            } else {
              if (!insightResult[hierarchyLevel][record.hierarchyTrack[hierarchyLevel - 1].name]) {
                insightResult[hierarchyLevel][record.hierarchyTrack[hierarchyLevel - 1].name] = {
                  data: new Array(),
                };
              }
              insightResult[hierarchyLevel][record.hierarchyTrack[hierarchyLevel - 1].name].data.push(record);
            }
          });
        }

        let responseObject = {};
        responseObject.heading = insights.entityName + ' - (Performance across domains)';
        responseObject.isShareable = req.query && req.query.linkId ? false : true;
        responseObject.summary = [
          {
            title: 'Name of Entity',
            value: insights.entityName,
          },
          {
            title: 'Date of Assessment',
            value: moment(insights.ratingCompletedAt).format('DD-MM-YYYY'),
          },
        ];

        responseObject.solutionUrl = {
          label: 'Solution Framework Structure + rubric defintion',
          link: 'solutions/details/' + insights.solutionId.toString(),
        };

        responseObject.sections = new Array();

        let summarySectionTableHeaders = new Array();
        summarySectionTableHeaders.push({
          name: 'name',
          value: '',
        });
        for (var k in insights.levelToScoreMapping) {
          summarySectionTableHeaders.push({ name: k, value: insights.levelToScoreMapping[k].label });
        }

        if (insightResult[0].data.length > 0) {
          let tableData = new Array();

          let tableSummaryTotal = {
            name: 'Total',
          };
          let tableSummaryPercentage = {
            name: 'Summary',
          };
          for (var k in insights.levelToScoreMapping) {
            tableSummaryTotal[k] = 0;
            tableSummaryPercentage[k] = 0;
          }

          let totalThemeCount = 0;
          insightResult[0].data.forEach((row) => {
            for (var k in insights.levelToScoreMapping) {
              row[k] = row.criteriaLevelCount[k];
              tableSummaryTotal[k] += row.criteriaLevelCount[k];
              totalThemeCount += row.criteriaLevelCount[k];
            }
            tableData.push(_.pick(row, ['name', ...Object.keys(insights.levelToScoreMapping)]));
          });

          for (var k in insights.levelToScoreMapping) {
            tableSummaryPercentage[k] = ((tableSummaryTotal[k] / totalThemeCount) * 100).toFixed(2) + '%';
          }
          // tableData.push(tableSummaryPercentage)
          tableData.push(tableSummaryTotal);

          let sectionSummary = [
            {
              label: 'Number of Key Domains',
              value: insightResult[0].data.length,
            },
            {
              label: 'Number of Criteria',
              value: totalThemeCount,
            },
          ];
          for (var k in insights.levelToScoreMapping) {
            sectionSummary.push({
              label: '% of criteria in ' + k,
              value: Number(((tableSummaryTotal[k] / totalThemeCount) * 100).toFixed(2)),
            });
          }

          let graphTitle = '';
          let graphSubTitle = '';
          let graphHAxisTitle = 'Percentage';

          let eachSubSection = {
            table: true,
            graph: true,
            graphData: {
              title: graphTitle,
              subTitle: graphSubTitle,
              chartType: 'BarChart',
              chartOptions: {
                is3D: true,
                isStacked: true,
                vAxis: {
                  title: 'Key domain and totals',
                  minValue: 0,
                },
                hAxis: {
                  title: graphHAxisTitle,
                  showTextEvery: 1,
                },
              },
            },
            data: tableData,
            tabularData: {
              headers: summarySectionTableHeaders,
            },
          };

          responseObject.sections.push({
            heading: '',
            summary: sectionSummary,
            subSections: [eachSubSection],
          });
        }

        let generateSectionsForTheme = function (theme) {
          if (theme.criteria.length > 0) {
            let table1Headers = [
              {
                name: 'name',
                value: 'Core Standard',
              },
              {
                name: 'level',
                value: 'Availability',
              },
            ];
            let table1Data = new Array();

            let table2Headers = [
              {
                name: 'level',
                value: 'Levels',
              },
              {
                name: 'noOfCriteria',
                value: '# of Criteria',
              },
            ];
            let table2Data = new Array();

            let tableSummaryTotal = {};
            for (var k in insights.levelToScoreMapping) {
              tableSummaryTotal[k] = 0;
            }

            theme.criteria.forEach((criteria) => {
              tableSummaryTotal[criteria.level] += 1;
              table1Data.push({
                name: criteria.name,
                level: Number(criteria.level.substr(1)),
              });
            });

            for (var k in insights.levelToScoreMapping) {
              table2Data.push({
                level: insights.levelToScoreMapping[k].label,
                noOfCriteria: tableSummaryTotal[k],
              });
            }

            let sectionHeading = 'Key Domain - ' + theme.name;

            let subSection1 = {
              table: true,
              graph: true,
              graphData: {
                title: 'Key Domain - ' + theme.name,
                subTitle: '',
                chartType: 'ColumnChart',
                chartOptions: {
                  is3D: true,
                  isStack: true,
                  vAxis: {
                    title: 'Levels',
                    minValue: 0,
                  },
                  hAxis: {
                    title: 'Criteria under ' + theme.name,
                    showTextEvery: 1,
                  },
                },
              },
              data: table1Data,
              tabularData: {
                headers: table1Headers,
              },
            };

            let subSection2 = {
              table: true,
              graph: true,
              graphData: {
                title: 'Summary of Distribution',
                subTitle: '',
                chartType: 'PieChart',
                chartOptions: {
                  is3D: true,
                  isStack: true,
                  vAxis: {
                    title: 'Levels',
                    minValue: 0,
                  },
                  hAxis: {
                    title: 'Criteria under ' + theme.name,
                    showTextEvery: 1,
                  },
                },
              },
              data: table2Data,
              tabularData: {
                headers: table2Headers,
              },
            };

            responseObject.sections.push({
              heading: sectionHeading,
              subSections: [subSection1, subSection2],
            });
          }
        };

        for (let criteriaCounter = 0; criteriaCounter < insights.criteriaScores.length; criteriaCounter++) {
          themesToProcess[insights.criteriaScores[criteriaCounter].hierarchyTrack[0].name].criteria.push(
            _.pick(insights.criteriaScores[criteriaCounter], ['name', 'level']),
          );
        }

        Object.keys(themesToProcess).forEach((theme) => {
          generateSectionsForTheme(themesToProcess[theme]);
        });

        let response = {
          message: messageConstants.apiResponses.HIGH_LEVEL_INSIGHTS,
          result: responseObject,
        };

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
   * @api {post} /assessment/api/v1/insights/multiEntityHighLevelReport/:programId?solutionId=""&entity=""&blockName="" Multi entity high level report
   * @apiVersion 1.0.0
   * @apiName Multi entity high level report
   * @apiHeader {String} X-authenticated-user-token Authenticity token
   * @apiSampleRequest /assessment/api/v1/insights/multiEntityHighLevelReport/5c5147ae95743c5718445eff
   * @apiGroup Insights
   * @apiUse successBody
   * @apiUse errorBody
   */

  /**
   * Multi entity high level.
   * @method
   * @name multiEntityHighLevelReport
   * @param {Object} req -request Data.
   * @param {String} req.query.solutionId - solution id.
   * @param {String} req.params._id - program id.
   * @param {Array} req.query.entity - entity ids.
   * @param {String} req.query.blockName - name of the block.
   * @returns {JSON} - Multiple entity high level report.
   */

  async multiEntityHighLevelReport(req) {
    return new Promise(async (resolve, reject) => {
      try {
        let programId = req.params._id;
        let solutionId = req.query.solutionId;
        let entityIdArray = req.query.entity.split(',') || [];
        let blockName = req.query.blockName;

        let insights = await database.models.insights.find(
          {
            programExternalId: programId,
            solutionId: ObjectId(solutionId),
            entityId: { $in: entityIdArray },
          },
          {
            entityId: 1,
            themeScores: 1,
            criteriaScores: 1,
            programId: 1,
            levelToScoreMapping: 1,
            solutionId: 1,
          },
        );

        if (!insights) {
          throw messageConstants.apiResponses.INSIGHTS_NOT_FOUND;
        }

        let insightResult = {};
        insights[0].themeScores.forEach((theme) => {
          if (theme.hierarchyLevel == 0) {
            !insightResult[theme.name] ? (insightResult[theme.name] = { name: theme.name, criteria: {} }) : '';
            if (!insightResult[theme.name]) {
              insightResult[theme.name] = {
                name: theme.name,
                criteria: {},
              };
            }
          }
        });

        insights.forEach((insight) => {
          insight.criteriaScores.forEach((criteria) => {
            if (!insightResult[criteria.hierarchyTrack[0].name].criteria[criteria.name]) {
              insightResult[criteria.hierarchyTrack[0].name].criteria[criteria.name] = {
                criteriaName: criteria.name,
              };
              for (var k in insights[0].levelToScoreMapping) {
                insightResult[criteria.hierarchyTrack[0].name].criteria[criteria.name][k] = 0;
              }
            }
            insightResult[criteria.hierarchyTrack[0].name].criteria[criteria.name][criteria.level] += 1;
          });
        });

        let responseObject = {};
        responseObject.heading = 'Performance Summary for all entities in ' + blockName;
        responseObject.isShareable = req.query && req.query.linkId ? false : true;
        responseObject.summary = [
          {
            label: 'Name of the Block',
            value: blockName,
          },
          {
            label: 'Total number of entities',
            value: insights.length,
          },
          {
            label: 'Date',
            value: moment().format('DD-MM-YYYY'),
          },
        ];
        responseObject.subTitle = 'Categorization of entities at different level - %';

        responseObject.solutionUrl = {
          label: 'Solution Framework Structure + rubric defintion',
          link: 'solutions/details/' + insights[0].solutionId.toString(),
        };

        responseObject.sections = new Array();

        let sectionHeaders = new Array();
        sectionHeaders.push({
          name: 'criteriaName',
          value: 'Core Standard',
        });
        for (var k in insights[0].levelToScoreMapping) {
          sectionHeaders.push({ name: k, value: insights[0].levelToScoreMapping[k].label });
        }

        Object.keys(insightResult).forEach((themeName) => {
          let tableData = new Array();
          Object.keys(insightResult[themeName].criteria).forEach((criteria) => {
            tableData.push(insightResult[themeName].criteria[criteria]);
          });

          let eachSubSection = {
            table: true,
            graph: true,
            heading: themeName,
            graphData: {
              title: 'Block performance report',
              subTitle: 'Perfomance of entities in a block across core standards',
              chartType: 'BarChart',
              chartOptions: {
                is3D: true,
                isStacked: true,
                vAxis: {
                  title: 'Core standards of entity improvement',
                  minValue: 0,
                },
                hAxis: {
                  title: 'Percentage of Entities',
                  showTextEvery: 1,
                },
              },
            },
            data: tableData,
            tabularData: {
              headers: sectionHeaders,
            },
          };

          responseObject.sections.push({
            heading: themeName,
            subSections: [eachSubSection],
          });
        });

        let response = {
          message: messageConstants.apiResponses.INSIGHTS_FETCHED,
          result: responseObject,
        };

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
   * @api {post} /assessment/api/v1/insights/multiEntityDrillDownReport/:programId?solutionId=""&entity=""&blockName="" Multi entity drill down report
   * @apiVersion 1.0.0
   * @apiName Multi entity drill down report
   * @apiHeader {String} X-authenticated-user-token Authenticity token
   * @apiSampleRequest /assessment/api/v1/insights/multiEntityDrillDownReport/5c5147ae95743c5718445eff
   * @apiGroup Insights
   * @apiUse successBody
   * @apiUse errorBody
   */

  /**
   * Multi entity drill down.
   * @method
   * @name multiEntityHighLevelReport
   * @param {Object} req -request Data.
   * @param {String} req.query.solutionId - solution id.
   * @param {String} req.params._id - program id.
   * @param {Array} req.query.entity - entity ids.
   * @param {String} req.query.blockName - name of the block.
   * @returns {JSON} - Multiple entity drill down report.
   */

  async multiEntityDrillDownReport(req) {
    return new Promise(async (resolve, reject) => {
      try {
        let programId = req.params._id;
        let solutionId = req.query.solutionId;
        let entityIdArray = req.query.entity.split(',') || [];
        let blockName = req.query.blockName;

        let insights = await database.models.insights.find(
          {
            programExternalId: programId,
            solutionId: ObjectId(solutionId),
            entityId: { $in: entityIdArray },
          },
          {
            entityId: 1,
            entityName: 1,
            themeScores: 1,
            criteriaScores: 1,
            programId: 1,
            levelToScoreMapping: 1,
            solutionId: 1,
          },
        );

        if (!insights) {
          throw messageConstants.apiResponses.INSIGHTS_NOT_FOUND;
        }

        let insightResult = {};
        insights[0].themeScores.forEach((theme) => {
          if (theme.hierarchyLevel == 0) {
            !insightResult[theme.name] ? (insightResult[theme.name] = { name: theme.name, entities: {} }) : '';
            if (!insightResult[theme.name]) {
              insightResult[theme.name] = {
                name: theme.name,
                entities: {},
              };
            }
          }
        });

        let responseObject = {};
        responseObject.heading = 'Performance Summary for all Entities in ' + blockName;
        responseObject.isShareable = req.query && req.query.linkId ? false : true;
        responseObject.summary = [
          {
            label: 'Name of the Block',
            value: blockName,
          },
          {
            label: 'Total number of entities',
            value: insights.length,
          },
          {
            label: 'Date',
            value: moment().format('DD-MM-YYYY'),
          },
        ];

        let criteriaLevelCount = {};
        for (var k in insights[0].levelToScoreMapping) {
          criteriaLevelCount[k] = 0;
        }

        responseObject.subTitle = 'Categorization of entities at different level - %';

        responseObject.solutionUrl = {
          label: 'Solution Framework Structure + rubric defintion',
          link: 'solutions/details/' + insights[0].solutionId.toString(),
        };

        responseObject.sections = new Array();

        let table1Header = {
          name: 'entityName',
          value: 'Core Standard',
        };

        let table2Header = {
          name: 'criteriaName',
          value: 'Core Standard',
        };

        let criteriaThemeGrouping = {};
        Object.keys(insightResult).forEach((themeName) => {
          criteriaThemeGrouping[themeName] = {
            themeName: themeName,
            criteria: {},
          };
        });

        let totalCriteriaCount = 0;
        insights[0].criteriaScores.forEach((criteria) => {
          totalCriteriaCount += 1;
          criteriaThemeGrouping[criteria.hierarchyTrack[0].name].criteria[criteria.name] = {
            criteriaName: criteria.name,
          };
        });
        responseObject.summary.push({
          label: 'Number of criteria in each entity:',
          value: totalCriteriaCount,
        });

        Object.keys(insightResult).forEach((themeName) => {
          let table1Headers = new Array();
          let table2Headers = new Array();

          let table1Data = new Array();
          let table2Data = new Array();

          table1Headers.push(table1Header);
          table2Headers.push(table2Header);

          Object.keys(criteriaThemeGrouping[themeName].criteria).forEach((criteriaName) => {
            let eachRow = {
              criteriaName: criteriaName,
            };
            insights.forEach((insight) => {
              for (
                let entityCriteriaScoresCounter = 0;
                entityCriteriaScoresCounter < insight.criteriaScores.length;
                entityCriteriaScoresCounter++
              ) {
                if (insight.criteriaScores[entityCriteriaScoresCounter].name == criteriaName) {
                  eachRow[insight.entityName] = Number(
                    insight.criteriaScores[entityCriteriaScoresCounter].level.substr(1),
                  );
                  break;
                }
              }
            });

            table2Data.push(eachRow);
            table1Headers.push({
              name: criteriaName,
              value: criteriaName,
            });
          });

          insights.forEach((insight) => {
            let eachRow = {
              entityName: insight.entityName,
            };
            insight.criteriaScores.forEach((criteria) => {
              if (criteria.hierarchyTrack[0].name == themeName) {
                eachRow[criteria.name] = Number(criteria.level.substr(1));
                criteriaLevelCount[criteria.level] += 1;
              }
            });
            table1Data.push(eachRow);
            table2Headers.push({
              name: insight.entityName,
              value: insight.entityName,
            });
          });

          let subSection1 = {
            table: true,
            graph: true,
            heading: themeName,
            graphData: {
              title: 'Cluster performance report across entities',
              subTitle:
                'Entities in the clusters performance across different core-standards in key domain: ' + themeName,
              chartType: 'ColumnChart',
              chartOptions: {
                is3D: true,
                isStacked: false,
                vAxis: {
                  title: 'Levels',
                  minValue: 0,
                },
                hAxis: {
                  title: 'Entities in the cluster',
                  showTextEvery: 1,
                },
              },
            },
            data: table1Data,
            tabularData: {
              headers: table1Headers,
            },
          };

          let subSection2 = {
            table: false,
            graph: true,
            heading: themeName,
            graphData: {
              title: 'Performance report across core standards',
              subTitle: 'Entities in a clusters performance across different core-standards',
              chartType: 'ColumnChart',
              chartOptions: {
                is3D: true,
                isStacked: false,
                vAxis: {
                  title: 'Levels',
                  minValue: 0,
                },
                hAxis: {
                  title: 'Core standards in key domain ' + themeName,
                  showTextEvery: 1,
                },
              },
            },
            data: table2Data,
            tabularData: {
              headers: table2Headers,
            },
          };

          responseObject.sections.push({
            heading: 'Key Domain ' + themeName,
            subSections: [subSection1, subSection2],
          });
        });

        for (var k in insights[0].levelToScoreMapping) {
          responseObject.summary.push({
            label: '% of criteria in ' + k,
            value: ((criteriaLevelCount[k] / (totalCriteriaCount * insights.length)) * 100).toFixed(2),
          });
        }

        let response = {
          message: messageConstants.apiResponses.INSIGHTS_FETCHED,
          result: responseObject,
        };

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
};
