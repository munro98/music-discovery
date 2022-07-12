const mongoose = require("mongoose");

const TrackSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true, 
    unique: false
  },
  artist: {
    type: String,
    required: true, 
    unique: false
  }
})
TrackSchema.index({ name: 1, artist: 1 }, { unique: true })
/*
let TrackSchema = new mongoose.Schema({
  firstName:  String,
  lastName: String,
  index: true,
  unique: true, 
  
  });
  */
const Track = mongoose.model("Track", TrackSchema);

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
  music: [[String]]
});

const User = mongoose.model("User", UserSchema);

module.exports = {
  User : User,
  Track : Track
  }