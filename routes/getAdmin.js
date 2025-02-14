const express = require("express");
const router = express.Router();
const { joinAdmin, renderGetAdmin, isAuthenticated } = require("../controllers/controller");

router.get("/", isAuthenticated, renderGetAdmin);

router.post("/", joinAdmin);

module.exports = router;
