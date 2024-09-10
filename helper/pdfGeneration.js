const fs = require('fs');
const { v1: uuidv4 } = require('uuid');
const { ChartJSNodeCanvas } = require('chartjs-node-canvas');
const width = 800; //px
const height = 450; //px
const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height });
const rp = require('request-promise');
const ejs = require('ejs');
const rimraf = require("rimraf");
const request = require("request");
const filesHelpers = require(MODULES_BASE_PATH + '/files/helper')
const cloudStorage = process.env.CLOUD_STORAGE_PROVIDER
const bucketName = process.env.CLOUD_STORAGE_BUCKETNAME

/**
 * Generate a PDF report for entity
 * @param {Object} instaRes - The response object containing report data
 * @returns {Promise<Object>} The generated PDF report information
 */
exports.pdfGeneration = async function pdfGeneration(instaRes) {


    return new Promise(async function (resolve, reject) {
        
        let currentTempFolder = 'tmp/' + uuidv4() + "--" + Math.floor(Math.random() * (10000 - 10 + 1) + 10)

        let imgPath = __dirname + '/../' + currentTempFolder;
        
        try {

            if (!fs.existsSync(imgPath)) {
                fs.mkdirSync(imgPath);
            }

            let bootstrapStream = await copyBootStrapFile(__dirname + '/../public/css/bootstrap.min.css', imgPath + '/style.css');

            // let headerFile = await copyBootStrapFile(__dirname + '/../views/header.html', imgPath + '/header.html');
            let footerFile = await copyBootStrapFile(__dirname + '/../views/footer.html', imgPath + '/footer.html');

            let FormData = [];

            let matrixMultiSelectArray = [];
            let matrixRadioArray = [];
            let multiSelectDataArray = [];
            let radioDataArray = [];
            
            instaRes.response = instaRes.response ? instaRes.response : instaRes.reportSections;

            //loop the response and store multiselect and radio questions of matrix type
            await Promise.all(instaRes.response.map(async ele => {
                if (ele.responseType == "matrix") {
                    await Promise.all(ele.instanceQuestions.map(element => {
                        if (element.responseType == "multiselect") {
                            matrixMultiSelectArray.push(element);
                        }
                        else if (element.responseType == "radio") {
                            matrixRadioArray.push(element);
                        }
                    }))
                } else if (ele.responseType == "multiselect") {
                    multiSelectDataArray.push(ele)
                } else if (ele.responseType == "radio") {
                    radioDataArray.push(ele)
                }
            }))
            
            let multiSelectData = []
            let radioQuestions = [];
            let matrixMultiSelectChartObj = [];
            let matrixRadioChartObj = [];
            let formDataMultiSelect = [];
            let radioFormData = [];
            let formDataMatrixMultiSelect = [];
            let matrixRadioFormData = [];

            //Prepare chart object before sending it to highchart server
            if (multiSelectDataArray.length > 0 ) {
               multiSelectData = await getChartObject(multiSelectDataArray);
               formDataMultiSelect = await createChart(multiSelectData, imgPath);
            }
            if (radioDataArray.length > 0 ) {
                radioQuestions = await getChartObject(radioDataArray);
                radioFormData = await createChart(radioQuestions, imgPath);
            }
            if (matrixMultiSelectArray.length > 0 ) {
                matrixMultiSelectChartObj = await getChartObject(matrixMultiSelectArray);
                formDataMatrixMultiSelect = await createChart(matrixMultiSelectChartObj, imgPath);
            }
            if (matrixRadioArray.length > 0 ) {
                matrixRadioChartObj = await getChartObject(matrixRadioArray);
                matrixRadioFormData = await createChart(matrixRadioChartObj, imgPath);
            }

            FormData.push(...formDataMultiSelect);
            FormData.push(...radioFormData);
            FormData.push(...formDataMatrixMultiSelect);
            FormData.push(...matrixRadioFormData);
           
            let params;

            if (instaRes.solutionName) {
                params = {
                    solutionName: instaRes.solutionName
                }
            }
            else {
                params = {
                    observationName: instaRes.observationName
                }
            }
            ejs.renderFile(__dirname + '/../views/header.ejs', {
                data: params
            })
                .then(function (headerHtml) {

                    let dir = imgPath;
                    if (!fs.existsSync(dir)) {
                        fs.mkdirSync(dir);
                    }
                    fs.writeFile(dir + '/header.html', headerHtml, async function (errWr, dataWr) {
                        if (errWr) {
                            throw errWr;
                        } else {
                            
                            let arrOfData = [];
                            let matrixData = [];

                            await Promise.all(instaRes.response.map(async ele => {

                                if (ele.responseType === "text" || ele.responseType === "date" || ele.responseType === "number" || ele.responseType === "slider") {

                                    arrOfData.push(ele);

                                } else if (ele.responseType === "multiselect") {

                                    let dt = formDataMultiSelect.filter(or => {

                                        if (or.order == ele.order) {
                                            return or;
                                        }
                                    })

                                    dt.responseType = "multiselect";
                                    arrOfData.push(dt);

                                } else if (ele.responseType === "radio") {
                                    let dt = radioFormData.filter(or => {

                                        if (or.order == ele.order) {
                                            return or;
                                        }
                                    })

                                    dt.responseType = "radio";
                                    arrOfData.push(dt);

                                } else if (ele.responseType === "matrix") {
                                    //push main matrix question object into array
                                    arrOfData.push(ele);
                                    let obj = {
                                        order: ele.order,
                                        data: []
                                    }

                                    await Promise.all(ele.instanceQuestions.map(element => {
                                        //push the instance questions to the array
                                        if (element.responseType == "text" || element.responseType == "date" || element.responseType == "number" || ele.responseType == "slider") {
                                            obj.data.push(element);
                                        }
                                        else if (element.responseType == "radio") {
                                            let dt = matrixRadioFormData.filter(or => {
                                                if (or.order == element.order) {
                                                    return or;
                                                }
                                            })

                                            dt[0].options.responseType = "radio";
                                            dt[0].options.answers = element.answers;
                                            obj.data.push(dt);

                                        }
                                        else if (element.responseType == "multiselect") {
                                            let dt = formDataMatrixMultiSelect.filter(or => {
                                                if (or.order == element.order) {
                                                    return or;
                                                }
                                            })

                                            dt[0].options.responseType = "multiselect";
                                            dt[0].options.answers = element.answers;

                                            obj.data.push(dt);

                                        }
                                    }))
                                    matrixData.push(obj);
                                }
                            }));

                            let obj = {
                                path: formDataMultiSelect,
                                instaRes: instaRes.response,
                                radioOptionsData: [],
                                orderData: arrOfData,
                                matrixRes: matrixData
                            };

                            ejs.renderFile(__dirname + '/../views/mainTemplate.ejs', {
                                data: obj
                            })
                                .then(function (dataEjsRender) {

                                    var dir = imgPath;
                                    if (!fs.existsSync(dir)) {
                                        fs.mkdirSync(dir);
                                    }
                                    fs.writeFile(dir + '/index.html', dataEjsRender, function (errWriteFile, dataWriteFile) {
                                        if (errWriteFile) {
                                            throw errWriteFile;
                                        } else {

                                            let optionsHtmlToPdf = gen.utils.getGotenbergConnection();
                                            optionsHtmlToPdf.formData = {
                                                files: [
                                                ]
                                            };
                                            FormData.push({
                                                value: fs.createReadStream(dir + '/index.html'),
                                                options: {
                                                    filename: 'index.html'
                                                }
                                            });
                                            FormData.push({
                                                value: fs.createReadStream(dir + '/style.css'),
                                                options: {
                                                    filename: 'style.css'
                                                }
                                            });
                                            FormData.push({
                                                value: fs.createReadStream(dir + '/header.html'),
                                                options: {
                                                    filename: 'header.html'
                                                }
                                            });
                                            FormData.push({
                                                value: fs.createReadStream(dir + '/footer.html'),
                                                options: {
                                                    filename: 'footer.html'
                                                }
                                            });
                                            optionsHtmlToPdf.formData.files = FormData;
                                            optionsHtmlToPdf.formData.marginTop = 1.2;
                                            optionsHtmlToPdf.formData.marginBottom = 1;

                                            rp(optionsHtmlToPdf)
                                                .then(function (responseHtmlToPdf) {

                                                    let pdfBuffer = Buffer.from(responseHtmlToPdf.body);
                                                    if (responseHtmlToPdf.statusCode == 200) {

                                                        let pdfFile = uuidv4() + ".pdf";
                                                        fs.writeFile(dir + '/' + pdfFile, pdfBuffer, 'binary', async function (err) {
                                                            if (err) {
                                                                return console.log(err);
                                                            }
                                                            else {
                                                                let uploadFileResponse = await uploadPdfToCloud(pdfFile, dir);
                                                                console.log(uploadFileResponse)
                                                                rimraf(imgPath,function () { console.log("done")});
                                                                return resolve({
                                                                    status: messageConstants.common.status_success,
                                                                    message: messageConstants.apiResponses.pdf_report_generated,
                                                                    pdfUrl:uploadFileResponse.getDownloadableUrl
                                                                })
                                                            }

                                                        });

                                                    }
                                                })
                                                .catch(function (err) {
                                                    resolve(err);
                                                    throw err;
                                                });
                                        }
                                    });
                                })
                                .catch(function (errEjsRender) {
                                    console.log("errEjsRender : ", errEjsRender);

                                    reject(errEjsRender);
                                });

                        }

                    });
                });

        } catch (exp) {
            return reject(exp);
        } 
    })

}

