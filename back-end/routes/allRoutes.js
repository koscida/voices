const express = require("express");
const authRoutes = require("../routes/authRoutes.js");
const mediaRoutes = require("../routes/mediaRoutes.js");
const actorRoutes = require("../routes/actorRoutes.js");
const episodeRoutes = require("../routes/episodeRoutes.js");
const characterRoutes = require("./characterRoutes.js");

// create one router for the app
let router = express.Router();

// add routes for each
authRoutes.addRoutes(router);
mediaRoutes.addRoutes(router);
actorRoutes.addRoutes(router);
episodeRoutes.addRoutes(router);
characterRoutes.addRoutes(router);

// export
module.exports = router;
