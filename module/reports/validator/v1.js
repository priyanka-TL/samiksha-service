module.exports = (req) => {
  let reportValidator = {
    status: function () {
      req.checkParams('_id').exists().withMessage('required solution id');
    },
    assessorEntities: function () {
      req.checkParams('_id').exists().withMessage('required solution id');
    },
    entityAssessors: function () {
      req.checkParams('_id').exists().withMessage('required solution id');
    },
    solutionEntityStatus: function () {
      req.checkParams('_id').exists().withMessage('required solution id');
    },
    solutionsSubmissionStatus: function () {
      req.checkParams('_id').exists().withMessage('required solution id');
      req.checkQuery('evidenceId').exists().withMessage('required solution id');
    },
    generateCriteriaByEntityId: function () {
      req.checkParams('_id').exists().withMessage('required solution id');
    },
    generateSubmissionReportsByEntityId: function () {
      req.checkParams('_id').exists().withMessage('required solution id');
    },
    registryDetails: function () {
      req.checkParams('_id').exists().withMessage('required solution id');
      req.checkQuery('type').exists().withMessage('required type');
      req.checkQuery('fromDate').exists().withMessage('required from date');
    },
    entityProfileInformation: function () {
      req.checkParams('_id').exists().withMessage('required solution id');
    },
    generateEcmReportByDate: function () {
      req.checkParams('_id').exists().withMessage('required solution id');
    },
    submissionFeedback: function () {
      req.checkParams('_id').exists().withMessage('required solution id');
      req.checkQuery('fromDate').exists().withMessage('required from date');
    },
    ecmSubmissionByDate: function () {
      req.checkParams('_id').exists().withMessage('required solution id');
      // req.checkQuery('fromDate').exists().withMessage("required from date");
    },
    completedParentInterviewsByDate: function () {
      req.checkParams('_id').exists().withMessage('required solution id');
      req.checkQuery('fromDate').exists().withMessage('required from date');
    },
    parentInterviewCallDidNotPickupReportByDate: function () {
      req.checkParams('_id').exists().withMessage('required solution id');
      req.checkQuery('fromDate').exists().withMessage('required from date');
    },

    parentInterviewCallResponseByDate: function () {
      req.checkParams('_id').exists().withMessage('required solution id');
      req.checkQuery('fromDate').exists().withMessage('required from date');
    },
    entityList: function () {
      req.checkParams('_id').exists().withMessage('required solution id');
    },
    fetch: function () {
  if (req.body.submissionId && req.body.observation === true) {
    req.checkBody('submissionId').exists().withMessage('submissionId is required');
        req.checkBody('observation')
      .custom(value => value === true || value === 'true')
      .withMessage('observation must be true');
  
  }
  else if (req.body.entityId && req.body.observationId && req.body.observation === true) {
    req.checkBody('entityId').exists().withMessage('entityId is required');
    req.checkBody('observationId').exists().withMessage('observationId is required');
        req.checkBody('observation')
      .custom(value => value === true || value === 'true')
      .withMessage('observation must be true');
  }
    }
  };

  if (reportValidator[req.params.method]) reportValidator[req.params.method]();
};
