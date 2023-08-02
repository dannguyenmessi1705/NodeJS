const express = require("express");
const app = express();


/*
// {USE DATABASE} //
const db = require("./util/database");
// Thực hiện câu lệnh SQL ở bên trong dấu nháy (sau đó trả về 1 promise)
db.execute("SELECT * FROM `node-shop`.`product-test`")
  .then(([data, field]) => {
    console.log(data); // Trả về 1 array chứa các dữ liệu data của đối tượng
    console.log(field); // Trả về 1 array chứa các trường dữ liệu của đối tượng
  }) // Kết quả trả về của promise là 1 array chứa 2 phần tử là [data] và field [[data], field] => dùng destructuring để lấy ra trong hàm callback của then
  .catch((err) => {
    console.log(err); // Trả về lỗi nếu có
  });
*/

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));

app.set("view engine", "ejs");
app.set("views", "./views");

const adminRoute = require("./Routes/admin");
const personRoute = require("./Routes/user");
const notFoundRoute = require("./Routes/notFound");

const path = require("path");
const rootDir = require("./util/path.js");
app.use(express.static(path.join(rootDir, "public")));

app.use("/admin", adminRoute);
app.use(personRoute);
app.use(notFoundRoute);

const IP = "192.168.1.15";
app.listen(3000, "localhost" || IP);
