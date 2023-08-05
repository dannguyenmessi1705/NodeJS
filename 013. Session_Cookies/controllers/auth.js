const getAuth = (req, res, next) => {
  /* Đối với NodeJS
  // if (isLogin) isLogin = isLogin.split("=")[1] == "true";
  */
  // Đối với ExpressJs + module cookie-parser
  let isLogin = req.cookies.isLogin;
  console.log(isLogin);
  res.render("./auth/login", {
    title: "Login",
    path: "/login",
    authenticate: isLogin,
  });
};
const postAuth = (req, res, next) => {
  /* Nếu khồng dùng Cookie hay Session, 
  res.isLogin = true // Khi sang route khác, sẽ bị reset tất cả response => Không thể gọi được isLogin, trừ khi đặt làm middleware trước khi đến các route khác
  */
  res.cookie("isLogin", "true"); // NodeJs đã thêm module ExpressJS + cookie-parser
  // res.setHeader("Set-Cookie", "isLogin=true")  // NodeJS
  res.redirect("/login");
};

module.exports = {
  getAuth,
  postAuth,
};
