const Product = require("../models/products");

// {GET ALL PRODUCTS MONGODB} //
const getIndex = (req, res) => {
  Product.fetchAll()
    .then((products) => {
      res.render("./user/index", {
        title: "Home",
        items: products,
        path: "/",
      });
    })
    .catch((err) => console.log(err));
};

// {GET ALL PRODUCTS MONGODB} //
const getProduct = (req, res) => {
  Product.fetchAll()
    .then((products) => {
      // Kết quả trả về của promise là 1 array chứa 2 phần tử là [data] và field [[data], field] => dùng destructuring để lấy ra trong hàm callback của then
      res.render("./user/productList", {
        title: "Product",
        items: products,
        path: "/product",
      });
    })
    .catch((err) => console.log(err));
};

// {FIND BY ID IN MONGODB} //
const getDetail = (req, res) => {
  const ID = req.params.productID; // lấy id của sản phẩm từ dynamic route, params là thuộc tính của req, productID là tên dynamic route
  // VD: http://localhost:3000/product/0.7834371053383911 => ID = 0.7834371053383911
  Product.findById(ID)
    .then((product) => {
      res.render("./user/productDetail", {
        title: "Product Detail",
        path: "/product",
        item: product,
      }); // promise trả về result = [[value], field] trong database => dùng destructuring trong hàm then
    })
    .catch((err) => console.log(err));
};

// {GET ALL PRODUCTS In CART AT DATABASE FROM USER} //
// {USE SPECIAL METHOD SEQUELIZE} //
const getCart = (req, res) => {
  // Lấy tất cả dữ liệu trong cart
  req.user
    .getCartUser() // Lấy cart của user
    .then((products) => {
      // products = [{} ,{}]
      let totalPrice = products.reduce((sum, product, index) => {
        return +product.price * product.quantity + sum;
      }, 0); // Tính tổng tiền của tất cả product trong cart
      res.render("./user/cart", {
        title: "Cart",
        path: "/cart",
        items: products,
        totalPrice: totalPrice,
      }); // Render ra dữ liệu, đồng thời trả về các giá trị động cho file cart.ejs
    }) // Lấy tất cả product trong cart
    .catch((err) => console.log(err));
};

// {POST CART IN MONGODB} //
const postCart = (req, res) => {
  const ID = req.body.id; // Lấy giá id từ trong thẻ input đã được hidden trong addCart.ejs (mục đích dùng input là để lấy ra id của product đã có sẵn trong database, không cần phải thông qua việc kiểm tra id đó có tồn tại hay không)
  Product.findById(ID).then((product) => {
    // Tìm ID sản phẩm và thêm vào cart qua phương thức addToCart của req.user (đã được lưu ở middleware phân quyền)
    return req.user
      .addToCart(product)
      .then((result) => {
        res.redirect("/cart");
      })
      .catch((err) => console.log(err));
  });
};

// {DELETE CART} //
const deleteCart = (req, res) => {
  const ID = req.body.id; // Lấy giá id từ trong thẻ input đã được hidden trong cart.ejs (mục đích dùng input là để lấy ra id của product đã có sẵn trong database, không cần phải thông qua việc kiểm tra id đó có tồn tại hay không)
  // Tìm ID sản phẩm
  Product.findById(ID)
    .then((product) => {
      if (product) {
        return req.user.deleteCartUser(product);
      }
    })
    .then((result) => {
      console.log("Deleted!");
      res.redirect("/cart");
    })
    .catch((err) => console.log(err));
};

const getOrder = (req, res) => {
  req.user
    .getOrders({ include: ["products"] }) // Lấy tất cả order của user, include: ['products'] để add thêm tất cả products vào thuộc tính products của order
    .then((orders) => {
      res.render("./user/order", {
        title: "Order",
        path: "/order",
        items: orders,
      });
    })
    .catch((err) => console.log(err));
};
const postOrder = (req, res) => {
  let storeCart; // Lưu lại cart
  req.user
    .getCart() // Lấy cart của user
    .then((cart) => {
      storeCart = cart; // Lưu lại cart
      return cart.getProducts(); // Lấy tất cả product trong cart
    })
    .then((products) => {
      return req.user
        .createOrder() // Tạo order cho user
        .then((order) => {
          return order.addProducts(
            products.map((product) => {
              product.orderitems = {
                count: product.cartitems.count,
              }; // Thêm thuộc tính count vào orderitems của product thong qua bảng trung gian cartitems
              return product;
            })
          ); // Thêm product vào order, thông qua bảng trung gian OrderItem (productId, orderId thêm vào đây)
        })
        .then(() => {
          storeCart.setProducts(null); // Xoá tất cả product trong cart khi đã thêm vào order
          res.redirect("/order"); // Sau khi thêm product vào order thì chuyển hướng đến trang order
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
};

module.exports = {
  getIndex,
  getProduct,
  getDetail,
  getCart,
  postCart,
  deleteCart,
  getOrder,
  postOrder,
};
