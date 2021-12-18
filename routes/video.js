var express = require('express');
var router = express.Router();

const videos = require("../controllers/video.controller.js");

router.post("/", videos.create);

router.get("/", videos.findAll);

router.get("/:id", videos.findOne);

router.put("/:id", videos.update);

router.delete("/:id", videos.delete);

router.delete("/", videos.deleteAll);

router.get("/bytag/:id", videos.findByTag);

module.exports = router;
