const isAuth = (req, res, next) => {
  if (req.session.username && req.session.password) {
    req.username = req.session.username;
    req.password = req.session.password;
    next();
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
};
module.exports = isAuth;
