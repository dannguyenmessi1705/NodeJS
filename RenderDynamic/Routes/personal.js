const express = require("express");
const route = express.Router();
const path = require("path");
const rootDir = require("../util/path.js");

/* {Sharing Data} */
const adminRoute = require("./admin.js");

route.get("/", (req, res) => {
  /* {Sharing Data} */
  adminRoute.products.forEach((e) => {
    console.log("product:", e.name);
  });
  // res.sendFile(path.join(rootDir, "views", "home.html"));
  /* {Template Engine: PUG} */
  res.render("home", { items: adminRoute.products, title: "Home", path: "/" }); // render file home.pug trong thư mục views/pug đã được set ở server.js, truyền vào đối số là một object chứa các thuộc tính cần thiết, được sử dụng trong file home.pug
});
module.exports = route;
