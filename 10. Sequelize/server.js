const express = require("express");
const app = express();

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

// {Tạo bảng trong database} //
// Nếu bảng đã tồn tại thì không tạo lại, nếu chưa tồn tại thì tạo mới
const sequelize = require("./util/database");
sequelize
  .sync()
  .then((result) => {
    // Vì promise là 1 bất đồng bộ, nên phải đưa việc khởi động server vào trong hàm promise đê đợi kết quả trả về
    const IP = "192.168.1.15";
    app.listen(3000, "localhost" || IP);
  })
  .catch((err) => {
    console.log(err);
  });
