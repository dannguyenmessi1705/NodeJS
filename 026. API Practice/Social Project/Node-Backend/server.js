const express = require("express");
const app = express();
const bodyParser = require("body-parser");
//app.use(bodyParser.urlencoded({extended: true})); // dùng cho application/x-www-form-urlencoded (loại mà form từ HTML submit lên)
app.use(bodyParser.json()); // dùng cho application/json (loại mà axios gửi lên)

// {COOKIE PARSER} - lưu và đọc cookie (dùng cho jsonwebtoken)
const cookie = require("cookie-parser");
app.use(cookie());

const port = 4000;
const cors = require("cors");
// app.use((req, res, next) => {
//     res.setHeader('Access-Control-Allow-Origin', '*'); // cho phép tất cả các domain đều có thể gọi API
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // cho phép các method này
//     res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // dùng để gửi header lên
// })
// ==== app.use(cors()); // cho phép tất cả các domain đều có thể gọi API

app.use(cors()); // cho phép tất cả các domain đều có thể gọi API
const path = require("path");

// {FILE UPLOAD}
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "image");
  },
  filename(req, file, cb) {
    cb(null, uuidv4() + "-" + file.originalname);
  },
});
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
}; // chỉ cho phép upload file có đuôi là png, jpg, jpeg
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")
); // single("image") là tên của field trong form

// {STATIC FILE}
app.use("/image", express.static(path.join(__dirname, "image")));

// {ROUTES}
const postRoute = require("./routes/post");
const authRoute = require("./routes/auth");
app.use("/auth", authRoute);
app.use("/v1", postRoute);

// {CONNECT TO MONGODB}
const mongoose = require("mongoose");
const URL = require("./util/database");
mongoose
  .connect(URL)
  .then(() => {
    app.listen(port, "localhost", () => {
      console.log(`Server is running at ${port}`);
    });
  })
  .catch((err) => {
    const error = new Error(err);
    error.httpStatusCode = 500;
    next(error);
  });

app.use((err, req, res, next) => {
  statusCode = err.statusCode || 500;
  message = err.message;
  res.status(statusCode).json({
    message: message,
  });
});
