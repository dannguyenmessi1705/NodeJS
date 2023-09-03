const express = require("express");
const app = express();
const bodyParser = require("body-parser");
//app.use(bodyParser.urlencoded({extended: true})); // dùng cho application/x-www-form-urlencoded (loại mà form từ HTML submit lên)
app.use(bodyParser.json()); // dùng cho application/json (loại mà axios gửi lên)
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
app.use(express.static(path.join(__dirname, "img")));

const postRoute = require("./routes/post");
app.use("/v1", postRoute);

app.listen(port, "localhost", () => {
  console.log(`Server is running at ${port}`);
});

app.use((err, req, res, next) => {
  res.status(err.httpStatusCode).json({
    message: err.message,
  });
});
