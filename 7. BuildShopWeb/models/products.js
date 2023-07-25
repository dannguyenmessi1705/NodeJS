const path = require("path");
const rootdir = require("../util/path");
const fs = require("fs");
const pathFile = path.join(rootdir, "data", "products.json");
const handleFile = (callback) => {
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
    handleFile((products) => {
      products.push(this);
      fs.writeFile(pathFile, JSON.stringify(products), (err) => {
        if (err) console.log(err);
      });
    });
  }
  static fetchAll(callback) {
    handleFile(callback);
  }
}
module.exports = Product;
