// Cú pháp nhập module
const http = require("http");
const route = require("./routes"); // Trong NodeJS, nhập module tự tạo thì phải thêm './' và không cần thêm '.js', từ khoá tạo tuỳ thích, nó là 1 object

route.print("Hello World"); // Gọi thuộc tính print của Object route vừa import từ file routes
const server = http.createServer(route.handle); // Truyền thuộc tính handle của Object route vừa import từ file routes
server.listen(3000);
