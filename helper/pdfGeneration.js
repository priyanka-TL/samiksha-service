const fs = require('fs');
const { v1: uuidv4 } = require('uuid');
const { ChartJSNodeCanvas } = require('chartjs-node-canvas');
const width = 800; //px
const height = 450; //px
const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height });
const rp = require('request-promise');
const ejs = require('ejs');
const path = require('path');
const rimraf = require("rimraf");
const request = require("request");
const filesHelpers = require(MODULES_BASE_PATH + '/files/helper')
const cloudStorage = process.env.CLOUD_STORAGE_PROVIDER
const bucketName = process.env.CLOUD_STORAGE_BUCKETNAME
const bucktType = process.env.CLOUD_STORAGE_BUCKET_TYPE

// PDF generation function for entity report
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

                                                                console.log(uploadFileResponse,'uploadFileResponse');
                                                                console.log(stopppp);

                                                                if (uploadFileResponse.success) {
                                                                    let pdfDownloadableUrl = await getDownloadableUrl(uploadFileResponse.data);

                                                                    console.log(pdfDownloadableUrl,'pdfDownloadableUrl')

                                                                    if (pdfDownloadableUrl.success && pdfDownloadableUrl.data.result && Object.keys(pdfDownloadableUrl.data.result).length > 0) {

                                                                        fs.readdir(imgPath, (err, files) => {
                                                                            if (err) throw err;

                                                                            let i = 0;
                                                                            for (const file of files) {

                                                                                fs.unlink(path.join(imgPath, file), err => {
                                                                                    if (err) throw err;
                                                                                });

                                                                                if (i == files.length) {
                                                                                    fs.unlink('../../' + currentTempFolder, err => {
                                                                                        if (err) throw err;

                                                                                    });
                                                                                    console.log("path.dirname(filename).split(path.sep).pop()", path.dirname(file).split(path.sep).pop());

                                                                                }

                                                                                i = i + 1;

                                                                            }
                                                                        });
                                                                        rimraf(imgPath,function () { console.log("done")});

                                                                        return resolve({
                                                                            status: messageConstants.common.status_success,
                                                                            message: messageConstants.common.pdf_report_generated,
                                                                            pdfUrl: pdfDownloadableUrl.data.result.url
                                                                        });
                                                                    }
                                                                    else {
                                                                        return resolve({
                                                                            status: messageConstants.common.status_failure,
                                                                            message: pdfDownloadableUrl.message ? pdfDownloadableUrl.message : messageConstants.common.could_not_generate_pdf,
                                                                            pdfUrl: ""
                                                                        })
                                                                    }
                                                                }
                                                                else {
                                                                    return resolve({
                                                                        status: messageConstants.common.status_failure,
                                                                        message: uploadFileResponse.message ? uploadFileResponse.message : messageConstants.common.could_not_generate_pdf,
                                                                        pdfUrl: ""
                                                                    })
                                                                }

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

// PDF generation function for instance API
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
                                                               
                                                                if (uploadFileResponse.success) {
                                                                    let pdfDownloadableUrl = await getDownloadableUrl(uploadFileResponse.data);
                                                                   
                                                                    if (pdfDownloadableUrl.success && pdfDownloadableUrl.data.result && Object.keys(pdfDownloadableUrl.data.result).length > 0) {
                                                                        
                                                                        fs.readdir(imgPath, (err, files) => {
                                                                            if (err) throw err;
                                                                            
                                                                            let i = 0;
                                                                            for (const file of files) {

                                                                                fs.unlink(path.join(imgPath, file), err => {
                                                                                    if (err) throw err;
                                                                                });

                                                                                if (i == files.length) {
                                                                                    fs.unlink('../../' + currentTempFolder, err => {
                                                                                        if (err) throw err;

                                                                                    });
                                                                                    console.log("path.dirname(filename).split(path.sep).pop()", path.dirname(file).split(path.sep).pop());
                                                                                   
                                                                                }

                                                                                i = i + 1;

                                                                            }
                                                                        });
                                                                        rimraf(imgPath,function () { console.log("done")});

                                                                        return resolve({
                                                                            status: messageConstants.common.status_success,
                                                                            message: messageConstants.common.pdf_report_generated,
                                                                            pdfUrl: pdfDownloadableUrl.data.result.url
                                                                        });
                                                                    }
                                                                    else {
                                                                        return resolve({
                                                                            status: messageConstants.common.status_failure,
                                                                            message: pdfDownloadableUrl.message ? pdfDownloadableUrl.message : messageConstants.common.could_not_generate_pdf,
                                                                            pdfUrl: ""
                                                                        })
                                                                    }
                                                                }
                                                                else {
                                                                    return resolve({
                                                                        status: messageConstants.common.status_failure,
                                                                        message: uploadFileResponse.message ? uploadFileResponse.message : messageConstants.common.could_not_generate_pdf,
                                                                        pdfUrl: ""
                                                                    })
                                                                }
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

//PDF generation for instance observation score report
exports.instanceObservationScorePdfGeneration = async function instanceObservationPdfGeneration(observationResp, obj) {

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
            
            observationResp.response = observationResp.response ? observationResp.response : observationResp.reportSections;

            //select all the multiselect response objects and create a chart object
            let chartObject = await getChartObject(observationResp.response);

            let formData = await createChart(chartObject, imgPath);

            let params;

            if (observationResp.solutionName) {
                params = {
                    solutionName: observationResp.solutionName
                }
            }
            else {
                params = {
                    observationName: observationResp.observationName
                }
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

                            let arrayOfData = [];


                            await Promise.all(observationResp.response.map(async ele => {

                                let dt = formData.filter(or => {

                                    if (or.order == ele.order) {
                                        return or;
                                    }
                                })

                                arrayOfData.push(dt);

                            }))

                            obj.orderData = arrayOfData;

                            ejs.renderFile(__dirname + '/../views/instanceScoreObsTemplate.ejs', {
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
                                                               
                                                                if (uploadFileResponse.success) {
                                                                    let pdfDownloadableUrl = await getDownloadableUrl(uploadFileResponse.data);
                                                                   
                                                                    if (pdfDownloadableUrl.success && pdfDownloadableUrl.data.result && Object.keys(pdfDownloadableUrl.data.result).length > 0) {
                                                                        
                                                                        fs.readdir(imgPath, (err, files) => {
                                                                            if (err) throw err;
                                                                            
                                                                            let i = 0;
                                                                            for (const file of files) {

                                                                                fs.unlink(path.join(imgPath, file), err => {
                                                                                    if (err) throw err;
                                                                                });

                                                                                if (i == files.length) {
                                                                                    fs.unlink('../../' + currentTempFolder, err => {
                                                                                        if (err) throw err;

                                                                                    });
                                                                                    console.log("path.dirname(filename).split(path.sep).pop()", path.dirname(file).split(path.sep).pop());
                                                                                   
                                                                                }

                                                                                i = i + 1;

                                                                            }
                                                                        });
                                                                        rimraf(imgPath,function () { console.log("done")});

                                                                        return resolve({
                                                                            status: messageConstants.common.status_success,
                                                                            message: messageConstants.common.pdf_report_generated,
                                                                            pdfUrl: pdfDownloadableUrl.data.result.url
                                                                        });
                                                                    }
                                                                    else {
                                                                        return resolve({
                                                                            status: messageConstants.common.status_failure,
                                                                            message: pdfDownloadableUrl.message ? pdfDownloadableUrl.message : messageConstants.common.could_not_generate_pdf,
                                                                            pdfUrl: ""
                                                                        })
                                                                    }
                                                                }
                                                                else {
                                                                    return resolve({
                                                                        status: messageConstants.common.status_failure,
                                                                        message: uploadFileResponse.message ? uploadFileResponse.message : messageConstants.common.could_not_generate_pdf,
                                                                        pdfUrl: ""
                                                                    })
                                                                }
                                                            }
                                                        
                                                    });
                                                }
                                            }).catch(function (err) {
                                                resolve(err);
                                                throw err;
                                            });
                                        }
                                    });
                                }).catch(function (errEjsRender) {
                                    console.log("errEjsRender : ", errEjsRender);

                                    reject(errEjsRender);
                                });
                        }
                    });
                });
        }
        catch (err) {
          return reject(err);
        }
    })

}


