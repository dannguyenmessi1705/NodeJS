const postController = {
  getPost: async (req, res, next) => {
    try {
      res.status(200).json({
        message: "Get post successfully",
        name: "Nguyen Van A",
        age: 20,
      });
    } catch (error) {
      const err = new Error(error);
      err.httpStatusCode = 500;
      next(err);
    }
  },
  createPost: async (req, res, next) => {
    const { name, age } = req.body;
    const id = Math.random().toString();
    try {
      res.status(201).json({message: "Create successfully", id: id, name: name, age: age });
    } catch (error) {
      const err = new Error(error);
      err.httpStatusCode = 500;
      next(err);
    }
  },
};

module.exports = postController;
