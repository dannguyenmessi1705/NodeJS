const express = require("express");
const router = express.Router();
const postController = require("../controllers/post");

// VALIDATION
const { body } = require("express-validator");

// GET http://localhost:4000/v1/posts
router.get("/posts", postController.getPost);

// POST http://localhost:4000/v1/posts
router.post(
  "/posts",
  [body("title").isLength({ min: 5 }), body("content").isLength({ min: 5 })],
  postController.createPost
);

module.exports = router;
