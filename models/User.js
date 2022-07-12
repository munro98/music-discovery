const mongoose = require("mongoose");

const TrackSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  artist: {
    type: String,
    required: true
  }
})

const Track = mongoose.model("Track", TrackSchema);
module.exports = Track;

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
  music: [TrackSchema]
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
