const getAuth = (req, res, next) => {
  res.render("./auth/login", {
    title: "Login",
    path: "/login",
  });
};

module.exports = getAuth;
