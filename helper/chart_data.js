
const filesCloudHelper = require(MODULES_BASE_PATH + '/cloud-services/files/helper')
const questionsHelper = require(MODULES_BASE_PATH + '/questions/helper');
const criteriaHelper = require(MODULES_BASE_PATH + '/criteria/helper');

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
        // criteriaName: data.criteria[0].name,
        criteriaName:'placeholder',
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
function getKeysToBeDeletedFromAnswers(data){
    let keysToBeDeletedFromAnswers = [];
    let answers = data.answers;

    for(let answerInstanceKey in answers){
      
      if(answers[answerInstanceKey].responseType == 'matrix'){

        let value = answers[answerInstanceKey].value;

        for(let obj of value){
          
          let keys = Object.keys(obj);
          for(let key of keys){
            keysToBeDeletedFromAnswers.push(key)
          }

        }

      }

    }

    
   return keysToBeDeletedFromAnswers;
  }

/**
 * Generates an observation report for non-rubric without Druid.
 * @param {Array} data - Array of survey submissions.
 * @param {boolean} [generateChart=false] - Flag to generate chart.
 * @param {boolean} [criteriaWise=false] - Flag to create criteria-wise report.
 * @returns {Promise<Array>} Formatted combined answer array.
 */
exports.generateObservationReportForNonRubricWithoutDruid = async function (data,generateChart=false,criteriaWise=false) {
  const answerArr = extractAnswers(data);
  const { questionRecordsIdArr, cachedCriteriaIdArr } = extractIds(answerArr);

  const [criteriaInfoArr, questionRecordArr] = await Promise.all([
    fetchCriteriaInfo(cachedCriteriaIdArr),
    fetchQuestionRecords(questionRecordsIdArr)
  ]);

  let formattedCombinedAnswerArr = await formatAnswers(answerArr, criteriaInfoArr, questionRecordArr);

  if (generateChart) {
    formattedCombinedAnswerArr = createObservationChartWithoutRubric(formattedCombinedAnswerArr);
  }

  formattedCombinedAnswerArr = replaceWithLabelsOptimized(formattedCombinedAnswerArr);

  if (criteriaWise) {
    formattedCombinedAnswerArr = await createCriteriaWiseReport(formattedCombinedAnswerArr);
  }

  return formattedCombinedAnswerArr;
}

/**
 * Extracts answers from survey submissions.
 * @param {Array} data - Array of survey submissions.
 * @returns {Array} Extracted answers.
 */
function extractAnswers(data) {
  return data.map((singleSurveySubmission) => {
    const domain = Object.keys(singleSurveySubmission.evidences)[0];
    const answers = singleSurveySubmission.evidences[domain].submissions[0].answers;
    
    Object.values(answers).forEach(answer => {
      answer.submissionId = singleSurveySubmission._id;
    });
  
    return answers;
  });
}

/**
 * Extracts question and criteria IDs from answers.
 * @param {Array} answerArr - Array of answers.
 * @returns {Object} Object containing arrays of question and criteria IDs.
 */
function extractIds(answerArr) {
  const questionRecordsIdArr = new Set();
  const cachedCriteriaIdArr = new Set();

  answerArr.forEach(submissionInstance => {
    Object.values(submissionInstance).forEach(questionInstance => {
      questionRecordsIdArr.add(questionInstance.qid);
      cachedCriteriaIdArr.add(questionInstance.criteriaId);
    });
  });

  return {
    questionRecordsIdArr: Array.from(questionRecordsIdArr),
    cachedCriteriaIdArr: Array.from(cachedCriteriaIdArr)
  };
}

/**
 * Fetches criteria information.
 * @param {Array} criteriaIds - Array of criteria IDs.
 * @returns {Promise<Array>} Array of criteria documents.
 */
async function fetchCriteriaInfo(criteriaIds) {
  return criteriaHelper.criteriaDocument({ _id: { $in: criteriaIds } });
}

/**
 * Fetches question records.
 * @param {Array} questionIds - Array of question IDs.
 * @returns {Promise<Array>} Array of question documents.
 */
async function fetchQuestionRecords(questionIds) {
  return questionsHelper.questionDocument({ _id: { $in: questionIds } });
}

