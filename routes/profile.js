const express = require("express");
const router = express.Router();
const { renderProfile, isAuthenticated } = require("../controllers/controller");

router.get("/", isAuthenticated, renderProfile);

module.exports = router;
