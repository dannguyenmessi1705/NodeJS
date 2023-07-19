const express = require("express"); // Nhập module express vào
const app = express(); // gọi hàm express() để tạo ra 1 app express, chứa các phương thức để xử lý request, response
const bodyParser = require("body-parser"); // Nhập module body-parser vào
app.use(bodyParser.urlencoded({ extended: false })); // Dùng body-parser để xử lý dữ liệu gửi lên server, ở đây ta dùng phương thức urlencoded() để xử lý dữ liệu gửi lên server, extended: false nghĩa là chỉ xử lý dữ liệu đơn giản, không xử lý dữ liệu phức tạp

// Nhập 3 module dùng để xử lý route
const adminRoute = require("./Routes/admin");
const personRoute = require("./Routes/personal");
const notFoundRoute = require("./Routes/notFound");

const path = require("path"); // Nhập module path vào, dùng để xử lý đường dẫn tới file hoặc folder
const rootDir = require("./util/path.js"); // Nhập module helper path vào, dùng để trả về đường dẫn thư mục gốc của project
app.use(express.static(path.join(rootDir, "public"))); // Dùng express.static() để trả về các file static (css, js, img, ...) cho client, ở đây ta trả về các file static trong folder public (origin/public)

// Đăng ký 2 route
app.use("/admin", adminRoute); // Đăng ký route có path là /admin/adminRoute
app.use(personRoute); // Đăng ký route có path là /personRoute

// Tạo 404 page  (Nếu không có route nào khớp thì nó sẽ chạy middleware này), bằng cách đăng ký 1 route có path là * (path này sẽ khớp với tất cả các route)
// Đặt code này ở cuối cùng vì nó sẽ chạy từ trên xuống dưới, nếu đặt ở trên thì các route phía dưới nó sẽ bị vào đây
app.use(notFoundRoute);

app.listen(3000); // Lắng nghe port 3000, nếu có request đến thì sẽ chạy function ở trên, nó sẽ luôn đảm bảo việc lắng nghe yêu cầu từ client
