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