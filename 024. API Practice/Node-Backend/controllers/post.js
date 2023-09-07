// {VALIDATION}
const { validationResult } = require("express-validator"); // Nhập vào để check validation
const fs = require("fs");
const path = require("path");

// {MODELS}
const Post = require("../models/posts");
const User = require("../models/users");

const postController = {
  getPost: async (req, res, next) => {
    try {
      const posts = await Post.find();
      if (!posts) {
        const err = new Error("Could not find post.");
        err.httpStatusCode = 404;
        throw err; // throw err sẽ bị catch bên dưới bắt được
      }
      res.status(200).json({ posts: posts });
    } catch (err) {
      if (!err.httpStatusCode) {
        err.httpStatusCode = 500;
      }
      next(err);
    }
  },
  createPost: async (req, res, next) => {
    try {
      const user = await User.findById(req.userId);
      if (!user) {
        const err = new Error("Not Authenticate");
        err.httpStatusCode = 401;
        throw err;
      }
      const validattionerrs = validationResult(req);
      const { title, content } = req.body;
      if (!req.file) {
        const err = new Error("No image provided.");
        err.httpStatusCode = 422;
        throw err; // throw err sẽ bị catch bên dưới bắt được
      }
      const imageUrl = req.file.path.replace(/\\/g, "/");
      if (!validattionerrs.isEmpty()) {
        const err = new Error("Validation failed, entered data is incorrect.");
        err.httpStatusCode = 422;
        throw err; // throw err sẽ bị catch bên dưới bắt được
      }
      const post = new Post({
        title,
        content,
        image: imageUrl,
        creator: {
          name: user.name,
        },
      });
      post
        .save()
        .then((result) => {
          if (!result) {
            const err = new Error("Could not create post.");
            err.httpStatusCode = 500;
            throw err; // throw err sẽ bị catch bên dưới bắt được
          }
          user.posts.push(result);
          user.save().then((result) => {
            res
              .status(201)
              .json({ message: "Post created successfully!", post: result });
          });
        })
        .catch((err) => {
          if (!err.httpStatusCode) {
            err.httpStatusCode = 500;
          }
          next(err);
        });
    } catch (err) {
      if (!err.httpStatusCode) {
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
        err.httpStatusCode = 404;
        throw err; // throw err sẽ bị catch bên dưới bắt được
      }
      res.status(200).json({ message: "Post found", post: post });
    } catch (err) {
      if (!err.httpStatusCode) {
        err.httpStatusCode = 500;
      }
      next(err);
    }
  },
  updatePost: async (req, res, next) => {
    try {
      const validattionerrs = validationResult(req);
      if (!validattionerrs.isEmpty()) {
        const err = new Error("Validation failed, entered data is incorrect.");
        err.httpStatusCode = 422;
        if (req.file) {
          imagePath = req.file.path.replace(/\\/g, "/");
          fs.unlinkSync(path.join(__dirname, "..", imagePath));
        }
        throw err; // throw err sẽ bị catch bên dưới bắt được
      }
      const user = await User.findById(req.userId);
      if (!user) {
        const err = new Error("Not Authenticate");
        err.httpStatusCode = 401;
        throw err;
      }
      const postId = req.params.postId;
      const { title, content } = req.body;
      let imageUrl = req.body.image;
      if (req.file) {
        imageUrl = req.file.path.replace(/\\/g, "/");
      }
      if (imageUrl === "undefined" || !imageUrl) {
        const err = new Error("No file picked.");
        err.httpStatusCode = 422;
        throw err; // throw err sẽ bị catch bên dưới bắt được
      }
      const post = await Post.findById(postId);
      if (!post) {
        const err = new Error("Could not find post.");
        err.httpStatusCode = 404;
        throw err; // throw err sẽ bị catch bên dưới bắt được
      }
      if (imageUrl !== post.image && post.image !== "undefined") {
        fs.unlinkSync(path.join(__dirname, "..", post.image));
      }
      post.title = title;
      post.content = content;
      post.image = imageUrl;
      const result = await post.save();
      res.status(200).json({ message: "Post updated!", post: result });
    } catch (err) {
      if (!err.httpStatusCode) {
        err.httpStatusCode = 500;
      }
      next(err);
    }
  },
  deletePost: async (req, res, next) => {
    const postId = req.params.postId;
    try {
      const user = await User.findById(req.userId);
      if (!user) {
        const err = new Error("Not Authenticate");
        err.httpStatusCode = 401;
        throw err;
      }
      const post = await Post.findById(postId);
      if (!post) {
        const error = new Error("Could not find post.");
        error.httpStatusCode = 404;
        throw error;
      }
      const pathImgDel = post.image;
      const result = await Post.findByIdAndDelete(postId);
      user.posts.pull(postId);
      const save = await user.save();
      fs.unlinkSync(path.join(__dirname, "..", pathImgDel));
      res.status(200).json({ message: "Post deleted", post: result });
    } catch (err) {
      if (!err.httpStatusCode) {
        err.httpStatusCode = 500;
      }
      next(err);
    }
  },
};

module.exports = postController;
