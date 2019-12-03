const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    trim: true,
    required: true,
    minlength: 3,
    maxlength: 50
  },
  lastName: {
    type: String,
    trim: true,
    required: true,
    minlength: 3,
    maxlength: 50
  },
  email: {
    type: String,
    required: [true, "Email is required."],
    unique: true,
    trim: true
  },
  password: {
    type: String,
    minlength: [8, "Password requires to have 8 characters minimum."],
    required: [true, "Password is required."]
  },
  avatar: String,
  apointments: [String],
  conversations: [String]
});

const User = mongoose.model("User", userSchema);

module.exports = User;
