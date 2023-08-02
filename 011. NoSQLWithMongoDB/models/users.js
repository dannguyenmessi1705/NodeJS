const { get } = require("../Routes/admin");

const getDB = require("../util/database").getDB; // Nhập vào object getDB lấy từ file database.js
const ObjectId = require("mongodb").ObjectId; // Nhập module ObjectId từ mongodb

// Tạo class User
class User {
  // Khơi tạo constructor có lưu username, email, id , cart của người dùng
  constructor(username, email, cart, id) {
    this.username = username;
    this.email = email;
    this.cart = cart; // cart: {items: [{product: , quantity: }]}
    this._id = new ObjectId(id);
  }
  // Lưu user vào database
  save() {
    const db = getDB(); // Lấy database từ server MongoDB (xử lý trong file database.js)
    db.collection("users").insertOne(this); // Lấy collection users trong database (nếu chưa có sẽ tự động tạo mới) và Thêm user vào collection users (this ở đây chính là object user được tạo ra từ class User)
  }
  // Tìm kiếm user theo id
  static findById(userID) {
    const db = getDB(); // Lấy database từ server MongoDB (xử lý trong file database.js)
    const ID = new ObjectId(userID); // Tạo object ID từ string userID (vì userID là string, còn ID là object)
    return db
      .collection("users") // Lấy collection users trong database (nếu chưa có sẽ tự động tạo mới)
      .findOne({ _id: ID }) // Tìm kiếm user trong collection users có id là ID (Nếu muốn trả về object không cần next() thì dùng findOne())
      .then((result) => {
        return result;
      })
      .catch((err) => console.log(err));
  }
  // Thêm product vào cart
  addToCart(product) {
    // Nếu ban đầu cart chưa có thuộc tính items (array) thì tạo
    if (!this.cart?.items) {
      this.cart = { items: [] };
    }
    let updateQuantity = 1; // Khởi tạo biến lưu số lượng product
    let cartUpdate = [...this.cart.items]; // Tạo một array mới bằng cách copy từ array cũ
    const cartIndex = this.cart.items.findIndex((item) => {
      return item.productId.toString() === product._id.toString();
    }); // Tìm kiếm product trong cart có id trùng với id của product được truyền vào
    if (cartIndex >= 0) {
      // Nếu tìm thấy product trong cart
      updateQuantity = cartUpdate[cartIndex].quantity + 1; // Tăng số lượng product lên 1
      cartUpdate[cartIndex].quantity = updateQuantity; // Cập nhật lại số lượng product trong cart
    } else {
      // Nếu không tìm thấy product trong cart
      // Thêm product vào cart
      cartUpdate.push({
        productId: new ObjectId(product._id), // Tạo object ID từ string product._id (vì product._id là string, còn ID là object)
        quantity: updateQuantity, // Số lượng product
      });
    }
    const db = getDB(); // Lấy database từ server MongoDB (xử lý trong file database.js)
    const updateItem = {
      // Tạo object updateItem để cập nhật cart
      items: cartUpdate, // Cập nhật lại items trong cart
    };
    return db.collection("users").updateOne(
      { _id: new ObjectId(this._id) }, // Tìm kiếm user có id là this._id
      { $set: { cart: updateItem } } // Cập nhật lại cart của user
    );
  }

  // Lấy cart của user
  getCartByUser() {
    const db = getDB(); // Lấy database từ server MongoDB (xử lý trong file database.js)
    const cartUser = this.cart.items.map((item) => {
      return item.productId;
    }); // Lấy ra mảng các id của product trong cart
    return db
      .collection("products")
      .find({ _id: { $in: cartUser } })
      .toArray() // Tìm kiếm các product có id nằm trong mảng cartUser trong collection products qua từ khoá tìm kiếm $in: [], sau đó chuyển kết quả thành array
      .then((products) => {
        // Trả về mảng các product có id nằm trong mảng cartUser (thuộc tính product giữ nguyên qua toán tử spread, thêm thuộc tính quantity)
        return products.map((product) => {
          return {
            ...product,
            quantity: this.cart.items.find((item) => {
              return product._id.toString() === item.productId.toString(); // Tìm kiếm product trong cart có id trùng với id của product được truyền vào, dùng toString() để so sánh 2 string vì ban đầu item.productId, product._id là object
            }).quantity, // Lấy ra thuộc tính quantity của cart.item trong user
          };
        });
      })
      .catch((err) => console.log(err));
  }
  // Xoá cart trong User
  deleteCartByUser(product) {
    const cart = this.cart.items; // Lấy ra mảng các product trong cart
    const cartIndex = cart.findIndex((item) => {
      // Tìm kiếm product trong cart có id trùng với id của product được truyền vào
      return item.productId.toString() === product._id.toString(); // Dùng toString() để so sánh 2 string vì ban đầu item.productId, product._id là object
    });
    cart.splice(cartIndex, 1); // Xoá product trong cart
    const cartUpdate = {
      // Tạo object cartUpdate để cập nhật cart
      items: cart,
    };
    const db = getDB(); // Lấy database từ server MongoDB (xử lý trong file database.js)
    return db // Cập nhật lại cart của user
      .collection("users")
      .updateOne({ _id: new Object(this._id) }, { $set: { cart: cartUpdate } }) // Tìm kiếm user có id là this._id, sau đó cập nhật lại cart của user
      .then((result) => {
        console.log(result);
      })
      .catch((err) => console.log(err));
  }
  // Thêm order vào database
  addOrderByUser() {
    const db = getDB(); // Lấy database từ server MongoDB (xử lý trong file database.js)
    return this.getCartByUser() // Lấy hết products trong cart của user
      .then((products) => {
        // Sau khi lấy hết products trong cart của user thì thêm vào collection orders qua object orderAdd
        const orderAdd = {
          items: products,
          user: {
            userId: new ObjectId(this._id),
            username: this.username,
            email: this.email,
          },
        };
        return db
          .collection("orders")
          .insertOne(orderAdd) // Thêm tất cả product trong cart user vào collection orders
          .then((result) => {
            // Sau khi thêm order vào collection orders, xoá cart của user đi
            db.collection("users").updateOne(
              { _id: new ObjectId(this._id) },
              { $set: { cart: { items: [] } } } // Cập nhật lại cart của user là một object chưa array rỗng
            );
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
  }
  // Lấy order của user
  getOrderByUser() {
    const db = getDB();
    return db.collection("orders").find({"user.userId": new ObjectId(this._id)}).toArray()
    .then(orderItems => { 
      console.log(orderItems)
      return orderItems
    })
    .catch(err => console.log(err))
  }
}

module.exports = User;
