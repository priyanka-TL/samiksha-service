/**
 * name : v1.js
 * author : Aman
 * created-date : 04-Jun-2020
 * Description : Observation solution validation.
 */

module.exports = (req) => {

    let templateValidator = {

        details : function () {
            req.checkParams('_id')
            .exists()
            .withMessage("required observation template solution id")
            .isMongoId()
            .withMessage("Invalid observation solution id");
        }
    }

    if (templateValidator[req.params.method]) {
        templateValidator[req.params.method]();
    }

};