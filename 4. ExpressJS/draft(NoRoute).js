// Sử dụng Express JS thay cho module 'http' của Node JS giúp giảm thiểu quá trình viết csdc lệnh logic của việc request, response. Tạo ra các route dễ dàng hơn (thay vì dùng các câu lệnh if như cách truyền thống)
// Ngoài ExpressJS ta còn có các Framework khác như: Vanilla, Adonis, Koa, Nest, Sail, ...'

const express = require("express"); // Nhập module express vào
const app = express(); // gọi hàm express() để tạo ra 1 app express, chứa các phương thức để xử lý request, response

const bodyParser = require("body-parser"); // Nhập module body-parser vào
app.use(bodyParser.urlencoded({ extended: false })); // Dùng body-parser để xử lý dữ liệu gửi lên server, ở đây ta dùng phương thức urlencoded() để xử lý dữ liệu gửi lên server, extended: false nghĩa là chỉ xử lý dữ liệu đơn giản, không xử lý dữ liệu phức tạp

// phương thức app.use() dùng để đăng ký 1 middleware, nó sẽ chạy trước khi chạy các route khác, nếu không có app.use() thì các route sẽ không chạy được
// middleware sẽ thực thi lần lượt từ trên xuống dưới, nếu có 1 middleware không có next() thì các middleware phía dưới nó sẽ không chạy được
/* 
  app.use((req, res, next) => {
  console.log("In the middleware!");
  // Middleware
  next(); // Chuyển tiếp request tới route tiếp theo, nếu không có next() thì request sẽ bị treo, không thể chuyển tiếp, như vậy sẽ chỉ in ra  'In the middleware!' rồi treo
});
app.use((req, res, next) => {
  console.log("In another middleware!");
  res.send("<h1>Hello from Express!</h1>"); // Phương thức res.send() dùng để gửi dữ liệu đi, ở đây ta gửi 1 đoạn html, so với res.write() thì res.send() sẽ tự động thêm res.end() vào cuối
  // Tại sao in ra 2 lần 'In the middleware!'? Vì khi gọi res.send() thì nó sẽ tự động thêm res.end() vào cuối nên nó sẽ chạy 2 lần, 1 lần là do res.send() và 1 lần là do res.end(), để khắc phục ta thêm return vào trước res.send() để nó không chạy tiếp các câu lệnh dưới
  // phương thức send() có thể gửi nhiều kiểu dữ liệu khác nhau như: json, html, text, ... nếu gửi json thì nó sẽ tự động thêm header là Content-Type: application/json, nếu gửi 1 đoạn string thì nó sẽ tự động thêm header là Content-Type: text/html, ...
  next()
});
*/
// app.use() có thể dùng để đăng ký 1 route, nếu không có route nào khớp thì nó sẽ chạy middleware này
// app.use("path", (req, res, next) => {});

/*
  app.use('/', (req, res, next) => {
  console.log("This always runs!");
  next(); // Cho phép chuyển tiếp request tới route tiếp theo nếu có request khớp
}) 
// Đăng ký 1 route, nếu không có route nào khớp thì nó sẽ chạy middleware này
*/

// Ngoài việc sử dụng app.use() để đăng ký route, ta còn có thể sử dụng các phương thức khác như: app.get(), app.post(), app.put(), app.delete(), ...
// app.get() dùng để đăng ký 1 route có phương thức GET
// app.post() dùng để đăng ký 1 route có phương thức POST
// app.put() dùng để đăng ký 1 route có phương thức PUT
// app.delete() dùng để đăng ký 1 route có phương thức DELETE
// app.all() dùng để đăng ký 1 route có thể có tất cả các phương thức trên
// app.use() dùng để đăng ký 1 route có thể có tất cả các phương thức trên khác với all() ở chỗ nó sẽ chạy trước các route khác, nếu không có route nào khớp thì nó sẽ chạy middleware này
// get, post, put, delete, all, nếu không có route nào khớp thì nó sẽ không chạy middleware (Cần tạo 404 page), use thì ngược lại (hạn chế dùng use để đăng ký route)
app.get("/add-product", (req, res) => {
  res.send(
    "<form action='product' method='POST'><input type='text' name='name'><button type='submit'>Add Product</button></form>"
  ); // Tạo 1 form để gửi dữ liệu lên server, khi ấn send thì route sẽ là /product và method là POST
}); // Tạo route có path là /add-product, nếu có request trỏ đến thì sẽ chạy function ở trên
app.post("/product", (req, res) => {
  console.log(req.body); // body là phương thức để lấy dữ liệu gửi lên server, ở đây ta lấy dữ liệu gửi lên server bằng phương thức POST
  // Để lấy ra được dữ liệu gửi lên server bằng phương thức POST thì ta phải dùng 1 middleware để xử lý dữ liệu gửi lên server, ở đây ta dùng middleware là body-parser, nó sẽ chuyển dữ liệu gửi lên server thành 1 object
  // [Object: null prototype] { name: 'data' }
  const data = JSON.parse(JSON.stringify(req.body)); // Chuyển object thành JSON, sau đó chuyển JSON thành object bỏ qua prototype
  console.log(data);
  res.redirect("/"); // Phương thức redirect() dùng để redirect tới 1 route khác, ở đây ta redirect tới route /
});
app.get("/", (req, res, next) => {
  res.send("<h1>Hello Home Page</h1>");
});
app.listen(3000); // Lắng nghe port 3000, nếu có request đến thì sẽ chạy function ở trên, nó sẽ luôn đảm bảo việc lắng nghe yêu cầu từ client
