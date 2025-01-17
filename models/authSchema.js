const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

// Schema for user/Admin
const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});

userSchema.plugin(passportLocalMongoose);
module.exports = new mongoose.model("User", userSchema);
