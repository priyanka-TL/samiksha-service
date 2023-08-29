module.exports = (req) => {
  let assessmentValidator = {
    details: function () {
      req.checkParams('_id').exists().withMessage('required Program id');
      req.checkQuery('solutionId').exists().withMessage('required solution id');
      req.checkQuery('entityId').exists().withMessage('required entity id');
    },
    metaForm: function () {
      req
        .checkParams('_id')
        .exists()
        .withMessage('required assessment solution id')
        .isMongoId()
        .withMessage('Invalid assessment solution id');
    },
    create: function () {
      req
        .checkQuery('solutionId')
        .exists()
        .withMessage('required assessment solution id')
        .isMongoId()
        .withMessage('Invalid assessment solution id');

      req.checkBody('name').exists().withMessage('required name of the solution');
      req.checkBody('description').exists().withMessage('required description of the solution');
      req
        .checkBody('program')
        .exists()
        .withMessage('required program for assessment')
        .custom((programData) => programValidation(programData))
        .withMessage('Required id and name in program');
    },
  };

  if (assessmentValidator[req.params.method]) {
    assessmentValidator[req.params.method]();
  }

  function programValidation(programData) {
    if ('_id' in programData && 'name' in programData) {
      return true;
    } else {
      return false;
    }
  }
};
