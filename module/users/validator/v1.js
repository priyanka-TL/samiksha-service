/**
 * name : users/validator/v1.js
 * author : Priyanka Pradeep
 * created-date : 27-May-2025
 * Description : User controller validator
 */
module.exports = (req) => {
  let entityValidator = {
    deleteUserPIIData: function () {
      req.checkBody('id').exists().withMessage('required id of the user')
    },
  };

  if (entityValidator[req.params.method]) entityValidator[req.params.method]();
};
