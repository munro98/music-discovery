const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  secret: {
    type: String,
    default: "Super secret"
  },
  favourites: [{
    type: String,
    unique: true
  }]
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
