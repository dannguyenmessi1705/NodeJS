const Product = require("../models/products"); // import model
// const products = []; // Tạo mảng rỗng để lưu dữ liệu tạm thời
const addProduct = (req, res) => {
  res.render("addProduct", {
    title: "Add Product",
    path: "/admin/add-product",
  });
}; // Trả về trang addProduct

const postProduct = (req, res) => {
  const data = JSON.parse(JSON.stringify(req.body));
  // products.push(data);
  // { Models } //
  const product = new Product(data); // Khởi tạo đối tượng product từ class Product cho mỗi lần request, đê lưu dữ liệu tạm thời vào vùng nhớ mới
  product.save(); // Đẩy dữ liệu từ người dùng vào mảng đã tạo

  res.redirect("/");
}; // Lấy dữ liệu từ form và đẩy vào mảng rỗng

const getProduct = (req, res) => {
  // res.render("home", { title: "Home", items: products, path: "/" });

  // { Models + Storing File } //
  Product.fetchAll((products) => {
    res.render("home", { title: "Home", items: products, path: "/" });
  }); // Trả về mảng đã được đẩy dữ liệu, dùng static để có thể truy cập trực tiếp (class.function) mà không cần khởi tạo đối tượng (new)
  /*
  [
    Product {
      data: { name: '', description: '', price: '' }
    }
  ]
  */
}; // Trả về trang home và hiển thị dữ liệu từ mảng rỗng

module.exports = {
  addProduct,
  postProduct,
  getProduct,
};
