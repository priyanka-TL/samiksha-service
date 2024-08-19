
const path = require("path");

const default_no_of_assessment_submissions_threshold = 3;
const default_entity_score_api_threshold = 5;
const filesHelper = require(MODULES_BASE_PATH + '/cloud-services/files/helper')

//function for instance observation final response creation
exports.instanceReportChart = async function (data, reportType = "") {
    let result;
    let multiSelectArray = [];
    let matrixArray = [];
    let order = "questionExternalId";
    let actualData = data;
    let solutionType;
    try {
        if (reportType && reportType == filesHelper.survey) {
            solutionType = filesHelper.survey;

            result = {
                solutionName: data.solutionExternalId,
                response: []
            }
        }
        else {
            solutionType = filesHelper.observation;
            result = {
                entityName: data[0].event[data[0].event.entityType + "Name"],
                observationName: data[0].event.observationName,
                observationId: data[0].event.observationId,
                entityType: data[0].event.entityType,
                entityId: data[0].event[data[0].event.entityType],
                districtName: data[0].event.districtName,
                response: []
            }
        }


        await Promise.all(data.map(async element => {
            // Response object creation for text, slider, number and date type of questions
            if (element.event.questionResponseType == "text" && element.event.instanceParentResponsetype != "matrix" || element.event.questionResponseType == "slider" && element.event.instanceParentResponsetype != "matrix" || element.event.questionResponseType == "number" && element.event.instanceParentResponsetype != "matrix" || element.event.questionResponseType == "date" && element.event.instanceParentResponsetype != "matrix") {

                if (element.event.questionResponseType == "date") {
                    element.event.questionAnswer = await getISTDate(element.event.questionAnswer);
                }

                // If answer is null then assign value as not answered
                if (element.event.questionAnswer == null) {
                    element.event.questionAnswer = "Not Answered";
                }


                let resp = {
                    order: element.event[order],
                    question: element.event.questionName,
                    responseType: element.event.questionResponseType,
                    answers: [element.event.questionAnswer],
                    chart: {},
                    instanceQuestions: [],
                    criteriaName: element.event.criteriaName,
                    criteriaId: element.event.criteriaId
                }

                // if(element.event.remarks != null){
                //     resp.remarks = [element.event.remarks]
                // }


                result.response.push(resp);
            }

            // Response object creation for radio type
            else if (element.event.questionResponseType == "radio" && element.event.instanceParentResponsetype != "matrix") {

                // If answer is null then assign value as not answered
                if (element.event.questionResponseLabel == null) {
                    element.event.questionResponseLabel = "Not Answered";
                }

                let resp = {
                    order: element.event[order],
                    question: element.event.questionName,
                    responseType:element.event.questionResponseType,
                    answers: [element.event.questionResponseLabel],
                    chart: {},
                    instanceQuestions: [],
                    criteriaName: element.event.criteriaName,
                    criteriaId: element.event.criteriaId,
                    optionsAvailableForUser:element.event.answerOptions
                }

                // if(element.event.remarks != null){
                //     resp.remarks = [element.event.remarks]
                // }

                result.response.push(resp);

            }

        }))

        //filter all the objects whose questionResponseType is multiselect
        await Promise.all(data.map(element => {
            if (element.event.questionResponseType == "multiselect" && element.event.instanceParentResponsetype != "matrix") {
                multiSelectArray.push(element);
            }
            if (element.event.instanceParentResponsetype == "matrix" && element.event.questionAnswer != null) {
                matrixArray.push(element);
            }
        }))

        //group the multiselect questions based on their questionExternalId
        let multiSelectResult = await groupArrayByGivenField(multiSelectArray, "questionExternalId");
        let res = Object.keys(multiSelectResult);

        //loop the keys and construct a response object for multiselect questions
        await Promise.all(res.map(async ele => {
            let multiSelectResp = await instanceMultiselectFunc(multiSelectResult[ele])
            result.response.push(multiSelectResp);

        }))

        //group the Matrix questions based on their questionExternalId
        let matrixResult = await groupArrayByGivenField(matrixArray, "instanceParentId");
        let matrixRes = Object.keys(matrixResult);

        //loop the keys of matrix array
        await Promise.all(matrixRes.map(async ele => {
            let matrixResponse = await matrixResponseObjectCreateFunc(matrixResult[ele], solutionType)
            result.response.push(matrixResponse);

        }))

        //sort the response objects based on questionExternalId field
        await result.response.sort(getSortOrder("order")); //Pass the attribute to be sorted on

        if (!reportType || reportType == filesHelper.survey) {
            // Get the questions array
            let questionArray = await questionListObjectCreation(actualData);
            result.allQuestions = questionArray;
        }

        //return final response object
        return result;
    }
    catch (err) {
        console.log(err);
    }
}


//Function to create a response object for multiselect question (Instance level Report)
async function instanceMultiselectFunc(data) {

    let labelArray = [];
    let question;

    await Promise.all(data.map(element => {

        // If answer is null then assign value as not answered
        if (element.event.questionResponseLabel == null) {
            element.event.questionResponseLabel = "Not Answered";
        }


        if(element.event.questionResponseLabel && Array.isArray(element.event.questionResponseLabel)){
            labelArray.push(...element.event.questionResponseLabel);
        }
        else {
            labelArray.push(element.event.questionResponseLabel);

        }
        question = element.event.questionName;
    }))

    //response object for multiselect questions
    let resp = {
        order: data[0].event.questionExternalId,
        question: question,
        responseType: data[0].event.questionResponseType,
        answers: labelArray,
        chart: {},
        instanceQuestions: [],
        criteriaName: data[0].event.criteriaName,
        criteriaId: data[0].event.criteriaId,
        optionsAvailableForUser:data[0].event.answerOptions
    }

    // if(data[0].event.remarks != null){
    //     resp.remarks = [data[0].event.remarks];
    // }

    return resp;

}


//Function for entity Observation and observation report's response creation
exports.entityReportChart = async function (data, entityId, entityName, reportType) {
    let result;
    let multiSelectArray = [];
    let textArray = [];
    let radioArray = [];
    let sliderArray = [];
    let numberArray = [];
    let dateArray = [];
    let noOfSubmissions = [];
    let matrixArray = [];
    let actualData = data;
    let solutionType;

    try {

        if (reportType == filesHelper.survey) {
            solutionType = filesHelper.survey;
            result = {
                solutionName: data[0].event.solutionName,
                response: []
            }
        }
        else {
            solutionType = filesHelper.observation;

            result = {
                entityType: data[0].event.entityType,
                entityId: entityId,
                entityName: data[0].event[entityName + "Name"],
                response: []
            }

            if (data[0].event.solutionId) {
                result.solutionId = data[0].event.solutionId;
                result.solutionName = data[0].event.solutionName;
            }
            else {
                result.observationId = data[0].event.observationId;
                result.observationName = data[0].event.observationName;
                result.districtName = data[0].event.districtName;
            }
        }

        await Promise.all(data.map(element => {
            if (noOfSubmissions.includes(element.event[solutionType + "SubmissionId"])) {
            } else {
                noOfSubmissions.push(element.event[solutionType + "SubmissionId"]);
            }

            if (element.event.questionResponseType == "text" && element.event.instanceParentResponsetype != "matrix") {
                textArray.push(element)
            }
            else if (element.event.questionResponseType == "radio" && element.event.instanceParentResponsetype != "matrix") {
                radioArray.push(element)
            }
            else if (element.event.questionResponseType == "multiselect" && element.event.instanceParentResponsetype != "matrix" && element.event.questionAnswer != null) {
                multiSelectArray.push(element)
            }
            else if (element.event.questionResponseType == "slider" && element.event.instanceParentResponsetype != "matrix") {
                sliderArray.push(element)
            }
            else if (element.event.questionResponseType == "number" && element.event.instanceParentResponsetype != "matrix") {
                numberArray.push(element)
            }
            else if (element.event.questionResponseType == "date" && element.event.instanceParentResponsetype != "matrix") {
                dateArray.push(element)
            }

            if (element.event.instanceParentResponsetype == "matrix") {
                if (element.event.questionResponseType == "multiselect" && element.event.questionAnswer != null || element.event.questionResponseType == "radio" || element.event.questionResponseType == "text" || element.event.questionResponseType == "date" || element.event.questionResponseType == "slider" || element.event.questionResponseType == "number") {
                    matrixArray.push(element)
                }
            }
        }))

        //group the text questions based on their questionName
        textResult = await groupArrayByGivenField(textArray, "questionExternalId");

        //group the radio questions based on their questionName
        radioResult = await groupArrayByGivenField(radioArray, "questionExternalId");

        //group the multiselect questions based on their questionName
        multiSelectResult = await groupArrayByGivenField(multiSelectArray, "questionExternalId");

        //group the slider questions based on their questionName
        sliderResult = await groupArrayByGivenField(sliderArray, "questionExternalId");

        //group the number questions based on their questionName
        numberResult = await groupArrayByGivenField(numberArray, "questionExternalId");

        //group the date questions based on their questionName
        dateResult = await groupArrayByGivenField(dateArray, "questionExternalId");

        //group the Matrix questions based on their instanceParentExternalId
        matrixResult = await groupArrayByGivenField(matrixArray, "instanceParentId");

        let textRes = Object.keys(textResult);
        //loop the keys and construct a response object for text questions
        await Promise.all(textRes.map(async ele => {
            let textResponse = await responseObjectCreateFunc(textResult[ele], solutionType)
            result.response.push(textResponse);

        }));

        let sliderRes = Object.keys(sliderResult);
        //loop the keys and construct a response object for slider questions
        await Promise.all(sliderRes.map(async ele => {
            let sliderResp = await responseObjectCreateFunc(sliderResult[ele], solutionType)
            result.response.push(sliderResp);
        }));

        let numberRes = Object.keys(numberResult);
        //loop the keys and construct a response object for slider questions
        await Promise.all(numberRes.map(async ele => {
            let numberResp = await responseObjectCreateFunc(numberResult[ele], solutionType)
            result.response.push(numberResp);
        }));

        let dateRes = Object.keys(dateResult);
        //loop the keys and construct a response object for slider questions
        await Promise.all(dateRes.map(async ele => {
            let dateResp = await responseObjectCreateFunc(dateResult[ele], solutionType)
            result.response.push(dateResp);
        }))

        let radioRes = Object.keys(radioResult);
        //loop the keys and construct a response object for slider questions
        await Promise.all(radioRes.map(async ele => {
            let radioResp = await radioObjectCreateFunc(radioResult[ele], noOfSubmissions)
            result.response.push(radioResp);
        }));

        let multiSelectRes = Object.keys(multiSelectResult);
        //loop the keys and construct a response object for multiselect questions
        await Promise.all(multiSelectRes.map(async ele => {
            let multiSelectResp = await multiSelectObjectCreateFunc(multiSelectResult[ele], noOfSubmissions, solutionType)
            result.response.push(multiSelectResp);
        }))

        let matrixRes = Object.keys(matrixResult);
        //loop the keys of matrix array
        await Promise.all(matrixRes.map(async ele => {
            let matrixResponse = await matrixResponseObjectCreateFunc(matrixResult[ele], solutionType)
            result.response.push(matrixResponse);

        }))

        result.totalSubmissions = noOfSubmissions.length;
        //sort the response objects based on questionExternalId field
        await result.response.sort(getSortOrder("order")); //Pass the attribute to be sorted on

        if (!reportType || reportType == filesHelper.survey) {
            // Get the questions array
            let questionArray = await questionListObjectCreation(actualData);
            result.allQuestions = questionArray;
        }

        return result;

    }
    catch (err) {
        console.log(err);
    }

}


