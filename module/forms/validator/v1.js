module.exports = (req) => {
	let formsValidator = {
		create: function () {
			req.checkBody('type').trim().notEmpty().withMessage('type field is empty')
			req.checkBody('subType').trim().notEmpty().withMessage('subType field is empty')
			req.checkBody('data').notEmpty().withMessage('data field is empty')
		},
		update: function () {
			req.checkBody('type').notEmpty().withMessage('type field is empty')
			req.checkBody('subType').notEmpty().withMessage('subType field is empty')
			req.checkBody('data').notEmpty().withMessage('data field is empty')
		},
		read: function () {
			if (req.params._id || Object.keys(req.body).length !== 0) {
				if (req.params._id) {
					req.checkParams('_id').notEmpty().withMessage('id param is empty')
				} else {
					req.checkBody('type').trim().notEmpty().withMessage('type field is empty')
					req.checkBody('subType').trim().notEmpty().withMessage('subType field is empty')
				}
			}
		},
	}

	if (formsValidator[req.params.method]) {
		formsValidator[req.params.method]()
	}
}