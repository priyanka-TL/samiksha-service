module.exports = {
  name: 'surveys',
  schema: {
    name: String,
    description: String,
    createdBy: {
      type: String,
      index: true,
      required: true,
    },
    solutionId: {
      type: 'ObjectId',
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
    solutionExternalId: {
      type: String,
      index: true,
      required: true,
    },
    startDate: Date,
    endDate: Date,
    status: String,
    createdFor: [String],
    rootOrganisations: [String],
    isDeleted: {
      type: Boolean,
      default: false,
    },
    isAPrivateProgram: {
      default: false,
      type: Boolean,
    },
    orgId:{
      type: String,
      require: true,
      index:true
    },
    tenantId: {
      type: String,
      require: true,
      index:true
    },
    project: Object,
    referenceFrom: {
      type: String,
      index: true,
    },
    isExternalProgram:Boolean
  },
  compoundIndex: [
    {
        "name" :{ createdBy: 1, solutionId: 1, tenantId: 1, orgId: 1 },
        "indexType" : { unique: true }
    }
  ]
};
