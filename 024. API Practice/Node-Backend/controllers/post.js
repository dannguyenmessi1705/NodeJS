// {VALIDATION}
const { validationResult } = require("express-validator"); // Nhập vào để check validation

const postController = {
  getPost: async (req, res, next) => {
    try {
      res.status(200).json({
        posts: [
          {
            title: "testing",
            creator: {
              name: "Di Dan",
            },
            createdAt: new Date(),
            image: "image/test.png",
            content: "test123",
          },
        ],
      });
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
    } catch (error) {
      const err = new Error(error);
      err.httpStatusCode = 500;
      next(err);
    }
  },
};

module.exports = postController;
