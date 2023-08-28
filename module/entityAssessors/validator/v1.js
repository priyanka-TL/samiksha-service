module.exports = (req) => {

    let entityAssessorValidator = {

        entities: function () {
            req.checkQuery('type').exists().withMessage("required type")
            req.checkQuery('subType').exists().withMessage("required subType")
        },
        
        uploadForPortal: function () {
            req.checkQuery('programId').exists().withMessage("required programId")
            req.checkQuery('solutionId').exists().withMessage("required solutionId")
        },
        completedAssessments : function () {
            req.checkQuery('fromDate').exists().withMessage("required from date");
        },
        bulkCreateByUserRoleAndEntity : function () {
            req.checkBody('programId').exists().withMessage("required programId");
            req.checkBody('solutionId').exists().withMessage("required solutionId");
            req.checkBody('assessorRole').exists().withMessage("required assessorRole");
            req.checkBody('entityId').exists().withMessage("required entityId")
            .isMongoId().withMessage("Invalid entity id");
            req.checkBody('role').exists().withMessage("required role");
        },
        create : function () {
            req.checkParams("_id").exists().withMessage("Required program id");
            req.checkQuery("solutionId").exists().withMessage("Required solution id");
        }
    }

    if (entityAssessorValidator[req.params.method]) entityAssessorValidator[req.params.method]();

};