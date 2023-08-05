const Order = require("../models/orders");
const Product = require("../models/products");
// {GET ALL PRODUCTS BY MONGOOSE} //
const getIndex = (req, res) => {
  Product.find()
    .then((products) => {
      res.render("./user/index", {
        title: "Home",
        items: products,
        path: "/",
      });
    })
    .catch((err) => console.log(err));
};

// {GET ALL PRODUCTS BY MONGOOSE} //
const getProduct = (req, res) => {
  Product.find()
    .then((products) => {
      res.render("./user/productList", {
        title: "Product",
        items: products,
        path: "/product",
      });
    })
    .catch((err) => console.log(err));
};

// {GET PRODUCT DETAIL BY MONGOOSE} //
const getDetail = (req, res) => {
  const ID = req.params.productID; // Lấy route động :productID bên routes (URL) - VD: http://localhost:3000/product/0.7834371053383911 => ID = 0.7834371053383911
  Product.findById(ID)
    .then((product) => {
      res.render("./user/productDetail", {
        title: "Product Detail",
        path: "/product",
        item: product,
      });
    })
    .catch((err) => console.log(err));
};

// {POST CART USER BY MONGOOSE} //
const postCart = (req, res) => {
  const ID = req.body.id; // ".id" vì id được đặt trong thuộc tính name của thẻ input đã được hidden
  Product.findById(ID) // Tìm product có _id = ID
    .then((product) => {
      req.user
        .postCartByUser(product) // Thêm product vào cart User
        .then(() => {
          return res.redirect("/cart");
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
};

// {GET CART USER BY MONGOOSE} //
const getCart = (req, res) => {
  req.user
    .populate("cart.items.productId") // Lấy tất cả dữ liệu user, populate để lấy thêm dữ liệu từ collection products vào thuộc tính productId của cart
    .then((user) => {
      let products = [...user.cart.items]; // Sau khi lấy được dữ liệu từ collection products qua populate, copy lại vào biến products
      return products; // Trả về kết quả
    })
    .then((products) => {
      // products = [{productId: {}, quantity, _id} ,{}]
      let totalPrice = products.reduce((sum, product, index) => {
        // Tính tổng tiền của tất cả product trong cart
        return +product.productId.price * product.quantity + sum;
      }, 0); // Tính tổng tiền của tất cả product trong cart
      return res.render("./user/cart", {
        title: "Cart",
        path: "/cart",
        items: products,
        totalPrice: totalPrice,
      }); // Render ra dữ liệu, đồng thời trả về các giá trị động cho file cart.ejs
    })
    .catch((err) => console.log(err));
};

// {DELETE CART USER BY MONGOOSE} //
const deleteCart = (req, res) => {
  const ID = req.body.id; // ".id" vì id được đặt trong thuộc tính name của thẻ input đã được hidden
  Product.findById(ID) // Tìm product có _id = ID
    .then((product) => {
      req.user
        .deleteCartByUser(product) // Xoá product trong cart User
        .then((result) => {
          return res.redirect("/cart");
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
};

// {POST ORDER BY USER IN MONGOOSE}
const postOrder = (req, res) => {
  req.user
    .populate("cart.items.productId") // Lấy tất cả dữ liệu user, populate để lấy thêm dữ liệu từ collection products vào thuộc tính productId của cart
    .then((user) => {
      const products = [...user.cart.items]; // Sau khi lấy được dữ liệu từ collection products qua populate, copy lại vào biến products
      return products;
    })
    .then((products) => {
      const productArray = products.map((item) => {
        // Tạo mảng mới chứa các object product và quantity
        return {
          product: item.productId._doc, // _doc là thuộc tính của mongoose, nó sẽ lấy ra tất cả các thuộc tính của object productId
          quantity: item.quantity, // Lấy quantity từ cart
        };
      });
      const order = new Order({
        // Tạo order mới
        products: productArray,
        user: {
          username: req.user.username,
          email: req.user.email,
          userId: req.user._id,
        },
      });
      return order.save(); // Lưu order vào database
    })
    .then(() => {
      return req.user.clearCart(); // Xoá cart của user
    })
    .then(() => res.redirect("/order"))
    .catch((err) => console.log(err));
};

// {GET ORDER BY USER IN MONGOOSE} //
const getOrder = (req, res) => {
  Order.find({ "user.userId": req.user._id }) // Tìm kiếm order có userId = userId của user hiện tại
    .then((orders) => {
      // orders = [{ {products: {}, quantity}, user{}}, {}]
      res.render("./user/order", {
        title: "Order",
        path: "/order",
        orders: orders,
      });
    })
    .catch((err) => console.log(err));
};

module.exports = {
  getIndex,
  getProduct,
  getDetail,
  postCart,
  getCart,
  deleteCart,
  postOrder,
  getOrder,
};

/* 11. MongoDB
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

// {GET ALL PRODUCTS In CART MONGODB} //
const getCart = (req, res) => {
  // Lấy tất cả dữ liệu trong cart
  req.user
    .getCartByUser() // Lấy cart của user
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

// {DELETE CART IN MONGODB} //
const deleteCart = (req, res) => {
  const ID = req.body.id; // Lấy giá id từ trong thẻ input đã được hidden trong cart.ejs (mục đích dùng input là để lấy ra id của product đã có sẵn trong database, không cần phải thông qua việc kiểm tra id đó có tồn tại hay không)
  // Tìm ID sản phẩm
  Product.findById(ID)
    .then((product) => {
      if (product) {
        return req.user.deleteCartByUser(product);
      }
    })
    .then((result) => {
      console.log("Deleted!");
      res.redirect("/cart");
    })
    .catch((err) => console.log(err));
};

// {GET ALL ORDERS IN MONGODB} //
const getOrder = (req, res) => {
  req.user
    .getOrderByUser() // Lấy tất cả order của user, include: ['products'] để add thêm tất cả products vào thuộc tính products của order
    .then((orderItems) => {
      res.render("./user/order", {
        title: "Order",
        path: "/order",
        orders: orderItems,
      });
    })
    .catch((err) => console.log(err));
};
// {POST ORDER IN MONGODB} //
const postOrder = (req, res) => {
  req.user
    .addOrderByUser()
    .then(() => {
      res.redirect("/order");
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
*/
