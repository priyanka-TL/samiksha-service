
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

  exports.generateObservationReportForNonRubricWithoutDruid = async function (data,generateChart=false,criteriaWise=false) {
    let answerArr = data.map((singleSurveySubmission) => {
      let domain = Object.keys(singleSurveySubmission.evidences);
      return singleSurveySubmission.evidences[domain[0]].submissions[0].answers;
    });

    let formattedCombinedAnswerArr = [];
    let questionRecordsIdArr = [];
    let cachedCriteriaIdArr = [];

    for (let submissionInstance of answerArr) {
      let questionIdArr = Object.keys(submissionInstance);

      for (let questionId of questionIdArr) {
        let questionInstance = submissionInstance[questionId];

        let criteriaId = questionInstance.criteriaId;
        let qid = questionInstance.qid;

        questionRecordsIdArr.push(qid);
        cachedCriteriaIdArr.push(criteriaId);
      }
    }

    let criteriaInfoArr = await criteriaHelper.criteriaDocument({
      _id: {
        $in: cachedCriteriaIdArr,
      },
    });

    let questionRecordArr = await questionsHelper.questionDocument({
      _id: {
        $in: questionRecordsIdArr,
      },
    });

    for (let submissionInstance of answerArr) {
      let questionIdArr = Object.keys(submissionInstance);

      for (let questionId of questionIdArr) {
        let questionInstance = submissionInstance[questionId];

        let questionRecordSingleElement = questionRecordArr.find((record) => record._id.equals(questionInstance.qid));
        let criteriaInfo = criteriaInfoArr.find((record) => record._id.equals(questionInstance.criteriaId));

        if (questionInstance.responseType == 'matrix') {
          continue;
        }

        let options = questionRecordSingleElement.options;

        const index = formattedCombinedAnswerArr.findIndex((obj) => {
          return obj.order === questionInstance.qid;
        });

        if (index !== -1) {
          // If found, modify the existing object
          let existingAnswerArr = formattedCombinedAnswerArr[index].answers;
          if (
            Array.isArray(submissionInstance[questionId].value) &&
            submissionInstance[questionId].responseType !== 'multiselect'
          ) {
            existingAnswerArr = existingAnswerArr.concat(submissionInstance[questionId].value);
          } else if (
            Array.isArray(submissionInstance[questionId].value) &&
            submissionInstance[questionId].value &&
            submissionInstance[questionId].responseType == 'multiselect'
          ) {
            existingAnswerArr = existingAnswerArr.push(submissionInstance[questionId].value);
          } else {
            existingAnswerArr.push(submissionInstance[questionId].value);
          }
        } else {
          let newValue = {
            order: questionRecordSingleElement.externalId,
            question: submissionInstance[questionId].payload.question[0],
            responseType: submissionInstance[questionId].responseType,
            answers: [submissionInstance[questionId].value],
            chart: {},
            instanceQuestions: [],
            options,
            criteriaName: criteriaInfo.name,
            criteriaId: questionInstance.criteriaId,
          };
          formattedCombinedAnswerArr.push(newValue);
        }
      }
    }

    if(generateChart){
      formattedCombinedAnswerArr = createObservationChartWithoutRubric(formattedCombinedAnswerArr);

    }
    formattedCombinedAnswerArr = replaceWithLabelsOptimized(formattedCombinedAnswerArr);

    if(criteriaWise){
      formattedCombinedAnswerArr = await createCriteriaWiseReport(formattedCombinedAnswerArr);
    }

    return formattedCombinedAnswerArr;
  };

  async function createCriteriaWiseReport(reportData){
    let finalResponseArray = []
    let allCriterias = []
    console.log(reportData,'reportData');
    let groupByCriteria = groupDataByEntityId(reportData, "criteriaId");
    console.log(groupByCriteria,'groupByCriteria')
    
    let criteriaKeys = Object.keys(groupByCriteria);

    await Promise.all(criteriaKeys.map(ele => {

        let criteriaObj = {

            criteriaId: ele,
            criteriaName: groupByCriteria[ele][0].criteriaName,
            questionArray: groupByCriteria[ele]

        }
        
        allCriterias.push({
           _id: ele,
           name: groupByCriteria[ele][0].criteriaName
        })

        finalResponseArray.push(criteriaObj);

    }));

    return finalResponseArray;
  }
  // Function for grouping the array based on certain field name
function groupDataByEntityId(array, name) {
  result = array.reduce(function (r, a) {
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