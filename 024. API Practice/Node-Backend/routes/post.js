const express = require("express");
const router = express.Router();
const postController = require("../controllers/post");

// VALIDATION
const { body } = require("express-validator");

// GET http://localhost:4000/v1/posts
router.get("/posts", body. postController.getPost);

// POST http://localhost:4000/v1/posts
router.post("/posts", postController.createPost);

module.exports = router;
