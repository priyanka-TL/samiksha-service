module.exports = (req) => {
  let solutionValidator = {
    uploadThemes: function () {
      req.checkParams('_id').exists().withMessage('required solution id');
    },
    update: function () {
      req.checkQuery('solutionExternalId').exists().withMessage('required solution externalId');
    },
    questionList: function () {
      req.checkParams('_id').exists().withMessage('required solution id');
    },
    details: function () {
      req.checkParams('_id').exists().withMessage('required solution id');
    },
    importFromSolution: function () {
      req.checkQuery('solutionId').exists().withMessage('required solution externalId');
      req.checkBody('externalId').exists().withMessage('required new solution externalId');
      req.checkBody('name').exists().withMessage('required new solution name');
      req.checkBody('description').exists().withMessage('required new solution description');
    },
    getObservationSolutionLink: function () {
      req.checkParams('_id').exists().withMessage('required observation solution id');
      req.checkQuery('appName').exists().withMessage('required app name');
    },
    addEntities: function () {
      req.checkParams('_id').exists().withMessage('Required solution id');
      req
        .checkBody('entities')
        .exists()
        .withMessage('Required entities data')
        .isArray()
        .withMessage('entities should be array')
        .notEmpty()
        .withMessage('entities cannot be empty')
        .custom((entities) => entitiesValidation(entities))
        .withMessage('invalid entity ids');
    },
    list: function () {
      // req.checkBody("solutionIds").exists().withMessage("Required solution external ids")
      // .isArray().withMessage("solutionIds should be array")
      // .notEmpty().withMessage("solutionIds cannot be empty");
    },
    targetedSolutionDetails: function () {
      req.checkParams('_id').exists().withMessage('Required solution id');
    },
    deleteCriteria: function () {
      req.checkParams('_id').exists().withMessage('Required solution externalId');
      req
        .checkBody('criteriaIds')
        .exists()
        .withMessage('Required criteria Ids data')
        .isArray()
        .withMessage('criteriaIds should be array')
        .notEmpty()
        .withMessage('criteriaIds cannot be empty');
    },
  };

  if (solutionValidator[req.params.method]) solutionValidator[req.params.method]();

  function entitiesValidation(entity) {
    let isObjectIds = true;
    if (Array.isArray(entity)) {
      for (var i = 0; entity.length > i; i++) {
        if (!ObjectId.isValid(entity[i])) {
          isObjectIds = false;
        }
      }
    }

    return isObjectIds;
  }
};
