const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// ID: GE20220001/GESP01 = 20220001
const identitySchema = new Schema(
  {
    identityNumber: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      minlength: 8,
      maxlength: 8,
    },
  },
  { timestamps: true }
);

const Identity = mongoose.model('Identity', identitySchema);

module.exports = Identity;