// ============> PDF generation function for assessment API ======================>
exports.assessmentPdfGeneration = async function assessmentPdfGeneration(assessmentRes) {


    return new Promise(async function (resolve, reject) {

        let currentTempFolder = 'tmp/' + uuidv4() + "--" + Math.floor(Math.random() * (10000 - 10 + 1) + 10)

        let imgPath = __dirname + '/../' + currentTempFolder;

        try {
            
            let assessmentChartData = await getAssessmentChartData(assessmentRes);
            let chartData = await getChartObject([assessmentChartData.reportSections[0]]);

            if (!fs.existsSync(imgPath)) {
                fs.mkdirSync(imgPath);
            }

            let bootstrapStream = await copyBootStrapFile(__dirname + '/../public/css/bootstrap.min.css', imgPath + '/style.css');

            // let headerFile = await copyBootStrapFile(__dirname + '/../views/header.html', imgPath + '/header.html');
            let footerFile = await copyBootStrapFile(__dirname + '/../views/footer.html', imgPath + '/footer.html');

            let FormData = [];

            let formDataAssessment = await createChart(chartData, imgPath);

            FormData.push(...formDataAssessment);
            let params = {
                assessmentName: "Institutional Assessment Report"
            }
            ejs.renderFile(__dirname + '/../views/assessment_header.ejs', {
                data: params
            })
                .then(function (headerHtml) {
                    var dir = imgPath;
                    if (!fs.existsSync(dir)) {
                        fs.mkdirSync(dir);
                    }
                    fs.writeFile(dir + '/header.html', headerHtml, function (errWr, dataWr) {
                        if (errWr) {
                            throw errWr;
                        } else {

                            var obj = {
                                path: formDataAssessment,
                            };
                            ejs.renderFile(__dirname + '/../views/stacked_bar_assessment_template.ejs', {
                                data: obj.path[0].options.filename,
                                assessmentData: assessmentRes.reportSections[1]
                            })
                                .then(function (dataEjsRender) {
                                    // console.log("dataEjsRender",imgPath);
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
                                                               
                                                                if (uploadFileResponse.success) {
                                                                    let pdfDownloadableUrl = await getDownloadableUrl(uploadFileResponse.data);
                                                                   
                                                                    if (pdfDownloadableUrl.success && pdfDownloadableUrl.data.result && Object.keys(pdfDownloadableUrl.data.result).length > 0) {
                                                                        
                                                                        fs.readdir(imgPath, (err, files) => {
                                                                            if (err) throw err;
                                                                            
                                                                            let i = 0;
                                                                            for (const file of files) {

                                                                                fs.unlink(path.join(imgPath, file), err => {
                                                                                    if (err) throw err;
                                                                                });

                                                                                if (i == files.length) {
                                                                                    fs.unlink('../../' + currentTempFolder, err => {
                                                                                        if (err) throw err;

                                                                                    });
                                                                                    console.log("path.dirname(filename).split(path.sep).pop()", path.dirname(file).split(path.sep).pop());
                                                                                   
                                                                                }

                                                                                i = i + 1;

                                                                            }
                                                                        });
                                                                        rimraf(imgPath,function () { console.log("done")});

                                                                        return resolve({
                                                                            status: messageConstants.common.status_success,
                                                                            message: messageConstants.common.pdf_report_generated,
                                                                            pdfUrl: pdfDownloadableUrl.data.result.url
                                                                        });
                                                                    }
                                                                    else {
                                                                        return resolve({
                                                                            status: messageConstants.common.status_failure,
                                                                            message: pdfDownloadableUrl.message ? pdfDownloadableUrl.message : messageConstants.common.could_not_generate_pdf,
                                                                            pdfUrl: ""
                                                                        })
                                                                    }
                                                                }
                                                                else {
                                                                    return resolve({
                                                                        status: messageConstants.common.status_failure,
                                                                        message: uploadFileResponse.message ? uploadFileResponse.message : messageConstants.common.could_not_generate_pdf,
                                                                        pdfUrl: ""
                                                                    })
                                                                }
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

                                    resolve(errEjsRender);
                                });
                            }
                    });
                });

        } catch (err) {
          return reject(err)
        } 
    })
}

const getAssessmentChartData = async function(assessmentData) {

    let dataArray = [];
    let j = 0;

    for (let i =0; i < assessmentData.reportSections[0].chart.data.datasets.length; i++) {
       dataArray = [...dataArray, ...assessmentData.reportSections[0].chart.data.datasets[i].data]
    }
    
    let chartData = await convertChartDataToPercentage(assessmentData.domainLevelObject);

    assessmentData.reportSections[0].chart.data.datasets = chartData;

    assessmentData.reportSections[0].chart.options["plugins"] = {
        datalabels: {
            formatter: function(value, data) {
             let labelValue = dataArray[j];
             j++;
             return labelValue;
             }
         }
    }
    
    return assessmentData;

}

const convertChartDataToPercentage = async function (domainObj) {
    let dynamicLevelObj = {};
    let domainKeys = Object.keys(domainObj);

    for (let i = 0; i < domainKeys.length; i++) {
        let levels = Object.keys(domainObj[domainKeys[i]]);
        let sum = 0;
        for (let j = 0; j < levels.length; j++) {
            if (!dynamicLevelObj[levels[j]]) {
                dynamicLevelObj[levels[j]] = []
            }
            let levelObj = domainObj[domainKeys[i]][levels[j]];
            sum += levelObj[levels[j]];
        }
        for (let k = 0; k < levels.length; k++) {
            let levelObj = domainObj[domainKeys[i]][levels[k]];
            levelObj[levels[k]] = ((levelObj[levels[k]] / sum) * 100).toFixed(2);
        }
    }
   
    let levelCountbject = {};
   
    for (let domainKey = 0; domainKey < domainKeys.length; domainKey++) {
        let levels = domainObj[domainKeys[domainKey]];
        let levelKeys = Object.keys(levels);
        for (level in dynamicLevelObj) {
            if (levelKeys.includes(level)) {
                dynamicLevelObj[level].push(levels[level][level]);
            } else {
                dynamicLevelObj[level].push(0);
            }
        }
    }
   
    //sort the levels
    Object.keys(dynamicLevelObj).sort().forEach(function (key) {
        levelCountbject[key] = dynamicLevelObj[key];
    });

    let datasets = [];
    let backgroundColors = ['rgb(255, 99, 132)','rgb(54, 162, 235)','rgb(255, 206, 86)','rgb(231, 233, 237)','rgb(75, 192, 192)','rgb(151, 187, 205)','rgb(220, 220, 220)','rgb(247, 70, 74)','rgb(70, 191, 189)','rgb(253, 180, 92)','rgb(148, 159, 177)','rgb(77, 83, 96)','rgb(95, 101, 217)','rgb(170, 95, 217)','rgb(140, 48, 57)','rgb(209, 6, 40)','rgb(68, 128, 51)','rgb(125, 128, 51)','rgb(128, 84, 51)','rgb(179, 139, 11)']
    let incrementor = 0;

    for (level in levelCountbject) {
        datasets.push({
            label: level,
            data: levelCountbject[level],
            backgroundColor: backgroundColors[incrementor]
        })
        incrementor++;
    }
    
    return datasets;
}