//matrix questions response object creation
async function matrixResponseObjectCreateFunc(data, solutionType) {
    let noOfInstances = [];
    let order = "instanceParentExternalId";

    //To get the latest edited question
    let questionObject = data.sort(custom_sort);
    let question = questionObject[questionObject.length - 1].event.instanceParentQuestion;

    let result = {
        order: data[0].event[order],
        question: question,
        responseType: data[0].event.instanceParentResponsetype,
        answers: [],
        chart: {},
        instanceQuestions: []
    }

    if (data[0].event.instanceParentCriteriaId) {
        result.criteriaName = data[0].event.instanceParentCriteriaName;
        result.criteriaId = data[0].event.instanceParentCriteriaId
    }

    let groupBySubmissionId = await groupArrayByGivenField(data, solutionType + "SubmissionId");
    let submissionKeys = Object.keys(groupBySubmissionId);

    await Promise.all(submissionKeys.map(async ele => {

        let groupByInstanceId = await groupArrayByGivenField(groupBySubmissionId[ele], "instanceId")
        let instanceKeys = Object.keys(groupByInstanceId)

        await Promise.all(instanceKeys.map(async element => {
            let instanceData = groupByInstanceId[element];
            let instanceIdArray = [];

            await Promise.all(instanceData.map(resp => {
                if (instanceIdArray.includes(resp.event.instanceId)) {

                } else {
                    instanceIdArray.push(resp.event.instanceId);
                }
            }))

            noOfInstances.push(instanceIdArray);

        }))
    }))

    let instanceIdArrayData = [].concat.apply([], noOfInstances);

    //group the Matrix questions based on their questionExternalId
    let matrixResult = await groupArrayByGivenField(data, "questionExternalId");
    let matrixRes = Object.keys(matrixResult);

    //loop the keys and construct a response object for multiselect questions
    await Promise.all(matrixRes.map(async ele => {
        let matrixResponse = await matrixResponseObject(matrixResult[ele], instanceIdArrayData, solutionType)
        result.instanceQuestions.push(matrixResponse);

    }))

    //sort the response objects based on questionExternalId field
    await result.instanceQuestions.sort(getSortOrder("order")); //Pass the attribute to be sorted on

    return result;
}


//Create Response object for matrix type instance questions
async function matrixResponseObject(data, noOfInstances, solutionType) {

    if (data[0].event.questionResponseType == "text" || data[0].event.questionResponseType == "slider" || data[0].event.questionResponseType == "number" || data[0].event.questionResponseType == "date") {
       
        let responseObj = await responseObjectCreateFunc(data, solutionType);
        return responseObj;
    }
    else if (data[0].event.questionResponseType == "radio") {

        let responseObj = await radioObjectCreateFunc(data, noOfInstances);
        return responseObj;
    }
    else if (data[0].event.questionResponseType == "multiselect") {

        let responseObj = await multiSelectObjectCreateFunc(data, noOfInstances, solutionType);
        return responseObj;
    }
}


//function to create response object for text, number,slider,date questions (Entiry Report)
async function responseObjectCreateFunc(data, solutionType) {
    let question;
    let dataArray = [];
    //let remarks = [];

    //group the data based on submission id
    let groupBySubmissionId = await groupArrayByGivenField(data, solutionType + "SubmissionId");

    let submissionKeys = Object.keys(groupBySubmissionId);

    await Promise.all(submissionKeys.map(async element => {

        let answerArray = [];

        await Promise.all(groupBySubmissionId[element].map(async ele => {

            let answer = ele.event.questionAnswer;

            if (!answerArray.includes(answer)) {

                if (answer == null) {
                    answer = "Not answered";
                }

                if (ele.event.questionResponseType == "date") {
                    answer = await getISTDate(answer);
                }

                answerArray.push(answer);
            }
        }));

        dataArray.push(answerArray);
    }));

    //Merge multiple array into single array
    dataArray = Array.prototype.concat(...dataArray);


    //To get the latest edited question
    let questionObject = data.sort(custom_sort);
    question = questionObject[questionObject.length - 1].event.questionName;

    //response object
    let resp = {
        order: data[0].event.questionExternalId,
        question: question,
        responseType: data[0].event.questionResponseType,
        answers: dataArray,
        chart: {},
        instanceQuestions: [],
        criteriaName: data[0].event.criteriaName,
        criteriaId: data[0].event.criteriaId
    }

    return resp;
}


//function to create response object for radio questions (Entiry Report)
async function radioObjectCreateFunc(data, noOfSubmissions) {
    var dataArray = [];
    var labelArray = [];
    var chartdata = [];
    var answerArray = [];
    var question;
    //let remarks = [];

    for (var i = 0; i < data.length; i++) {

        if (data[i].event.questionAnswer == null) {
            data[i].event.questionAnswer = "Not answered";
        }
        if (data[i].event.questionResponseLabel == null) {
            data[i].event.questionResponseLabel = "Not answered";
        }

        dataArray.push(data[i].event.questionAnswer);
        answerArray.push(data[i].event.questionResponseLabel);

        if (labelArray.includes(data[i].event.questionResponseLabel)) {
        } else {
            labelArray.push(data[i].event.questionResponseLabel);
        }

        // if(data[i].event.remarks != null){
        //     remarks.push(data[i].event.remarks);
        // }

    }

    var responseArray = count(dataArray)   //call count function to count occurences of elements in the array
    responseArray = Object.entries(responseArray);  //to convert object into array

    for (var j = 0; j < responseArray.length; j++) {
        var k = 0;
        var element = responseArray[j];
        var value = (element[k + 1] / noOfSubmissions.length) * 100;
        value = parseFloat(value.toFixed(2));
        if (labelArray[j] == null) {
            labelArray[j] = "Not answered";
        }
        var dataObj = {
            name: labelArray[j],
            y: value
        }

        chartdata.push(dataObj);

    }

    //To get the latest edited question
    let questionObject = data.sort(custom_sort);
    question = questionObject[questionObject.length - 1].event.questionName;

    var resp = {
        order: data[0].event.questionExternalId,
        question: question,
        responseType: data[0].event.questionResponseType,
        answers: [],
        chart: {
            type: "pie",
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: false
                    },
                    showInLegend: true
                }
            },
            data: [
                {
                    data: chartdata
                }
            ]
        },
        instanceQuestions: [],
        criteriaName: data[0].event.criteriaName,
        criteriaId: data[0].event.criteriaId
    }

    if ("instanceParentResponsetype" in data[0].event != null) {
        resp.answers = answerArray;
    }

    return resp;
}