/**
 * Formats answers into a combined array.
 * @param {Array} answerArr - Array of answers.
 * @param {Array} criteriaInfoArr - Array of criteria information.
 * @param {Array} questionRecordArr - Array of question records.
 * @returns {Promise<Array>} Formatted combined answer array.
 */
async function formatAnswers(answerArr, criteriaInfoArr, questionRecordArr) {
  const formattedCombinedAnswerArr = [];

  for (const submissionInstance of answerArr) {
    for (const [questionId, questionInstance] of Object.entries(submissionInstance)) {
      if (questionInstance.responseType === 'matrix') continue;

      const questionRecordSingleElement = questionRecordArr.find(record => record._id.equals(questionInstance.qid));
      const criteriaInfo = criteriaInfoArr.find(record => record._id.equals(questionInstance.criteriaId));

      await updateOrCreateFormattedAnswer(formattedCombinedAnswerArr, questionInstance, questionRecordSingleElement, criteriaInfo);
    }
  }

  return formattedCombinedAnswerArr;
}

/**
 * Updates an existing formatted answer or creates a new one.
 * @param {Array} formattedCombinedAnswerArr - Array of formatted answers.
 * @param {Object} questionInstance - Question instance.
 * @param {Object} questionRecordSingleElement - Question record.
 * @param {Object} criteriaInfo - Criteria information.
 */
async function updateOrCreateFormattedAnswer(formattedCombinedAnswerArr, questionInstance, questionRecordSingleElement, criteriaInfo) {
  const index = formattedCombinedAnswerArr.findIndex(obj => obj.qid === questionInstance.qid);

  if (index !== -1) {
    await updateExistingAnswer(formattedCombinedAnswerArr[index], questionInstance);
  } else {
    const newValue = await createNewFormattedAnswer(questionInstance, questionRecordSingleElement, criteriaInfo);
    formattedCombinedAnswerArr.push(newValue);
  }
}

/**
 * Updates an existing formatted answer.
 * @param {Object} existingAnswer - Existing formatted answer.
 * @param {Object} questionInstance - Question instance.
 */
async function updateExistingAnswer(existingAnswer, questionInstance) {
  if (questionInstance.fileName && questionInstance.fileName.length > 0) {
    const newEvidences = await processFileEvidences(questionInstance.fileName, questionInstance.submissionId);
    existingAnswer.evidences.push(...newEvidences);
  }

  updateAnswerValues(existingAnswer.answers, questionInstance);
}

/**
 * Creates a new formatted answer.
 * @param {Object} questionInstance - Question instance.
 * @param {Object} questionRecordSingleElement - Question record.
 * @param {Object} criteriaInfo - Criteria information.
 * @returns {Promise<Object>} New formatted answer.
 */
async function createNewFormattedAnswer(questionInstance, questionRecordSingleElement, criteriaInfo) {
  const evidence = await processFileEvidences(questionInstance.fileName, questionInstance.submissionId);

  return {
    qid: questionInstance.qid,
    order: questionRecordSingleElement.externalId,
    question: questionInstance.payload.question[0],
    responseType: questionInstance.responseType,
    answers: [questionInstance.value],
    chart: {},
    instanceQuestions: [],
    options: questionRecordSingleElement.options,
    criteriaName: criteriaInfo.name,
    criteriaId: questionInstance.criteriaId,
    evidences: evidence
  };
}

/**
 * Processes file evidences.
 * @param {Array} fileNames - Array of file names.
 * @param {string} submissionId - Submission ID.
 * @returns {Promise<Array>} Processed evidences.
 */
async function processFileEvidences(fileNames, submissionId) {
  if (!fileNames || fileNames.length === 0) return [];

  const evidences = [];
  for (const file of fileNames) {
    const sourcePath = await filesCloudHelper.getDownloadableUrl([file.sourcePath]);
    evidences.push({ ...file, fileUrl: sourcePath.result[0], submissionId });
  }
  return evidences;
}

/**
 * Updates answer values.
 * @param {Array} existingAnswers - Existing answers.
 * @param {Object} questionInstance - Question instance.
 */
function updateAnswerValues(existingAnswers, questionInstance) {
  if (Array.isArray(questionInstance.value) && questionInstance.responseType !== 'multiselect') {
    existingAnswers.push(...questionInstance.value);
  } else if (Array.isArray(questionInstance.value) && questionInstance.value && questionInstance.responseType === 'multiselect') {
    existingAnswers.push(questionInstance.value);
  } else {
    existingAnswers.push(questionInstance.value);
  }
}

