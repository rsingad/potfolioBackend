const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  githubId: String,
  name: String,
  email: String,
  image: String,
});

module.exports = mongoose.model("User", UserSchema);
