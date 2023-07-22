const express = require("express");
const route = express.Router();
const path = require("path");
const rootDir = require("../util/path.js");

/* {Sharing Data} */
const adminRoute = require("./admin.js");

route.get("/", (req, res) => {
  /* {Sharing Data} */
  adminRoute.products.forEach((e) => {
    console.log("product:", e.name, e.price, e.description);
  });
  // res.sendFile(path.join(rootDir, "views", "home.html"));

  /*
  // {Render Dynamic: handlebars} //
  res.render("home", {
    items: adminRoute.products,
    title: "Home",
    homeCSS: true,
    activeHome: true,
    hasProduct: adminRoute.products.length > 0,
  }); // render file home.hbs trong thư mục views/handlebars đã được set ở server.js, truyền vào đối số là một object chứa các thuộc tính cần thiết, được sử dụng trong file home.hbs
  */

  /*
  // {Render Dynamic: PUG} //
  res.render("home", { items: adminRoute.products, title: "Home", path: "/" }); // render file home.pug trong thư mục views/pug đã được set ở server.js, truyền vào đối số là một object chứa các thuộc tính cần thiết, được sử dụng trong file home.pug
  */

  // {Render Dynamic: EJS} //
  res.render("home", { title: "Home", items: adminRoute.products, path: "/" }); // render file home.ejs trong thư mục views/pug đã được set ở server.js, truyền vào đối số là một object chứa các thuộc tính cần thiết, được sử dụng trong file home.ejs
});
module.exports = route;