/**
 * Generate a PDF report for instance observation
 * @param {Object} instaRes - The response object containing instance observation data
 * @returns {Promise<Object>} The generated PDF report information
 */
exports.instanceObservationPdfGeneration = async function instanceObservationPdfGeneration(instaRes) {


    return new Promise(async function (resolve, reject) {

        var currentTempFolder = 'tmp/' + uuidv4() + "--" + Math.floor(Math.random() * (10000 - 10 + 1) + 10)

        var imgPath = __dirname + '/../' + currentTempFolder;


        try {

            if (!fs.existsSync(imgPath)) {
                fs.mkdirSync(imgPath);
            }

            let bootstrapStream = await copyBootStrapFile(__dirname + '/../public/css/bootstrap.min.css', imgPath + '/style.css');

            // let headerFile = await copyBootStrapFile(__dirname + '/../views/header.html', imgPath + '/header.html');
            let footerFile = await copyBootStrapFile(__dirname + '/../views/footer.html', imgPath + '/footer.html');

            var multiSelectArray = [];
            var radioArray = [];
            let formData = [];
            
            instaRes.response = instaRes.response ? instaRes.response : instaRes.reportSections;

            await Promise.all(instaRes.response.map(async ele => {
                if (ele.responseType == "matrix") {
                    await Promise.all(ele.instanceQuestions.map(element => {
                        if (element.responseType == "multiselect") {
                            multiSelectArray.push(element);
                        }
                        else if (element.responseType == "radio") {
                            radioArray.push(element);
                        }
                    }))
                }

            }))

            //select all the multiselect response objects and create a chart object
            let multiSelectChartObj = await getChartObject(multiSelectArray);
            let radioChartObj = await getChartObject(radioArray);

            let multiselectFormData = await createChart(multiSelectChartObj, imgPath);
            let radioFormData = await createChart(radioChartObj, imgPath);

            formData.push(...multiselectFormData);
            formData.push(...radioFormData);


            var params = {
                observationName: instaRes.observationName ? instaRes.observationName : instaRes.solutionName
            }
            ejs.renderFile(__dirname + '/../views/header.ejs', {
                data: params
            })
                .then(function (headerHtml) {

                    var dir = imgPath;
                    if (!fs.existsSync(dir)) {
                        fs.mkdirSync(dir);
                    }

                    fs.writeFile(dir + '/header.html', headerHtml, async function (errWr, dataWr) {
                        if (errWr) {
                            throw errWr;
                        } else {

                            //Arrange the questions based on the order field
                            var arrOfData = [];
                            var matrixData = [];

                            await Promise.all(instaRes.response.map(async ele => {


                                if (ele.responseType === "text" || ele.responseType === "date" || ele.responseType === "number" || ele.responseType === "slider" || ele.responseType === "multiselect" || ele.responseType === "radio") {

                                    arrOfData.push(ele);

                                } else if (ele.responseType === "matrix") {

                                    //push main matrix question object into array
                                    arrOfData.push(ele);
                                    let obj = {
                                        order: ele.order,
                                        data: []
                                    }
                                    await Promise.all(ele.instanceQuestions.map(element => {
                                        //push the instance questions to the array
                                        if (element.responseType == "text" || element.responseType == "date" || element.responseType == "number" || ele.responseType == "slider") {
                                            obj.data.push(element);
                                        }
                                        else if (element.responseType == "radio") {
                                            let dt = radioFormData.filter(or => {
                                                if (or.order == element.order) {
                                                    return or;
                                                }
                                            })

                                            dt[0].options.responseType = "radio";
                                            dt[0].options.answers = element.answers;
                                            obj.data.push(dt);

                                        }
                                        else if (element.responseType == "multiselect") {
                                            let dt = multiselectFormData.filter(or => {
                                                if (or.order == element.order) {
                                                    return or;
                                                }
                                            })

                                            dt[0].options.responseType = "multiselect";
                                            dt[0].options.answers = element.answers;

                                            obj.data.push(dt);

                                        }
                                    }))

                                    matrixData.push(obj);
                                }
                            }));


                            var obj = {
                                orderData: arrOfData,
                                matrixRes: matrixData
                            };
                            ejs.renderFile(__dirname + '/../views/instanceObservationTemplate.ejs', {
                                data: obj
                            })
                                .then(function (dataEjsRender) {

                                    var dir = imgPath;
                                    if (!fs.existsSync(dir)) {
                                        fs.mkdirSync(dir);
                                    }
                                    fs.writeFile(dir + '/index.html', dataEjsRender, function (errWriteFile, dataWriteFile) {
                                        if (errWriteFile) {
                                            throw errWriteFile;
                                        } else {

                                            let optionsHtmlToPdf = gen.utils.getGotenbergConnection();
                                            optionsHtmlToPdf.formData = {
                                                files: [
                                                ]
                                            };
                                            formData.push({
                                                value: fs.createReadStream(dir + '/index.html'),
                                                options: {
                                                    filename: 'index.html'
                                                }
                                            });
                                            formData.push({
                                                value: fs.createReadStream(dir + '/style.css'),
                                                options: {
                                                    filename: 'style.css'
                                                }
                                            });
                                            formData.push({
                                                value: fs.createReadStream(dir + '/header.html'),
                                                options: {
                                                    filename: 'header.html'
                                                }
                                            });
                                            formData.push({
                                                value: fs.createReadStream(dir + '/footer.html'),
                                                options: {
                                                    filename: 'footer.html'
                                                }
                                            });
                                            optionsHtmlToPdf.formData.files = formData;
                                            optionsHtmlToPdf.formData.marginTop = 1.4;
                                            optionsHtmlToPdf.formData.marginBottom = 1;

                                            rp(optionsHtmlToPdf)
                                                .then(function (responseHtmlToPdf) {

                                                    let pdfBuffer = Buffer.from(responseHtmlToPdf.body);
                                                    if (responseHtmlToPdf.statusCode == 200) {
                                                        let pdfFile = uuidv4() + ".pdf";
                                                        fs.writeFile(dir + '/' + pdfFile, pdfBuffer, 'binary', async function (err) {
                                                            if (err) {
                                                                return console.log(err);
                                                            }
                                                            else {

                                                                let uploadFileResponse = await uploadPdfToCloud(pdfFile, dir);
                                                                console.log(uploadFileResponse)
                                                                rimraf(imgPath,function () { console.log("done")});
                                                                return resolve({
                                                                    status: messageConstants.common.status_success,
                                                                    message: messageConstants.apiResponses.pdf_report_generated,
                                                                    pdfUrl:uploadFileResponse.getDownloadableUrl
                                                                })

                                                            }
                                                        });
                                                    }
                                                })
                                                .catch(function (err) {
                                                  console.log("error in converting HtmlToPdf", err);
                                                  resolve(err);
                                                  throw err;
                                                });
                                        }
                                    });
                                })
                                .catch(function (errEjsRender) {
                                  reject(errEjsRender);
                                });

                        }

                    });
                });

        } catch (exp) {
          return reject(exp);
        } 
    })
}

