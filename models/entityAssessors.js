module.exports = {
  name: 'entityAssessors',
  schema: {
    userId: {
      type: String,
      index: true,
    },
    name: String,
    email: String,
    role: String,
    programId: {
      type: 'ObjectId',
      index: true,
    },
    parentId: String,
    entities: [],
    createdBy: String,
    updatedBy: String,
    externalId: String,
    solutionId: {
      type: 'ObjectId',
      index: true,
    },
    entityTypeId: 'ObjectId',
    entityType: String,
  },
};
