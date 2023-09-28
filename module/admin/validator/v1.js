module.exports = (req) => {
  let adminValidator = {
    dbFind: function () {
      req.checkParams('_id').exists().withMessage('required mongodb collection name');
      req.checkBody('query').exists().withMessage('required mongoDB find query');
    },
  };

  if (adminValidator[req.params.method]) {
    adminValidator[req.params.method]();
  }
};
