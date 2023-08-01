const getDB = require("../util/database").getDB; // Nhập vào object getDB lấy từ file database.js
const ObjectId = require("mongodb").ObjectId; // Nhập module ObjectId từ mongodb

// Tạo class User
class User {
  constructor(username, email) {
    this.username = username;
    this.email = email;
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
}

module.exports = User;
