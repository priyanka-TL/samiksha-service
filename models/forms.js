/**
 * name : forms.js.
 * author : Prajwal.
 * created-date : 08-May-2024.
 * Description : Schema for Forms.
 */

const { Schema } = require('mongoose');

const formSchema = new Schema({
  type: {
    type: String,
    required: true,
  },
  subType: {
    type: String,
    required: true,
  },
  version: {
    type: Number,
    default: 0,
  },
  data: {
    type: Schema.Types.Mixed,
  },
  orgIds: {
    type: Array,
    require: true,
    index: true,
  },
  tenantId: {
    type: String,
    require: true,
    index: true,
  },
});

// Pre-update hook to increment version
formSchema.pre('findOneAndUpdate', function (next) {
  // Safely increment version without overwriting the original update object
  this.setUpdate({ $inc: { version: 1 }, ...this.getUpdate() });
  next();
});

formSchema.pre('updateOne', function (next) {
  // Safely increment version without overwriting the original update object
  this.setUpdate({ $inc: { version: 1 }, ...this.getUpdate() });
  next();
});

module.exports = {
  name: 'forms',
  schema: formSchema,
  compoundIndex: [
    {
      name: { type: 1, subType: 1, tenantId: 1, orgIds },
      indexType: { unique: true },
    },
  ],
};
