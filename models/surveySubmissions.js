module.exports = {
  name: 'surveySubmissions',
  schema: {
    surveyId: {
      type: 'ObjectId',
      index: true,
      required: true,
    },
    createdBy: {
      type: String,
      index: true,
      required: true,
    },
    status: {
      type: String,
      index: true,
    },
    evidencesStatus: Array,
    evidences: Object,
    criteria: Array,
    answers: Object,
    completedDate: Date,
    solutionId: {
      type: 'ObjectId',
      index: true,
      required: true,
    },
    solutionExternalId: {
      type: String,
      index: true,
      required: true,
    },
    programId: {
      type: 'ObjectId',
      index: true,
    },
    programExternalId: {
      type: String,
      index: true,
    },
    isAPrivateProgram: {
      default: false,
      type: Boolean,
    },
    surveyInformation: Object,
    appInformation: Object,
    userRoleInformation: Object,
    userProfile: Object,
    programInformation: Object,
    orgId: {
      type: String,
      require: true,
      index: true,
    },
    tenantId: {
      type: String,
      require: true,
      index: true,
    },
  },
  compoundIndex: [
    {
      name: { surveyId: 1, solutionId: 1, tenantId: 1, orgId: 1 },
      indexType: { unique: true },
    },
  ],
};
