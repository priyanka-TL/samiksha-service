module.exports = {
  name: 'submissions',
  schema: {
    entityId: {
      type: 'ObjectId',
      index: true,
    },
    programId: {
      type: 'ObjectId',
      index: true,
    },
    assessors: Array,
    status: {
      type: String,
      index: true,
    },
    evidencesStatus: Array,
    evidences: Object,
    criteria: Array,
    themes: Array,
    answers: Object,
    entityExternalId: {
      type: String,
      index: true,
    },
    entityInformation: Object,
    programExternalId: {
      type: String,
      index: true,
    },
    programInformation: Object,
    entityProfile: Object,
    ratingOfManualCriteriaEnabled: Boolean,
    allManualCriteriaRatingSubmitted: Boolean,
    feedback: Array,
    generalQuestions: Object,
    parentInterviewResponsesStatus: Array,
    parentInterviewResponses: Object,
    completedDate: {
      type: Date,
      index: true,
    },
    solutionId: {
      type: 'ObjectId',
      index: true,
    },
    solutionExternalId: {
      type: String,
      index: true,
    },
    submissionsUpdatedHistory: Array,
    ratingCompletedAt: Date,
    entityTypeId: {
      type: 'ObjectId',
      index: true,
    },
    entityType: {
      type: String,
      index: true,
    },
    pointsBasedMaxScore: { type: Number, default: 0 },
    pointsBasedScoreAchieved: { type: Number, default: 0 },
    pointsBasedPercentageScore: { type: Number, default: 0 },
    isAPrivateProgram: {
      default: false,
      type: Boolean,
    },
    submissionNumber: {
      type: Number,
      index: true,
    },
    scoringSystem: String,
    isRubricDriven: { type: Boolean, default: false },
    numberOfAnsweredCriterias: { type: Number, default: 0 },
    title: {
      type: String,
      default: function () {
        if (this.submissionNumber && this.submissionNumber > 0) {
          return 'Assessment ' + this.submissionNumber;
        } else {
          return 'Assessment';
        }
      },
    },
    project: Object,
    referenceFrom: String,
    appInformation: Object,
    criteriaLevelReport: Boolean,
  },
};
