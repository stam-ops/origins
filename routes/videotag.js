var express = require('express');
var router = express.Router();

const videotag = require("../controllers/videotag.controller.js");

router.post("/", videotag.create);

router.get("/", videotag.findAll);

router.delete("/:id", videotag.delete);

module.exports = router;
