module.exports = (req) => {

    let entityValidator = {

        generateFromSubmissionId: function () {
            req.checkParams('_id').exists().withMessage("Submission ID is mandatory.")
        },
        singleEntityDrillDownReport: function () {
            req.checkParams('_id').exists().withMessage("Program Id is mandatory.")
            req.checkQuery('solutionId').exists().withMessage("Solution Id is mandatory.")
            req.checkQuery('entity').exists().withMessage("Entity ID is mandatory.")
        },
        singleEntityHighLevelReport: function () {
            req.checkParams('_id').exists().withMessage("Program Id is mandatory.")
            req.checkQuery('solutionId').exists().withMessage("Solution Id is mandatory.")
            req.checkQuery('entity').exists().withMessage("Entity ID is mandatory.")
        },
        multiEntityHighLevelReport: function () {
            req.checkParams('_id').exists().withMessage("Program Id is mandatory.")
            req.checkQuery('solutionId').exists().withMessage("Solution Id is mandatory.")
            req.checkQuery('entity').exists().withMessage("Entity ID is mandatory.")
            req.checkQuery('blockName').exists().withMessage("Block Name is mandatory.")
        },
        multiEntityDrillDownReport: function () {
            req.checkParams('_id').exists().withMessage("Program Id is mandatory.")
            req.checkQuery('solutionId').exists().withMessage("Solution Id is mandatory.")
            req.checkQuery('entity').exists().withMessage("Entity ID is mandatory.")
            req.checkQuery('blockName').exists().withMessage("Block Name is mandatory.")
        }


    }

    if (entityValidator[req.params.method]) entityValidator[req.params.method]();

};