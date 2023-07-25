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
  const ID = req.params.id; // lấy id của sản phẩm từ dynamic route, params là thuộc tính của req, productID là tên dynamic route
  // VD: http://localhost:3000/product/0.7834371053383911 => ID = 0.7834371053383911
  Product.findByID(ID, (product) => {
    console.log(product);
    res.render("./user/productDetail", {
      title: "Product Detail",
      path: "/product",
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
  const ID = req.body.id; // Lấy giá id từ trong thẻ input đã được hidden trong addCart.ejs (mục đích dùng input là để lấy ra id của product đã có sẵn trong database, không cần phải thông qua việc kiểm tra id đó có tồn tại hay không)
  Product.findByID(ID, (item) => {
    Cart.addCart(ID, item.product.price);
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
