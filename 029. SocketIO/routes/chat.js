const express = require("express");
const route = express.Router();
const ChatController = require("../controllers/chat");
const ProtectRoute = require("../middleware/isAuth")
// {CHAT} //
route.get("/chat", ProtectRoute, ChatController.getChat);

module.exports = route;
