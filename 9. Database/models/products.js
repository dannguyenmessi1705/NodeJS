const Cart = require("./carts")
const db = require("../util/database");


class Product {
  constructor(data, idUpdate) {
    this.product = data;
    this.product.id = idUpdate 
  }

  // {ADD TO DATABASE} //
  save(isDelete=null) {
    return db.execute('INSERT INTO `node-shop`.products (name, price, description) VALUES (?, ?, ?)', 
    [this.product.name, this.product.price, this.product.description]
    ) // Các dấu "?" là 1 tham số lần được truyền vào thông qua các phần tử mảng [id] ở bên ngoài 
  }
  // {GET ALL PRODUCTS FROM MYSQL} //
  static fetchAll() {
    return db.execute('SELECT * FROM `node-shop`.products')
  }
  // {GET PRODUCT BY ID FROM MYSQL} //
  static findByID(id) {
    return db.execute('SELECT * FROM `node-shop`.products WHERE products.id = ?', [id]) // Các dấu "?" là 1 tham số lần được truyền vào thông qua các phần tử mảng [id] ở bên ngoài
  }
}
module.exports = Product;
