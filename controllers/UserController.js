
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