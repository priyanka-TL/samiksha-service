module.exports = {
  name: 'userExtension',
  schema: {
    externalId: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
      index: true
    },
    createdBy: {
      type: String,
      required: true,
    },
    updatedBy: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: 'active'
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    programRoleMapping: Array,
    orgIds:{
      type: Array,
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
			name: { userId: 1, tenantId: 1  },
			indexType: { unique: true },
		},
	],
};
