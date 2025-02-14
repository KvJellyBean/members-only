const express = require("express");
const router = express.Router();
const { joinMember, renderJoinMember, isAuthenticated } = require("../controllers/controller");

router.get("/", isAuthenticated, renderJoinMember);

router.post("/", joinMember);

module.exports = router;
