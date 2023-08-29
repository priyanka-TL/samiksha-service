module.exports = (req) => {
  let assessmentValidator = {
    details: function () {
      req.checkParams('_id').exists().withMessage('required Program id');
      req.checkQuery('solutionId').exists().withMessage('required solution id');
      req.checkQuery('entityId').exists().withMessage('required entity id');
    },
  };

  if (assessmentValidator[req.params.method]) assessmentValidator[req.params.method]();
};
