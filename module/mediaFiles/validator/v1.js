module.exports = (req) => {

    let mediaFilesValidator = {

        createEmoji: function () {
            req.checkBody('name').exists().withMessage("name is required");
            req.checkBody('unicode').exists().withMessage("unicode is required");
        },
        createGesture: function () {
            req.checkBody('name').exists().withMessage("name is required");
            req.checkBody('unicode').exists().withMessage("unicode is required");
        },
        getGesture: function () {
            req.checkBody('name').exists().withMessage("name is required");
        },
        getEmoji: function () {
            req.checkBody('name').exists().withMessage("name is required");
        }
    }

    if (mediaFilesValidator[req.params.method]) mediaFilesValidator[req.params.method]();
};