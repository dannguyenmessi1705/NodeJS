const express = require("express");
const app = express();

// {SET COOKIE FOR EXPRESS} //
const cookies = require("cookie-parser"); // q
app.use(cookies("secret")); // Truyền "secret" để dùng các lệnh mã hoá Cookie

// {DÙNG MONGODB ĐỂ LƯU TRỮ SESSION} //
const session = require("express-session"); // Nhập module express-session
const URL = require("./util/database"); // Nhập vào object lấy URL connect MONGO từ file database.js
const MongoDBStore = require("connect-mongodb-session")(session); // Nhập module connect-mongodb-session để lưu session vào database
const storeDB = new MongoDBStore({
  // Tạo 1 store để lưu session vào database
  uri: URL, // Đường dẫn kết nối đến database
  collection: "sessions", // Tên collection để lưu session
});

// {SET SESSION FOR EXPRESS} //
// Cấu hình session
app.use(
  session({
    secret: "Nguyen Di Dan", // Chuỗi bí mật để mã hoá session
    resave: false, // resave: false => Không lưu lại session nếu không có sự thay đổi (Không cần thiết)
    saveUninitialized: false, // saveUninitialized: false => Không lưu lại session nếu không có sự thay đổi (Không cần thiết)
    // resave vs saveUninitialized: https://stackoverflow.com/questions/40381401/when-use-saveuninitialized-and-resave-in-express-session
    store: storeDB, // Lưu session vào database
  })
);

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));

app.set("view engine", "ejs");
app.set("views", "./views");

// {RUN SERVER + Add user to req (Phân quyền)} //
const IP = "192.168.1.6";
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