//function to create response object for multiselect questions (Entiry Report)
async function multiSelectObjectCreateFunc(data, noOfSubmissions, solutionType) {
    try {
        let dataArray = [];
        let answerArray = [];
        let labelArray = [];
        let chartdata = [];
        //let remarks = [];

        await Promise.all(data.map(ele => {
            dataArray.push(ele.event.questionAnswer);

            if (labelArray.includes(ele.event.questionResponseLabel)) {
            } else {
                labelArray.push(ele.event.questionResponseLabel)
            }
        }))

        labelMerged = Array.from(new Set(labelArray))
        uniqueDataArray = Object.entries(count(dataArray));

        for (let j = 0; j < uniqueDataArray.length; j++) {
            let k = 0;
            let element = uniqueDataArray[j];
            let value = (element[k + 1] / noOfSubmissions.length) * 100;
            value = parseFloat(value.toFixed(2));
            chartdata.push(value);
        }

        //To get the latest edited question
        let questionObject = data.sort(custom_sort);
        let question = questionObject[questionObject.length - 1].event.questionName;


        let resp = {
            order: data[0].event.questionExternalId,
            question: question,
            responseType: data[0].event.questionResponseType,
            answers: [],
            chart: {
                type: "bar",
                data: [
                    {
                        data: chartdata
                    }
                ],
                xAxis: {
                    categories: labelMerged,
                    title: {
                        text: "Responses"
                    }
                },
                yAxis: {
                    min: 0,
                    max: 100,
                    title: {
                        text: "Responses in percentage"
                    }
                }
            },
            instanceQuestions: [],
            criteriaName: data[0].event.criteriaName,
            criteriaId: data[0].event.criteriaId
        }

        // loop through objects and find remarks
        let groupArrayBySubmissions = await groupArrayByGivenField(data, solutionType + "SubmissionId");

        let submissionKeysArray = Object.keys(groupArrayBySubmissions);

        // await Promise.all(submissionKeysArray.map(async element => {

        //     if(groupArrayBySubmissions[element][0].event.remarks != null){
        //         remarks.push(groupArrayBySubmissions[element][0].event.remarks);
        //     }

        // }));

        // resp.remarks = remarks ;

        // Constructing answer array for matrix questions
        if ("instanceParentResponsetype" in data[0].event != null) {

            await Promise.all(submissionKeysArray.map(async ele => {
                var groupByInstanceId = await groupArrayByGivenField(groupArrayBySubmissions[ele], "instanceId")
                var instanceKeys = Object.keys(groupByInstanceId)

                await Promise.all(instanceKeys.map(async element => {
                    let instanceData = groupByInstanceId[element];
                    let instanceAnswerArray = [];

                    await Promise.all(instanceData.map(resp => {

                        instanceAnswerArray.push(resp.event.questionResponseLabel);
                    }))

                    answerArray.push(instanceAnswerArray);

                }))

            }))

            resp.answers = answerArray;
        }

        return resp;
    }
    catch (err) {
        console.log(err);
    }
}

// to count the occurances of same elements in the array
function count(arr) {
    return arr.reduce((prev, curr) => (prev[curr] = ++prev[curr] || 1, prev), {})
}

//Create response object for listObservationNames API
exports.listObservationNamesObjectCreate = async function (data) {
    try {
        let responseObj = []

        for (let i = 0; i < data.length; i++) {
            responseObj.push(data[i].event);
        }

        return responseObj;
    }
    catch (err) {
        console.log(err);
    }
}

//Create response object for listSolutionNames API
exports.listSolutionNamesObjectCreate = async function (data) {
    try {
        let responseObj = [];
        let scoring;

        let groupBySolutionId = await groupArrayByGivenField(data, "solutionId")

        let solutionKeys = Object.keys(groupBySolutionId);

        await Promise.all(solutionKeys.map(element => {

            let obj = {
                solutionName: groupBySolutionId[element][0].event.solutionName,
                solutionId: groupBySolutionId[element][0].event.solutionId
            }

            groupBySolutionId[element].forEach(ele => {

                if (ele.event.totalScore >= 1) {
                    scoring = true;
                }
            });


            if (scoring == true) {
                obj.scoring = true;
            } else {
                obj.scoring = false;
            }

            responseObj.push(obj);
        }))

        return responseObj;

    }
    catch (err) {
        console.log(err);
    }
}



//=========================================  assessment chart data ===============================================

exports.listProgramsObjectCreate = async function (data) {
    try {
        var responseObj = []
        var dataArray = []

        for (var i = 0; i < data.length; i++) {
            dataArray.push(data[i].event);
        }

        // Function for grouping the array based on program Id
        result = dataArray.reduce(function (r, a) {
            r[a.programId] = r[a.programId] || [];
            r[a.programId].push(a);
            return r;
        }, Object.create(null));

        var res = Object.keys(result);

        //loop the keys 
        await Promise.all(res.map(async ele => {
            var programListResp = await programListRespObjCreate(result[ele])
            responseObj.push(programListResp);

        }));

        return responseObj;
    }
    catch (err) {
        console.log(err);
    }
}

//Function to create program object and solution array  -- listPrograms API
async function programListRespObjCreate(data) {
    try {
        let pgmObj = {
            programName: data[0].programName,
            programId: data[0].programId,
            programDescription: data[0].programDescription,
            programExternalId: data[0].programExternalId,
            solutions: []
        }

        await Promise.all(data.map(element => {
            let solutionObj = {
                solutionName: element.solutionName,
                solutionId: element.solutionId,
                solutionDescription: element.solutionDescription,
                solutionExternalId: element.solutionExternalId
            }

            pgmObj.solutions.push(solutionObj);
        }));

        return pgmObj;

    }
    catch (err) {
        console.log(err);
    }
}

