/**
 * name : v1.js
 * author : Saish
 * created-date : 15-OCT-2024
 * Description : Criteria validator.
 */

module.exports = (req) => {
  let configurationsValidator = {
    createOrUpdate: function () {
      req.checkBody('code').trim().notEmpty().withMessage('code field is empty')
			req.checkBody('profileKeys').trim().notEmpty().withMessage('profileKeys field is empty')
			
    },
  };

  if (configurationsValidator[req.params.method]) {
    configurationsValidator[req.params.method]();
  }
};