// Single submission and multiple submission assessment report
exports.assessmentAgainPdfReport = async function (assessmentResponse) {

    return new Promise(async function (resolve, reject) {

        let currentTempFolder = 'tmp/' + uuidv4() + "--" + Math.floor(Math.random() * (10000 - 10 + 1) + 10)

        let imgPath = __dirname + '/../' + currentTempFolder;

        try {

            let assessmentChartData = await getAssessmentAgainChartData(assessmentResponse);
            let chartData = await getChartObject([assessmentChartData.reportSections[0]]);

            // console.log("imgPath",imgPath);
            if (!fs.existsSync(imgPath)) {
                fs.mkdirSync(imgPath);
            }

            let bootstrapStream = await copyBootStrapFile(path.join(__dirname, '../public/css/bootstrap.min.css'), imgPath + '/style.css');

            // let headerFile = await copyBootStrapFile(__dirname + '/../views/header.html', imgPath + '/header.html');
            // let footerFile = await copyBootStrapFile(path.join(__dirname, '../public/css/bootstrap.min.css'), imgPath + '/footer.html');
            let footerFile = await copyBootStrapFile(path.join(__dirname,  '/../views/footer.html'), imgPath + '/footer.html');

            let FormData = [];

            let formDataAssessment = await createChart(chartData, imgPath);

            FormData.push(...formDataAssessment);
            let params = {
                assessmentName: assessmentResponse.programName
            }
            ejs.renderFile(path.join(__dirname, '../views/assessment_header.ejs'), {
                data: params
            })
                .then(function (headerHtml) {
                    var dir = imgPath;
                    if (!fs.existsSync(dir)) {
                        fs.mkdirSync(dir);
                    }
                    fs.writeFile(path.join(dir,'/header.html'), headerHtml, function (errWr, dataWr) {
                        if (errWr) {
                            throw errWr;
                        } else {

                            let obj = {
                                path: formDataAssessment,
                            };

                            assessmentResponse.reportSections[1].isAssessAgain = true;

                            ejs.renderFile(path.join(__dirname, '../views/stacked_bar_assessment_template.ejs'), {
                                data: obj.path[0].options.filename,
                                assessmentData: assessmentResponse.reportSections[1]
                            })
                                .then(function (dataEjsRender) {
                                   
                                    var dir = imgPath;
                                    if (!fs.existsSync(dir)) {
                                        fs.mkdirSync(dir);
                                    }
                                    fs.writeFile(path.join(dir, '/index.html'), dataEjsRender, function (errWriteFile, dataWriteFile) {
                                        if (errWriteFile) {
                                            throw errWriteFile;
                                        } else {

                                            let optionsHtmlToPdf = gen.utils.getGotenbergConnection();
                                            console.log({optionsHtmlToPdf});
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
                                                    console.log({responseHtmlToPdf});
                                                    let pdfBuffer = Buffer.from(responseHtmlToPdf.body);
                                                    if (responseHtmlToPdf.statusCode == 200) {
                                                       
                                                        let pdfFile = uuidv4() + ".pdf";
                                                        fs.writeFile(dir + '/' + pdfFile, pdfBuffer, 'binary', async function (err) {
                                                            if (err) {
                                                                return console.log(err);
                                                            }
                                                            else {

                                                                let uploadFileResponse = await uploadPdfToCloud(pdfFile, dir);
                                                                console.log({uploadFileResponse});
                                                                if (uploadFileResponse.success) {
                                                                    let pdfDownloadableUrl = await getDownloadableUrl(uploadFileResponse.data);
                                                                    console.log({pdfDownloadableUrl});
                                                                    if (pdfDownloadableUrl.success && pdfDownloadableUrl.data.result && Object.keys(pdfDownloadableUrl.data.result).length > 0) {
                                                                        
                                                                        fs.readdir(imgPath, (err, files) => {
                                                                            if (err) throw err;
                                                                            
                                                                            let i = 0;
                                                                            for (const file of files) {

                                                                                fs.unlink(path.join(imgPath, file), err => {
                                                                                    if (err) throw err;
                                                                                });

                                                                                if (i == files.length) {
                                                                                    fs.unlink('../../' + currentTempFolder, err => {
                                                                                        if (err) throw err;

                                                                                    });
                                                                                    console.log("path.dirname(filename).split(path.sep).pop()", path.dirname(file).split(path.sep).pop());
                                                                                   
                                                                                }

                                                                                i = i + 1;

                                                                            }
                                                                        });
                                                                        rimraf(imgPath, (error) => {
                                                                            if (error) {
                                                                                console.log('ERROR-RIMRAF', JSON.stringify(error));
                                                                            }
                                                                        });

                                                                        return resolve({
                                                                            status: messageConstants.common.status_success,
                                                                            message: messageConstants.common.pdf_report_generated,
                                                                            pdfUrl: pdfDownloadableUrl.data.result.url
                                                                        });
                                                                    }
                                                                    else {
                                                                        return resolve({
                                                                            status: messageConstants.common.status_failure,
                                                                            message: pdfDownloadableUrl.message ? pdfDownloadableUrl.message : messageConstants.common.could_not_generate_pdf,
                                                                            pdfUrl: ""
                                                                        })
                                                                    }
                                                                }
                                                                else {
                                                                    return resolve({
                                                                        status: messageConstants.common.status_failure,
                                                                        message: uploadFileResponse.message ? uploadFileResponse.message : messageConstants.common.could_not_generate_pdf,
                                                                        pdfUrl: ""
                                                                    })
                                                                }
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
                                    console.log(errEjsRender);
                                    resolve(errEjsRender);
                                });
                        }
                    });
                });

        } catch (err) {
            return reject(err);
        }
    })
}

const getAssessmentAgainChartData = async function(assessmentData) {

    let actualChartData = [];
    let j = 0;
    let k = 0;
   
    for (let i =0; i < assessmentData.reportSections[0].chart.data.datasets.length; i++) {
        actualChartData = [...actualChartData, ...assessmentData.reportSections[0].chart.data.datasets[i].data]
    }
   
    let chartData = await convertAssessAgainChartDataToPercentage(assessmentData.reportSections[0].domainLevelObject);
    
    assessmentData.reportSections[0].chart.data.datasets = chartData;

    assessmentData.reportSections[0].chart.options["plugins"] = {
        datalabels: {
            offset: 0,
            anchor: "end",
            align: "left",
            font: {
              size: 7
            },
            formatter: function(value, data) {
                if ((data.datasetIndex + 1) % chartData.length == 0) {
                    let barValue = actualChartData[j]
                    j++;
                    if (assessmentData.reportSections[0].chart.submissionDateArray.length > 0) {
                        let submissionValue = assessmentData.reportSections[0].chart.submissionDateArray[k];
                        k++;
                        return [barValue, "", submissionValue];
                    } else {
                        return barValue;
                    }
                }
                else {
                     let barValue = actualChartData[j];
                     j++;
                     return barValue;
                }
            }
        }
    }

    return assessmentData;
}

const convertAssessAgainChartDataToPercentage = async function(domainObj) {
    
    let dynamicLevelObj = {};
    let domainKeys = Object.keys(domainObj);

    for (let i = 0; i < domainKeys.length; i++) {
        let dateKeys = Object.keys(domainObj[domainKeys[i]]);
        for (let dateKey = 0; dateKey < dateKeys.length; dateKey++) {
            let levels = domainObj[domainKeys[i]][dateKeys[dateKey]];
            let sum = 0;
            for (level in levels) {
                if (!dynamicLevelObj[level]) {
                   dynamicLevelObj[level] = []
                }
                sum += levels[level];
            }
    
            for (level in levels) {
                 levels[level] = ((levels[level] / sum) * 100).toFixed(2);
            }
        }
    }
    
    let levelCountbject = {};
   
    for (let i = 0; i < domainKeys.length; i++) {
        let dateKeys = Object.keys(domainObj[domainKeys[i]]);
        for (let dateKey = 0; dateKey < dateKeys.length; dateKey++) {
            let levels = domainObj[domainKeys[i]][dateKeys[dateKey]];
           
            for (level in dynamicLevelObj) {
                if (Object.keys(levels).includes(level)) {
                    dynamicLevelObj[level].push(levels[level]);
                } else {
                    dynamicLevelObj[level].push(0);
                }
            }
        }
    }

    //sort the levels
    Object.keys(dynamicLevelObj).sort().forEach(function (key) {
        levelCountbject[key] = dynamicLevelObj[key];
    });

    let datasets = [];
    let backgroundColors = ['rgb(255, 99, 132)','rgb(54, 162, 235)','rgb(255, 206, 86)','rgb(231, 233, 237)','rgb(75, 192, 192)','rgb(151, 187, 205)','rgb(220, 220, 220)','rgb(247, 70, 74)','rgb(70, 191, 189)','rgb(253, 180, 92)','rgb(148, 159, 177)','rgb(77, 83, 96)','rgb(95, 101, 217)','rgb(170, 95, 217)','rgb(140, 48, 57)','rgb(209, 6, 40)','rgb(68, 128, 51)','rgb(125, 128, 51)','rgb(128, 84, 51)','rgb(179, 139, 11)']
    let incrementor = 0;
  
    for (level in levelCountbject) {
        datasets.push({
            label: level,
            data: levelCountbject[level],
            backgroundColor: backgroundColors[incrementor]
        })
        incrementor++;
    }
    
    return datasets;
}


//Unnati monthly report pdf generation function
exports.unnatiViewFullReportPdfGeneration = async function (responseData) {

    return new Promise(async function (resolve, reject) {

        var currentTempFolder = 'tmp/' + uuidv4() + "--" + Math.floor(Math.random() * (10000 - 10 + 1) + 10)

        var imgPath = __dirname + '/../' + currentTempFolder;

        if (!fs.existsSync(imgPath)) {
            fs.mkdirSync(imgPath);
        }

        let bootstrapStream = await copyBootStrapFile(__dirname + '/../public/css/bootstrap.min.css', imgPath + '/style.css');

        try {

            var FormData = [];

            //get the chart object
            let chartObj = await ganttChartObject(responseData.projectDetails);

            //generate the chart using highchart server
            let ganttChartData = await createChart(chartObj[0], imgPath);

            FormData.push(...ganttChartData);

            let obj = {
                chartData: ganttChartData,
                reportType: responseData.reportType,
                projectData: chartObj[1],
                chartLibrary : "chartjs"
            }

            ejs.renderFile(__dirname + '/../views/unnatiViewFullReport.ejs', {
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

                            optionsHtmlToPdf.formData.files = FormData;


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
                                               
                                                if (uploadFileResponse.success) {
                                                    let pdfDownloadableUrl = await getDownloadableUrl(uploadFileResponse.data);
                                                   
                                                    if (pdfDownloadableUrl.success && pdfDownloadableUrl.data.result && Object.keys(pdfDownloadableUrl.data.result).length > 0) {
                                                        
                                                        fs.readdir(imgPath, (err, files) => {
                                                            if (err) throw err;
                                                            
                                                            let i = 0;
                                                            for (const file of files) {

                                                                fs.unlink(path.join(imgPath, file), err => {
                                                                    if (err) throw err;
                                                                });

                                                                if (i == files.length) {
                                                                    fs.unlink('../../' + currentTempFolder, err => {
                                                                        if (err) throw err;

                                                                    });
                                                                    console.log("path.dirname(filename).split(path.sep).pop()", path.dirname(file).split(path.sep).pop());
                                                                   
                                                                }

                                                                i = i + 1;

                                                            }
                                                        });
                                                        rimraf(imgPath,function () { console.log("done")});

                                                        return resolve({
                                                            status: messageConstants.common.status_success,
                                                            message: messageConstants.common.pdf_report_generated,
                                                            pdfUrl: pdfDownloadableUrl.data.result.url
                                                        });
                                                    }
                                                    else {
                                                        return resolve({
                                                            status: messageConstants.common.status_failure,
                                                            message: pdfDownloadableUrl.message ? pdfDownloadableUrl.message : messageConstants.common.could_not_generate_pdf,
                                                            pdfUrl: ""
                                                        })
                                                    }
                                                }
                                                else {
                                                    return resolve({
                                                        status: messageConstants.common.status_failure,
                                                        message: uploadFileResponse.message ? uploadFileResponse.message : messageConstants.common.could_not_generate_pdf,
                                                        pdfUrl: ""
                                                    })
                                                }
                                            
                                        }
                                    });
                                }
                            }).catch(err => {
                                resolve(err);
                            })
                        }
                    })
                })
        }
        catch (err) {
            resolve(err);
        }
    })
}


