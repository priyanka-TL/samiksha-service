module.exports = {
  name: 'insights',
  schema: {
    submissionId: 'ObjectId',
    entityId: {
      type: 'ObjectId',
      index: true,
    },
    entityExternalId: {
      type: String,
      index: true,
    },
    entityName: String,
    programId: {
      type: 'ObjectId',
      index: true,
    },
    programExternalId: String,
    solutionId: {
      type: 'ObjectId',
      index: true,
    },
    solutionExternalId: {
      type: String,
      index: true,
    },
    submissionStartedAt: Date,
    submissionCompletedAt: Date,
    ratingCompletedAt: Date,
    score: String,
    themeScores: Array,
    criteriaScores: Array,
    scoringSystem: String,
    levelToScoreMapping: Object,
    criteriaLevelCount: Object,
    entityTypeId: {
      type: 'ObjectId',
      index: true,
    },
    entityType: {
      type: String,
      index: true,
    },
  },
};
