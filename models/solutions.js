module.exports = {
  name: "solutions",
  schema: {
    externalId: String,
    isReusable: Boolean,
    name: {
      type : String,
      index : true
    },
    description: {
      type : String,
      index : true
    },
    author: String,
    parentSolutionId: "ObjectId",
    resourceType: Array,
    language: Array,
    keywords: Array,
    concepts: Array,
    scoringSystem: String,
    levelToScoreMapping: Object,
    themes: Array,
    flattenedThemes : Array,
    questionSequenceByEcm: Object,
    entityType: String,
    type: String,
    subType: String,
    entities: Array,
    programId: "ObjectId",
    programExternalId: String,
    programName: String,
    programDescription: String,
    entityProfileFieldsPerEntityTypes: Object,
    startDate: Date,
    endDate: {
      type : Date,
      index : true
    },
    status: String,
    evidenceMethods: Object,
    sections: Object,
    registry: Array,
    frameworkId: "ObjectId",
    frameworkExternalId: String,
    parentSolutionId: "ObjectId",
    noOfRatingLevels: Number,
    isRubricDriven: { type : Boolean, default: false },
    enableQuestionReadOut: { type : Boolean, default: false },
    isReusable: Boolean,
    roles: Object,
    observationMetaFormKey: String,
    updatedBy: String,
    captureGpsLocationAtQuestionLevel:{ type : Boolean, default: false },
    sendSubmissionRatingEmailsTo: String,
    creator: String,
    linkTitle: String,
    linkUrl: String,
    isAPrivateProgram : {
      default : false,
      type : Boolean
    },
    assessmentMetaFormKey : String,
    allowMultipleAssessemts : {
      default : false,
      type : Boolean
    },
    isDeleted: {
        default : false,
        type : Boolean,
        index : true
    },
    project : Object,
    referenceFrom : String,
    scope: {
			type: Object,
			default: {},
		},
    pageHeading: {
      default : "Domains",
      type : String
    },
    criteriaLevelReport : Boolean,
    license:Object,
    link: {
      type : String,
      index : true
    },
    minNoOfSubmissionsRequired: {
      type: Number,
      default: 1
    },
    reportInformation : Object,
    certificateTemplateId : "ObjectId",
    rootOrganisations : Array,
    createdFor : Array,
    projectTemplateId : {
      type : "ObjectId",
      index: true
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
    }
  },
  compoundIndex: [
		{
			name: { externalId: 1, tenantId: 1 , orgId: 1 },
			indexType: { unique: true },
		},
	],
};