//PDF generation for instance criteria report
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
                                                               
                                                                if (uploadFileResponse.success) {
                                                                    let pdfDownloadableUrl = await getDownloadableUrl(uploadFileResponse.data);
                                                                   
                                                                    if (pdfDownloadableUrl.success && pdfDownloadableUrl.data.result && Object.keys(pdfDownloadableUrl.data.result).length > 0) {
                                                                        
                                                                        fs.readdir(imgPath, (err, files) => {
                                                                            if (err) throw err;
                                                                            
                                                                            let i = 0;
                                                                            for (const file of files) {

                                                                                fs.unlink(path.join(imgPath, file), err => {
                                                                                    if (err) throw err;
                                                                                });

                                                                                if (i == files.length) {
                                                                                    fs.unlink('../../' + currentTempFolder, err => {
                                                                                        if (err) throw err;

                                                                                    });
                                                                                    console.log("path.dirname(filename).split(path.sep).pop()", path.dirname(file).split(path.sep).pop());
                                                                                   
                                                                                }

                                                                                i = i + 1;

                                                                            }
                                                                        });
                                                                        rimraf(imgPath,function () { console.log("done")});

                                                                        return resolve({
                                                                            status: messageConstants.common.status_success,
                                                                            message: messageConstants.common.pdf_report_generated,
                                                                            pdfUrl: pdfDownloadableUrl.data.result.url
                                                                        });
                                                                    }
                                                                    else {
                                                                        return resolve({
                                                                            status: messageConstants.common.status_failure,
                                                                            message: pdfDownloadableUrl.message ? pdfDownloadableUrl.message : messageConstants.common.could_not_generate_pdf,
                                                                            pdfUrl: ""
                                                                        })
                                                                    }
                                                                }
                                                                else {
                                                                    return resolve({
                                                                        status: messageConstants.common.status_failure,
                                                                        message: uploadFileResponse.message ? uploadFileResponse.message : messageConstants.common.could_not_generate_pdf,
                                                                        pdfUrl: ""
                                                                    })
                                                                }
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


// PDF generation function for entity report
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
                                                               
                                                                if (uploadFileResponse.success) {
                                                                    let pdfDownloadableUrl = await getDownloadableUrl(uploadFileResponse.data);
                                                                   
                                                                    if (pdfDownloadableUrl.success && pdfDownloadableUrl.data.result && Object.keys(pdfDownloadableUrl.data.result).length > 0) {
                                                                        
                                                                        fs.readdir(imgPath, (err, files) => {
                                                                            if (err) throw err;
                                                                            
                                                                            let i = 0;
                                                                            for (const file of files) {

                                                                                fs.unlink(path.join(imgPath, file), err => {
                                                                                    if (err) throw err;
                                                                                });

                                                                                if (i == files.length) {
                                                                                    fs.unlink('../../' + currentTempFolder, err => {
                                                                                        if (err) throw err;

                                                                                    });
                                                                                    console.log("path.dirname(filename).split(path.sep).pop()", path.dirname(file).split(path.sep).pop());
                                                                                   
                                                                                }

                                                                                i = i + 1;

                                                                            }
                                                                        });
                                                                        rimraf(imgPath,function () { console.log("done")});

                                                                        return resolve({
                                                                            status: messageConstants.common.status_success,
                                                                            message: messageConstants.common.pdf_report_generated,
                                                                            pdfUrl: pdfDownloadableUrl.data.result.url
                                                                        });
                                                                    }
                                                                    else {
                                                                        return resolve({
                                                                            status: messageConstants.common.status_failure,
                                                                            message: pdfDownloadableUrl.message ? pdfDownloadableUrl.message : messageConstants.common.could_not_generate_pdf,
                                                                            pdfUrl: ""
                                                                        })
                                                                    }
                                                                }
                                                                else {
                                                                    return resolve({
                                                                        status: messageConstants.common.status_failure,
                                                                        message: uploadFileResponse.message ? uploadFileResponse.message : messageConstants.common.could_not_generate_pdf,
                                                                        pdfUrl: ""
                                                                    })
                                                                }
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

