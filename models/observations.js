module.exports = {
  name: 'observations',
  schema: {
    name: String,
    description: String,
    createdBy: {
      type: String,
      index: true,
    },
    frameworkId: 'ObjectId',
    frameworkExternalId: String,
    solutionId: {
      type: 'ObjectId',
      index: true,
    },
    programId: {
      type: "ObjectId",
      required: false,
      index : true
    },
    programExternalId: {
      type: String,
      required: false,
      index : true
    },
    solutionExternalId: {
      type: String,
      index: true,
    },
    startDate: Date,
    endDate: Date,
    status: {
      type: String,
      index: true,
    },
    entityTypeId: {
      type: 'ObjectId',
      index: true,
    },
    entityType: String,
    entities: Array,
    createdFor: [String],
    rootOrganisations: [String],
    isAPrivateProgram: {
      default: false,
      type: Boolean,
    },
    link: {
      type: String,
      index: true,
    },
    project: Object,
    referenceFrom: String,
    userProfile : Object,
    orgId:{
      type: String,
      require: true,
      index:true
    },
    tenantId: {
      type: String,
      require: true,
      index:true
    }
  },
  compoundIndex: [
    {
        "name" :{ createdBy: 1, solutionId: 1 , tenantId: 1 , orgId: 1 },
        "indexType" : { unique: true }
    }
  ]
};
