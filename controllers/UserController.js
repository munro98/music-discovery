
const {User} = require("../models/User"); // User model
const {Track} = require("../models/User");

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
    console.log(req.body);
    if (sessUser) {
        try {
            const track = [req.body.artist, req.body.name];
            console.log("save -----------" + track)

            User.findByIdAndUpdate(req.session.user.id, {"$addToSet":{"music": track}},{safe: true, new:true},(err,user) => {
                if (err) {
                    console.log(err);
                    res.status(400).json({ msg: "Error saving track" });
                }
                console.log(user);
            });
            
        } catch (e) {
            res.status(400).json({ msg: "Error saving track" });
            console.log(e);
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
            //https://www.mongodb.com/docs/manual/reference/operator/update/pull/#mongodb-update-up.-pull
            const track = [req.body.artist, req.body.name];
            console.log("delete -----------" + track)

            User.findByIdAndUpdate(req.session.user.id, {"$pull":{"music": track}},{safe: true, new:true},(err,user) => {
                if (err) {
                    console.log(err);
                    res.status(400).json({ msg: "Error deleting track" });
                }
                console.log(user);
            });
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