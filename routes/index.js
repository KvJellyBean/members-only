const express = require("express");
const router = express.Router();
const { renderLobby } = require("../controllers/controller");

router.get("/", renderLobby);

module.exports = router;
