/**
 * name : CriteriaQuestionsController.js
 * author : Akash
 * created-date : 22-Nov-2018
 * Description : Criteria Questions.
 */

/**
 * CriteriaQuestions
 * @class
 */
module.exports = class CriteriaQuestions extends Abstract {
  constructor() {
    super(criteriaQuestionsSchema);
  }

  static get name() {
    return 'criteriaQuestions';
  }
};