/**
 * Generate a PDF report for instance criteria
 * @param {Object} instanceResponse - The response object containing instance criteria data
 * @returns {Promise<Object>} The generated PDF report information
 */
exports.instanceCriteriaReportPdfGeneration = async function (instanceResponse) {


    return new Promise(async function (resolve, reject) {

        var currentTempFolder = 'tmp/' + uuidv4() + "--" + Math.floor(Math.random() * (10000 - 10 + 1) + 10)

        var imgPath = __dirname + '/../' + currentTempFolder;


        try {

            if (!fs.existsSync(imgPath)) {
                fs.mkdirSync(imgPath);
            }

            let bootstrapStream = await copyBootStrapFile(__dirname + '/../public/css/bootstrap.min.css', imgPath + '/style.css');

            // let headerFile = await copyBootStrapFile(__dirname + '/../views/header.html', imgPath + '/header.html');
            let footerFile = await copyBootStrapFile(__dirname + '/../views/footer.html', imgPath + '/footer.html');

            let formData = [];

            let params = {
                observationName: instanceResponse.observationName ? instanceResponse.observationName : instanceResponse.solutionName
            }
            ejs.renderFile(__dirname + '/../views/header.ejs', {
                data: params
            })
                .then(function (headerHtml) {

                    var dir = imgPath;

                    fs.writeFile(dir + '/header.html', headerHtml, async function (err, dataWr) {
                        if (err) {
                            throw err;
                        } else {

                            var obj = {
                                response: instanceResponse.response ? instanceResponse.response : instanceResponse.reportSections
                            };
                            ejs.renderFile(__dirname + '/../views/instanceCriteriaTemplate.ejs', {
                                data: obj
                            })
                                .then(function (dataEjsRender) {

                                    var dir = imgPath;
                                    if (!fs.existsSync(dir)) {
                                        fs.mkdirSync(dir);
                                    }
                                    fs.writeFile(dir + '/index.html', dataEjsRender, function (errWriteFile, dataWriteFile) {
                                        if (errWriteFile) {
                                            throw errWriteFile;
                                        } else {

                                            let optionsHtmlToPdf = gen.utils.getGotenbergConnection();
                                            optionsHtmlToPdf.formData = {
                                                files: [
                                                ]
                                            };
                                            formData.push({
                                                value: fs.createReadStream(dir + '/index.html'),
                                                options: {
                                                    filename: 'index.html'
                                                }
                                            });
                                            formData.push({
                                                value: fs.createReadStream(dir + '/style.css'),
                                                options: {
                                                    filename: 'style.css'
                                                }
                                            });
                                            formData.push({
                                                value: fs.createReadStream(dir + '/header.html'),
                                                options: {
                                                    filename: 'header.html'
                                                }
                                            });
                                            formData.push({
                                                value: fs.createReadStream(dir + '/footer.html'),
                                                options: {
                                                    filename: 'footer.html'
                                                }
                                            });
                                            optionsHtmlToPdf.formData.files = formData;

                                            rp(optionsHtmlToPdf)
                                                .then(function (responseHtmlToPdf) {

                                                    let pdfBuffer = Buffer.from(responseHtmlToPdf.body);
                                                    if (responseHtmlToPdf.statusCode == 200) {

                                                        let pdfFile = uuidv4() + ".pdf";
                                                        fs.writeFile(dir + '/' + pdfFile, pdfBuffer, 'binary', async function (err) {
                                                            if (err) {
                                                                return console.log(err);
                                                            }
                                                            else {

                                                                let uploadFileResponse = await uploadPdfToCloud(pdfFile, dir);
                                                                console.log(uploadFileResponse)
                                                                rimraf(imgPath,function () { console.log("done")});
                                                                return resolve({
                                                                    status: messageConstants.common.status_success,
                                                                    message: messageConstants.apiResponses.pdf_report_generated,
                                                                    pdfUrl:uploadFileResponse.getDownloadableUrl
                                                                })

                                                            }
                                                        
                                                    });
                                                }
                                            })
                                            .catch(function (err) {
                                                console.log("error in converting HtmlToPdf", err);
                                                resolve(err);
                                                throw err;
                                            });
                                        }
                                    });
                                })
                                .catch(function (errEjsRender) {
                                    console.log("errEjsRender : ", errEjsRender);

                                    reject(errEjsRender);
                                });
                            }
                        });
                });
            } catch (err) {
              return reject(err);
        }
    })
}


