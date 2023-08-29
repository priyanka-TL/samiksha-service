module.exports = (req) => {
  let pollSubmissionsValidator = {
    make: function () {
      req.checkParams('_id').exists().withMessage('required poll id').isMongoId().withMessage('Invalid poll id');
      req.checkBody(Object.values(req.body)).isEmpty().withMessage('request body is required');
    },
  };

  if (pollSubmissionsValidator[req.params.method]) pollSubmissionsValidator[req.params.method]();
};
