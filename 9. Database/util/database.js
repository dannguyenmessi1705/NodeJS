const mysql = require("mysql2"); // Nhâp thư viện mysql2

// Tạo 1 pool để kết nối tới database (pool là 1 tập hợp các kết nối)
const pool = mysql.createPool({
  host: "localhost", // Địa chỉ host
  user: "root", // Tên user
  database: "node-shop", // Tên database
  password: "17052002", // Mật khẩu
});
module.exports = pool.promise(); // Xuất pool để sử dụng ở các file khác là 1 promise, trả về then(), catch() để xử lý tránh bị callback hell
