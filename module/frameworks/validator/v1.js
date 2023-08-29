module.exports = (req) => {
  let frameworkValidator = {
    uploadThemes: function () {
      req.checkParams('_id').exists().withMessage('required framework id');
    },
    update: function () {
      req.checkQuery('frameworkExternalId').exists().withMessage('required framework externalId');
    },
    delete: function () {
      req.checkParams('_id').exists().withMessage('required framework externalId');
    },
  };

  if (frameworkValidator[req.params.method]) frameworkValidator[req.params.method]();
};
