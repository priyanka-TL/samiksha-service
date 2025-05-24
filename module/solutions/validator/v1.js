module.exports = (req) => {
  let solutionValidator = {
    uploadThemes: function () {
      req.checkParams('_id').exists().withMessage('required solution id');
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
    create: function () {
      req.checkBody('externalId').exists().withMessage('required solution externalId');
      req.checkBody('name').exists().withMessage('required solution name');
      req.checkBody('type').exists().withMessage('required solution type');
      req.checkBody('subType').exists().withMessage('required solution subType');
    },
    update: function () {
      req.checkParams('_id').exists().withMessage('required solution id');
    },
    isTargetedBasedOnUserProfile: function () {
      req.checkParams('_id').exists().withMessage('Required solution id');
    },
    detailsBasedOnRoleAndLocation: function () {
      req.checkParams('_id').exists().withMessage('Required solution id');
    },
    addRolesInScope: function () {
      req.checkParams('_id').exists().withMessage('required program id');
      req.checkBody('roles').exists().withMessage('required program roles to be added');
    },
    addEntitiesInScope: function () {
      req.checkParams('_id').exists().withMessage('required program id');
      req.checkBody('entities').exists().withMessage('required entities to be added');
    },
    removeRolesInScope: function () {
      req.checkParams('_id').exists().withMessage('required program id');
      req.checkBody('roles').exists().withMessage('required program roles to be added');
    },
    removeEntitiesInScope: function () {
      req.checkParams('_id').exists().withMessage('required program id');
      req.checkBody('entities').exists().withMessage('required entities to be added');
    },
    getDetails: function () {
      req.checkParams('_id').exists().withMessage('required solution id');
    },
    fetchLink: function () {
      req.checkParams('_id').exists().withMessage('required solution id');
    },
    verifyLink: function () {
      req.checkParams('_id').exists().withMessage('required solution link');
    },
    targetedSolutions: function () {
      req.checkHeaders('origin').exists().withMessage('Required origin');
    },
    updateSolutions: function () {
      req.checkQuery('solutionExternalId').exists().withMessage('required solution externalId');
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
