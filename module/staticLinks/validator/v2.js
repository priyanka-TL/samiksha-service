module.exports = (req) => {

    let entityValidator = {

        list: function () {
            req.checkHeaders('apptype').exists().withMessage("required app type")
        }


    }

    if (entityValidator[req.params.method]) entityValidator[req.params.method]();

};