/**
 * Generate a PDF report for entity criteria
 * @param {Object} responseData - The response object containing entity criteria data
 * @returns {Promise<Object>} The generated PDF report information
 */
exports.entityCriteriaPdfReportGeneration = async function (responseData) {

    return new Promise(async function (resolve, reject) {

        var currentTempFolder = 'tmp/' + uuidv4() + "--" + Math.floor(Math.random() * (10000 - 10 + 1) + 10)

        var imgPath = __dirname + '/../' + currentTempFolder;


        try {

            if (!fs.existsSync(imgPath)) {
                fs.mkdirSync(imgPath);
            }

            let bootstrapStream = await copyBootStrapFile(__dirname + '/../public/css/bootstrap.min.css', imgPath + '/style.css');

            // let headerFile = await copyBootStrapFile(__dirname + '/../views/header.html', imgPath + '/header.html');
            let footerFile = await copyBootStrapFile(__dirname + '/../views/footer.html', imgPath + '/footer.html');

            let multiSelectArray = [];
            let radioArray = [];
            let formData = [];
            
            responseData.response = responseData.response ? responseData.response : responseData.reportSections;

            await Promise.all(responseData.response.map(async singleResponse => {
                await Promise.all( singleResponse.questionArray.map( question => {
                    if (question.responseType == "multiselect") {
                        multiSelectArray.push(question);
                    }
                    else if (question.responseType == "radio") {
                        radioArray.push(question);
                    }
                }))
            }))
            
            //Prepare chart object before sending it to highchart server
            let multiSelectData = await getChartObject(multiSelectArray);
            let radioData = await getChartObject(radioArray);

            //send chart objects to highchart server and get the charts
            let multiselectFormData = await createChart(multiSelectData, imgPath);
            let radioFormData = await createChart(radioData, imgPath);

            formData.push(...multiselectFormData);
            formData.push(...radioFormData);

            let params = {
                observationName: responseData.observationName ? responseData.observationName : responseData.solutionName
            }

            ejs.renderFile(__dirname + '/../views/header.ejs', {
                data: params
            })
                .then(function (headerHtml) {

                    var dir = imgPath;
                    if (!fs.existsSync(dir)) {
                        fs.mkdirSync(dir);
                    }
                    fs.writeFile(dir + '/header.html', headerHtml, async function (errWr, dataWr) {
                        if (errWr) {
                            throw errWr;
                        } else {

                            let obj = {
                                response: responseData.response,
                                radioData: radioFormData,
                                multiselectData: multiselectFormData
                            };
                            ejs.renderFile(__dirname + '/../views/entityCriteriaTemplate.ejs', {
                                data: obj
                            })
                                .then(function (dataEjsRender) {

                                    var dir = imgPath;
                                    if (!fs.existsSync(dir)) {
                                        fs.mkdirSync(dir);
                                    }
                                    fs.writeFile(dir + '/index.html', dataEjsRender, function (errWriteFile, dataWriteFile) {
                                        if (errWriteFile) {
                                            throw errWriteFile;
                                        } else {

                                            let optionsHtmlToPdf = gen.utils.getGotenbergConnection();
                                            optionsHtmlToPdf.formData = {
                                                files: [
                                                ]
                                            };
                                            formData.push({
                                                value: fs.createReadStream(dir + '/index.html'),
                                                options: {
                                                    filename: 'index.html'
                                                }
                                            });
                                            formData.push({
                                                value: fs.createReadStream(dir + '/style.css'),
                                                options: {
                                                    filename: 'style.css'
                                                }
                                            });
                                            formData.push({
                                                value: fs.createReadStream(dir + '/header.html'),
                                                options: {
                                                    filename: 'header.html'
                                                }
                                            });
                                            formData.push({
                                                value: fs.createReadStream(dir + '/footer.html'),
                                                options: {
                                                    filename: 'footer.html'
                                                }
                                            });
                                            optionsHtmlToPdf.formData.files = formData;
                                            optionsHtmlToPdf.formData.marginTop = 1.2;
                                            optionsHtmlToPdf.formData.marginBottom = 1;

                                            rp(optionsHtmlToPdf)
                                                .then(function (responseHtmlToPdf) {

                                                    let pdfBuffer = Buffer.from(responseHtmlToPdf.body);
                                                    if (responseHtmlToPdf.statusCode == 200) {

                                                        let pdfFile = uuidv4() + ".pdf";
                                                        fs.writeFile(dir + '/' + pdfFile, pdfBuffer, 'binary', async function (err) {
                                                            if (err) {
                                                                return console.log(err);
                                                            }
                                                            else {

                                                                let uploadFileResponse = await uploadPdfToCloud(pdfFile, dir);
                                                                console.log(uploadFileResponse)
                                                                rimraf(imgPath,function () { console.log("done")});
                                                                return resolve({
                                                                    status: messageConstants.common.status_success,
                                                                    message: messageConstants.apiResponses.pdf_report_generated,
                                                                    pdfUrl:uploadFileResponse.getDownloadableUrl
                                                                })

                                                            }
                                                        
                                                    });
                                                }
                                            })
                                            .catch(function (err) {
                                                resolve(err);
                                                throw err;
                                            });
                                        }
                                    });
                                })
                                .catch(function (errEjsRender) {
                                    console.log("errEjsRender : ", errEjsRender);

                                    reject(errEjsRender);
                                });

                        }

                    });
                });

        } catch (err) {
           return reject(err);
        }
    })

}
/**
 * Copy a bootstrap file from one location to another
 * @param {string} from - The source file path
 * @param {string} to - The destination file path
 * @returns {Promise<Object>} A promise that resolves when the file is copied
 */
