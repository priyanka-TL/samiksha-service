module.exports = {
    name: "mediaFiles",
    schema: {
        name: {
          type: String,
          required: true,
          index: true
        },
        type: {
          type: String,
          required: true,
          index: true
        },
        unicode: {
          type: String,
          required: true,
          index: true
        },
        status: {
           type: String,
           required: true,
           index: true
        },
        createdBy: {
          type: String,
          required: true
        },
        updatedBy: {
          type: String,
          required: true
        },
        isDeleted: {
            type: Boolean,
            default: false,
            required: true
        }
    }
}