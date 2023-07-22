// Tạo module rồi import vào server.js
const fs = require("fs"); // Module mặc định của nodejs thì không cần thêm './'
// hàm xử lý cho hàm createServer
const handleRequest = (req, res) => {
  if (req.url === "/") {
    // Nếu url là / thì trả về 1 đoạn html
    res.write("<html>");
    res.write("<head><title>My first page</title></head>");
    res.write(
      '<body><form action="/message" method="POST"><input type="text" name="message"><button type="submit">Send</button></form></body>'
    ); // Tạo 1 form để gửi dữ liệu lên server, khi ấn send thì route sẽ là /message và method là POST
    res.write("</html>");
    return res.end(); // Kết thúc response, tránh việc chạy tiếp các câu lệnh dưới (gây lỗi).
  }
  const method = req.method;
  if (req.url === "/message" && method === "POST") {
    const body = [];
    req.on("data", (chunk) => {
      console.log(chunk);
      body.push(chunk);
    });
    return req.on("end", () => {
      const bodyParse = Buffer.concat(body).toString();
      console.log(bodyParse);
      const message = bodyParse.split("=")[1];
      fs.writeFile("message.txt", message, (err) => {
        res.statusCode = 302;
        res.setHeader("Location", "/");
        res.end();
      });
    });
  }
  res.setHeader("Content-Type", "text/html"); // setHeader là phương thức để set header cho response, ở đây ta set header là Content-Type và value là text/html
  res.write("<html>"); // write là phương thức để ghi dữ liệu vào response, ở đây ta ghi dữ liệu là 1 đoạn html
  res.write("<head><title>My first page</title></head>"); // Tiếp tục ghi dữ liệu vào response
  res.write("<body><h1>Hello from my Node.js Server!</h1></body>"); // Tiếp tục ghi dữ liệu vào response
  res.write("</html>"); // Tiếp tục ghi dữ liệu vào response
  res.end(); // end là phương thức để kết thúc response, nếu không có thì server sẽ không biết khi nào dữ liệu gửi đi là hết
  // Sau res,end() thì không được gọi thêm bất kỳ phương thức nào khác
};

const printLine = (string) => {
  console.log(string);
};

/// Xuất module dưới dạng là các Object(truyền vào các hàm cần export)
// Nếu chỉ muốn export 1 module => (module.export = handleRequest)

// Nếu muốn export nhiều hàm, thì truyền key với value vào Object, khi import từ file khác ta chỉ cần truy cập vào từng key
/*
module.exports = {
    handle: handleRequest,
    print: printLine
}
*/

// Hoặc ngắn hơn
exports.handle = handleRequest;
exports.print = printLine;
