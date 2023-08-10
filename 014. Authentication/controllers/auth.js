const User = require("../models/users");
const bcrypt = require("bcrypt");
// {SESSION + COOKIES} // Đối với Session, phải tạo Session trước khi tạo Cookie
const getAuth = (req, res, next) => {
  res.render("./auth/login", {
    title: "Login",
    path: "/login",
    authenticate: req.session.isLogin,
  });
};
const postAuth = (req, res, next) => {
  const email = req.body.email; // Lấy giá trị email từ form
  const password = req.body.password; // Lấy giá trị password từ form
  User.findOne({ email: email }) // Tìm user có email = email
    .then((user) => {
      if (!user) {
        // Nếu không tìm thấy user
        console.log("Email or Password do not match");
        return res.redirect("/login"); // Chuyển hướng về trang login
      }
      bcrypt
        .compare(password, user.password) // So sánh password nhập vào với password đã mã hoá trong database
        .then((isMatch) => {
          if (isMatch) {
            // Nếu password trùng khớp
            req.session.isLogin = true; // Tạo Session có tên là "isLogin", giá trị là "true"
            req.session.user = user; // Tạo Session có tên là "user", giá trị là user vừa tìm được
            // req.session.cookie.maxAge = 3000; // Thời gian tồn tại của Session là 3s
            return req.session.save(() => {
              // Lưu Session
              res.redirect("/"); // Sau khi lưu Session thì mới chuyển hướng sang trang chủ (vì lưu Session là bất đồng bộ)
            });
          } else {
            console.log("Email or Password do not match"); // Nếu password không trùng khớp
            return res.redirect("/login"); // Chuyển hướng về trang login
          }
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
};

// LOGOUT => SESSION SẼ XOÁ
const postLogout = (req, res, next) => {
  req.session.destroy(() => {
    // Xoá Session
    res.redirect("/"); // Sau khi xoá Session thì mới chuyển hướng sang trang chủ (vì xoá Session là bất đồng bộ)
  });
};

// {SIGNUP} //
const getSignup = (req, res, next) => {
  res.render("./auth/signup", {
    title: "SignUp",
    path: "/signup",
    authenticate: false,
  });
};

const postSignup = (req, res, next) => {
  const username = req.body.username; // Lấy giá trị username từ form
  const email = req.body.email; // Lấy giá trị email từ form
  const password = req.body.password; // Lấy giá trị password từ form
  const re_password = req.body.re_password; // Lấy giá trị re_password từ form
  if (username && email && password && re_password) {
    // Nếu tất cả các giá trị đều tồn tại
    return User.findOne({ username: username }) // Tìm kiếm 1 user trong collection có username là username
      .then((name) => {
        if (name) {
          // Nếu tìm thấy => username đã tồn tại
          console.log("The username is existed"); // In ra màn hình
          return res.redirect("/signup"); // Chuyển hướng sang trang đăng ký
        }
        User.findOne({ email: email }) // Tìm kiếm 1 user trong collection có email là email
          .then((userEmail) => {
            if (userEmail) {
              // Nếu tìm thấy => email đã tồn tại
              console.log("The email is existed");
              return res.redirect("/signup"); // Chuyển hướng sang trang đăng ký
            }
            bcrypt
              .hash(password, 12) // Nếu không tìm thấy => Mã hóa password với số lần lặp là 12
              .then((hashPassword) => {
                const user = new User({
                  // Tạo 1 user mới
                  username: username,
                  email: email,
                  password: hashPassword,
                  cart: {
                    items: [],
                  },
                });
                return user.save().then(() => {
                  // Lưu user mới tạo
                  res.redirect("/login"); // Chuyển hướng sang trang đăng nhập
                });
              });
          });
      })
      .catch((err) => console.log(err));
  }
  return res.redirect("/signup");
};

module.exports = {
  getAuth,
  postAuth,
  postLogout,
  getSignup,
  postSignup,
};
