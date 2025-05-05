const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ["teacher", "student", "admin"], default: "teacher" },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
