module.exports = (req) => {
  let programsValidator = {
    entityList: function () {
      req.checkQuery('solutionId').exists().withMessage('required solution id');
    },
    userEntityList: function () {
      req.checkQuery('solutionId').exists().withMessage('required solution id');
    },
    entityBlocks: function () {
      req.checkQuery('solutionId').exists().withMessage('required solution id');
    },
    userList: function () {
      req.checkQuery('solutionId').exists().withMessage('required solution id');
    },
    blockEntity: function () {
      req.checkQuery('solutionId').exists().withMessage('required solution id');
      req.checkQuery('blockId').exists().withMessage('required block id');
    },
    addSolutions: function () {
      req.checkParams('_id').exists().withMessage('required program id');
      req.checkBody('solutionIds').exists().withMessage('required solutions ids');
    },
    create: function () {
      req.checkBody('externalId').exists().withMessage('required program externalId');
      req.checkBody('name').exists().withMessage('required program name');
      // req.checkBody('requestForPIIConsent').exists().withMessage('required requestForPIIConsent value of program');
    },
    update: function () {
      req.checkParams('_id').exists().withMessage('required program id');
    },
    addRolesInScope: function () {
      req.checkParams('_id').exists().withMessage('required program id');
      req.checkBody('roles').exists().withMessage('required program roles to be added');
      req.checkBody('roles').isArray().withMessage('roles must be an array')
    },
    addEntitiesInScope: function () {
      req.checkParams('_id')
				.exists()
				.withMessage('required program id')
				.isMongoId()
				.withMessage('Invalid program ID')
			req.checkBody('entities').exists().withMessage('required entities to be added')
			const entities = req.body.entities
			if (entities && typeof entities === 'object') {
				for (const [key, value] of Object.entries(entities)) {
					req.checkBody(`entities.${key}`).isArray().withMessage(`${key} should be an array`)
				}
			}
			if (req.query.organizations === 'true') {
				req.checkBody('organizations')
					.exists()
					.withMessage('Organizations field is required when organizations=true in query')
					.isArray()
					.withMessage('Organizations must be an array')
			}
    },
    removeRolesInScope: function () {
      req.checkParams('_id').exists().withMessage('required program id');
      req.checkBody('roles').exists().withMessage('required program roles to be added');
      req.checkBody('roles').isArray().withMessage('roles must be an array')
    },
    removeEntitiesInScope: function () {
      req.checkParams('_id')
				.exists()
				.withMessage('required program id')
				.isMongoId()
				.withMessage('Invalid program ID')
			req.checkBody('entities').exists().withMessage('required entities to be added')
			const entities = req.body.entities
			if (entities && typeof entities === 'object') {
				for (const [key, value] of Object.entries(entities)) {
					req.checkBody(`entities.${key}`).isArray().withMessage(`${key} should be an array`)
				}
			}
			if (req.query.organizations === 'true') {
				req.checkBody('organizations')
					.exists()
					.withMessage('Organizations field is required when organizations=true in query')
					.isArray()
					.withMessage('Organizations must be an array')
			}
    },
    join: function () {
      req.checkParams('_id').exists().withMessage('required program id');
      req.checkParams('_id').isMongoId().withMessage('Invalid program ID');
      req.checkBody('userRoleInformation').exists().withMessage('required userRoleInformation to be added');
    },
  };

  if (programsValidator[req.params.method]) programsValidator[req.params.method]();
};