//Function to create stacked bar chart response object for entity assessment API  
exports.entityAssessmentChart = async function (inputObj) {
    return new Promise(async function (resolve, reject) {

        let entityName = inputObj.entityName;
        let domainObj = {};
        let domainCriteriaObj = {};
        let domainArray = [];
        let scoresExists = false;
        let dynamicLevelObj = {};
        let childEntityId = inputObj.childEntity ? inputObj.childEntity : inputObj.parentEntity;
        let childEntityName = childEntityId + "Name";

        for (let domain = 0; domain < inputObj.data.length; domain++) {

            let domainData = inputObj.data[domain];

            if (domainData.event.level !== null) {

                scoresExists = true;

                if (!dynamicLevelObj[domainData.event.level]) {
                    dynamicLevelObj[domainData.event.level] = [];
                }

                // Domain and level object creation for chart
                if (!domainObj[domainData.event[entityName]]) {
                    domainObj[domainData.event[entityName]] = {};
                    domainObj[domainData.event[entityName]][domainData.event.level] = {
                        [domainData.event.level]: 1,
                        entityId: inputObj.childEntity ? domainData.event[inputObj.childEntity] : ""
                    };

                } else {
                    if (!domainObj[domainData.event[entityName]][domainData.event.level]) {
                        domainObj[domainData.event[entityName]][domainData.event.level] = {
                            [domainData.event.level]: 1,
                            entityId: inputObj.childEntity ? domainData.event[inputObj.childEntity] : ""
                        };
                    }
                    else {
                        let level = domainObj[domainData.event[entityName]][domainData.event.level][domainData.event.level];
                        domainObj[domainData.event[entityName]][domainData.event.level] = {
                            [domainData.event.level]: ++level,
                            entityId: inputObj.childEntity ? domainData.event[inputObj.childEntity] : ""
                        }
                    }
                }


                // Domain and criteria object creation
                if (!domainCriteriaObj[domainData.event[childEntityId]]) {
                    domainCriteriaObj[domainData.event[childEntityId]] = {};
                    domainCriteriaObj[domainData.event[childEntityId]][domainData.event[childEntityName]] = {};
                    domainCriteriaObj[domainData.event[childEntityId]][domainData.event[childEntityName]][domainData.event.domainName] = {};
                    domainCriteriaObj[domainData.event[childEntityId]][domainData.event[childEntityName]][domainData.event.domainName][domainData.event.childExternalid] = {};
                    domainCriteriaObj[domainData.event[childEntityId]][domainData.event[childEntityName]][domainData.event.domainName][domainData.event.childExternalid][domainData.event.childName] = {};
                    domainCriteriaObj[domainData.event[childEntityId]][domainData.event[childEntityName]][domainData.event.domainName][domainData.event.childExternalid][domainData.event.childName]["level"] = domainData.event.level;
                }
                else {
                    if (!domainCriteriaObj[domainData.event[childEntityId]][domainData.event[childEntityName]]) {
                        domainCriteriaObj[domainData.event[childEntityId]][domainData.event[childEntityName]] = {};
                        domainCriteriaObj[domainData.event[childEntityId]][domainData.event[childEntityName]][domainData.event.domainName] = {};
                        domainCriteriaObj[domainData.event[childEntityId]][domainData.event[childEntityName]][domainData.event.domainName][domainData.event.childExternalid] = {};
                        domainCriteriaObj[domainData.event[childEntityId]][domainData.event[childEntityName]][domainData.event.domainName][domainData.event.childExternalid][domainData.event.childName] = {};
                        domainCriteriaObj[domainData.event[childEntityId]][domainData.event[childEntityName]][domainData.event.domainName][domainData.event.childExternalid][domainData.event.childName]["level"] = domainData.event.level;
                    }
                    else {
                        if (!domainCriteriaObj[domainData.event[childEntityId]][domainData.event[childEntityName]][domainData.event.domainName]) {
                            domainCriteriaObj[domainData.event[childEntityId]][domainData.event[childEntityName]][domainData.event.domainName] = {};
                            domainCriteriaObj[domainData.event[childEntityId]][domainData.event[childEntityName]][domainData.event.domainName][domainData.event.childExternalid] = {};
                            domainCriteriaObj[domainData.event[childEntityId]][domainData.event[childEntityName]][domainData.event.domainName][domainData.event.childExternalid][domainData.event.childName] = {};
                            domainCriteriaObj[domainData.event[childEntityId]][domainData.event[childEntityName]][domainData.event.domainName][domainData.event.childExternalid][domainData.event.childName]["level"] = domainData.event.level;
                        }
                        else {
                            if (!domainCriteriaObj[domainData.event[childEntityId]][domainData.event[childEntityName]][domainData.event.domainName][domainData.event.childExternalid]) {
                                domainCriteriaObj[domainData.event[childEntityId]][domainData.event[childEntityName]][domainData.event.domainName][domainData.event.childExternalid] = {};
                                domainCriteriaObj[domainData.event[childEntityId]][domainData.event[childEntityName]][domainData.event.domainName][domainData.event.childExternalid][domainData.event.childName] = {};
                                domainCriteriaObj[domainData.event[childEntityId]][domainData.event[childEntityName]][domainData.event.domainName][domainData.event.childExternalid][domainData.event.childName]["level"] = domainData.event.level;
                            }
                            else {
                                if (!domainCriteriaObj[domainData.event[childEntityId]][domainData.event[childEntityName]][domainData.event.domainName][domainData.event.childExternalid][domainData.event.childName]) {
                                    domainCriteriaObj[domainData.event[childEntityId]][domainData.event[childEntityName]][domainData.event.domainName][domainData.event.childExternalid][domainData.event.childName] = {};
                                    domainCriteriaObj[domainData.event[childEntityId]][domainData.event[childEntityName]][domainData.event.domainName][domainData.event.childExternalid][domainData.event.childName]["level"] = domainData.event.level;
                                }
                                else {
                                    domainCriteriaObj[domainData.event[childEntityId]][domainData.event[childEntityName]][domainData.event.domainName][domainData.event.childExternalid][domainData.event.childName]["level"] = domainData.event.level;
                                }
                            }
                        }
                    }

                }
            }
        }

        //  if score does not exists, return empty array
        if (scoresExists == false) {
            return resolve({});
        }

        //loop the domain keys and construct level array for stacked bar chart
        let domainKeys = Object.keys(domainObj);
        let obj = {};
        domainArray = domainKeys;

        for (let domainKey = 0; domainKey < domainKeys.length; domainKey++) {
            let levels = domainObj[domainKeys[domainKey]];
            let levelKeys = Object.keys(levels);
            for (level in dynamicLevelObj) {
                if (levelKeys.includes(level)) {
                    dynamicLevelObj[level].push({
                        y: levels[level][level],
                        entityId: levels[level].entityId
                    });
                } else {
                    dynamicLevelObj[level].push({
                        y: 0,
                        entityId: ""
                    });
                }
            }
        }

        //sort the levels
        Object.keys(dynamicLevelObj).sort().forEach(function (key) {
            obj[key] = dynamicLevelObj[key];
        });

        let series = [];
        for (level in obj) {
            series.push({
                name: level,
                data: obj[level]
            })
        }

        let chartTitle = "";
        if (inputObj.childEntity == "") {
            chartTitle = "domain"
        }
        else {
            chartTitle = "Entity"
        }

        let chartObj = {
            result: true,
            title: inputObj.data[0].event.programName + " report",
            reportSections: [
                {
                    order: 1,
                    chart: {
                        type: "bar",
                        nextChildEntityType: inputObj.childEntity,
                        stacking: "percent",
                        title: "Criteria vs level mapping aggregated at " + chartTitle + " level",
                        xAxis: {
                            categories: domainArray,
                            title: ""
                        },
                        yAxis: {
                            title: {
                                text: "Criteria"
                            }
                        },
                        data: series
                    }
                }
            ]
        }

        let domainCriteriaArray = [];
        let entityIdKeys = Object.keys(domainCriteriaObj);

        for (let entityIdKey = 0; entityIdKey < entityIdKeys.length; entityIdKey++) {

            let entityNameKeys = Object.keys(domainCriteriaObj[entityIdKeys[entityIdKey]]);

            for (let entityNameKey = 0; entityNameKey < entityNameKeys.length; entityNameKey++) {

                let entityDomainObject = {
                    entityId: entityIdKeys[entityIdKey],
                    entityName: entityNameKeys[entityNameKey],
                    domains: []
                }

                let domainNameKeys = Object.keys(domainCriteriaObj[entityIdKeys[entityIdKey]][entityNameKeys[entityNameKey]]);

                for (let domainNameKey = 0; domainNameKey < domainNameKeys.length; domainNameKey++) {

                    let domainObject = {
                        domainName: domainNameKeys[domainNameKey],
                        criterias: []
                    }

                    let externalIdKeys = Object.keys(domainCriteriaObj[entityIdKeys[entityIdKey]][entityNameKeys[entityNameKey]][domainNameKeys[domainNameKey]]);

                    for (let externalIdKey = 0; externalIdKey < externalIdKeys.length; externalIdKey++) {

                        let childNameKeys = Object.keys(domainCriteriaObj[entityIdKeys[entityIdKey]][entityNameKeys[entityNameKey]][domainNameKeys[domainNameKey]][externalIdKeys[externalIdKey]]);

                        for (childNameKey = 0; childNameKey < childNameKeys.length; childNameKey++) {

                            let criteriaObject = {
                                name: childNameKeys[childNameKey],
                                level: domainCriteriaObj[entityIdKeys[entityIdKey]][entityNameKeys[entityNameKey]][domainNameKeys[domainNameKey]][externalIdKeys[externalIdKey]][childNameKeys[childNameKey]].level
                            }

                            domainObject.criterias.push(criteriaObject);
                        }
                    }
                    entityDomainObject.domains.push(domainObject);
                }

                domainCriteriaArray.push(entityDomainObject);
            }
        }

        let expansionObject = {
            order: 2,
            chart: {
                type: "expansion",
                title: "Descriptive view",
                entities: domainCriteriaArray
            }
        }

        chartObj.reportSections.push(expansionObject);

        return resolve(chartObj);
    })
        .catch(err => {
            return reject(err);
        })

}


//===================================== chart object creation for observation scoring reports =========================

// Chart object creation for instance observation score report
exports.instanceScoreReportChartObjectCreation = async function (data, reportType) {

    let obj = {
        result: true,
        totalScore: data[0].event.totalScore,
        scoreAchieved: data[0].event.scoreAchieved,
        observationName: data[0].event.observationName,
        schoolName: data[0].event.schoolName,
        districtName: data[0].event.districtName,
        response: []
    }

    //Group the objects based on the questionExternalId
    let result = await groupArrayByGivenField(data, "questionExternalId");

    let resp = Object.keys(result);

    await Promise.all(resp.map(async element => {

        let chartObject = await scoreObjectCreateFunction(result[element]);

        obj.response.push(chartObject);

    }))

    //sort the response objects based on questionExternalId field
    await obj.response.sort(getSortOrder("order")); //Pass the attribute to be sorted on

    if (!reportType) {
        // Get the question array
        let questionArray = await questionListObjectCreation(data);
        obj.allQuestions = questionArray;
    }

    return obj;
}


async function scoreObjectCreateFunction(data) {

    if (data[0].event.minScore == null) {
        data[0].event.minScore = 0;
    }

    if (data[0].event.maxScore == null) {
        data[0].event.maxScore = 0;
    }

    let value = (data[0].event.minScore / data[0].event.maxScore) * 100;
    value = parseFloat(value.toFixed(2));

    let yy = 0;

    if (!value) {
        value = 0;
    } else {
        yy = 100 - value
    }

    let dataObj = [{
        name: data[0].event.minScore + " out of " + data[0].event.maxScore,
        y: value,
        color: "#6c4fa1"
    }, {
        name: "",
        y: yy,
        color: "#fff"
    }]

    let resp = {
        order: data[0].event.questionExternalId,
        question: data[0].event.questionName,
        chart: {
            type: "pie",
            credits: {
                enabled: false
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: false
                    },
                    showInLegend: true,
                    borderColor: '#000000'
                }
            },

            data: [
                {
                    data: dataObj
                }
            ]
        },
        criteriaName: data[0].event.criteriaName,
        criteriaId: data[0].event.criteriaId
    }

    // If remarks is not null then add it to reponse object
    // if(data[0].event.remarks != null){
    //     resp.remarks = [data[0].event.remarks];
    // }

    return resp;

}



// Chart object creation for entity observation score report
exports.entityScoreReportChartObjectCreation = async function (data, version, reportType) {

    let sortedData = await data.sort(sort_objects);

    let submissionId = [];
    let responseData = [];

    let threshold = process.env.ENTITY_SCORE_REPORT_THRESHOLD ? parseInt(process.env.ENTITY_SCORE_REPORT_THRESHOLD) : default_entity_score_api_threshold;

    if (typeof threshold !== "number") {
        throw new Error("threshold_in_entity_score_api should be integer");
    }

    await Promise.all(sortedData.map(element => {

        if (submissionId.length <= threshold) {
            if (!submissionId.includes(element.event.observationSubmissionId)) {
                submissionId.push(element.event.observationSubmissionId)
            }
        }
    }))


    let obj = {
        result: true,
        schoolName: data[0].event.schoolName,
        totalObservations: submissionId.length,
        observationName: data[0].event.observationName,
        districtName: data[0].event.districtName,
        response: []
    }

    //loop sortedData and take required json objects
    await Promise.all(sortedData.map(async objectData => {

        if (submissionId.includes(objectData.event.observationSubmissionId)) {

            responseData.push(objectData);
        }
    }))

    //group the questions based on their questionExternalId
    let groupedData = await groupArrayByGivenField(responseData, "questionExternalId");

    let groupKeys = Object.keys(groupedData);

    await Promise.all(groupKeys.map(async ele => {

        let responseObj = await entityScoreObjectCreateFunc(groupedData[ele], version, threshold);

        obj.response.push(responseObj);

    }))

    //sort the response objects using questionExternalId field
    await obj.response.sort(getSortOrder("order")); //Pass the attribute to be sorted on

    if (!reportType) {
        // Get the question array
        let questionArray = await questionListObjectCreation(data);
        obj.allQuestions = questionArray;
    }

    return obj;

}


