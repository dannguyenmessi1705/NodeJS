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
  constructor(data, idUpdate) {
    this.product = data;
    this.product.id = idUpdate // Dùng để cập nhật product, nếu tạo mới thì không cần truyền idUpdate vào (null)
  }
  // {UPDATE PRODUCT} //
  save() {
    // Lấy products từ database
    handleReadFile((products) => {
      // Nếu có tham số idUpdate truyền vào -> nghĩa là đang update, id là đã có sẵn trong database
      if (this.product.id) {
        const updateProductIndex = products.findIndex((item) => item.product.id === this.product.id) // Tìm vị trí của product cần Update, Edit ở trong mnagr dữ liệu sau khi get về
        const updateProduct = [...products]; // Sao chép dữ liệu của data sang biến mới là updateProduct
        updateProduct[updateProductIndex] = this; // Cập nhật dữ liệu của sản phẩm đã tìm được ở trên
        // Ghi lại dữ liệu vào database
        fs.writeFile(pathFile, JSON.stringify(updateProduct), (err) => {
          if (err) console.log(err);
        });
      }
      // Nếu không có id truyền vào, ngầm hiểu là đang thêm 1 sản phẩm mới
      else {
        // {ADD PRODUCT ID} //
        this.product.id = Math.random().toString(); // random id cho từng sản phẩm
        products.push(this);
        fs.writeFile(pathFile, JSON.stringify(products), (err) => {
          if (err) console.log(err);
        });
      }
    });
  }
  static fetchAll(callback) {
    handleReadFile(callback);
  }
  // {GET PRODUCT BY ID} //
  static findByID(id, callback) {
    handleReadFile((products) => {
      // get all products
      const product = products.find((element) => element.product.id === id); // get product by id
      callback(product); // các lệnh thao tác sau khi lấy được product
    });
  }
}
module.exports = Product;
