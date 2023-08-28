/**
 * name : importController.js
 * author : Akash
 * created-date : 01-feb-2019
 * Description : importing program,solution,framework,criteria,questions
 */

/**
    * Import
    * @class
*/
module.exports = class Import {

    constructor() {
    }

    static get name() {
        return "import";
    }

    /**
    * @api {post} /assessment/api/v1/import/program Upload Program Document JSON
    * @apiVersion 1.0.0
    * @apiName Upload Program Document JSON
    * @apiGroup Import
    * @apiParam {File} program Mandatory program file of type JSON.
    * @apiUse successBody
    * @apiUse errorBody
    */

     /**
    * Import program.
    * @method
    * @name program
    * @param {Object} req - request data.
    * @param {JSON} req.files.program - program data.
    * @returns {JSON} consists of message and status. 
    */

    program(req) {
        return new Promise(async (resolve, reject) => {
            try {
                let programData = JSON.parse(req.files.program.data.toString());
                //need to implement JOI to validate json
                let queryObject = {
                    _id: ObjectId(programData._id)
                };

                let programDocument = await database.models.programs.findOne(queryObject, { _id: 1 });

                if (programDocument) {
                    return resolve({
                        status: httpStatusCode.bad_request.status,
                        message: messageConstants.apiResponses.ROGRAM_EXISTS
                    });
                }

                programDocument = await database.models.programs.create(programData);
                return resolve({
                    status: httpStatusCode.ok.status,
                    message: messageConstants.apiResponses.PROGRAM_IMPORTED
                });
            } catch (error) {
                return reject({
                    status: error.status || httpStatusCode.internal_server_error.status,
                    message: error.message || httpStatusCode.internal_server_error.message,
                    errorObject: error
                });
            }
        })
    }

    /**
    * @api {post} /assessment/api/v1/import/solution Upload Solution Document JSON
    * @apiVersion 1.0.0
    * @apiName Upload Solution Document JSON
    * @apiGroup Import
    * @apiParam {File} solution     Mandatory solution file of type JSON.
    * @apiUse successBody
    * @apiUse errorBody
    */

     /**
    * Import solution.
    * @method
    * @name solution
    * @param {Object} req - request data.
    * @param {JSON} req.files.solution - solution data.
    * @returns {JSON} consists of message and status. 
    */

    solution(req) {
        return new Promise(async (resolve, reject) => {
            try {
                let solutionData = JSON.parse(req.files.solution.data.toString());
                //need to implement JOI to validate json
                let queryObject = {
                    _id: ObjectId(solutionData._id)
                };

                let solutionDocument = await database.models.solutions.findOne(queryObject, { _id: 1 });

                if (solutionDocument) {
                    return resolve({
                        status: httpStatusCode.bad_request.status,
                        message: messageConstants.apiResponses.SOLUTION_EXISTS
                    });
                }

                solutionDocument = await database.models.solutions.create(evaluationFrameworkData);

                return resolve({
                    status: httpStatusCode.ok.status,
                    message: messageConstants.apiResponses.SOLUTION_IMPORTED
                });

            } catch (error) {
                return reject({
                    status: error.status || httpStatusCode.internal_server_error.status,
                    message: error.message || httpStatusCode.internal_server_error.message,
                    errorObject: error
                });
            }
        })
    }

    /**
    * @api {post} /assessment/api/v1/import/framework Upload Framework Document JSON
    * @apiVersion 1.0.0
    * @apiName Upload Framework Document JSON
    * @apiGroup Import
    * @apiParam {File} framework     Mandatory framework file of type JSON.
    * @apiUse successBody
    * @apiUse errorBody
    */

    /**
    * Import framework.
    * @method
    * @name framework
    * @param {Object} req - request data.
    * @param {JSON} req.files.framework - framework data.
    * @returns {JSON} consists of message and status. 
    */

    framework(req) {
        return new Promise(async (resolve, reject) => {
            try {

                let frameworkData = JSON.parse(req.files.framework.data.toString());
                //need to implement JOI to validate json
                let queryObject = {
                    _id: ObjectId(frameworkData._id)
                };

                let frameworkDocument = await database.models.frameworks.findOne(queryObject, { _id: 1 });

                if (frameworkDocument) {
                    return resolve({
                        status: httpStatusCode.bad_request.status,
                        message: messageConstants.apiResponses.FRAMEWORK_EXISTS
                    });
                }

                frameworkDocument = await database.models.frameworks.create(frameworkData);

                return resolve({
                    status: httpStatusCode.ok.status,
                    message: messageConstants.apiResponses.FRAMEWORK_INSERTED
                });

            } catch (error) {
                return reject({
                    status: error.status || httpStatusCode.internal_server_error.status,
                    message: error.message || httpStatusCode.internal_server_error.message,
                    errorObject: error
                });
            }
        })
    }

    /**
    * @api {post} /assessment/api/v1/import/criteria Upload Criteria Document JSON
    * @apiVersion 1.0.0
    * @apiName Upload Criteria Document JSON
    * @apiGroup Import
    * @apiParam {File} criteria     Mandatory criteria file of type JSON.
    * @apiUse successBody
    * @apiUse errorBody
    */

     /**
    * Import criteria.
    * @method
    * @name criteria
    * @param {Object} req - request data.
    * @param {JSON} req.files.criteria - criteria data.
    * @returns {JSON} consists of message and status. 
    */
   
    criteria(req) {
        return new Promise(async (resolve, reject) => {
            try {
                let criteriaData = JSON.parse(req.files.criteria.data.toString());
                //need to implement JOI to validate json
                await database.models.criteria.create(criteriaData);

                let responseMessage = messageConstants.apiResponses.CRITERIA_INSERTED;
                return resolve({ 
                    status: httpStatusCode.ok.status, 
                    message: responseMessage 
                });
            } catch (error) {
                return reject({
                    status: error.status || httpStatusCode.internal_server_error.status,
                    message: error.message || httpStatusCode.internal_server_error.message,
                    errorObject: error
                });
            }
        })
    }


    /**
    * @api {post} /assessment/api/v1/import/questions Upload Questions Document JSON
    * @apiVersion 1.0.0
    * @apiName Upload Questions Document JSON
    * @apiGroup Import
    * @apiParam {File} questions     Mandatory questions file of type JSON.
    * @apiUse successBody
    * @apiUse errorBody
    */

    /**
    * Import questions.
    * @method
    * @name questions
    * @param {Object} req - request data.
    * @param {JSON} req.files.questions - questions data.
    * @returns {JSON} consists of message and status. 
    */

    questions(req) {
        return new Promise(async (resolve, reject) => {
            try {
                let questionData = JSON.parse(req.files.questions.data.toString());
                //need to implement JOI to validate json
                await database.models.questions.create(questionData);

                let responseMessage = messageConstants.apiResponses.QUESTION_INSERTED;
                return resolve({ 
                    status: httpStatusCode.ok.status, 
                    message: responseMessage 
                });
            }
            catch (error) {
                return reject({
                    status: error.status || httpStatusCode.internal_server_error.status,
                    message: error.message || httpStatusCode.internal_server_error.message,
                    errorObject: error
                });
            }
        })
    }

};
