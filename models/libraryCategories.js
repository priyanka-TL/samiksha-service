/**
 * name : libraryCategories.js
 * author : Aman
 * created-date : 23-Jun-2020
 * Description : Library categories.
 */

module.exports = {
  name: 'libraryCategories',
  schema: {
    name: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      required: true,
    },
    externalId: {
      type: String,
      required: true,
      index: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    isVisible: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      default: 'active',
    },
    updatedBy: {
      type: String,
      default: 'SYSTEM',
    },
    createdBy: {
      type: String,
      default: 'SYSTEM',
    },
  },
};
