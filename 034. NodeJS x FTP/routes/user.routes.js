const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const authMiddleware = require("../middleware/auth.middleware");
router.get("/FTP", authMiddleware, userController.showList);
router.get("/FTP/:remoteFilePath", authMiddleware, userController.accessFile);
router.post("/FTP/:remoteFilePath", authMiddleware, userController.uploadFile);
module.exports = router;