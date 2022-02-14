var express = require('express');
var router = express.Router();

const mm = require("../controllers/monday.controller.js");

router.post("/", mm.challenge);


module.exports = router;
