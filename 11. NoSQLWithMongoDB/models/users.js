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
        console.log(result);
        return result;
      })
      .catch((err) => console.log(err));
  }
  // Thêm product vào cart
  addToCart(product) {
    const cartIndex = this.cart.items.findIndex((item) => {
      return item.productId.toString() === product._id.toString();
    }); // Tìm kiếm product trong cart có id trùng với id của product được truyền vào
    let cartUpdate = [...this.cart.items]; // Tạo một array mới bằng cách copy từ array cũ
    let updateQuantity = 1; // Khởi tạo biến lưu số lượng product
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
}

module.exports = User;
