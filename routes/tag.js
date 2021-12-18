var express = require('express');
var router = express.Router();

const tags = require("../controllers/tag.controller.js");


router.post("/", tags.create);

router.get("/", tags.findAll);

router.get("/:id", tags.findOne);

router.delete("/:id", tags.delete);
module.exports = router;