async function copyBootStrapFile(from, to) {
    // var fileInfo = await rp(options).pipe(fs.createWriteStream(radioFilePath))
    var readCss = fs.createReadStream(from).pipe(fs.createWriteStream(to));
    return new Promise(function (resolve, reject) {
        readCss.on('finish', function () {
            // console.log("readCss", readCss);
            return resolve(readCss);
        });
        readCss.on('error', function (err) {
            // return resolve(fileInfo);
            // console.log("err--", err);
            return resolve(err)
        });
    });
}

/**
 * Prepare chart data for chartjs
 * @param {Array} data - The array of chart data
 * @returns {Promise<Array>} An array of chart objects
 */
const getChartObject = async function (data) {
    let chartOptions = [];

    await Promise.all(data.map(chartData => {
        let chartObj = {
            order: chartData.order,
            options: chartData.chart,
            question: chartData.question
        };
       
        if (!chartObj.options.options) {
           chartObj.options.options = {
               plugin : {}
           };
        }
        /* 10-may-2022 - chartjs-node-canvas doesn't have multiple line title property. So spliting questions into array element of fixed length */
        let titleArray = [];
        if ( chartData.question && chartData.question !== "" ) {
                //split questions into an array
                let words = chartData.question.split(' ');
                //maximum character length of a line
                let sentenceLengthLimit = 101;
                let sentence = "";
                let titleIndex = 0
                
                for ( let index = 0; index < words.length; index++ ) {
                    let upcomingLength = sentence.length + words[index].length;
                    //check length of upcoming sentence
                    if ( upcomingLength <= sentenceLengthLimit ) {
                        sentence = sentence + " " + words[index];
                        //add last word 
                        if ( index == (words.length - 1)) {
                            titleArray[titleArray.length] = sentence ;
                        }
                    } else {
                        //add line to title array
                        titleArray[titleIndex] = sentence ;
                        titleIndex ++ ;
                        sentence = "";
                        sentence = sentence + words[index];
                    }
                    
                }
        }
        
        
        if (!chartObj.options.options.title) {
            chartObj.options.options.title = {
                display: true,
                text: titleArray,
                fontSize: 18,
                fontFamily: 'Arial',
                fullSize: true,
                
                
            };
        }
        
        if (chartObj.options.type == "horizontalBar") {
        if (!chartObj.options.options.scales["yAxes"] || !chartObj.options.options.scales["yAxes"][0]["ticks"] ) {
            if (!chartObj.options.options.scales["yAxes"]) {
               chartObj.options.options.scales["yAxes"] = [{}];
            }
            
            chartObj.options.options.scales["yAxes"][0]["ticks"] = {
                callback: function (value, index, values) {
                  let strArr = value.split(' ');
                  let tempString = '';
                  let result = [];
                  for (let x = 0; x < strArr.length; x++) {
                    tempString += ' ' + strArr[x];
                    if ((x % 5 === 0 && x !== 0) || x == strArr.length - 1) {
                      tempString = tempString.slice(1);
                      result.push(tempString);
                      tempString = '';
                    }
                  }
                  return result || value;
                },
                fontSize: 12,
            }
        }
        }

        chartOptions.push(chartObj)
    }))

    return chartOptions;
}

