const Product = require("../models/products");
const addProduct = (req, res) => {
  res.render("./admin/addProduct", {
    title: "Add Product",
    path: "/admin/add-product",
  });
};

const postProduct = (req, res) => {
  const data = JSON.parse(JSON.stringify(req.body));
  const product = new Product(data);
  product.save();
  res.redirect("/");
};

const getProduct = (req, res) => {
  Product.fetchAll((products) => {
    res.render("./admin/products", {
      title: "Admin Product",
      items: products,
      path: "/admin/product",
    });
  });
};

module.exports = {
  addProduct,
  postProduct,
  getProduct,
};
