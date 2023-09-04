// {VALIDATION}
const { validationResult } = require("express-validator"); // Nhập vào để check validation

// {MODELS}
const Post = require("../models/posts");

const postController = {
  getPost: async (req, res, next) => {
    try {
      const posts = await Post.find();
      if (!posts) {
        const err = new Error("Could not find post.");
        err.statusCode = 404;
        throw err; // throw err sẽ bị catch bên dưới bắt được
      }
      res.status(200).json({ posts: posts });
    } catch (err) {
      if (!err.statusCode) {
        err.httpStatusCode = 500;
      }
      next(err);
    }
  },
  createPost: async (req, res, next) => {
    const validattionerrs = validationResult(req);
    const { title, content } = req.body;
    if (!req.file) {
      const err = new Error("No image provided.");
      err.statusCode = 422;
      throw err; // throw err sẽ bị catch bên dưới bắt được
    }
    const imageUrl = req.file.path.replace(/\\/g, "/");
    try {
      if (!validattionerrs.isEmpty()) {
        const err = new Error("Validation failed, entered data is incorrect.");
        err.statusCode = 422;
        throw err; // throw err sẽ bị catch bên dưới bắt được
      }
      const post = new Post({
        title,
        content,
        image: imageUrl,
        creator: {
          name: "Di Dan",
        },
      });
      post
        .save()
        .then((result) => {
          if (!result) {
            const err = new Error("Could not create post.");
            err.statusCode = 500;
            throw err; // throw err sẽ bị catch bên dưới bắt được
          }
          res
            .status(201)
            .json({ message: "Post created successfully!", post: result });
        })
        .catch((err) => {
          if (!err.statusCode) {
            err.httpStatusCode = 500;
          }
          next(err);
        });
    } catch (err) {
      if (!err.statusCode) {
        err.httpStatusCode = 500;
      }
      next(err);
    }
  },
  getPostById: async (req, res, next) => {
    const postId = req.params.postId;
    try {
      const post = await Post.findById(postId);
      if (!post) {
        const err = new Error("Could not find post.");
        err.statusCode = 404;
        throw err; // throw err sẽ bị catch bên dưới bắt được
      }
      res.status(200).json({ message: "Post found", post: post });
    } catch (err) {
      if (!err.statusCode) {
        err.httpStatusCode = 500;
      }
      next(err);
    }
  },
};

module.exports = postController;