async function entityScoreObjectCreateFunc(data, version, threshold) {

    let seriesData = [];
    let yAxisMaxValue;

    //group the questions based on their observationSubmissionId
    let groupedSubmissionData = await groupArrayByGivenField(data, "observationSubmissionId");

    let groupedSubmissionKeys = Object.keys(groupedSubmissionData);

    await Promise.all(groupedSubmissionKeys.map(async scoreData => {

        if (groupedSubmissionData[scoreData][0].event.minScore == null) {
            groupedSubmissionData[scoreData][0].event.minScore = 0;
        }

        if (seriesData.length != threshold) {
            seriesData.push([parseInt(groupedSubmissionData[scoreData][0].event.minScore)]);
        }

        if (groupedSubmissionData[scoreData][0].event.maxScore != null) {
            yAxisMaxValue = groupedSubmissionData[scoreData][0].event.maxScore;
        }


    }))

    let chartData = {
        order: data[0].event.questionExternalId,
        question: data[0].event.questionName,
        chart: {
            type: "scatter",
            title: "",
            xAxis: {
                title: {
                    enabled: true,
                    text: "observations"
                },
                labels: {},
                categories: ["Obs1", "Obs2", "Obs3", "Obs4", "Obs5"],
                startOnTick: false,
                endOnTick: false,
                showLastLabel: true
            },
            yAxis: {
                min: 0,
                max: yAxisMaxValue,
                allowDecimals: false,
                title: {
                    text: "Score"
                }
            },
            plotOptions: {
                scatter: {
                    lineWidth: 1,
                    lineColor: "#F6B343"
                }
            },
            credits: {
                enabled: false
            },
            legend: {
                enabled: false
            },
            data: [{
                color: "#F6B343",
                data: seriesData
            }]

        },
        criteriaName: data[0].event.criteriaName,
        criteriaId: data[0].event.criteriaId
    }

    if (version == "v2") {
        chartData.chart.type = "column";
        chartData.chart.plotOptions = {
            column: {
                pointPadding: 0.3,
                borderWidth: 0
            }
        }
    }

    return chartData;
}



// Chart object creation for observation score report
exports.observationScoreReportChart = async function (data, entityType, reportType) {

    let obj = {
        result: true,
        observationName: data[0].event.observationName,
        solutionName: data[0].event.solutionName,
        entityType: entityType,
        response: []
    }

    //group the data based on entity Id
    let questionIdGroupedData = await groupArrayByGivenField(data, "questionExternalId");

    let entityKeys = Object.keys(questionIdGroupedData);

    await Promise.all(entityKeys.map(async element => {

        let responseObj = await observationScoreResponseObj(questionIdGroupedData[element], entityType);

        obj.response.push(responseObj);
    }))


    // Number of schools in this particular observation/solution
    obj.entitiesObserved = obj.response[0].chart.xAxis.categories.length;

    //sort the response objects using questionExternalId field
    await obj.response.sort(getSortOrder("order")); //Pass the attribute to be sorted on

    if (!reportType) {
        // Get the question array
        let questionArray = await questionListObjectCreation(data);
        obj.allQuestions = questionArray;
    }

    return obj;
}

//Chart object creation for each question
async function observationScoreResponseObj(data, entityType) {

    let obsArray1 = [];
    let obsArray2 = [];
    let entityNames = [];
    let yAxisMaxValue;

    //Group the data based on school Id
    let groupedEntityData = await groupArrayByGivenField(data, entityType);

    let groupedEntityKeys = Object.keys(groupedEntityData);

    await Promise.all(groupedEntityKeys.map(async element => {

        let sortedData = await groupedEntityData[element].sort(sort_objects);

        entityNames.push(sortedData[0].event[entityType + "Name"]);
        yAxisMaxValue = parseInt(sortedData[0].event.maxScore);

        if (sortedData.length >= 1) {

            if (sortedData[0].event.minScore == null) {
                sortedData[0].event.minScore = 0;
            }

            obsArray1.push(parseInt(sortedData[0].event.minScore));

            if (sortedData.length > 1) {

                if (sortedData[1].event.minScore == null) {
                    sortedData[1].event.minScore = 0;
                }

                obsArray2.push(parseInt(sortedData[1].event.minScore));
            }

        }

    }))


    let chartData = {
        order: data[0].event.questionExternalId,
        question: data[0].event.questionName,
        chart: {
            type: "bar",
            title: "",
            xAxis: {
                title: {
                    text: null
                },
                labels: {},
                categories: entityNames
            },
            yAxis: {
                min: 0,
                max: yAxisMaxValue,
                title: {
                    text: "Score"
                },
                labels: {
                    overflow: 'justify'
                },
                allowDecimals: false
            },
            plotOptions: {
                bar: {
                    dataLabels: {
                        enabled: true
                    }
                }
            },
            legend: {
                enabled: true
            },
            credits: {
                enabled: false
            },
            data: [{
                name: 'observation1',
                data: obsArray1
            }, {
                name: 'observation2',
                data: obsArray2
            }]

        },
        criteriaName: data[0].event.criteriaName,
        criteriaId: data[0].event.criteriaId
    }

    return chartData;
}

// Function for grouping the array based on certain field name
function groupArrayByGivenField(array, name) {
    result = array.reduce(function (r, a) {
        r[a.event[name]] = r[a.event[name]] || [];
        r[a.event[name]].push(a);
        return r;
    }, Object.create(null));

    return result;
}


function custom_sort(a, b) {
    return new Date(a.event.completedDate).getTime() - new Date(b.event.completedDate).getTime();
}

function sort_objects(a, b) {
    return new Date(a.event.completedDate).getTime() < new Date(b.event.completedDate).getTime();
}


//function to create the title
function designationCreateFunction(entityType) {
    var value;
    if (entityType == "school") {
        value = "HM"
    }
    else if (entityType == "cluster") {
        value = "CRP"
    }
    else if (entityType == "zone") {
        value = "ZONE"
    }
    else if (entityType == "block") {
        value = "BEO"
    }
    else if (entityType == "district") {
        value = "DEO"
    }
    else if (entityType == "state") {
        value = "State"
    }
    else if (entityType == "hub") {
        value = "HUB"
    }

    return value;
}



//============================ Container APP API Response object creation ==========================================

exports.courseEnrollmentResponeObj = async function (result) {
    var response = {
        result: true,
        data: []
    }

    for (var i = 0; i < result.length; i++) {
        let obj = {}
        obj.course_name = result[i].event.course_name;
        obj.status = result[i].event.course_status;
        response.data.push(obj);
    }

    return response;
}

//Chart object creation for usage by content 
exports.usageByContentResponeObj = async function (result) {
    var response = {
        result: true,
        data: []
    }

    for (var i = 0; i < result.length; i++) {
        let obj = {}
        obj.content_name = result[i].content_name;
        obj.total_users_viewed = result[i]["Total Users Viewed"];
        response.data.push(obj);
    }
    return response;
}


//Chart object creation for contents downloaded by the user
exports.contentDownloadResponeObj = async function (result) {
    var response = {
        result: true,
        data: []
    }

    for (var i = 0; i < result.length; i++) {
        let obj = {}
        obj.content_name = result[i].content_name;
        obj.total_downloads = result[i]["COUNT(content_identifier)"];
        response.data.push(obj);
    }
    return response;
}


//Chart object creation for contents viewed in the platform
exports.contentViewResponeObj = async function (result) {
    var response = {
        result: true,
        data: []
    }

    for (var i = 0; i < result.length; i++) {
        let obj = {}
        obj.content_name = result[i].content_name;
        obj.total_views = result[i]["COUNT(content_identifier)"];
        response.data.push(obj);
    }
    return response;
}



//Function for sorting the array in ascending order based on a key
function getSortOrder(prop) {
    return function (a, b) {
        if (a[prop] > b[prop]) {
            return 1;
        } else if (a[prop] < b[prop]) {
            return -1;
        }
        return 0;
    }
}

//COnvert questionSequenceByEcm value from string to int
async function sequenceNumberTypeConvertion(data) {

    await Promise.all(data.map(element => {
        element.event.questionSequenceByEcm = parseInt(element.event.questionSequenceByEcm);

        if (element.event.instanceParentEcmSequence != null) {
            element.event.instanceParentEcmSequence = parseInt(element.event, instanceParentEcmSequence);
        }
    }));

    return data;
}



// question list response object creation
var questionListObjectCreation = async function (data) {
    let questionArray = [];

    //group the questions based on their questionExternalId
    let result = await groupArrayByGivenField(data, "questionExternalId");

    let groupKeys = Object.keys(result);

    await Promise.all(groupKeys.map(async element => {
        let obj = {};

        obj.questionName = result[element][0].event.questionName;
        obj.questionExternalId = result[element][0].event.questionExternalId;
        obj.questionId = result[element][0].event.questionId;

        questionArray.push(obj);
    }))

    await questionArray.sort(getSortOrder("questionExternalId"));

    return questionArray;

}



// Create evidenceList
exports.getEvidenceList = async function (data) {

    let filePath = [];
    let remarks = [];

    await Promise.all(data.map(element => {

        files = element.event.fileSourcePath.split(",");
        filePath.push(files);

        if (element.event.remarks != null) {
            remarks.push(element.event.remarks);
        }

    }));

    let evidenceList = Array.prototype.concat(...filePath);

    return [evidenceList, remarks];
}


