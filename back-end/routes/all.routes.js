const express = require("express");
const authRoutes = require("./auth.routes.js");
const mediaRoutes = require("./media.routes.js");
const actorRoutes = require("./actor.routes.js");
// const episodeRoutes = require("./episode.routes.js");
const characterRoutes = require("./character.routes.js");

// create one router for the app
let router = express.Router();

// add routes for each
authRoutes.addRoutes(router);
mediaRoutes.addRoutes(router);
actorRoutes.addRoutes(router);
// episodeRoutes.addRoutes(router);
characterRoutes.addRoutes(router);

// export
module.exports = router;
