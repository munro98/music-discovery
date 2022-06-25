const rateLimit = require("express-rate-limit");


exports.registerLimiter = rateLimit({
  windowMs: 1 * 60 * 60 * 1000, // 1 hour window
  max: 6, // start blocking after 6 requests
  message:
    "Too many registration attempts from this device, please try again in a few hours"
});

exports.loginLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour window
  max: 5, // start blocking after 5 requests
  message:
    "Too many Login attempts from this device, please try again in an hour"
});