//PDF generation for instance observation score report
exports.instanceScoreCriteriaPdfGeneration = async function (observationResp, obj) {

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
            
            let chartDataArray = [];

            observationResp.response = observationResp.response ? observationResp.response : observationResp.reportSections;

            await Promise.all(observationResp.response.map(async questionData => {
    
                await Promise.all(questionData.questionArray.map(async singleQuestion => {
    
                    chartDataArray.push(singleQuestion);
                }));
            }));

            let chartObj = await getChartObject(chartDataArray);

            let formData = await createChart(chartObj, imgPath);

            let params = {
                observationName: observationResp.observationName ? observationResp.observationName : observationResp.solutionName
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


                            obj.response = observationResp.response;
                            obj.highChartData = formData;

                            ejs.renderFile(__dirname + '/../views/scoreCriteriaTemplate.ejs', {
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
                                                               
                                                                if (uploadFileResponse.success) {
                                                                    let pdfDownloadableUrl = await getDownloadableUrl(uploadFileResponse.data);
                                                                   
                                                                    if (pdfDownloadableUrl.success && pdfDownloadableUrl.data.result && Object.keys(pdfDownloadableUrl.data.result).length > 0) {
                                                                        
                                                                        fs.readdir(imgPath, (err, files) => {
                                                                            if (err) throw err;
                                                                            
                                                                            let i = 0;
                                                                            for (const file of files) {

                                                                                fs.unlink(path.join(imgPath, file), err => {
                                                                                    if (err) throw err;
                                                                                });

                                                                                if (i == files.length) {
                                                                                    fs.unlink('../../' + currentTempFolder, err => {
                                                                                        if (err) throw err;

                                                                                    });
                                                                                    console.log("path.dirname(filename).split(path.sep).pop()", path.dirname(file).split(path.sep).pop());
                                                                                   
                                                                                }

                                                                                i = i + 1;

                                                                            }
                                                                        });
                                                                        rimraf(imgPath,function () { console.log("done")});

                                                                        return resolve({
                                                                            status: messageConstants.common.status_success,
                                                                            message: messageConstants.common.pdf_report_generated,
                                                                            pdfUrl: pdfDownloadableUrl.data.result.url
                                                                        });
                                                                    }
                                                                    else {
                                                                        return resolve({
                                                                            status: messageConstants.common.status_failure,
                                                                            message: pdfDownloadableUrl.message ? pdfDownloadableUrl.message : messageConstants.common.could_not_generate_pdf,
                                                                            pdfUrl: ""
                                                                        })
                                                                    }
                                                                }
                                                                else {
                                                                    return resolve({
                                                                        status: messageConstants.common.status_failure,
                                                                        message: uploadFileResponse.message ? uploadFileResponse.message : messageConstants.common.could_not_generate_pdf,
                                                                        pdfUrl: ""
                                                                    })
                                                                }
                                                            }
                                                        
                                                    }); 
                                                }
                                            }).catch(function (err) {
                                                console.log("error in converting HtmlToPdf", err);
                                                resolve(err);
                                                throw err;
                                            });

                                        }

                                    });

                                }).catch(function (errEjsRender) {
                                    console.log("errEjsRender : ", errEjsRender);

                                    reject(errEjsRender);
                                });
                        }
                    });
                });
        }
        catch (err) {
          return reject(err);
        }
    })

}


// gantt chart for unnati pdf report
async function ganttChartObject(projects) {

    return new Promise(async function (resolve, reject) {
        
        let arrayOfChartData = [];
        let projectData = [];
        let i = 1;

        await Promise.all(projects.map(async eachProject => {
             
            let data = [];
            let labels = [];
            let leastStartDate = "";

            await Promise.all(eachProject.tasks.map(eachTask => {
                if(eachTask.startDate) {
                  leastStartDate = eachTask.startDate;
                }
                labels.push(eachTask.title);
                data.push({
                    task: eachTask.title,
                    startDate:eachTask.startDate,
                    endDate: eachTask.endDate
                })
            }))

            if (data.length > 0) {
                data.forEach(v => {
                leastStartDate = new Date(v.startDate) < new Date(leastStartDate) ? v.startDate : leastStartDate;
                })
            }

            let chartOptions = {
                order: 1,
                options: {
                    type: 'horizontalBar',
                    data: {
                        labels: labels, 
                        datasets: [
                        {
                        data: data.map((t) => {
                          if (leastStartDate && t.startDate) {
                          return dateDiffInDays(new Date(leastStartDate), new Date(t.startDate));
                          }
                        }),
                        datalabels: {
                          color: '#025ced',
                        //   formatter: function (value, context) {
                        //     return '';
                        //   },
                        },
                        backgroundColor: 'rgba(63,103,126,0)',
                        hoverBackgroundColor: 'rgba(50,90,100,0)',
                      },
                      {
                        data: data.map((t) => {
                            if (t.startDate && t.endDate) {
                              return dateDiffInDays(new Date(t.startDate), new Date(t.endDate));
                            }
                        }),
                        datalabels: {
                          color: '#025ced',
                        //   formatter: function (value, context) {
                        //     return '';
                        //   },
                        },
                      },
                    ]
                    },
                    options : {
                     maintainAspectRatio: false,
                     title: {
                        display: true,
                        text: eachProject.title
                       },
                    legend: { display: false },
                    scales: {
                    xAxes: [
                        {
                          stacked: true,
                          ticks: {
                            callback: function (value, index, values) {
                              if (leastStartDate) {
                              const date = new Date(leastStartDate);
                              date.setDate(value);
                              return getDate(date);
                              }
                            },
                          },
                        },
                    ],
                      yAxes: [
                        {
                          stacked: true,
                        },
                      ],
                    }
                    }
                }
            }
            
            arrayOfChartData.push(chartOptions);
            eachProject.order = i;
            projectData.push(eachProject);
            i++;
        
        }))

        resolve([arrayOfChartData, projectData]);
    })
}

function getDate(date) {
    return (
      date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).substr(-2) + '-' + ('0' + date.getDate()).substr(-2)
    );
}

function dateDiffInDays(a, b) {
    const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
    return Math.floor((utc2 - utc1) / (1000 * 60 * 60 * 24));
}

