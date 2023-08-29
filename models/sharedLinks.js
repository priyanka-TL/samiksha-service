module.exports = {
  name: 'sharedLink',
  schema: {
    privateURL: String,
    publicURL: String,
    linkId: String,
    isActive: Boolean,
    accessedCount: Number,
    linkViews: Array,
    reportName: String,
    queryParams: String,
    userDetails: {
      id: String,
      accessiblePrograms: Array,
      allRoles: Array,
      firstName: String,
      lastName: String,
      email: String,
    },
  },
};
