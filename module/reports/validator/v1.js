module.exports = (req) => {

    let reportValidator = {

        status: function () {
            req.checkParams('_id').exists().withMessage("required solution id");
        },
        assessorEntities:function(){
            req.checkParams('_id').exists().withMessage("required solution id");
        },
        entityAssessors:function(){
            req.checkParams('_id').exists().withMessage("required solution id");
        },
        solutionEntityStatus:function(){
            req.checkParams('_id').exists().withMessage("required solution id");
        },
        solutionsSubmissionStatus:function(){
            req.checkParams('_id').exists().withMessage("required solution id");
            req.checkQuery('evidenceId').exists().withMessage("required solution id");
        },
        generateCriteriaByEntityId:function(){
            req.checkParams('_id').exists().withMessage("required solution id");
        },
        generateSubmissionReportsByEntityId:function(){
            req.checkParams('_id').exists().withMessage("required solution id");
        },
        registryDetails:function(){
            req.checkParams('_id').exists().withMessage("required solution id");
            req.checkQuery('type').exists().withMessage("required type");
            req.checkQuery('fromDate').exists().withMessage("required from date");
        },
        entityProfileInformation:function(){
            req.checkParams('_id').exists().withMessage("required solution id");
        },
        generateEcmReportByDate:function(){
            req.checkParams('_id').exists().withMessage("required solution id");
        },
        submissionFeedback:function(){
            req.checkParams('_id').exists().withMessage("required solution id");
            req.checkQuery('fromDate').exists().withMessage("required from date");
        },
        ecmSubmissionByDate:function(){
            req.checkParams('_id').exists().withMessage("required solution id");
            // req.checkQuery('fromDate').exists().withMessage("required from date");
        },
        completedParentInterviewsByDate:function(){
            req.checkParams('_id').exists().withMessage("required solution id");
            req.checkQuery('fromDate').exists().withMessage("required from date");
        },
        parentInterviewCallDidNotPickupReportByDate:function(){
            req.checkParams('_id').exists().withMessage("required solution id");
            req.checkQuery('fromDate').exists().withMessage("required from date");
        },
        
        parentInterviewCallResponseByDate:function(){
            req.checkParams('_id').exists().withMessage("required solution id");
            req.checkQuery('fromDate').exists().withMessage("required from date");
        },
        entityList:function(){
            req.checkParams('_id').exists().withMessage("required solution id");
        }
    }

    if (reportValidator[req.params.method]) reportValidator[req.params.method]();

};