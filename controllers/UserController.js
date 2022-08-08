
const {User} = require("../models/User"); // User model
const {Track} = require("../models/Track");

exports.getSecret = (req, res) => {
    const sessUser = req.session.user;

    if (sessUser) {
        User.findById(sessUser.id ).then((user) => {
            if (!user) return res.status(400).json("Error");

            //console.log(user.name);
            //console.log(user.secret);

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
            //console.log("save -----------" + track)
            User.findById(sessUser.id ).then((user) => {
                if (!user) return res.status(400).json("Error");
    
                var track = new Track();
                track.user = user._id;
                track.name = req.body.name;
                track.artist = req.body.artist;

                track.save(function (err) {
                    if (err)
                        console.log(err);
                    //console.log("track added!");
                    //console.log(track);
                    res.json({ msg: "Saved track" });
                });
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
            //console.log(req);
            Track.deleteOne( { user: sessUser.id, name: req.body.name, artist: req.body.artist }, (err,r) => {
                if (err) {
                    console.log(err);
                    res.status(400).json({ msg: "Error" });
                }
                //console.log(r);
                if (r.deletedCount > 0) {
                    //console.log("Deleted");
                    res.json({ msg: "Deleted" });
                } else {
                    res.status(400).json({ msg: "Error deleting track" });
                } 
            }); 
        } catch (e) {
            res.status(400).json({ msg: "Error deleting track" });
        }
      
    } else {
      return res.status(401).json({ msg: "Unauthorized" });
    }
};

// TODO: untested
exports.containsTrack = async (req, res) => {
    const sessUser = req.session.user;
    console.log(req.body);
    if (sessUser) {
        try {
            const track = [req.body.artist, req.body.name];
            //console.log("checking -----------" + track)

            //db.inventory.find( { tags: ["red", "blank"] } )
            Track.find( {user: req.session.user.id, name: req.body.data[i].name, artist: req.body.data[i].artist}, (err,res) => {
                if (err) {
                    console.log(err);
                    res.status(400).json({ msg: "Error reading track" });
                }
                if (res.length > 0) {
                    //console.log("track found in profile");
                    const data = {result: true}
                    res.json(data);
                }
            });
        } catch (e) {
            res.status(400).json({ msg: "Error saving track" });
            console.log(e);
        }
      
    } else {
      return res.status(401).json({ msg: "Unauthorized" });
    }
};

exports.containedInUser = async (req, res) => {
    const sessUser = req.session.user;
    console.log("containedInUser");
    //console.log(req.body.data);
    if (sessUser) {
        try {
            let promises = [];

            let names = req.body.data.map((track) => track.name);
            let artists = req.body.data.map((track) => track.artist);
            let tracks = [];
            Track.find(
            {user: req.session.user.id, $or:[
                {"name":{"$in":names}},
                {"artist":{"$in":artists}}
            ]}
                , (err,r) => {
                if (err) {
                    console.log(err);
                    //res.status(400).json({ msg: "Error reading track" });
                }
                if (r.length > 0) {
                    //console.log("found " + r);
                    for (let i = 0; i < r.length; i++) {
                        const track = {name: r[i].name, artist: r[i].artist};
                        tracks.push(track);
                    }
                    //console.log(tracks);
                    res.json(tracks);
                } else {
                    res.json([]);
                }
            });
            /*
            //let tracks = []
            for (let i = 0; i < req.body.data.length; i++) {
                //const track = [req.body.data[i].artist, req.body.data[i].name];
                let p = new Promise((resolve, reject) => {
                    Track.find( {user: req.session.user.id, name: req.body.data[i].name, artist: req.body.data[i].artist}, (err,res) => {
                        if (err) {
                            console.log(err);
                            //res.status(400).json({ msg: "Error reading track" });
                        }
                        if (res.length > 0) {
                            console.log("found " + req.body.data[i].name);
                            resolve({name: req.body.data[i].name, artist: req.body.data[i].artist});
                        } else {
                            resolve();
                        }
                    });
                  });
                  promises.push(p);
                
            }
            Promise.all(promises).then((values) => {
                //console.log(values);
                let return_data = values.filter(track => track != undefined);
                console.log(return_data);
                res.json(values);
              });
              */
        } catch (e) {
            res.status(400).json({ msg: "Error saving track" });
            console.log(e);
        }
    } else {
      return res.status(401).json({ msg: "Unauthorized" });
    }
};

exports.getAllTracks = async (req, res) => {
    const sessUser = req.session.user;
    const {track} = req.body;
    console.log("getAllTracks");
    if (sessUser) {
        
        const options = {
            sort: { date_added: 1 },
          };
        const cursor = Track.find({user: sessUser.id}, (err, r) => {
            if (err) {
                res.status(400).json({ msg: "Error" });
            }
            //console.log(r);
            let return_data = r.map((t) => ({name: t.name, artist: t.artist}));
            res.status(200).json(return_data);
        })

    } else {
      return res.status(401).json({ msg: "Unauthorized" });
    }
};