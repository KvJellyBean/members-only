const express = require("express");
const router = express.Router();
const { renderMessageForm, renderMessageDetail, addMessage, deleteMessage, isAuthenticated, isAdmin } = require("../controllers/controller");

router.get("/new", isAuthenticated, renderMessageForm);

router.get("/:id", isAuthenticated, renderMessageDetail);

router.post("/", addMessage);

router.delete("/:id", isAdmin, deleteMessage);

module.exports = router;
