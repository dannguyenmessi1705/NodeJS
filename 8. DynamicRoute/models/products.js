const path = require("path");
const rootdir = require("../util/path");
const fs = require("fs");
const pathFile = path.join(rootdir, "data", "products.json");
const handleReadFile = (callback) => {
  fs.readFile(pathFile, (err, fileContent) => {
    if (err) {
      callback([]);
    } else {
      callback(JSON.parse(fileContent));
    }
  });
};

class Product {
  constructor(data) {
    this.product = data;
  }
  save() {
    // {ADD PRODUCT ID} //
    this.product.id = Math.random().toString(); // random id cho từng sản phẩm
    handleReadFile((products) => {
      products.push(this);
      fs.writeFile(pathFile, JSON.stringify(products), (err) => {
        if (err) console.log(err);
      });
    });
  }
  static fetchAll(callback) {
    handleReadFile(callback);
  }
  // {GET PRODUCT BY ID} //
  static findByID(id, callback) {
    handleReadFile((products) => { // get all products
      const product = products.find((element) => element.product.id === id); // get product by id
      callback(product); // các lệnh thao tác sau khi lấy được product
    });
  }
}
module.exports = Product;
