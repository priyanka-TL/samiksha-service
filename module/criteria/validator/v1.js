/**
 * name : v1.js
 * author : Aman
 * created-date : 24-Jun-2020
 * Description : Criteria validator.
 */

module.exports = (req) => {
  let criteriaValidator = {
    update: function () {
      req.checkQuery('externalId').exists().withMessage('required criteria external id');
    },
  };

  if (criteriaValidator[req.params.method]) {
    criteriaValidator[req.params.method]();
  }
};
