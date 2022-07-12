
const User = require("../models/User"); // User model


exports.getSecret = (req, res) => {
    const sessUser = req.session.user;

    if (sessUser) {
        User.findById(sessUser.id ).then((user) => {
            if (!user) return res.status(400).json("Error");

            console.log(user.name);
            console.log(user.secret);

            const data = {secret: user.secret}
            res.json(data); // sends cookie with sessionID automatically in response
        });
    } else {
        return res.status(401).json({ msg: "Unauthorized" });
    }

  };

exports.saveTrack = async (req, res) => {
    const sessUser = req.session.user;
    const {track} = req.body;
    if (sessUser) {
        try {
            let track = new Track();
            track.artist = req.params.artist;
            track.name = req.params.name;
            console.log(req);
            /*
            track.save(function (err) {
                if (err) {
                    console.log(err);
                    res.status(400).json({ msg: "Error saving track" });
                }
                console.log("track added!");
                console.log(track);
            });
            */
        } catch (e) {
            res.status(400).json({ msg: "Error deleting track" });
        }
      
    } else {
      return res.status(401).json({ msg: "Unauthorized" });
    }
};

exports.deleteTrack = async (req, res) => {
    const sessUser = req.session.user;
    const {track} = req.body;
    if (sessUser) {
        try {
            console.log(req);
            /*
            const query = { name: req.params.name, artist: req.params.artist };
            const result = await Track.deleteOne(query);
            if (result.deletedCount === 1) { 
                res.status(200).json({
                    status: "Successful deletion",
                });
            } else {
                res.status(400).json({ msg: "Error deleting track" });
            }
            */
        } catch (e) {
            res.status(400).json({ msg: "Error deleting track" });
        }
      
    } else {
      return res.status(401).json({ msg: "Unauthorized" });
    }
};

exports.getAllMusic = async (req, res) => {
    const sessUser = req.session.user;
    const {track} = req.body;
    if (sessUser) {

        const user = await User.findfindById(sessUser.id);
        res.status(200).json({
            status: "Success",
            results: user.music.length,
            data: user.music
            
        });
    } else {
      return res.status(401).json({ msg: "Unauthorized" });
    }
};