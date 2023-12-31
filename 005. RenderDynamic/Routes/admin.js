const express = require("express");
const route = express.Router();
const path = require("path");
const rootDir = require("../util/path.js");

/* {Sharing Data} */
const products = []; // Tạo biến đê lưu trữ dữ liệu mỗi khi có request tới route này, đây là một bộ nhớ tạm thời, dữ liệu này sẽ bị mất chỉ khi server bị tắt

route.get("/add-product", (req, res) => {
  // res.sendFile(path.join(rootDir, "views", "addProduct.html"));

  /*
  // {Render Dynamic: handlebars} //
  res.render("addProduct", {
    title: "Add Product",
    activeAdd: true,
    addCSS: true,
    formCSS: true,
    homeCSS: true,
  }); // render file addProduct.hbs trong thư mục views/handlebars đã được set ở server.js, truyền vào đối số là một object chứa các thuộc tính cần thiết, được sử dụng trong file addProduct.hbs
  */

  /*
  // {Render Dynamic: PUG} //
  res.render("addProduct", { title: "Add Product", path: "/admin/add-product" }); // render file addProduct.pug trong thư mục views/pug đã được set ở server.js, truyền vào đối số là một object chứa các thuộc tính cần thiết, được sử dụng trong file addProduct.pug
  */

  // {Render Dynamic: EJS} //
  res.render("addProduct", {title: "Add Product", path: "/admin/add-product"}) // render file addProduct.ejs trong thư mục views/pug đã được set ở server.js, truyền vào đối số là một object chứa các thuộc tính cần thiết, được sử dụng trong file addProduct.ejs
});
route.post("/add-product", (req, res) => {
  const data = JSON.parse(JSON.stringify(req.body));
  // data = { name: '' }
  /* {Sharing Data} */
  products.push(data); // Lưu dữ liệu vào biến products
  res.redirect("/");
});

module.exports = {
  route,
  /* {Sharing Data} */
  products,
};
