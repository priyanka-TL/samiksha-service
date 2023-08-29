module.exports = {
  name: 'pollSubmissions',
  schema: {
    pollName: {
      type: String,
      required: true,
    },
    responses: {
      type: Array,
      required: true,
    },
    submittedAt: {
      type: Date,
      required: true,
    },
    pollId: {
      type: 'ObjectId',
      index: true,
      required: true,
    },
    userId: {
      type: String,
      required: true,
      index: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
  },
};