//Evidence array creation function
exports.evidenceChartObjectCreation = async function (chartData, evidenceData) {


    let filesArray = [];
    let questionData = [];

    await Promise.all(chartData.response.map(async element => {

        let filteredData = evidenceData.filter(data => element.order.includes(data.event.questionExternalId));

        if (filteredData.length > 0) {
            let result = await evidenceArrayCreation(element.order, evidenceData);

            filesArray.push(result[0]);
            questionData.push(result[1]);

        }

        if (element["instanceQuestions"] && element.instanceQuestions.length > 0) {

            await Promise.all(element.instanceQuestions.map(async ele => {

                let filteredData = evidenceData.filter(data => ele.order.includes(data.event.questionExternalId));

                if (filteredData.length > 0) {
                    let response = await evidenceArrayCreation(ele.order, evidenceData);

                    filesArray.push(response[0]);
                    questionData.push(response[1]);

                }

            }));

        }

    }));

    //merge multiple arrays into single array
    let fileSoucePaths = Array.prototype.concat(...filesArray);
    fileSoucePaths = Array.prototype.concat(...fileSoucePaths);

    let questionArray = Array.prototype.concat(...questionData);

    uniqueFilePaths = fileSoucePaths.filter(function (elem, index, self) { return index == self.indexOf(elem); })

   let downloadableUrls
    try {
        downloadableUrls = await filesHelper.getDownloadableUrl(
            uniqueFilePaths
        );

      } catch (error) {
        throw new Error('fetching downloable urls failed.')
      }

    let result = await insertEvidenceArrayToChartObject(chartData, downloadableUrls, questionArray);

    return result;

}

// create filepaths array 
async function evidenceArrayCreation(questionExternalId, evidenceData) {

    let filteredData = evidenceData.filter(data => questionExternalId.includes(data.event.questionExternalId));

    let filePath = [];
    let questionData = [];
    let filesArray = [];
    let evidence_count;

    //loop the array, split the fileSourcePath and push it into array
    await Promise.all(filteredData.map(fileData => {

        filePath.push(fileData.event.fileSourcePath.split(","));

    }));

    let filePaths = Array.prototype.concat(...filePath);

    evidence_count = filePaths.length;

    if (filePaths.length > parseInt(process.env.EVIDENCE_THRESHOLD)) {
        filesArray.push(filePaths.slice(0, parseInt(process.env.EVIDENCE_THRESHOLD)));
    } else {
        filesArray.push(filePaths);
    }

    filesArray = Array.prototype.concat(...filesArray);

    let obj = {
        questionExternalId: questionExternalId,
        evidence_count: evidence_count,
        filePathsArray: filesArray
    }

    questionData.push(obj);

    return [filesArray, questionData];

}

// Insert evidence array to the corrousponding questions
async function insertEvidenceArrayToChartObject(chartData, downloadableUrls, questionData) {

    await Promise.all(chartData.response.map(async ele => {

        let filteredData = questionData.filter(data => ele.order.includes(data.questionExternalId));

        if (filteredData.length > 0) {

            let evidenceData = [];

            await Promise.all(filteredData[0].filePathsArray.map(filePath => {

                let data = downloadableUrls.result.filter(evidence => {
                    return [filePath].includes(evidence.filePath)
                });
                evidenceData.push(data);

            }))

            evidenceData = Array.prototype.concat(...evidenceData);

            ele.evidences = [];
            ele.evidence_count = filteredData[0].evidence_count;

            await Promise.all(evidenceData.map(async element => {

                let ext = path.extname(element.filePath).split('.').join("");
                let obj = {};
                obj.url = element.url;
                obj.extension = ext;
                ele.evidences.push(obj);

            }));

        }

        if (ele["instanceQuestions"] && ele.instanceQuestions.length > 0) {

            await Promise.all(ele.instanceQuestions.map(async value => {

                let filteredData = questionData.filter(data => value.order.includes(data.questionExternalId));

                if (filteredData.length > 0) {

                    let evidenceData = [];

                    await Promise.all(filteredData[0].filePathsArray.map(filePath => {

                        let data = downloadableUrls.result.filter(evidence => [filePath].includes(evidence.filePath));
                        evidenceData.push(data);

                    }));

                    evidenceData = Array.prototype.concat(...evidenceData);

                    value.evidences = [];
                    value.evidence_count = filteredData[0].evidence_count;

                    await Promise.all(evidenceData.map(async element => {

                        let ext = path.extname(element.filePath).split('.').join("");
                        let obj = {};
                        obj.url = element.url;
                        obj.extension = ext;
                        value.evidences.push(obj);

                    }));

                }

            }));

        }

    }));

    await chartData.response.sort(getSortOrder("order"));

    return chartData;
}


// Extract fileSourcePath, get the downloadable url from kendra service
async function getDownloadableUrlFromKendra(filesArray, token) {

    return new Promise(async function (resolve, reject) {

        try {
            let downloadableUrl = await kendraService.getDownloadableUrl(filesArray, token);

            return resolve(downloadableUrl);

        } catch (error) {
            return reject(error);
        }
    })
}


// Response object creation for allEvidences API
exports.evidenceResponseCreateFunc = async function (result) {

    let evidenceList = {
        images: [],
        videos: [],
        documents: [],
        remarks: []
    };

    await Promise.all(result.map(element => {

        let obj = {};
        let filePath = element.filePath;

        let ext = path.extname(filePath).split('.').join("");

        if (filesHelper.imageFormats.includes(ext)) {

            obj.filePath = filePath;
            obj.url = element.url;
            obj.extension = ext;
            evidenceList.images.push(obj);

        } else if (filesHelper.videoFormats.includes(ext)) {

            obj.filePath = filePath;
            obj.url = element.url;
            obj.extension = ext;
            evidenceList.videos.push(obj);

        } else {

            obj.filePath = element.filePath;
            obj.url = element.url;
            obj.extension = ext;
            evidenceList.documents.push(obj);

        }


    }))

    return evidenceList;
}


//Function for creating response object for list assessment programs API
exports.listAssessmentProgramsObjectCreate = async function (data) {
    let response = {
        "result": true,
        "data": []
    }

    await Promise.all(data.map(element => {

        response.data.push(element.event);

    }));

    return response;
}