//Unnati redesign entity report pdf generation function
exports.unnatiEntityReportPdfGeneration = async function (entityReportData) {

    return new Promise(async function (resolve, reject) {

        let currentTempFolder = 'tmp/' + uuidv4() + "--" + Math.floor(Math.random() * (10000 - 10 + 1) + 10)

        let imgPath = __dirname + '/../' + currentTempFolder;

        if (!fs.existsSync(imgPath)) {
            fs.mkdirSync(imgPath);
        }

        let bootstrapStream = await copyBootStrapFile(__dirname + '/../public/css/bootstrap.min.css', imgPath + '/style.css');

        try {
            let formData = [];

            //copy images from public folder
            let imgSourcePaths = ['/../public/images/note1.svg', '/../public/images/note2.svg', '/../public/images/note3.svg', '/../public/images/note4.svg']

            for (let i = 0; i < imgSourcePaths.length; i++) {

                let imgName = "note" + (i + 1) + ".svg";
                let src = __dirname + imgSourcePaths[i];
                fs.copyFileSync(src, imgPath + ('/' + imgName));

                formData.push({
                    value: fs.createReadStream(imgPath + ('/' + imgName)),
                    options: {
                        filename: imgName,
                    }
                })
                
            }

            //get the chart object
            let chartData = await getEntityReportChartObjects(entityReportData);

            //generate the chart using highchart server
            let entityReportCharts = await createChart(chartData, imgPath);

            formData.push(...entityReportCharts);

            let ejsInputData = {
                chartData: entityReportCharts,
                response: entityReportData
            }

            ejs.renderFile(__dirname + '/../views/unnatiEntityReport.ejs', {
                data: ejsInputData
            })
                .then(function (dataEjsRender) {

                    let dir = imgPath;
                    if (!fs.existsSync(dir)) {
                        fs.mkdirSync(dir);
                    }

                    fs.writeFile(dir + '/index.html', dataEjsRender, function (errWriteFile, dataWriteFile) {
                        if (errWriteFile) {
                            throw errWriteFile;
                        } else {

                            let optionsHtmlToPdf = gen.utils.getGotenbergConnection();
                            optionsHtmlToPdf.formData = {
                                files: []
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
                                               
                                                if (uploadFileResponse.success) {
                                                    let pdfDownloadableUrl = await getDownloadableUrl(uploadFileResponse.data);
                                                   
                                                    if (pdfDownloadableUrl.success && pdfDownloadableUrl.data.result && Object.keys(pdfDownloadableUrl.data.result).length > 0) {
                                                        
                                                        fs.readdir(imgPath, (err, files) => {
                                                            if (err) throw err;
                                                            
                                                            let i = 0;
                                                            for (const file of files) {

                                                                fs.unlink(path.join(imgPath, file), err => {
                                                                    if (err) throw err;
                                                                });

                                                                if (i == files.length) {
                                                                    fs.unlink('../../' + currentTempFolder, err => {
                                                                        if (err) throw err;

                                                                    });
                                                                    console.log("path.dirname(filename).split(path.sep).pop()", path.dirname(file).split(path.sep).pop());
                                                                   
                                                                }

                                                                i = i + 1;

                                                            }
                                                        });
                                                        rimraf(imgPath,function () { console.log("done")});

                                                        return resolve({
                                                            status: messageConstants.common.status_success,
                                                            message: messageConstants.common.pdf_report_generated,
                                                            pdfUrl: pdfDownloadableUrl.data.result.url
                                                        });
                                                    }
                                                    else {
                                                        return resolve({
                                                            status: messageConstants.common.status_failure,
                                                            message: pdfDownloadableUrl.message ? pdfDownloadableUrl.message : messageConstants.common.could_not_generate_pdf,
                                                            pdfUrl: ""
                                                        })
                                                    }
                                                }
                                                else {
                                                    return resolve({
                                                        status: messageConstants.common.status_failure,
                                                        message: uploadFileResponse.message ? uploadFileResponse.message : messageConstants.common.could_not_generate_pdf,
                                                        pdfUrl: ""
                                                    })
                                                }
                                            }
                                        
                                    });
                                }

                            }).catch(err => {
                                resolve(err);
                            })
                        }
                    })
                })
        }
        catch (err) {
          return reject(err);
        }
    })
}

async function getEntityReportChartObjects(data) {

    return new Promise(async function (resolve, reject) {

        let chartData = [];

        let getChartObjects = [
            getTaskOverviewChart(data.tasks),
            getCategoryWiseChart(data.categories)
        ];

        await Promise.all(getChartObjects)
            .then(function (response) {
                chartData.push(response[0]);
                chartData.push(response[1]);
            });

        return resolve(chartData)


    })
}

async function getTaskOverviewChart(tasks) {
    return new Promise(async function (resolve, reject) {


        let total = tasks['Total'];
        delete tasks['Total'];

        let labels = [];
        let data = [];
        let backgroundColor = [];

        if (tasks["Completed"]) {
            labels.push("Completed");
            data.push(((tasks["Completed"] / total) * 100).toFixed(1));
            backgroundColor.push("#295e28");
            delete tasks["Completed"];
        }

        if (tasks["Not Started"]) {
            labels.push("Not Started");
            data.push(((tasks["Not Started"] / total) * 100).toFixed(1));
            backgroundColor.push("#db0b0b");
            delete tasks["Not Started"];
        }

        Object.keys(tasks).forEach(eachTask => {
            let percetage = ((tasks[eachTask] / total) * 100).toFixed(1);
            labels.push(eachTask);
            data.push(percetage);
        })
        
        backgroundColor = [...backgroundColor, ...['rgb(255, 99, 132)','rgb(54, 162, 235)','rgb(255, 206, 86)','rgb(231, 233, 237)','rgb(75, 192, 192)','rgb(151, 187, 205)','rgb(220, 220, 220)','rgb(247, 70, 74)','rgb(70, 191, 189)','rgb(253, 180, 92)','rgb(148, 159, 177)','rgb(77, 83, 96)','rgb(95, 101, 217)','rgb(170, 95, 217)','rgb(140, 48, 57)','rgb(209, 6, 40)','rgb(68, 128, 51)','rgb(125, 128, 51)','rgb(128, 84, 51)','rgb(179, 139, 11)']];
      
        let chartOptions = {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: backgroundColor,
                }]
            },
            options: {
                cutoutPercentage: 80,
                legend: {
                    position: "bottom",
                    labels: {
                        padding: 30,
                    }
                },
                layout: {
                    padding: {
                      top: 25
                    },
                },
                plugins: {
                    datalabels: {
                        anchor: 'end',
                        align: 'end',
                        font: {
                            size: 18,
                        },
                        formatter: (value) => {
                          return value + '%';
                        }
                    }
                }
            },
        };

        let chartObject = {
            order: 1,
            options: chartOptions
        };

        resolve(chartObject);
    })
}

async function getCategoryWiseChart(categories) {
    return new Promise(async function (resolve, reject) {

        let total = categories['Total'];
        delete categories['Total'];
        let labels = [];
        let data = [];

        Object.keys(categories).forEach(eachCategory => {
            let percetage = ((categories[eachCategory] / total) * 100).toFixed(1);
            labels.push(eachCategory);
            data.push(percetage);
        });

        let chartOptions = {
            type: 'doughnut',
            data: {
              labels: labels,
              datasets: [{
                data: data,
                backgroundColor: ['rgb(255, 99, 132)','rgb(54, 162, 235)','rgb(255, 206, 86)','rgb(231, 233, 237)','rgb(75, 192, 192)','rgb(151, 187, 205)','rgb(220, 220, 220)','rgb(247, 70, 74)','rgb(70, 191, 189)','rgb(253, 180, 92)','rgb(148, 159, 177)','rgb(77, 83, 96)','rgb(95, 101, 217)','rgb(170, 95, 217)','rgb(140, 48, 57)','rgb(209, 6, 40)','rgb(68, 128, 51)','rgb(125, 128, 51)','rgb(128, 84, 51)','rgb(179, 139, 11)']
              }]
            },
            options: {
                legend: {
                   position: "bottom",
                   labels: {
                    padding: 30,
                }
                },
                layout: {
                    padding: {
                      top: 15,
                      bottom: 25
                    },
                },
                plugins: {
                    datalabels: {
                        anchor: 'end',
                        align: 'end',
                        font: {
                            size: 18,
                        },
                        formatter: (value) => {
                          return value + '%';
                        }
                    }
                }
            }
        };

        let chartObject = {
            order: 2,
            options: chartOptions
        };
        resolve(chartObject);
    })
}


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

//Prepare chartData for chartjs
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