/**
 * Create charts using chartjs
 * @param {Array} chartData - The array of chart data
 * @param {string} imgPath - The path to save chart images
 * @returns {Promise<Array>} An array of form data for the charts
 */
const createChart = async function (chartData, imgPath) {

    return new Promise(async function (resolve, reject) {

        try {
            
            let formData = [];

            await Promise.all(chartData.map(async data => {
                let chartImage = "chartPngImage_" + uuidv4() + "_.png";

                let imgFilePath = imgPath + "/" + chartImage;
                console.log(data.options,'data.options')
                let imageBuffer = await chartJSNodeCanvas.renderToBuffer(data.options);
                fs.writeFileSync(imgFilePath, imageBuffer);
formData
                .push({
                    order: data.order,
                    value: fs.createReadStream(imgFilePath),
                    options: {
                        filename: chartImage,
                    }
                })

            }))

            return resolve(formData)
        }
        catch (err) {
            return reject(err);
        }
    })
}
/**
 * Upload a PDF file to cloud storage
 * @param {string} fileName - The name of the file to upload
 * @param {string} folderPath - The path of the folder containing the file
 * @returns {Promise<Object>} The upload result
 */
const uploadPdfToCloud = async function(fileName, folderPath) {

    return new Promise( async function( resolve, reject) {
     
     try {
        
        console.log(fileName, folderPath,'fileName, folderPath')
        let getSignedUrl = await filesHelpers.preSignedUrls(
            [fileName],
            bucketName,
            cloudStorage,
            'temporary/files/report/',
            parseInt(process.env.PRESIGNED_URL_EXPIRY_IN_SECONDS), //expireIn PARAMS
            '' //permission PARAMS
        )
         
         if (getSignedUrl.result && Object.keys(getSignedUrl.result).length > 0) {
             
             let fileUploadUrl = getSignedUrl.result[0].url;
             let fileData = fs.readFileSync(folderPath + "/" + fileName);

             try { 

                 var options = {
                    'method': 'PUT',
                    'url': fileUploadUrl,
                    'headers': {
                      'Content-Type': 'multipart/form-data'
                    },
                    body:fileData
                  
                  };
                
                request(options, function (error, response) {
                    if (error) {
                        return resolve({
                            success: false
                        })
                    };

                    return resolve({
                        success: true,
                        data: getSignedUrl.result[0].payload.sourcePath,
                        getDownloadableUrl:getSignedUrl.result[0].getDownloadableUrl[0]
                    })

                  })
                 
             } catch (e) {
                 console.log(e)
             }
         }
         else {
             return resolve({
                 success: false
             })
         }
     }
     catch(err) {
         return resolve({
             success: false,
             message: err.message
         })
     }
 
    })
 }