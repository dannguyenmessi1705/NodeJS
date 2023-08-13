// {SENDING EMAIL AFTER SIGNUP} //
const nodemailer = require("nodemailer"); // Nhập module nodemailer
// Tạo transporter để gửi mail
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com", // Host của mail server
  port: 465, // Port của mail server
  secure: true, // Sử dụng SSL
  auth: {
    user: "didannguyen@5dulieu.com", // mail dùng để gửi
    pass: "femryegbpgljleyv", // password của mail dùng để gửi (có thể dùng password ứng dụng) (https://myaccount.google.com/apppasswords) thay vì dùng password của mail
  },
});
const fs = require("fs"); // Nhập module fs
const rootPath = require("../util/path"); // Nhập đường dẫn tuyệt đối của thư mục gốc
const path = require("path"); // Nhập module path

const User = require("../models/users");
const bcrypt = require("bcrypt");
// {SESSION + COOKIES} // Đối với Session, phải tạo Session trước khi tạo Cookie
const postAuth = (req, res, next) => {
  const email = req.body.email; // Lấy giá trị email từ form
  const password = req.body.password; // Lấy giá trị password từ form
  User.findOne({ email: email }) // Tìm user có email = email
    .then((user) => {
      if (!user) {
        // Nếu không tìm thấy user
        // {FLASH MESSAGE} // Nếu password không trùng khớp
        req.flash("errorLogin", "Email or Password does not match!"); // Tạo flash message có tên là "error", giá trị là "Email or Password does not match!"
        return res.redirect("/login"); // Chuyển hướng về trang login
      }
      bcrypt
        .compare(password, user.password) // So sánh password nhập vào với password đã mã hoá trong database
        .then((isMatch) => {
          if (isMatch) {
            // {FLASH MESSAGE} //
            req.flash("successLogin", "Login successfully!"); // Tạo flash message có tên là "success", giá trị là "Login successfully!"
            // Nếu password trùng khớp
            req.session.isLogin = true; // Tạo Session có tên là "isLogin", giá trị là "true"
            req.session.user = user; // Tạo Session có tên là "user", giá trị là user vừa tìm được
            // req.session.cookie.maxAge = 3000; // Thời gian tồn tại của Session là 3s
            return req.session.save(() => {
              // Lưu Session
              res.redirect("/"); // Sau khi lưu Session thì mới chuyển hướng sang trang chủ (vì lưu Session là bất đồng bộ)
            });
          } else {
            // {FLASH MESSAGE} // Nếu password không trùng khớp
            req.flash("errorLogin", "Email or Password does not match!"); // Tạo flash message có tên là "error", giá trị là "Email or Password does not match!"
            return res.redirect("/login"); // Chuyển hướng về trang login
          }
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
};

const getAuth = (req, res, next) => {
  const [errorMessage] = req.flash("errorLogin"); // Lấy giá trị flash message có tên là "error"
  const [successSignup] = req.flash("successSignup"); // Lấy giá trị flash message có tên là "successSigup"
  res.render("./auth/login", {
    title: "Login",
    path: "/login",
    successSignup: successSignup, // Truyền giá trị flash message có tên là "success" vào biến successSigup
    errorMessage: errorMessage, // Truyền giá trị flash message có tên là "error" vào biến errorMessage
  });
};

// LOGOUT => SESSION SẼ XOÁ
const postLogout = (req, res, next) => {
  req.session.destroy(() => {
    // Xoá Session
    res.redirect("/"); // Sau khi xoá Session thì mới chuyển hướng sang trang chủ (vì xoá Session là bất đồng bộ)
  });
};

// SIGNUP
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
          // {FLASH MESSAGE} // Nếu username đã tồn tại
          req.flash("errorUsername", "Username is existed"); // Tạo flash message có tên là "error", giá trị là "Username is existed"
          return res.redirect("/signup"); // Chuyển hướng sang trang đăng ký
        }
        User.findOne({ email: email }) // Tìm kiếm 1 user trong collection có email là email
          .then((userEmail) => {
            if (userEmail) {
              // Nếu tìm thấy => email đã tồn tại
              // {FLASH MESSAGE} // Nếu email đã tồn tại
              req.flash("errorEmail", "Email is existed"); // Tạo flash message có tên là "error", giá trị là "Email is existed"
              return res.redirect("/signup"); // Chuyển hướng sang trang đăng ký
            } else if (password !== re_password) {
              // Nếu password và re_password không trùng khớp
              // {FLASH MESSAGE} // Nếu password không trùng khớp
              req.flash(
                "errorRePassword",
                "Password and Re-Password does not match"
              ); // Tạo flash message có tên là "error", giá trị là "Password does not match"
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
                  // {FLASH MESSAGE} // Nếu user mới tạo thành công
                  req.flash("successSignup", "Sign up successfully"); // Tạo flash message có tên là "success", giá trị là "Sign up successfully"
                  // Lưu user mới tạo
                  res.redirect("/login"); // Chuyển hướng sang trang đăng nhập

                  // {SEND MAIL} //
                  const pathImg = path.join(
                    rootPath,
                    "public",
                    "img",
                    "signup.png"
                  ); // Đường dẫn đến file hình ảnh
                  // Dùng transporter vừa tạo để gửi mail
                  transporter
                    .sendMail({
                      // Tạo 1 mail
                      from: "didannguyen@5dulieu.com", // Địa chỉ email của người gửi
                      to: email, // Địa chỉ email của người nhận
                      subject: "Signup Successfully", // Tiêu đề mail
                      html: `<h1>You signup successfully. Welcome to our service</h1>`, // Nội dung mail
                      attachments: [
                        // File đính kèm
                        {
                          filename: "signup.png", // Tên file đính kèm
                          content: fs.createReadStream(pathImg), // Nội dung file đính kèm
                        },
                      ],
                    })
                    .then((res) => console.log(res)) // Nếu gửi mail thành công
                    .catch((err) => console.log(err)); // Nếu gửi mail thất bại
                });
              });
          });
      })
      .catch((err) => console.log(err));
  }
  return res.redirect("/signup");
};

// {SIGNUP} //
const getSignup = (req, res, next) => {
  const [errorUsername] = req.flash("errorUsername"); // Lấy giá trị flash message có tên là "errorUsername"
  const [errorEmail] = req.flash("errorEmail"); // Lấy giá trị flash message có tên là "errorEmail"
  const [errorRePassword] = req.flash("errorRePassword"); // Lấy giá trị flash message có tên là "errorRePassword"
  res.render("./auth/signup", {
    title: "SignUp",
    path: "/signup",
    errorUsername: errorUsername,
    errorEmail: errorEmail,
    errorRePassword: errorRePassword,
  });
};

module.exports = {
  getAuth,
  postAuth,
  postLogout,
  getSignup,
  postSignup,
};