// Chart creation using chartjs
const createChart = async function (chartData, imgPath) {

    return new Promise(async function (resolve, reject) {

        try {
            
            let formData = [];

            await Promise.all(chartData.map(async data => {
                let chartImage = "chartPngImage_" + uuidv4() + "_.png";

                let imgFilePath = imgPath + "/" + chartImage;
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

const uploadPdfToCloud = async function(fileName, folderPath) {

    return new Promise( async function( resolve, reject) {
     
     try {
 
        let getSignedUrl = await filesHelpers.preSignedUrls(
            [fileName],
            bucketName,
            cloudStorage,
            folderPath,
            parseInt(process.env.PRESIGNED_URL_EXPIRY_IN_SECONDS), //expireIn PARAMS
            '' //permission PARAMS
        )
         

        require('fs').writeFileSync('getSignedUrl.json',JSON.stringify(getSignedUrl))
        console.log(getSignedUrl,'getSignedUrl')


        //  let getSignedUrl = await kendraHelper.getPreSignedUrl
        //  (
        //      fileName
        //  );
        
         if (getSignedUrl.result && Object.keys(getSignedUrl.result).length > 0) {
             
             let fileUploadUrl = getSignedUrl.result[0].url;
             let fileData = fs.readFileSync(folderPath + "/" + fileName);
             console.log(folderPath + "/" + fileName,'filename')
             console.log(fileData,'fileData')
             try { 
               let res =  await request({
                   url: fileUploadUrl,
                   method: 'put',
                   headers: {
                       "x-ms-blob-type" : process.env.CLOUD_STORAGE_PROVIDER == messageConstants.common.azure ? "BlockBlob" : null,
                       "Content-Type": "multipart/form-data"
                     },
                   body: fileData
                 })


                 var options = {
                    'method': 'PUT',
                    'url': fileUploadUrl,
                    'headers': {
                      'Content-Type': 'multipart/form-data'
                    },
                    body:fileData
                  
                  };
                  await request(options, function (error, response) {
                    if (error) throw new Error(error);
                    console.log(response,'response')
                    console.log(response.body);
                  })

                 require('fs').writeFileSync('response.json',JSON.stringify(res));

                 if (res.statusCode >= 200 && res.statusCode < 300) {
                    console.log('File uploaded successfully');
                  } else {
                    console.error(`File upload failed with status code: ${res.statusCode}`);
                  }

                 return resolve({
                     success: true,
                     data: getSignedUrl.result[0].payload.sourcePath
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
 
const getDownloadableUrl = async function (filePath) {
 
     return new Promise(async function (resolve, reject) {
 
         try {
 
            let downloadableUrl = await filesHelpers.getDownloadableUrl(
                [filePath],
                bucketName,
                cloudStorage,
                parseInt(process.env.DOWNLOADABLE_URL_EXPIRY_IN_SECONDS)
            )

            console.log(downloadableUrl,'downloadableUrl')

             let response = await kendraHelper.getDownloadableUrl
             (
                 filePath
             );
            
             return resolve({
                 success: true,
                 data: response
             });
         }
         catch (err) {
             return resolve({
                 success: false,
                 message: err.message
             })
         }
 
     })
}

//create pdf report for Questions Response
exports.questionResponseReportPdf = async function ( dataObj ) {
    return new Promise(async function (resolve, reject) {
        try {

            let solutionName = dataObj.filterData.solutionName;
            solutionName = solutionName.replace(/[^a-zA-Z0-9 ]/g, "")
            solutionName = solutionName.replace(/ /g,"");   //remove space from solution name
            var optionFormData = [];

            let currentTempFolder = 'tmp/' + uuidv4() + "--" + Math.floor(Math.random() * (10000 - 10 + 1) + 10)
            let imgPath = __dirname + '/../' + currentTempFolder;
            if (!fs.existsSync(imgPath)) {
                fs.mkdirSync(imgPath);
            }
            
            await copyBootStrapFile(__dirname + '/../public/css/bootstrap.min.css', imgPath + '/style.css');
    
            // let headerFile = await copyBootStrapFile(__dirname + '/../views/header.html', imgPath + '/header.html');
            await copyBootStrapFile(__dirname + '/../views/footer.html', imgPath + '/footer.html');
            
            await Promise.all(dataObj.responseData.map(async domainElement => {
                
                    await Promise.all(domainElement.criterias.map(async criteriaElement => {
                        
                        await Promise.all(criteriaElement.questionData.map(async questionDataElement => {
                            const options = await createChartOption(questionDataElement);
                            const questionResponseChart = await createChart(options.chartOptions, imgPath);
                            questionDataElement.formData = {
                                filename : questionResponseChart[0].options.filename
                            };
                            optionFormData.push(questionResponseChart[0]);
                            questionDataElement.legendData = options.legendArray
                        }))
                        
                    }))
            }))
            //ecm based sorting
            await Promise.all(dataObj.responseData.map(async domainElement => {
                await Promise.all(domainElement.criterias.map(async criteriaElement => {
                    if( criteriaElement.questionData && criteriaElement.questionData.length > 0 ) {
                        let myArray = criteriaElement.questionData;
                        myArray.sort((a, b) => a.questionSequenceByEcm - b.questionSequenceByEcm)
                        criteriaElement.questionData = myArray;
                    }   
                }))
            }))
    
            ejs.renderFile(__dirname + '/../views/questionResponseReportTemplate.ejs', {
                data: dataObj
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
                                optionFormData.push({
                                    value: fs.createReadStream(dir + '/index.html'),
                                    options: {
                                        filename: 'index.html'
                                    }
                                    
                                });
                                optionFormData.push({
                                    value: fs.createReadStream(dir + '/style.css'),
                                    options: {
                                        filename: 'style.css'
                                    }
                                });
                                optionsHtmlToPdf.formData.files = optionFormData;
                                optionsHtmlToPdf.formData.paperHeight = 4.6;
                                optionsHtmlToPdf.formData.emulatedMediaType = "screen";
                                optionsHtmlToPdf.formData.marginRight = 0;
                                optionsHtmlToPdf.formData.marginLeft = 0;
                                optionsHtmlToPdf.formData.marginTop = 0.2;
                                optionsHtmlToPdf.formData.marginBottom = 0;
        
                                rp(optionsHtmlToPdf)
                                    .then(function (responseHtmlToPdf) {
    
                                        let pdfBuffer = Buffer.from(responseHtmlToPdf.body);
                                        
                                        if (responseHtmlToPdf.statusCode == 200) {
                                           
                                            let pdfFile = solutionName + '-' + uuidv4() + ".pdf";
                                            fs.writeFile( dir + '/' + pdfFile, pdfBuffer, 'binary', async function (err) {
                                                if (err) {
                                                    
                                                    return console.log(err);
                                                }
                                                else {
                                                    let uploadFileResponse = await uploadPdfToCloud(pdfFile, dir);

                                                    if (uploadFileResponse.success) {
                                                        let pdfDownloadableUrl = await getDownloadableUrl(uploadFileResponse.data);

                                                        if (pdfDownloadableUrl.success && pdfDownloadableUrl.data.result && Object.keys(pdfDownloadableUrl.data.result).length > 0) {

                                                            fs.readdir(imgPath, (err, files) => {
                                                                if (err) throw err;

                                                                let i = 0;
                                                                for (const file of files) {

                                                                    fs.unlink(path.join(imgPath, file), err => {
                                                                        if (err) throw err;
                                                                    });

                                                                    if (i == files.length) {
                                                                        fs.unlink('../../' + currentTempFolder, err => {
                                                                            if (err) throw err;

                                                                        });
                                                                        console.log("path.dirname(filename).split(path.sep).pop()", path.dirname(file).split(path.sep).pop());

                                                                    }

                                                                    i = i + 1;

                                                                }
                                                            });
                                                            rimraf(imgPath, function () { console.log("done"); });

                                                            return resolve({
                                                                status: messageConstants.common.status_success,
                                                                message: messageConstants.common.pdf_report_generated,
                                                                pdfUrl: pdfDownloadableUrl.data.result.url
                                                            });
                                                        }
                                                        else {
                                                            
                                                            return resolve({
                                                                status: messageConstants.common.status_failure,
                                                                message: pdfDownloadableUrl.message ? pdfDownloadableUrl.message : messageConstants.common.could_not_generate_pdf,
                                                                pdfUrl: ""
                                                            })
                                                        }
                                                    }
                                                    else {
                                                        return resolve({
                                                            status: messageConstants.common.status_failure,
                                                            message: uploadFileResponse.message ? uploadFileResponse.message : messageConstants.common.could_not_generate_pdf,
                                                            pdfUrl: ""
                                                        })
                                                    }
                                                }
                                            });
                                        }
    
                                    }).catch(err => {
                                       throw err;
                                    })
    
                            
                        }
                    });
                })
                .catch(function (errEjsRender) {
                    throw errEjsRender
                });
    
        } catch ( err ) {
            return resolve(err)
        }
    });
    
}

//add options to each question data - for question response report
const createChartOption = async function(questionData) {
    try {
        let optionsData;
        var xValues = [];
        var yValues = [];
        let legendData = [];
        //create data arrays to plot graph
        if ( questionData.answerData.length > 0 ) {
            await Promise.all(questionData.answerData.map( answerElement => {
                xValues.push(answerElement[0]);
                yValues.push(answerElement[1])    
            }))
        }
        let totalSubmissions = yValues.reduce((a, b) => a + b, 0)
        
        for ( let i = 0; i < yValues.length; i++ ) {
            let newValue = (yValues[i] / totalSubmissions) * 100;
            let num = Math.round( ( newValue + Number.EPSILON ) * 100 ) / 100;
            yValues[i] = num;
        }

        if( questionData.questionResponseType == "radio" || questionData.questionResponseType == "slider" ) {

            let yValuesNew = [];
            for ( let i = 0; i < yValues.length; i++ ) {
                yValuesNew[i] = yValues[i]+'%';
            }
            legendData = xValues
            
            optionsData = [{
                options : {
                    type: "pie",
                    data: {
                        labels: yValuesNew,
                        datasets: [{
                        backgroundColor: ['#FD7F6F', '#7EB0D5', '#B2E061', '#BD7EBE', '#FFB55A', '#FFEE65', '#BEB9DB', '#FDCCE5', '#8BD3C7','#A4A2A8'],
                        data: yValues
                        }]
                    },
                    options: {
                        plugins: {
                            datalabels: {
                              display: false
                            }
                        },
                        legend: {
                            display: true,
                            position: 'bottom',
                            labels: {
                                "fontSize": 14,
                            }
                            
                        },
                    }
                    
                }
            }];
            
        } else {
            let xValuesNew = [];
            for ( let i = 0; i < xValues.length; i++ ) {
                xValuesNew[i] = 'R'+(i+1);
                legendData[i] = 'R'+(i+1)+' - '+xValues[i];

            }
            
            //bar chart options
            optionsData = [{
                options : {
                    type: 'bar',
                    data: {
                        labels: xValuesNew,
                        datasets: [
                            {
                                data: yValues,
                                backgroundColor: 'rgb(84, 113, 243)',
                                barPercentage: 0.5
                            }
                    
                        ]
                    },
                    options: {
                        //display of legend
                        legend: {
                            display: false
                        },
                        plugins: {
                            //not display data on bar
                            datalabels: {
                              display: false
                            }
                        },
                        scales: {
                            yAxes: [{
                                ticks: {
                                    beginAtZero:true
                                },
                                scaleLabel: {
                                    display: true,
                                    fontSize: 20,
                                    labelString:  'Percentage times options chosen'
                                },
                            }],
                            xAxes: [{
                                scaleLabel: {
                                    display: true,
                                    fontSize: 18,
                                    labelString:  'Options'
                                },
                                
                            }]
                        },
                    }
                    
                }
            }];
        }
        questionData.percentageData = yValues;
        return {
            chartOptions :optionsData,
            legendArray : legendData
        };
    } catch (error) {
        throw error;
    }
} 

//core service stats report generation
exports.coreStatsReportGeneration = async function (overview) {

    return new Promise(async function (resolve, reject) {
        let currentTempFolder = 'tmp/' + uuidv4() + "--" + Math.floor(Math.random() * (10000 - 10 + 1) + 10)

        let imgPath = __dirname + '/../' + currentTempFolder;

        if (!fs.existsSync(imgPath)) {
            fs.mkdirSync(imgPath);
        }

        try {

            const options = await createPieChartOptions(overview);           
            const userOverViewResponseChart = await createChart(options.chartOptions, imgPath);
            let FormData = [];
            FormData.push(...userOverViewResponseChart);
            ejs.renderFile(__dirname + '/../views/coreStatsReport.ejs', {
                data: userOverViewResponseChart
            })
                .then(function (dataEjsRender) {

                    let dir = imgPath;
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

                            optionsHtmlToPdf.formData.files = FormData;
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
                                                if (uploadFileResponse.success) {
                                                    let pdfDownloadableUrl = await getDownloadableUrl(uploadFileResponse.data);
                                                    if (pdfDownloadableUrl.success && pdfDownloadableUrl.data.result && Object.keys(pdfDownloadableUrl.data.result).length > 0) {
                                                        
                                                        fs.readdir(imgPath, (err, files) => {
                                                            if (err) throw err;
                                                            
                                                            let i = 0;
                                                            for (const file of files) {

                                                                fs.unlink(path.join(imgPath, file), err => {
                                                                    if (err) throw err;
                                                                });

                                                                if (i == files.length) {
                                                                    fs.unlink('../../' + currentTempFolder, err => {
                                                                        if (err) throw err;

                                                                    });                                                                   
                                                                }

                                                                i = i + 1;

                                                            }
                                                        });
                                                        rimraf(imgPath,function () { console.log("done")});

                                                        return resolve({
                                                            status: messageConstants.common.status_success,
                                                            message: messageConstants.common.pdf_report_generated,
                                                            pdfUrl: pdfDownloadableUrl.data.result.url
                                                        });
                                                    }
                                                    else {
                                                        return resolve({
                                                            status: messageConstants.common.status_failure,
                                                            message: pdfDownloadableUrl.message ? pdfDownloadableUrl.message : messageConstants.common.could_not_generate_pdf,
                                                            pdfUrl: ""
                                                        })
                                                    }
                                                }
                                                else {
                                                    return resolve({
                                                        status: messageConstants.common.status_failure,
                                                        message: uploadFileResponse.message ? uploadFileResponse.message : messageConstants.common.could_not_generate_pdf,
                                                        pdfUrl: ""
                                                    })
                                                }
                                            }
                                        
                                    });
                                }

                            }).catch(err => {
                                console.log(err);
                                reject(err);
                            })
                        }
                    })
                })
        }
        catch (err) {
          return reject(err);
        }
    })
}


const createPieChartOptions =async function(chartOptions){

    try{

        let chartDataArray = [];
        let labelArray = [];

        await Promise.all(Object.entries(chartOptions).map(([key, value] )=> {
            labelArray.push(key);
            chartDataArray.push(value)
        }))
        let chart = [{
            options : {

            type: "pie",
            data: {
                labels: labelArray,
                datasets: [{
                    backgroundColor: ['#FFA971', '#F6DB6C', '#98CBED', '#C9A0DA'],
                    data: chartDataArray
                }]
            },
        
            options: {
                plugins: {
                    datalabels: {
                      display: false
                    }
                },
                legend: {
                    display: true,
                    position: 'bottom',
                    labels: {
                        "fontSize": 14,
                    }
                    
                },
            }
        }
        }]
       return{chartOptions :chart} 
    }catch (error) {
        throw error;
    }

}