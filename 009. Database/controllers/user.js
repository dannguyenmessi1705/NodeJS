const Product = require("../models/products");
const Cart = require("../models/carts");

// {GET ALL PRODUCTS FROM MYSQL} //
const getIndex = (req, res) => {
  Product.fetchAll()
    .then(([value, field]) => {
      // Kết quả trả về của promise là 1 array chứa 2 phần tử là [data] và field [[data], field] => dùng destructuring để lấy ra trong hàm callback của then
      res.render("./user/index", {
        title: "Home",
        items: value,
        path: "/",
      });
    })
    .catch((err) => console.log(err));
};

// {GET ALL PRODUCTS FROM MYSQL} //
const getProduct = (req, res) => {
  Product.fetchAll()
    .then(([value, field]) => {
      // Kết quả trả về của promise là 1 array chứa 2 phần tử là [data] và field [[data], field] => dùng destructuring để lấy ra trong hàm callback của then
      res.render("./user/productList", {
        title: "Product",
        items: value,
        path: "/product",
      });
    })
    .catch((err) => console.log(err));
};

// {GET PRODUCT BY ID FROM MYSQL} //
const getDetail = (req, res) => {
  const ID = req.params.productID; // lấy id của sản phẩm từ dynamic route, params là thuộc tính của req, productID là tên dynamic route
  // VD: http://localhost:3000/product/0.7834371053383911 => ID = 0.7834371053383911
  Product.findByID(ID)
    .then(([[value], field]) => {
      res.render("./user/productDetail", {
        title: "Product Detail",
        path: "/product",
        item: value,
      }); // promise trả về result = [[value], field] trong database => dùng destructuring trong hàm then
    })
    .catch((err) => console.log(err));
};

// {UI CART} //
const getCart = (req, res) => {
  // Lấy tất cả dữ liệu trong cart
  Cart.fetchCart((carts) => {
    // Lấy tất cả dữ liệu trong product
    Product.fetchAll()
      .then(([value, field]) => {
        // Kết quả trả về của promise là 1 array chứa 2 phần tử là [data] và field [[data], field] => dùng destructuring để lấy ra trong hàm callback của then
        const productInCart = []; // Tạo 1 mảng lưu các giá trị ID trong cart = product
        value.forEach((item) => {
          const hasProduct = carts.products.find(
            (cartProduct) => cartProduct.id == item.id
          );
          // hasProduct trả về 1 product trong cart trùng với product bên ngoài
          if (hasProduct) {
            productInCart.push({ cartItem: item, count: hasProduct.count }); // đưa product bên ngoài và số lượng product trong giỏ hàng vào mảng
          }
          // Render ra dữ liệu, đồng thời trả về các giá trị động cho file cart.ejs
          res.render("./user/cart", {
            title: "Cart",
            path: "/cart",
            totalPrice: carts.totalPrice,
            items: productInCart,
          });
        });
      })
      .catch((err) => console.log(err));
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

// {DELETE CART} //
const deleteCart = (req, res) => {
  const ID = req.body.id; // Lấy giá id từ trong thẻ input đã được hidden trong cart.ejs (mục đích dùng input là để lấy ra id của product đã có sẵn trong database, không cần phải thông qua việc kiểm tra id đó có tồn tại hay không)
  // Tìm ID sản phẩm
  Product.findByID(ID, (item) => {
    // Nếu tìm được
    if (item)
      // Xoá sản phẩm trong giỏ hàng
      Cart.deleteCartItem(ID, item.product.price);
    res.redirect("/cart");
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
  getDetail,
  getCart,
  postCart,
  deleteCart,
  getCheckout,
  getOrder,
};
