const filesCloudHelper = require(MODULES_BASE_PATH + '/cloud-services/files/helper');
const questionsHelper = require(MODULES_BASE_PATH + '/questions/helper');

/**
 * Generates a submission report without using Druid.
 * This function processes survey data, removes specific keys from answers,
 * and creates a new report structure with formatted answers and evidences.
 *
 * @param {Object} data - The survey data object containing answers and criteria.
 * @returns {Promise<Array>} A promise that resolves to an array of formatted report objects.
 */
//function for creating report of survey solution
exports.generateSubmissionReportWithoutDruid = async function (data) {
  let keysToBeDeletedFromAnswers = getKeysToBeDeletedFromAnswers(data);

  let answers = data.answers;

  for (let answerInstanceKey in answers) {
    if (keysToBeDeletedFromAnswers.includes(answerInstanceKey)) {
      delete answers[answerInstanceKey];
    }
  }

  let newReport = [];

  for (let key in answers) {
    let answerInstanceObj = answers[key];
    let evidences = [];

    let fileName = answerInstanceObj.fileName;

    if (fileName && fileName.length > 0) {
      for (let fileObj of fileName) {
        let sourcePath = await filesCloudHelper.getDownloadableUrl([fileObj.sourcePath]);

        evidences.push(sourcePath.result[0]);
      }
    }

    let newObj = {};
    if (answerInstanceObj.responseType == 'matrix') {
      let qid = answerInstanceObj.qid;

      let questionRecordArr = await questionsHelper.questionDocument({
        _id: qid,
      });

      let questionRecord = questionRecordArr[0];

      let instanceIdentifier = questionRecord.instanceIdentifier;

      let valueArr = answerInstanceObj.value;

      let indentifierCount = 1;
      for (let value of valueArr) {
        for (let key in value) {
          let questionRecordArrNew = await questionsHelper.questionDocument({
            _id: value[key].qid,
          });

          value[key].optionsAvailableForUser = questionRecordArrNew[0].options
            ? questionRecordArrNew[0].options
            : undefined;
          value[key].question = questionRecordArrNew[0].question[0];

          let valueKey = Array.isArray(value[key].value) ? value[key].value : [value[key].value];

          value[key].answers = valueKey;
        }

        value.instanceIdentifier = instanceIdentifier + ' ' + indentifierCount;

        indentifierCount++;
      }

      newObj = {
        order: answerInstanceObj.externalId,
        question: answerInstanceObj.question[0],
        responseType: answerInstanceObj.responseType,
        chart: {},
        instanceQuestions: [],
        criteriaName: data.criteria[0].name,
        criteriaId: answerInstanceObj.criteriaId,
        optionsAvailableForUser: answerInstanceObj.options ? answerInstanceObj.options : undefined,
        instanceQuestions: valueArr,
        evidences,
        instanceIdentifier,
      };
    } else {
      let valueKey = Array.isArray(answerInstanceObj.value) ? answerInstanceObj.value : [answerInstanceObj.value];

      newObj = {
        order: answerInstanceObj.externalId,
        question: answerInstanceObj.question[0],
        responseType: answerInstanceObj.responseType,
        answers: valueKey,
        chart: {},
        instanceQuestions: [],
        criteriaName: data.criteria[0].name,
        criteriaId: answerInstanceObj.criteriaId,
        optionsAvailableForUser: answerInstanceObj.options ? answerInstanceObj.options : undefined,
        evidences,
      };
    }

    newReport.push(newObj);
  }

  return newReport;
};
/**
 * Identifies keys that should be removed from the answers object in the survey data.
 * This function is particularly useful for handling matrix-type responses.
 *
 * @param {Object} data - The survey data object containing answers.
 * @returns {Array<string>} An array of keys that should be deleted from the answers object.
 */
function getKeysToBeDeletedFromAnswers(data) {
  let keysToBeDeletedFromAnswers = [];
  let answers = data.answers;

  for (let answerInstanceKey in answers) {
    if (answers[answerInstanceKey].responseType == 'matrix') {
      let value = answers[answerInstanceKey].value;

      for (let obj of value) {
        let keys = Object.keys(obj);
        for (let key of keys) {
          keysToBeDeletedFromAnswers.push(key);
        }
      }
    }
  }

  return keysToBeDeletedFromAnswers;
}

exports.generateObservationReportForRubricWithoutDruid = async function (data) {
  let scoreReport = [];
  let domainLevelObject = generateDomainLevelObject(data);
  let chartObject = generateChartObjectForRubric(data);
  let horizontalBarChart={
    order:1,
    domainLevelObject:domainLevelObject,
    responseType:"horizontalBar",
    chart:chartObject
  }
  scoreReport.push(horizontalBarChart)
  let expansionChartObject = generateExpansionChartObject(data)
  let expansionTableChart={
    order:2,
    responseType:"expansion-table",
    chart:expansionChartObject
  }
  scoreReport.push(expansionTableChart)
  return scoreReport;
};

function generateDomainLevelObject(submissionData) {
  const domainLevelObject = {}
  submissionData.forEach((data)=>{
  data.themes.map((eachDomain) => {
    let level = eachDomain.pointsBasedLevel;
    let completedDate = data.completedDate;
    let domainName = eachDomain.name
      // Ensure the domainName exists in the object
      if (!domainLevelObject[domainName]) {
        domainLevelObject[domainName] = {};
      }

      // Ensure the completedDate exists under the domainName
      if (!domainLevelObject[domainName][completedDate]) {
        domainLevelObject[domainName][completedDate] = {};
      }

      // Ensure the level exists under the completedDate and set it to 1
      if (!domainLevelObject[domainName][completedDate][level]) {
        domainLevelObject[domainName][completedDate][level] = 1;
      } else {
        domainLevelObject[domainName][completedDate][level]++;
      }
    
  });
})
  return domainLevelObject;
}

