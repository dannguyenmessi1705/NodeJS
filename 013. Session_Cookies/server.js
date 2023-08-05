const express = require("express");
const app = express();

// {COOKIE FOR EXPRESS} //
const cookies = require("cookie-parser")
app.use(cookies())

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));

app.set("view engine", "ejs");
app.set("views", "./views");

// {RUN SERVER + Add user to req (Phân quyền)} //
const IP = "192.168.1.6";
const URL = require("./util/database"); // Nhập vào object lấy từ file database.js
const mongoose = require("mongoose"); // Nhập module mongoose
const User = require("./models/users"); // Nhập vào class User lấy từ file users.js
mongoose
  .connect(URL)
  .then(() => {
    User.findOne() // Tìm kiếm 1 user trong collection users (user đầu tiên)
      .then((user) => {
        if (!user) {
          // Nếu không có user nào thì tạo user mới
          const user = new User({
            username: "DanNguyen",
            email: "danprohy@gmail.com",
            cart: {
              items: [],
            },
          });
          user.save(); // Lưu user vào database
        }
      })
      .catch((err) => console.log(err));
    app.listen(3000, "localhost" || IP);
    console.log("Connected!");
  }) // Kết nối với database, sau đó mới chạy server
  .catch((err) => console.log(err));

// {MIDDLEWARE PHÂN QUYỀN} //
app.use((req, res, next) => {
  User.findById("64cc7af71adf0619fa3e8481") // Tìm kiếm user vừa tạo
    .then((user) => {
      // Nếu tìm thấy user thì lưu vào req
      if (user) {
        req.user = new User(user); // Lưu lại user vào request để sử dụng ở các middleware tiếp theo (không cần dùng new User vì user đã là object rồi, có thể dùng các method của mongoose cũng như từ class User luôn )
        next(); // Tiếp tục chạy các middleware tiếp theo
      }
    })
    .catch((err) => console.log(err));
});

// {LOGIN ROUTE} //
const loginRoute = require("./Routes/auth");
const adminRoute = require("./Routes/admin");
const personRoute = require("./Routes/user");
const notFoundRoute = require("./Routes/notFound");

const path = require("path");
const rootDir = require("./util/path.js");
app.use(express.static(path.join(rootDir, "public")));

app.use("/admin", adminRoute);
app.use(personRoute);
// {LOGIN ROUTE} //
app.use(loginRoute);
app.use(notFoundRoute);

/* 11. MongoDB
const express = require("express");
const app = express();

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));

app.set("view engine", "ejs");
app.set("views", "./views");

// {RUN SERVER} //
const mongoConnect = require("./util/database").mongoConnect; // Nhập vào object lấy từ file database.js
mongoConnect(() => {
  app.listen(3000, "localhost" || IP);
}); // Kết nối với database, sau đó mới chạy server

// {MIDDLEWARE với phân quyền USER} //
const User = require("./models/users"); // Nhập vào class User lấy từ file users.js
app.use((req, res, next) => {
  User.findById("64c88f273be19a3b8663c9aa") // Tìm kiếm user có id là "64c88f273be19a3b8663c9aa"
    .then((user) => {
      req.user = new User(user.username, user.email, user.cart, user._id); // Lưu lại user vào request để sử dụng ở các middleware tiếp theo
      next(); // Tiếp tục chạy các middleware tiếp theo
    })
    .catch((err) => console.log(err));
});

const adminRoute = require("./Routes/admin");
const personRoute = require("./Routes/user");
const notFoundRoute = require("./Routes/notFound");

const path = require("path");
const rootDir = require("./util/path.js");
app.use(express.static(path.join(rootDir, "public")));
const IP = "192.168.1.6";

app.use("/admin", adminRoute);
app.use(personRoute);
app.use(notFoundRoute);
*/
