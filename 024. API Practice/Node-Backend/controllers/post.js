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
    const { title, content } = req.body;
    try {
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