/**
 * Asynchronously creates a report grouped by criteria, processing report data
 * and returning a structured response array.
 * 
 * @param {Array} reportData - The array of report data, each item containing criteria and question details.
 * @returns {Promise<Array>} A promise that resolves to an array of objects where each object contains criteriaId, criteriaName, and questionArray.
 */
async function createCriteriaWiseReport(reportData) {
  let finalResponseArray = [];
  let allCriterias = [];
  let groupByCriteria = groupDataByEntityId(reportData, "criteriaId");
  let criteriaKeys = Object.keys(groupByCriteria);

  await Promise.all(criteriaKeys.map(ele => {
      let criteriaObj = {
          criteriaId: ele,
          criteriaName: groupByCriteria[ele][0].criteriaName,
          questionArray: groupByCriteria[ele]
      };

      allCriterias.push({
          _id: ele,
          name: groupByCriteria[ele][0].criteriaName
      });

      finalResponseArray.push(criteriaObj);
  }));

  return finalResponseArray;
}
/**
 * Groups an array of objects by a specific property, creating a dictionary
 * where keys are the values of the specified property, and values are arrays
 * of objects that share the same property value.
 * 
 * @param {Array} array - The array of objects to be grouped.
 * @param {string} name - The name of the property to group by.
 * @returns {Object} An object where the keys are unique values of the specified property, and the values are arrays of objects with matching property values.
 */
function groupDataByEntityId(array, name) {
  let result = array.reduce(function (r, a) {
      r[a[name]] = r[a[name]] || [];
      r[a[name]].push(a);
      return r;
  }, Object.create(null));

  return result;
}

  /**
 * Creates observation charts for specific response types in the provided report data.
 * 
 * This function iterates over each answer instance in the `reportData` array and generates 
 * a chart for instances where the `responseType` is either 'multiselect' or 'radio'. 
 * The generated chart is then added to the `chart` property of each matching answer instance.
 * 
 * @param {Array<Object>} reportData - The array of answer instances. Each instance is expected to 
 * have a `responseType`, `answers`, and `options` properties.
 * @returns {Array<Object>} The modified `reportData` array with added `chart` properties for the 
 * relevant answer instances.
 */
  function createObservationChartWithoutRubric(reportData) {
    for (let answerInstance of reportData) {
      if (answerInstance.responseType == 'multiselect' || answerInstance.responseType == 'radio') {
        answerInstance.chart = createChartForObservationWithoutRubric(
          answerInstance.responseType,
          answerInstance.answers,
          answerInstance.options
        );
      }
    }

    return reportData;
  }
/**
 * Creates a chart based on the response type, answers, and options.
 * 
 * This function is a placeholder and should be implemented to return a chart
 * object or data based on the provided parameters.
 * 
 * @param {string} responseType - The type of response ('multiselect' or 'radio').
 * @param {Array} answers - The answers provided by the users.
 * @param {Array} options - The possible options for the response.
 * @returns {Object} A chart object representing the data.
 */
  function createChartForObservationWithoutRubric(responseType, answers, options) {
    let chart = {};
    if (responseType == 'multiselect') {
      let percentages = calculatePercentagesForNestedArray(answers);

      chart = createMultiSelectChartForRadio(percentages);
    } else if (responseType == 'radio') {
      let percentages = calculatePercentagesForChartType(answers);

      chart = createPieChartForRadio(percentages);
    }

    return chart;
  }
