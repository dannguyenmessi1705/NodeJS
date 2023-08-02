const Product = require("../models/products");

const getIndex = (req, res) => {
  Product.fetchAll((products) => {
    res.render("./user/index", {
      title: "Home",
      items: products,
      path: "/",
    });
  });
};

const getProduct = (req, res) => {
  Product.fetchAll((products) => {
    res.render("./user/productList", {
      title: "Product",
      items: products,
      path: "/product",
    });
  });
};

const getCart = (req, res) => {
  res.render("./user/cart", {
    title: "Cart",
    path: "/cart",
  });
};

const getCheckout = (req, res) => {
  res.render("./user/checkout", {
    title: "Checkout",
    path: "/checkout",
  });
};

const getOrder = (req, res) => {
  res.render("./user/order", {
    title: "Order",
    path: "/order",
  });
};

module.exports = {
  getIndex,
  getProduct,
  getCart,
  getCheckout,
  getOrder,
};
