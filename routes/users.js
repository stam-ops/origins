var express = require('express');
var router = express.Router();

const user = require("../controllers/user.controller.js");

router.post("/register", user.register);

router.post("/login", user.login);

router.delete("/logout", user.logout);

module.exports = router;
