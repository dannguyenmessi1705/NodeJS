const path = require("path");
const rootdir = require("../util/path");
const fs = require("fs");

// {Storing with file json} //
const pathFile = path.join(rootdir, "data", "products.json"); // Tạo đường dẫn đến file json
const handleFile = (callback) => {
  fs.readFile(pathFile, (err, fileContent) => {
    if (err) {
      callback([]);
    } else {
      callback(JSON.parse(fileContent));
    } // Đọc file json, nếu có lỗi thì trả về mảng rỗng, nếu không có lỗi thì trả về mảng đã được đẩy dữ liệu
    // sử dụng callback để trả về kết quả, tránh dùng return luôn vì nó sẽ trả về kết quả trước khi đọc file xong (lỗi bất đồng bộ)
  });
};

// const products = []; // Tạo mảng rỗng để lưu dữ liệu tạm thời
class Product {
  // Tạo class Product
  constructor(data) {
    this.data = data;
  } // Tạo constructor, truyền vào data request từ người dùng
  save() {
    // products.push(this);

    // {Storing with file json} //
    handleFile((products) => {
      products.push(this);
      fs.writeFile(pathFile, JSON.stringify(products), (err) => {
        if (err) console.log(err);
      });
    }); // Đọc file json, nếu không có lỗi thì đẩy dữ liệu từ file vào mảng products, sau đó đẩy dữ liệu từ người dùng vào mảng đã tạo
  
  } // Đẩy dữ liệu từ người dùng vào mảng đã tạo
  static fetchAll(callback) {
    // return products;

    // {Storing with file json} //
    handleFile(callback);
  
  } // Trả về mảng đã được đẩy dữ liệu, dùng static để có thể truy cập trực tiếp (class.function) mà không cần khởi tạo đối tượng (new)
}
module.exports = Product;
