const mongoose = require("mongoose");

const {UserSchema} = require("./User");

const TrackSchema = new mongoose.Schema({
    user: {
      type: mongoose.Types.ObjectId,
      required: true, 
      unique: false
    },
    name: {
      type: String,
      required: true, 
      unique: false
    },
    artist: {
      type: String,
      required: true, 
      unique: false
    },
    added_date: {
        type: Date,
        default: Date.now()
    }
  })
  TrackSchema.index({ user: 1, name: 1, artist: 1 }, { unique: true });
  
const Track = mongoose.model("Track", TrackSchema);
module.exports = {
    Track : Track,
}