/**
 * Creates a horizontal bar chart configuration for a given percentage distribution.
 * 
 * This function takes an object where the keys are the possible answers and the values 
 * are the corresponding percentages of responses. It returns a configuration object 
 * suitable for rendering a horizontal bar chart.
 * 
 * @param {Object} percentageObject - An object where keys represent possible answers and 
 * values represent the percentage of responses for each answer.
 * @returns {Object} A chart configuration object for rendering a horizontal bar chart.
 */
  function createMultiSelectChartForRadio(percentageObject) {
    let answers = Object.keys(percentageObject);

    let percentages = Object.values(percentageObject);

    let chartObj = {
      type: 'horizontalBar',
      data: {
        labels: answers,
        datasets: [
          {
            data: percentages,
            backgroundColor: '#de8657',
          },
        ],
      },
      options: {
        legend: false,
        scales: {
          xAxes: [
            {
              ticks: {
                min: 0,
                max: 100,
              },
              scaleLabel: {
                display: true,
                labelString: 'Responses in percentage',
              },
            },
          ],
          yAxes: [
            {
              scaleLabel: {
                display: true,
                labelString: 'Responses',
              },
            },
          ],
        },
      },
    };

    return chartObj;
  }
  /**
 * Creates a pie chart configuration for a given percentage distribution.
 * 
 * This function takes an object where the keys are the possible answers and the values 
 * are the corresponding percentages of responses. It returns a configuration object 
 * suitable for rendering a pie chart.
 * 
 * @param {Object} percentageObject - An object where keys represent possible answers and 
 * values represent the percentage of responses for each answer.
 * @returns {Object} A chart configuration object for rendering a pie chart.
 */
  function createPieChartForRadio(percentageObject) {
    let answers = Object.keys(percentageObject);

    let percentages = Object.values(percentageObject);

    let chartObj = {
      type: 'pie',
      data: {
        labels: answers,
        datasets: [
          {
            backgroundColor: ['#FFA971', '#F6DB6C', '#98CBED', '#C9A0DA', '#5DABDC', '#88E5B0'],
            data: percentages,
          },
        ],
      },
      options: {
        responsive: true,
        legend: {
          position: 'bottom',
          align: 'start',
        },
      },
    };

    return chartObj;
  }
  /**
 * Calculates the percentage distribution of elements in a nested array.
 * 
 * This function flattens a nested array of values, counts the occurrences of each unique value, 
 * and calculates the percentage that each value represents out of the total number of sub-arrays.
 * 
 * @param {Array<Array>} arr - A nested array where each sub-array contains values.
 * @returns {Object} An object where keys are the unique values from the nested array, and values 
 * are the corresponding percentages of occurrences.
 */
  function calculatePercentagesForNestedArray(arr) {
    // Step 1: Flatten the array and count occurrences
    const counts = arr.flat().reduce((acc, value) => {
      acc[value] = (acc[value] || 0) + 1;
      return acc;
    }, {});

    // Step 2: Calculate the total number of sub-arrays
    const totalArrays = arr.length;

    // Step 3: Calculate percentages for each element
    const percentages = Object.keys(counts).reduce((acc, key) => {
      acc[key] = (counts[key] / totalArrays) * 100;
      return acc;
    }, {});

    return percentages;
  }
  /**
 * Calculates the percentage distribution of elements in a flat array.
 * 
 * This function counts the occurrences of each unique value in a flat array and calculates 
 * the percentage that each value represents out of the total number of elements.
 * 
 * @param {Array} arr - A flat array of values.
 * @returns {Object} An object where keys are the unique values from the array, and values 
 * are the corresponding percentages of occurrences.
 */

  function calculatePercentagesForChartType(arr) {
    // Step 1: Group elements and count occurrences
    const counts = arr.reduce((acc, value) => {
      acc[value] = (acc[value] || 0) + 1;
      return acc;
    }, {});

    // Step 2: Calculate total elements in the array
    const totalElements = arr.length;

    // Step 3: Calculate percentages for each group
    const percentages = Object.keys(counts).reduce((acc, key) => {
      acc[key] = (counts[key] / totalElements) * 100;
      return acc;
    }, {});

    return percentages;
  }

  function replaceWithLabelsOptimized(dataArray) {
    // Iterate over each object in the array
    dataArray.forEach((item) => {
      if (item.responseType == 'multiselect' || item.responseType == 'radio') {
        const options = item.options;

        // Create a lookup dictionary for quick access
        const lookup = options.reduce((acc, option) => {
          acc[option.value] = option.label;
          return acc;
        }, {});

        // Replace values in answers array
        item.answers = item.answers.map((answer) => {
          if (Array.isArray(answer)) {
            return answer.map((value) => lookup[value] || value);
          } else {
            return lookup[answer] || answer;
          }
        });

        // Replace values in data.labels array

        if(item.chart.data){
          item.chart.data.labels = item.chart.data.labels.map((label) => lookup[label] || label);
        }

      }
    });

    return dataArray;
  }