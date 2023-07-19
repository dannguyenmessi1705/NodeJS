const express = require("express"); // Nhập module express vào
const route = express.Router(); // Gọi hàm Router() để tạo ra 1 route, chứa các phương thức để xử lý request, response

const path = require("path"); // Nhập module path vào, dùng để xử lý đường dẫn tới file hoặc folder
// Dùng path thay vì dùng string để tránh lỗi khi chuyển đổi giữa các hệ điều hành khác nhau, ví dụ: Windows dùng \ còn Linux dùng /, nếu dùng string thì khi chuyển đổi giữa các hệ điều hành sẽ bị lỗi

const rootDir = require("../util/path.js"); // Nhập module helper path vào, dùng để trả về đường dẫn thư mục gốc của project

route.get("/add-product", (req, res) => {
  /*
  res.send(
    "<form action='/admin/add-product' method='POST'><input type='text' name='name'><button type='submit'>Add Product</button></form>"
  ); // Tạo 1 form để gửi dữ liệu lên server, khi ấn send thì route sẽ là /product và method là POST
  */
  // res.sendFile(path.join(__dirname, "..", "views", "addProduct.html")); // Nối các đường dẫn lại với nhau, __dirname là đường dẫn tới folder hiện tại, .. là folder cha, views là folder chứa file addProduct.html (../views/addProduct.html)
  res.sendFile(path.join(rootDir, "views", "addProduct.html")); // rootDir là đường dẫn tới folder chứa file chạy đầu tiên (ở đây là file server.js), views là folder chứa file addProduct.html (origin/views/addProduct.html)
});
route.post("/add-product", (req, res) => {
  console.log(req.body); // body là phương thức để lấy dữ liệu gửi lên server, ở đây ta lấy dữ liệu gửi lên server bằng phương thức POST
  // Để lấy ra được dữ liệu gửi lên server bằng phương thức POST thì ta phải dùng 1 middleware để xử lý dữ liệu gửi lên server, ở đây ta dùng middleware là body-parser, nó sẽ chuyển dữ liệu gửi lên server thành 1 object
  // [Object: null prototype] { name: 'data' }
  const data = JSON.parse(JSON.stringify(req.body)); // Chuyển object thành JSON, sau đó chuyển JSON thành object bỏ qua prototype
  console.log(data);
  res.redirect("/"); // Phương thức redirect() dùng để redirect tới 1 route khác, ở đây ta redirect tới route /
});

module.exports = route; // Xuất route  để các file khác có thể sử dụng được (route là thuộc tính của module.exports
