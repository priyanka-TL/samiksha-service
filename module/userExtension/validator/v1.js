module.exports = (req) => {
  let entityValidator = {
    getProfile: function () {
      // req.checkQuery('type').exists().withMessage("required type")
      // req.checkParams('_id').exists().withMessage("required entity id").isMongoId().withMessage("invalid entity id")
    },
  };

  if (entityValidator[req.params.method]) entityValidator[req.params.method]();
};
