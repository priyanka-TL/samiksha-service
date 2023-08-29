module.exports = (req) => {
  let pollsValidator = {
    create: function () {
      req.checkBody(Object.keys(req.body)).isEmpty().withMessage('request body is required');
    },

    delete: function () {
      req.checkParams('_id').exists().withMessage('required poll id').isMongoId().withMessage('Invalid poll id');
    },

    getPollQuestions: function () {
      req.checkParams('_id').exists().withMessage('required poll id').isMongoId().withMessage('Invalid poll id');
    },
    getPollQuestionsByLink: function () {
      req.checkParams('_id').exists().withMessage('required link');
    },

    report: function () {
      req.checkParams('_id').exists().withMessage('required poll id').isMongoId().withMessage('Invalid poll id');
    },
  };

  if (pollsValidator[req.params.method]) pollsValidator[req.params.method]();
};