function generateChartObjectForRubric(chartObjectsArray) {
// Create the initial structure of the horizontal chartData object

  const chartOptions = {
    type: 'horizontalBar',
    title: '',
    submissionDateArray: [],
    options: {
      title: {
        display: true,
        text: '',
      },
      scales: {
        xAxes: [
          {
            stacked: true,
            gridLines: {
              display: false,
            },
            scaleLabel: {
              display: true,
              labelString: 'Criteria',
            },
          },
        ],
        yAxes: [
          {
            stacked: true,
          },
        ],
      },
      legend: {
        display: true,
        position: 'bottom',
      },
    },
  };
  let themeArray = [];
  let dataSetsMap = {};


   // Points mapping based on level (L1 -> 1, L2 -> 2.)
   const pointsMapping = {
    "L1": 1,
    "L2": 2,
    "L3": 3,
    "L4": 4
  };

  // Loop through each chartObject in the array
  chartObjectsArray.forEach((chartObject) => {
    chartObject.themes.forEach((eachDomain) => {
      const themeName = eachDomain.name;

      // If themeName is not already in themeArray, add it
      if (!themeArray.includes(themeName)) {
        themeArray.push(themeName);

        for (let key in dataSetsMap) {
          dataSetsMap[key].data.push(0);
        }
      }

      // Find the points value for the current domain's level
      let pointsValue = pointsMapping[eachDomain.pointsBasedLevel] || 1;

      // If there's no dataset for this points level, create it
      if (!dataSetsMap[eachDomain.pointsBasedLevel]) {
        dataSetsMap[eachDomain.pointsBasedLevel] = {
          label: eachDomain.pointsBasedLevel,
          data: new Array(themeArray.length).fill(0), 
          backgroundColor: getColorForLevel(eachDomain.pointsBasedLevel),
        };
      }

      // Find the index of the current themeName
      const themeIndex = themeArray.indexOf(themeName);

      // Update the corresponding data in the dataset for this points level
      dataSetsMap[eachDomain.pointsBasedLevel].data[themeIndex] = pointsValue;
    });
  });


  let dataSetsArray = Object.values(dataSetsMap);

  chartOptions['data'] ={
    labels:themeArray,
    datasets:dataSetsArray
  }
  return chartOptions;
}

// Helper function to assign colors based on level
function getColorForLevel(level) {
  const colors = {
    "L1": "rgb(255, 99, 132)",
    "L2": "rgb(54, 162, 235)",
    "L3": "rgb(255, 206, 86)",
    "L4": "rgb(75, 192, 192)"
  };
  return colors[level] || "rgb(201, 203, 207)"; 
}

function generateExpansionChartObject(chartObjectsArray) {
  let levelExpandKey = {
    L1: "Level 1",
    L2: "Level 2",
    L3: "Level 3",
    L4: "Level 4",
  };

  // Initialize the chartData object
  let chartData = {
    type: "expansion-table",
    title: "Descriptive view",
    heading: chartObjectsArray.map((_, index) => `Assess. ${index + 1}`), // Generate "Assess. 1", "Assess. 2", etc.
    domains: [],
    totalSubmissions: chartObjectsArray.length // Total number of assessments
  };

  let domainsAndCriteriaScores = {};

  // Loop over each chart object (for each assessment)
  chartObjectsArray.forEach((chartObject, assessmentIndex) => {
    chartObject.themes.forEach((eachDomain) => {
      if (!domainsAndCriteriaScores[eachDomain.name]) {
        domainsAndCriteriaScores[eachDomain.name] = {
          domainName: eachDomain.name,
          criterias: []
        };
      }

      eachDomain.criteria.forEach(eachCriteriaScores => {
        let matchedCriteria = chartObject.criteria.find(eachDomainCriteria =>
          eachCriteriaScores.criteriaId.toString() === eachDomainCriteria._id.toString() ||
          (eachDomainCriteria.parentCriteriaId && eachCriteriaScores.criteriaId.toString() === eachDomainCriteria.parentCriteriaId.toString())
        );

        if (matchedCriteria) {
          let existingCriteria = domainsAndCriteriaScores[eachDomain.name].criterias.find(
            criteria => criteria.name === matchedCriteria.name
          );

          // If the criteria already exists, add another assessment (level and score) to the same entry
          if (existingCriteria) {
            existingCriteria.levels.push(levelExpandKey[matchedCriteria.score]);
            existingCriteria.levelsWithScores.push({
              level: levelExpandKey[matchedCriteria.score],
              score: matchedCriteria.scoreAchieved
            });
          } else {
            // If it's the first occurrence of this criteria, create a new entry
            domainsAndCriteriaScores[eachDomain.name].criterias.push({
              name: matchedCriteria.name,
              levels: [levelExpandKey[matchedCriteria.score]],
              levelsWithScores: [{
                level: levelExpandKey[matchedCriteria.score],
                score: matchedCriteria.scoreAchieved
              }]
            });
          }
        }
      });
    });
  });

  // Convert the domain criteria object back to an array
  chartData.domains = Object.values(domainsAndCriteriaScores);

  return chartData;
}


