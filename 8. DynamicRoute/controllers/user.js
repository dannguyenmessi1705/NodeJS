const Product = require("../models/products");
const Cart = require("../models/carts");

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

// {ADD PRODUCT ID} //
const getDetail = (req, res) => {
  const ID = req.params.productID; // lấy id của sản phẩm từ dynamic route, params là thuộc tính của req, productID là tên dynamic route
  // VD: http://localhost:3000/product/0.7834371053383911 => ID = 0.7834371053383911
  Product.findByID(ID, (product) => {
    console.log(product);
    res.render("./user/productDetail", {
      title: "Product Detail",
      path: "/product/:productID",
      productID: ID,
      item: product,
    });
  });
};
const getCart = (req, res) => {
  res.render("./user/cart", {
    title: "Cart",
    path: "/cart",
  });
};

// {POST CART} //
const postCart = (req, res) => {
  const ID = req.body.productID; // Lấy giá id từ trong thẻ input đã được hidden trong productList.ejs, productDetail.ejs và index.ejs
  Product.findByID(ID, (product) => {
    Cart.addCart(ID, product.product.price);
  });
  res.redirect("/cart");
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
  getDetail,
  getCart,
  postCart,
  getCheckout,
  getOrder,
};
