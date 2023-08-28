module.exports = (req) => {

    let programOperationsValidator = {

        reportFilters: function () {
            req.checkParams('_id').exists().withMessage("required solution id")
        },
        userProfile: function () {
            req.checkParams('_id').exists().withMessage("required solution id")
        },
        searchEntity: function () {
            req.checkParams('_id').exists().withMessage("required solution id")
            req.checkQuery('id').exists().withMessage("required entity id")
        },
        entityReport: function () {
            req.checkParams('_id').exists().withMessage("required solution id")
            req.checkQuery('fromDate').exists().withMessage("required from date")
        },
        entitySummary: function () {
            req.checkParams('_id').exists().withMessage("required solution id")
            req.checkQuery('fromDate').exists().withMessage("required from date")
        },
        assessorReport: function () {
            req.checkParams('_id').exists().withMessage("required solution id")
            req.checkQuery('fromDate').exists().withMessage("required from date")
        }

    }

    if (programOperationsValidator[req.params.method]) programOperationsValidator[req.params.method]();

};