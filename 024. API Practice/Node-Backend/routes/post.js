const express = require("express");
const router = express.Router();
const postController = require("../controllers/post");
// {Protect route}
const Protect = require("../middleware/isAuth");

// VALIDATION
const { body } = require("express-validator");

// GET http://localhost:4000/v1/posts
router.get("/posts", postController.getPost);

// POST http://localhost:4000/v1/posts
router.post(
  "/posts",
  Protect,
  [body("title").isLength({ min: 5 }), body("content").isLength({ min: 5 })],
  postController.createPost
);

// GET POST DETAIL BY ID http://localhost:4000/v1/posts/:postId
router.get("/posts/:postId", postController.getPostById);

// PUT http://localhost:4000/v1/posts/:postId
router.put(
  "/posts/:postId",
  Protect,
  [body("title").isLength({ min: 5 }), body("content").isLength({ min: 5 })],
  postController.updatePost
);

// DELETE http://localhost:4000/v1/posts/:postId
router.delete("/posts/:postId", Protect, postController.deletePost);

module.exports = router;
