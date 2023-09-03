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
            image: "image/test.jpg",
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
    const {
      title,
      content,
    } = req.body;
    const creator = { name: "Di Dan" };
    const createdAt = new Date();
    const image = "image/test.jpg";
    const id = Math.random().toString();
    try {
      res.status(201).json({
        posts: [
          {
            _id: id,
            title,
            creator,
            createdAt,
            image,
            content,
          },
        ],
      });
    } catch (error) {
      const err = new Error(error);
      err.httpStatusCode = 500;
      next(err);
    }
  },
};

module.exports = postController;
