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
const IP = "192.168.1.6";

app.use("/admin", adminRoute);
app.use(personRoute);
app.use(notFoundRoute);


const mongoConnect = require("./util/database").mongoConnect; // Nhập vào object lấy từ file database.js
mongoConnect(() => { 
  app.listen(3000, "localhost" || IP);
}); // Kết nối với database