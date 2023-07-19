const express = require("express"); // Nhập module express vào
const route = express.Router(); // Gọi hàm Router() để tạo ra 1 route, chứa các phương thức để xử lý request, response

const path = require("path"); // Nhập module path vào, dùng để xử lý đường dẫn tới file hoặc folder
// Dùng path thay vì dùng string để tránh lỗi khi chuyển đổi giữa các hệ điều hành khác nhau, ví dụ: Windows dùng \ còn Linux dùng /, nếu dùng string thì khi chuyển đổi giữa các hệ điều hành sẽ bị lỗi

const rootDir = require("../util/path.js") // Nhập module helper path vào, dùng để trả về đường dẫn thư mục gốc của project

route.get("/*", (req, res) => {
  // res.status(404).send("<h1>Page not found</h1>");
  // == res.status(404).sendFile(path.join(__dirname, "..", "views", "404.html")); // // Nối các đường dẫn lại với nhau, __dirname là đường dẫn tới folder hiện tại, .. là folder cha, views là folder chứa file 404.html (../views/404.html)
  res.status(404).sendFile(path.join(rootDir, "views", "404.html")) // rootDir là đường dẫn tới folder chứa file chạy đầu tiên (ở đây là file server.js), views là folder chứa file 404.html (origin/views/404.html)
}); // Đăng ký 1 route có path là * (path này sẽ khớp với tất cả các route), nếu không có route nào khớp thì nó sẽ chạy middleware này

module.exports = route; // Xuất route  để các file khác có thể sử dụng được (route là thuộc tính của module.exports)
