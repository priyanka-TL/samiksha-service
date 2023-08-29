module.exports = {
  name: 'entityAssessorsTrackers',
  schema: {
    assessorUserId: {
      type: String,
      index: true,
    },
    assessorId: 'ObjectId',
    action: String,
    actionObject: Array,
    type: String,
    createdBy: String,
    dateOfOperation: Date,
    validFrom: Date,
    validTo: Date,
    programId: {
      type: 'ObjectId',
      index: true,
    },
    updatedData: Array,
    solutionId: {
      type: 'ObjectId',
      index: true,
    },
    entityTypeId: 'ObjectId',
    entityType: String,
  },
};
