module.exports = (req) => {

    let entityValidator = {
        searchEntities: function () {
            let existId = "solutionId,observationId"
            if (req.query.solutionId) {
                existId = "solutionId"
            }

            if (req.query.observationId) {
                existId = 'observationId'
            }
            req.checkQuery(existId).exists().withMessage("required solution or observation Id")
        },
        assessment: function () {
            req.checkParams('_id')
            .exists()
            .withMessage("required observation id")
            .isMongoId()
            .withMessage("Invalid observation id");
            
            req.checkQuery('entityId').exists().withMessage("required entity id")
        },
        create : function() {
            req.checkQuery('solutionId')
            .exists()
            .withMessage("required solution id")
            .isMongoId().withMessage("Invalid observation solution id");

            req.checkBody('name').exists().withMessage("required observation name");
            req.checkBody('description').exists().withMessage("required observation description");
            req.checkBody('program')
            .exists()
            .withMessage("required program for observation")
            .custom(programData => 
                programValidation(programData)
            ).withMessage("Required id and name in program");
        }

    }

    if (entityValidator[req.params.method]) {
        entityValidator[req.params.method]();
    }

    function programValidation(program) {
        
        if( "_id" in program && "name" in program ) {
            return true;
        } else {
           return false;
        }
    }

};