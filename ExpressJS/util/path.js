const path = require("path"); // Nhập module path vào, dùng để xử lý đường dẫn tới file hoặc folder
module.exports = path.dirname(process.mainModule.filename);
// Xuất đường dẫn tới folder chứa file chạy đầu tiên (ở đây là file server.js)
// Nghĩa là nó sẽ trả vê đường dẫn gốc của project, khi đó ta chỉ cần import module này để tránh việc sử dụng '../' nhiều lần
