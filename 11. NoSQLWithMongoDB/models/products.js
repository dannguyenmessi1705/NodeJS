const getDB = require("../util/database").getDB; // Nhập vào object getDB lấy từ file database.js

// Tạo class Product
class Product {
  constructor(name, price, desciption, url) {
    (this.name = name),
      (this.price = price),
      (this.desciption = desciption),
      (this.url = url);
  }
  // Lưu product vào database
  save() {
    let db = getDB(); // Lấy database từ server MongoDB (xử lý trong file database.js)
    return db
      .collection("products") // Lấy collection products trong database (nếu chưa có sẽ tự động tạo mới)
      .insertOne(this) // Thêm product vào collection products (this ở đây chính là object product được tạo ra từ class Product)
      .then((result) => console.log(result))
      .catch((err) => console.log(err));
  }
}

module.exports = Product;
