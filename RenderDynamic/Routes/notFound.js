const express = require("express");
const route = express.Router();

const path = require("path");

const rootDir = require("../util/path.js");

route.get("/*", (req, res) => {
  // res.status(404).sendFile(path.join(rootDir, "views", "404.html"));
  /* {Render Dynamic: PUG} */
  res.status(404).render("404", { title: "Page Not Found" }); // render file 404.pug trong thư mục views/pug đã được set ở server.js, truyền vào đối số là một object chứa các thuộc tính cần thiết, được sử dụng trong file 404.pug
});

module.exports = route;
