module.exports = {
  name: 'polls',
  schema: {
    name: {
      type: String,
      required: true,
    },
    creator: {
      type: String,
      required: true,
    },
    createdBy: {
      type: String,
      required: true,
      index: true,
    },
    questions: {
      type: Array,
      required: true,
    },
    link: {
      type: String,
      index: true,
    },
    result: Object,
    numberOfResponses: Number,
    metaInformation: Object,
    isDeleted: {
      type: Boolean,
      default: false,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
  },
};
