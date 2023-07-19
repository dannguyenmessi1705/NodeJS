const express = require("express"); // Nhập module express vào
const route = express.Router(); // Gọi hàm Router() để tạo ra 1 route, chứa các phương thức để xử lý request, response

const path = require("path"); // Nhập module path vào, dùng để xử lý đường dẫn tới file hoặc folder
// Dùng path thay vì dùng string để tránh lỗi khi chuyển đổi giữa các hệ điều hành khác nhau, ví dụ: Windows dùng \ còn Linux dùng /, nếu dùng string thì khi chuyển đổi giữa các hệ điều hành sẽ bị lỗi
const rootDir = require("../util/path.js"); // Nhập module helper path vào, dùng để trả về đường dẫn thư mục gốc của project

route.get("/", (req, res) => {
  // res.send('<h1>Hello Home Page</h1>') ==
  // ==res.sendFile(path.join(__dirname, "..", "views", "home.html")); // Nối các đường dẫn lại với nhau, __dirname là đường dẫn tới folder hiện tại, .. là folder cha, views là folder chứa file home.html (../views/home.html)
  res.sendFile(path.join(rootDir, "views", "home.html")); // rootDir là đường dẫn tới folder chứa file chạy đầu tiên (ở đây là file server.js), views là folder chứa file home.html (origin/views/home.html)
});
module.exports = route; // Xuất route  để các file khác có thể sử dụng được (route là thuộc tính của module.exports)
