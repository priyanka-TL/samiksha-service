
const filesCloudHelper = require(MODULES_BASE_PATH + '/cloud-services/files/helper')
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

      console.log(answerInstanceObj,'answerInstanceObj')
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

  exports.generateObservationReportWithoutDruid = async function (data) {
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
          question: answerInstanceObj.payload.question[0],
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
  
        let chart = createChart(responseType,valueKey,)

        console.log(answerInstanceObj,'answerInstanceObj')
        newObj = {
          order: answerInstanceObj.externalId,
          question: answerInstanceObj.payload.question[0],
          responseType: answerInstanceObj.responseType,
          answers: valueKey,
          chart: chart,
          instanceQuestions: [],
          // criteriaName: data.criteria[0].name,
          criteriaId: answerInstanceObj.criteriaId,
          optionsAvailableForUser: answerInstanceObj.options ? answerInstanceObj.options : undefined,
          evidences,
        };
      }
  
      newReport.push(newObj);
    }
  
    return newReport;
  };

  exports.generateObservationReportForNonRubricWithoutDruid = async function(data){
    console.log(data,'<---**data')


    let answerArr = data.map((singleSurveySubmission)=>{
      return singleSurveySubmission.evidences['OB'].submissions[0].answers
    })

    require('fs').writeFileSync('atest.json',JSON.stringify(answerArr));

    let formattedCombinedAnswerArr = [];

    for(let submissionInstance of answerArr){

      let questionIdArr = Object.keys(submissionInstance);
    
      console.log(questionIdArr,'questionIdArr')
      console.log(stoppp)
    //  for(let )

      // let object = formattedCombinedAnswerArr.find((obj)=>{
      //   return obj.order = 
      // })



    }


  }

  function createChart(responseType,answerArr){
    let chart = {};

    if(responseType == 'radio'){

      chart  = {
        "type": "pie",
        "data": {
            "labels": answerArr,
            "datasets": [
                {
                    "backgroundColor": [
                        "#FFA971",
                        "#F6DB6C",
                        "#98CBED",
                        "#C9A0DA",
                        "#5DABDC",
                        "#88E5B0"
                    ],
                    "data": [
                        100
                    ]
                }
            ]
        }


    }

  }else if(responseType == 'multiselect'){

    chart  = {
      "type": "horizontalBar",
      "data": {
          "labels": answerArr,
          "datasets": [
              {
                  "backgroundColor": [
                      "#FFA971",
                      "#F6DB6C",
                      "#98CBED",
                      "#C9A0DA",
                      "#5DABDC",
                      "#88E5B0"
                  ],
                  "data": [
                      100
                  ]
              }
          ]
      }


  }

}
    return chart;
  }