//Function for creating response object for list entities API
exports.listEntitesObjectCreation = async function (data) {

    let response = {
        "result": true,
        "data": []
    }

    let entityArray = [];

    await Promise.all(data.map(element => {

        let obj = {};
        let entity = element.event.entityType;
        obj.entityId = element.event[entity];
        obj.entityName = element.event[entity + "Name"];
        obj.entityType = element.event.entityType;
        obj.solutionId = element.event.solutionId;
        obj.solutionName = element.event.solutionName;


        entityArray.push(obj);

    }));

    let groupEntityData = await groupDataByEntityId(entityArray, "entityId");

    let entityKeys = Object.keys(groupEntityData);

    await Promise.all(entityKeys.map(async ele => {

        let entityObject = {
            entityId: groupEntityData[ele][0].entityId,
            entityName: groupEntityData[ele][0].entityName,
            entityType: groupEntityData[ele][0].entityType,
            solutions: []
        }

        await Promise.all(groupEntityData[ele].map(entityData => {
            let solutionObject = {
                solutionId: entityData.solutionId,
                solutionName: entityData.solutionName
            }
            entityObject.solutions.push(solutionObject);
        }));

        response.data.push(entityObject);
    }));

    return response;
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



// Prepare tags array using acl data
exports.tagsArrayCreateFunc = async function (acl) {

    let aclKeys = Object.keys(acl);
    let tagsArray = [];

    await Promise.all(aclKeys.map(async element => {
        let nestedKeys = Object.keys(acl[element]);
        await Promise.all(nestedKeys.map(ele => {
            tagsArray.push(acl[element][ele].tags);
        }));
    }));

    tagsArray = Array.prototype.concat(...tagsArray);

    return tagsArray;
}



// Function for creating response object of listImprovementProjects API
exports.improvementProjectsObjectCreate = async function (data) {

    let response = {
        "result": true,
        "data": []
    }

    let groupByCriteria = await groupArrayByGivenField(data, "criteriaDescription");

    let criteriaKeys = Object.keys(groupByCriteria);

    await Promise.all(criteriaKeys.map(async element => {

        let criteriaObj = {
            criteriaName: groupByCriteria[element][0].event.criteriaDescription,
            level: groupByCriteria[element][0].event.level,
            label: groupByCriteria[element][0].event.label,
            improvementProjects: []
        }

        await Promise.all(groupByCriteria[element].map(ele => {

            if (ele.event.imp_project_title != null) {

                let projectObj = {
                    projectName: ele.event.imp_project_title,
                    projectId: ele.event.imp_project_id,
                    projectGoal: ele.event.imp_project_goal,
                    projectExternalId: ele.event.imp_project_externalId
                }

                criteriaObj.improvementProjects.push(projectObj);
            }
        }));

        response.data.push(criteriaObj);

    }));

    return response;
}


//Function to create a report based on criteria
exports.getCriteriawiseReport = async function (responseObj) {

    let responseArray = [];
    let finalResponseArray = []

    await Promise.all(responseObj.response.map(element => {

        let instanceQuestions = [];

        if (element["instanceQuestions"]) {
            instanceQuestions = element.instanceQuestions;
            element.instanceQuestions = [];
        }

        responseArray.push(element);

        if (instanceQuestions.length > 0) {

            responseArray = [...responseArray, ...instanceQuestions];
        }

    }));

    let groupByCriteria = await groupDataByEntityId(responseArray, "criteriaName");

    let criteriaKeys = Object.keys(groupByCriteria);

    await Promise.all(criteriaKeys.map(ele => {

        let criteriaObj = {

            criteriaId: groupByCriteria[ele][0].criteriaId,
            criteriaName: groupByCriteria[ele][0].criteriaName,
            questionArray: groupByCriteria[ele]

        }

        finalResponseArray.push(criteriaObj);

    }));

    responseObj.response = finalResponseArray;

    let allCriterias = responseArray.map(({ criteriaId, criteriaName }) => ({ criteriaId, criteriaName }));

    allCriterias = allCriterias.reduce((acc, current) => {
        const x = acc.find(item => item.criteriaName === current.criteriaName);
        if (!x) {
            return acc.concat([current]);
        } else {
            return acc;
        }
    }, []);


    responseObj.allCriterias = allCriterias;

    return responseObj;

}

exports.programsListCreation = async function (programs) {

    let programArray = [];

    await Promise.all(programs.map(program => {
        programArray.push(program.event);
    }));

    // remove duplicate programs from the array
    let uniquePrograms = [...new Set(programArray.map(obj => JSON.stringify(obj)))].map(str => JSON.parse(str));

    programList = {
        result: true,
        data: uniquePrograms
    }

    return programList;
}



exports.solutionListCreation = async function (solutions, id) {

    let solutionArray = {
        result: true,
        data: {
        }
    }

    let solutionData = await createSolutionsArray(solutions, id);

    solutionArray.data.mySolutions = solutionData.filter(data => id.includes(data.id));

    solutionArray.data.allSolutions = solutionData;

    return solutionArray;
}


//Create response object for listSolutionNames API
const createSolutionsArray = async function (data) {
    try {
        let responseObj = [];

        let groupBySolutionId = await groupArrayByGivenField(data, "solutionId")

        let solutionKeys = Object.keys(groupBySolutionId);

        await Promise.all(solutionKeys.map(element => {

            let obj = {
                solutionName: groupBySolutionId[element][0].event.solutionName,
                solutionId: groupBySolutionId[element][0].event.solutionId,
                type: groupBySolutionId[element][0].event.type
            }

            if (groupBySolutionId[element][0].event['createdBy'] != null) {
                obj.id = groupBySolutionId[element][0].event.createdBy;
            }

            else if (groupBySolutionId[element][0].event['userId'] != null) {
                obj.id = groupBySolutionId[element][0].event.userId;
            }
            else {
                obj.id = "";
            }

            groupBySolutionId[element].forEach(ele => {

                if (ele.event['totalScore'] && ele.event.totalScore >= 1) {
                    obj.scoring = true;
                } else {
                    obj.scoring = false;
                }
            });

            responseObj.push(obj);
        }))

        return responseObj;

    }
    catch (err) {
        console.log(err);
    }
}


//Report for entity level report in assessments
exports.entityLevelReportData = async function (data) {

    return new Promise(async function (resolve, reject) {

        //group the data based on completed date   
        let groupedSubmissionData = await groupArrayByGivenField(data, "completedDate");

        let completedDateKeys = Object.keys(groupedSubmissionData);

        let totalSubmissions = completedDateKeys.length;

        let threshold = process.env.ASSESSMENT_SUBMISSION_REPORT_THRESHOLD ? parseInt(process.env.ASSESSMENT_SUBMISSION_REPORT_THRESHOLD) : default_no_of_assessment_submissions_threshold;

        if (typeof threshold !== "number") {
            throw new Error("no_of_assessment_submissions_threshold value should be integer");
        }

        let dateArray = [];
        if (completedDateKeys.length > threshold) {

            dateArray = completedDateKeys.slice(-(threshold - 1));
            dateArray.push(completedDateKeys[0]);

            completedDateKeys = dateArray;
        }

        let response = await entityLevelReportChartCreateFunc(groupedSubmissionData, completedDateKeys.sort());

        let result = [];
        if (response.length > 0) {

            result.push(response[0]);

            //append total number of submissions value
            response[1].chart.totalSubmissions = totalSubmissions;
            result.push(response[1]);
        }

        return resolve(result);
    }).
        catch(err => {
            return reject(err);
        })
}

//Chart data preparation for entity level assessment report
const entityLevelReportChartCreateFunc = async function (groupedSubmissionData, completedDateArray) {

    return new Promise(async function (resolve, reject) {

        let domainObj = {};
        let domainNameArray = [];
        let submissionDateArray = [];
        let domainCriteriaArray = [];
        let domainCriteriaObj = {};
        let heading = [];
        let dynamicLevelObj = {};
        let scoresExists = false;

        //loop the data and construct domain name and level object
        for (completedDate = 0; completedDate < completedDateArray.length; completedDate++) {

            let i = completedDate + 1;
            heading.push("Assess. " + i);

            let date = completedDateArray[completedDate];

            for (domain = 0; domain < groupedSubmissionData[date].length; domain++) {

                let domainData = groupedSubmissionData[date][domain];

                if (domainData.event.level !== null) {

                    scoresExists = true;

                    if (!dynamicLevelObj[domainData.event.level]) {
                        dynamicLevelObj[domainData.event.level] = [];
                    }

                    // Domain and level object creation for chart
                    if (!domainObj[domainData.event.domainName]) {
                        domainObj[domainData.event.domainName] = {};

                        if (!domainObj[domainData.event.domainName][domainData.event.completedDate]) {
                            domainObj[domainData.event.domainName][domainData.event.completedDate] = {};

                            if (!domainObj[domainData.event.domainName][domainData.event.completedDate][domainData.event.level]) {
                                domainObj[domainData.event.domainName][domainData.event.completedDate][domainData.event.level] = 1;
                            }
                            else {
                                let level = domainObj[domainData.event.domainName][domainData.event.completedDate][domainData.event.level];
                                domainObj[domainData.event.domainName][domainData.event.completedDate][domainData.event.level] = ++level;
                            }
                        }
                        else {
                            if (!domainObj[domainData.event.domainName][domainData.event.completedDate][domainData.event.level]) {
                                domainObj[domainData.event.domainName][domainData.event.completedDate][domainData.event.level] = 1;
                            }
                            else {
                                let level = domainObj[domainData.event.domainName][domainData.event.completedDate][domainData.event.level];
                                domainObj[domainData.event.domainName][domainData.event.completedDate][domainData.event.level] = ++level;
                            }
                        }
                    } else {
                        if (!domainObj[domainData.event.domainName][domainData.event.completedDate]) {
                            domainObj[domainData.event.domainName][domainData.event.completedDate] = {};

                            if (!domainObj[domainData.event.domainName][domainData.event.completedDate][domainData.event.level]) {
                                domainObj[domainData.event.domainName][domainData.event.completedDate][domainData.event.level] = 1;
                            }
                            else {

                                let level = domainObj[domainData.event.domainName][domainData.event.completedDate][domainData.event.level];
                                domainObj[domainData.event.domainName][domainData.event.completedDate][domainData.event.level] = ++level;
                            }
                        }
                        else {
                            if (!domainObj[domainData.event.domainName][domainData.event.completedDate][domainData.event.level]) {
                                domainObj[domainData.event.domainName][domainData.event.completedDate][domainData.event.level] = 1;
                            }
                            else {

                                let level = domainObj[domainData.event.domainName][domainData.event.completedDate][domainData.event.level];
                                domainObj[domainData.event.domainName][domainData.event.completedDate][domainData.event.level] = ++level;
                            }
                        }
                    }


                    // Domain and criteria object creation
                    if (!domainCriteriaObj[domainData.event.domainName]) {
                        domainCriteriaObj[domainData.event.domainName] = {};

                        domainCriteriaObj[domainData.event.domainName][domainData.event.childExternalid] = {};

                        domainCriteriaObj[domainData.event.domainName][domainData.event.childExternalid][domainData.event.childName] = {};

                        domainCriteriaObj[domainData.event.domainName][domainData.event.childExternalid][domainData.event.childName]["levels"] = [domainData.event.label];
                    }
                    else {

                        if (!domainCriteriaObj[domainData.event.domainName][domainData.event.childExternalid]) {
                            domainCriteriaObj[domainData.event.domainName][domainData.event.childExternalid] = {};

                            domainCriteriaObj[domainData.event.domainName][domainData.event.childExternalid][domainData.event.childName] = {};
                            domainCriteriaObj[domainData.event.domainName][domainData.event.childExternalid][domainData.event.childName]["levels"] = [domainData.event.label];
                        }
                        else {
                            if (!domainCriteriaObj[domainData.event.domainName][domainData.event.childExternalid][domainData.event.childName]) {
                                domainCriteriaObj[domainData.event.domainName][domainData.event.childExternalid][domainData.event.childName] = {};

                                domainCriteriaObj[domainData.event.domainName][domainData.event.childExternalid][domainData.event.childName]["levels"] = [domainData.event.label];
                            }
                            else {

                                if (!domainCriteriaObj[domainData.event.domainName][domainData.event.childExternalid][domainData.event.childName]["levels"]) {
                                    domainCriteriaObj[domainData.event.domainName][domainData.event.childExternalid][domainData.event.childName]["levels"] = [domainData.event.label];
                                }
                                else {
                                    domainCriteriaObj[domainData.event.domainName][domainData.event.childExternalid][domainData.event.childName]["levels"].push(domainData.event.label);
                                }
                            }
                        }
                    }
                }
            }
        }

        // if score does not exists, return empty array
        if (scoresExists == false) {
            return resolve([]);
        }

        //loo the domain keys and construct level array for stacked bar chart
        let domainKeys = Object.keys(domainObj);
        let obj = {};

        for (domainKey = 0; domainKey < domainKeys.length; domainKey++) {

            let dateKeys = Object.keys(domainObj[domainKeys[domainKey]]);

            for (dateKey = 0; dateKey < dateKeys.length; dateKey++) {

                submissionDateArray.push(dateKeys[dateKey]);

                if (!domainNameArray.includes(domainKeys[domainKey])) {

                    domainNameArray.push(domainKeys[domainKey])

                } else {
                    domainNameArray.push("")
                }

                let levels = domainObj[domainKeys[domainKey]][dateKeys[dateKey]];

                let levelKeys = Object.keys(levels);

                for (level in dynamicLevelObj) {
                    if (levelKeys.includes(level)) {
                        dynamicLevelObj[level].push(levels[level]);
                    } else {
                        dynamicLevelObj[level].push(0);
                    }

                }
            }
        }

        //sort the levels
        Object.keys(dynamicLevelObj).sort().forEach(function (key) {
            obj[key] = dynamicLevelObj[key];
        });

        let series = [];
        for (level in obj) {
            series.push({
                name: level,
                data: obj[level]
            })
        }

        submissionDateArray = await getDateTime(submissionDateArray);

        let chartObj = {
            order: 1,
            chart: {
                type: 'bar',
                title: "",
                xAxis: [{
                    categories: domainNameArray

                },
                {
                    opposite: true,
                    reversed: false,
                    categories: submissionDateArray,
                    linkedTo: 0
                },
                ],
                yAxis: {
                    min: 0,
                    title: {
                        text: 'Criteria'
                    }
                },
                legend: {
                    reversed: true
                },
                plotOptions: {
                    series: {
                        stacking: 'percent'
                    }
                },
                data: series

            }
        }


        let domainCriteriaKeys = Object.keys(domainCriteriaObj);

        for (domainKey = 0; domainKey < domainCriteriaKeys.length; domainKey++) {

            let domainCriteriaObject = {
                domainName: domainCriteriaKeys[domainKey],
                criterias: []
            }

            let externalIdKeys = Object.keys(domainCriteriaObj[domainCriteriaKeys[domainKey]]);

            for (externalIdKey = 0; externalIdKey < externalIdKeys.length; externalIdKey++) {

                let criteriaKey = Object.keys(domainCriteriaObj[domainCriteriaKeys[domainKey]][externalIdKeys[externalIdKey]]);

                for (ckey = 0; ckey < criteriaKey.length; ckey++) {

                    let criteriaObj = {
                        name: criteriaKey[ckey],
                        levels: domainCriteriaObj[domainCriteriaKeys[domainKey]][externalIdKeys[externalIdKey]][criteriaKey[ckey]].levels
                    }

                    domainCriteriaObject.criterias.push(criteriaObj);
                }
            }
            domainCriteriaArray.push(domainCriteriaObject);
        }

        let expansionViewObj = {
            order: 2,
            chart: {
                type: "expansion-table",
                title: "Descriptive view",
                heading: heading,
                domains: domainCriteriaArray
            }
        };

        return resolve([chartObj, expansionViewObj]);

    }).
        catch(err => {
            return reject(err);
        })
}

//function for date conversion
const getDateTime = async function (completedDate) {

    let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let submissionDate = [];
    await Promise.all(completedDate.map(date => {
        if (date === null) {
            submissionDate.push("");
        } else {
            let dateValue = new Date(date);
            let day = dateValue.getDate();
            let month = months[dateValue.getMonth()];
            let year = dateValue.getFullYear();
            submissionDate.push(day + " " + month + " " + year);
        }
    }));

    return submissionDate;
}




//Function for listing all answers of a question
exports.listALLAnswers = async function (data,pageNo,pageSize) {

    let result = {
        question: data[0].events[0].questionName,
        answers: [],
        completedDate: ""
    }

    let startIndex = pageSize * (pageNo - 1);
    let endIndex = startIndex + pageSize;
    data = data.slice(startIndex,endIndex); 

    data.forEach(singleEvent => {
        singleEvent.events.forEach(singleResponse => {
            result.answers.push(singleResponse.questionAnswer);
        })
    })

    let latestEvent = data[data.length - 1].events;
    result.completedDate = latestEvent[latestEvent.length - 1].completedDate;

    return result;
}

//function for creating report of survey solution
exports.getSurveySolutionReport = async function (data, submissionCount) {
    return new Promise(async function (resolve, reject) {

        let result = {
            solutionName: data[0].event.solutionName,
            response: [],
            questionExternalIds: []
        }

        let matrixData = [];
        let nonMatrixData = [];

        await Promise.all(data.map(singleData => {

            if (!result.questionExternalIds.includes(singleData.event.questionExternalId)) {
                result.questionExternalIds.push(singleData.event.questionExternalId)
            }

            if (singleData.event.instanceParentResponsetype == "matrix") {
                matrixData.push(singleData)
            }
            else {
                nonMatrixData.push(singleData);
            }
        }))

        if (matrixData.length > 0) {

            let groupedMatrixData = await groupArrayByGivenField(matrixData, "instanceParentExternalId");

            let matrixQuestionKeys = Object.keys(groupedMatrixData);

            await Promise.all(matrixQuestionKeys.map(async matrixKey => {

                let numberOfInstances = [];
                groupedMatrixData[matrixKey].map(singleMatrixObject => {
                    if (!numberOfInstances.includes(singleMatrixObject.event.instanceId)) {
                        numberOfInstances.push(singleMatrixObject.event.instanceId);
                    }
                })

                let response = {
                    order: matrixKey,
                    question: groupedMatrixData[matrixKey][0].event.instanceParentQuestion,
                    responseType: groupedMatrixData[matrixKey][0].event.instanceParentResponsetype,
                    answers: [],
                    chart: {},
                    instanceQuestions: []
                }

                let chartData = await getChartObject(groupedMatrixData[matrixKey], numberOfInstances.length);

                if (chartData.length > 0) {
                    response.instanceQuestions.push(...chartData);
                    result.response.push(response);
                }
            }))
        }

        if (nonMatrixData.length > 0) {
            let chartData = await getChartObject(nonMatrixData, submissionCount);

            if (chartData.length > 0) {
                result.response.push(...chartData);
            }
        }

        await result.response.sort(getSortOrder("order"))
        return resolve(result);

    })
        .catch(err => {
            return reject(err);
        })
}

const getChartObject = async function (data, submissionCount) {

    return new Promise(async function (resolve, reject) {

        let response = [];

        let groupDataByQuestionId = await groupArrayByGivenField(data, "questionExternalId");

        let questionKeys = Object.keys(groupDataByQuestionId);

        await Promise.all(questionKeys.map(async questionKey => {

            let questionObject = {
                order: questionKey,
                question: groupDataByQuestionId[questionKey][0].event.questionName,
                responseType: groupDataByQuestionId[questionKey][0].event.questionResponseType,
                answers: [],
                chart: {},
                instanceQuestions: []
            }

            if (questionObject.responseType == "radio") {

                let chartDataArray = [];

                await Promise.all(groupDataByQuestionId[questionKey].map(singleResponse => {
                    chartDataArray.push({
                        name: singleResponse.event.questionResponseLabel,
                        y: ((singleResponse.event.questionAnswerCount / submissionCount) * 100).toFixed(2)
                    })
                }))

                let chart = {
                    type: "pie",
                    plotOptions: {
                        pie: {
                            allowPointSelect: true,
                            cursor: 'pointer',
                            dataLabels: {
                                enabled: false
                            },
                            showInLegend: true
                        }
                    },
                    data: [
                        {
                            data: chartDataArray
                        }
                    ]
                }

                questionObject.chart = chart;
                response.push(questionObject);
            }
            else if (questionObject.responseType == "multiselect") {

                let chartDataArray = [];
                let labelArray = [];

                await Promise.all(groupDataByQuestionId[questionKey].map(singleResponse => {
                    chartDataArray.push(((singleResponse.event.questionAnswerCount / submissionCount) * 100).toFixed(2));
                    labelArray.push(singleResponse.event.questionResponseLabel)
                }))

                let chart = {
                    type: "bar",
                    data: [
                        {
                            data: chartDataArray
                        }
                    ],
                    xAxis: {
                        categories: labelArray,
                        title: {
                            text: "Responses"
                        }
                    },
                    yAxis: {
                        min: 0,
                        max: 100,
                        title: {
                            text: "Responses in percentage"
                        }
                    }
                }
                questionObject.chart = chart;
                response.push(questionObject);
            }
            else {
                let sortedData = await groupDataByQuestionId[questionKey].sort(getSortOrder("completedDate"));
                await Promise.all(sortedData.map( async singleResponse => {

                    if (singleResponse.event.questionResponseType == "date") {
                        singleResponse.event.questionAnswer = await getISTDate(singleResponse.event.questionAnswer)
                    }
                    questionObject.answers.push(singleResponse.event.questionAnswer)
                }))
                questionObject.count = questionObject.answers.length;
                questionObject.completedDate = sortedData[sortedData.length - 1].event.completedDate;
                response.push(questionObject);
            }
        }))

        return resolve(response);

    })
        .catch(err => {
            return reject(err);
        })

}


const getISTDate = async function(date) {
    let d = new Date(date);
    d.setUTCHours(d.getUTCHours() + 5);
    d.setUTCMinutes(d.getUTCMinutes() + 30);
    let amOrPm = (d.getUTCHours() < 12) ? "AM" : "PM";
    let hour = (d.getUTCHours() < 12) ? d.getUTCHours() : d.getUTCHours() - 12;
    return d.getUTCDate() + '-' + (d.getUTCMonth() + 1) + '-' + d.getUTCFullYear() + ' ' + hour + ':' + d.getUTCMinutes() + ':' + d.getUTCSeconds() + ' ' + amOrPm;

}
