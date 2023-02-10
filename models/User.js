const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    identityNumber: {
      type: String,
      required: true,
      minlength: 8,
      maxlength: 8,
      trim: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      maxLength: 50,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 10,
      maxlength: 255,
    },
    profile: {
      firstName: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 50,
        trim: true,
      },
      lastName: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 50,
        trim: true,
      },
      phone: {
        type: String,
        trim: true,
        default: '',
      },
      address: {
        type: String,
        trim: true,
        default: '',
      },
      country: {
        type: String,
        trim: true,
        default: '',
      },
      imageUrl: {
        type: String,
        trim: true,
        default: '',
      },
    },
    role: { type: String, required: true, default: 'user' },
    isAdmin: { type: Boolean, required: true, default: false },
    hasPermission: { type: Boolean, required: true, default: false },
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);

module.exports.User = User;
