/**
 * name : v1.js
 * author : Deepa
 * created-date : 09-Sep-2020
 * Description : Survey solution validation.
 */

module.exports = (req) => {

    let templateValidator = {

        details : function () {
            req.checkParams('_id')
            .exists()
            .withMessage("required survey template solution id")
            .isMongoId()
            .withMessage("Invalid survey solution id");
        }
    }

    if (templateValidator[req.params.method]) {
        templateValidator[req.params.method]();
    }

};