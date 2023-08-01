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
      req.user = user; // Lưu lại user vào request để sử dụng ở các middleware tiếp theo
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
