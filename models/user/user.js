const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const SALT_FACTOR = 10;
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
userSchema.pre("save", async function save(next) {
  const user = this;
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(SALT_FACTOR);
    user.password = await bcrypt.hash(user.password, salt);
  } catch (err) {
    return next(err);
  }
});
userSchema.methods.validatePassword = async function validatePassword(data) {
  return bcrypt.compare(data, this.password);
};
const User = mongoose.model("User", userSchema);

module.exports = User;
