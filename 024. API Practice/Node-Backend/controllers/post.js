// {VALIDATION}
const { validationResult } = require("express-validator"); // Nhập vào để check validation

// {MODELS}
const Post = require("../models/posts");

const postController = {
  getPost: async (req, res, next) => {
    try {
      const posts = await Post.find();
      res.status(200).json({ posts: posts });
    } catch (error) {
      const err = new Error(error);
      err.httpStatusCode = 500;
      next(err);
    }
  },
  createPost: async (req, res, next) => {
    const validattionErrors = validationResult(req);
    const { title, content } = req.body;
    try {
      if (!validattionErrors.isEmpty()) {
        return res.status(422).json({
          message: "Validation failed, entered data is incorrect.",
          errors: validattionErrors.array(),
        });
      }
      const post = new Post({
        title,
        content,
        image: "image/test.png",
        creator: {
          name: "Di Dan",
        },
      });
      post
        .save()
        .then((result) => {
          console.log(result);
          res.status(201).json({
            post: {
              _id: new Date().toISOString(),
              creator: {
                name: "Di Dan",
              },
              createdAt: new Date(),
              title,
              content,
              image: "image/test.png",
            },
          });
        })
        .catch((err) => {
          const error = new Error(err);
          error.httpStatusCode = 500;
          next(error);
        });
    } catch (error) {
      const err = new Error(error);
      err.httpStatusCode = 500;
      next(err);
    }
  },
};

module.exports = postController;
