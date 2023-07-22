const http = require("http"); // Nhập module http vào
const fs = require("fs"); // Module fs xử lý ra vào file

const server = http.createServer((req, res) => {
  // console.log(req.url) // url là đường dẫn mà client gửi lên server, ví dụ như /, /about, /contact, /product, ...
  // console.log(req.method) // method là phương thức mà client gửi lên server, ví dụ như GET, POST, PUT, DELETE, ...
  // console.log(req.headers) // headers là những thông tin mà client gửi lên server, ví dụ như user-agent, cookie, host, accept, accept-language, accept-encoding, connection, cache-control, upgrade-insecure-requests, ...
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

  const method = req.method; // Lấy Phương thức của request
  if (req.url === "/message" && method === "POST") {
    // Nếu route đang trỏ tại /message và có yêu cầu phương thức POST
    const body = []; // Tạo 1 mảng rỗng để lưu dữ liệu
    // Tạo các hàm lắng nghe sự kiện
    req.on("data", (chunk) => {
      // Khi có dữ liệu gửi lên server thì sẽ chạy function này
      console.log(chunk); // chunk là 1 buffer, nó sẽ chứa dữ liệu gửi lên server
      // <Buffer 6d 65 73 73 61 67 65 3d 44 61 6e>
      body.push(chunk); // Thêm chunk vào mảng body
    });
    // Dùng return để trả về luôn ngay cả khi không có request nào, để tránh việc nó sẽ tự động chuyển xuống trang dưới, gây ra lỗi
    return req.on("close", () => {
      // Khi request kết thúc thì sẽ chạy function này
      const parseBody = Buffer.concat(body).toString(); // Chuyển mảng body thành 1 string (do body là mảng buffer mà dữ liệu gửi lên server là 1 string)
      console.log(parseBody); // In ra dữ liệu gửi lên server
      // Do input có name = message nên dữ liệu in ra sẽ là message='data'
      const data = parseBody.split("=")[1]; // Lấy chuỗi sau dấu bằng
      fs.writeFile("./message.txt", data, (err) => {
        console.log(err);
        res.statusCode = 302; // Set statusCode là 302, nghĩa là redirect tới 1 route khác
        res.setHeader("Location", "/"); // Set header là Location và value là /, nghĩa là redirect tới route /
        return res.end(); // Kết thúc response, tránh việc chạy tiếp các câu lệnh dưới (gây lỗi).
      }); // Ghi dữ liệu vào file message.txt, khồng nên dùng writeFileSync vì nó sẽ chạy đồng bộ, nghĩa là nó sẽ chạy xong mới chạy các câu lệnh dưới làm cho server bị chậm, thay vào đó nên dùng writeFile truyền thêm callback function để nó chạy bất đồng bộ
    });
  }

  res.setHeader("Content-Type", "text/html"); // setHeader là phương thức để set header cho response, ở đây ta set header là Content-Type và value là text/html
  res.write("<html>"); // write là phương thức để ghi dữ liệu vào response, ở đây ta ghi dữ liệu là 1 đoạn html
  res.write("<head><title>My first page</title></head>"); // Tiếp tục ghi dữ liệu vào response
  res.write("<body><h1>Hello from my Node.js Server!</h1></body>"); // Tiếp tục ghi dữ liệu vào response
  res.write("</html>"); // Tiếp tục ghi dữ liệu vào response
  res.end(); // end là phương thức để kết thúc response, nếu không có thì server sẽ không biết khi nào dữ liệu gửi đi là hết
  // Sau res,end() thì không được gọi thêm bất kỳ phương thức nào khác
}); // Tạo server, truyền vào 1 function có 2 tham số là là request, response. 2 tham số này là 2 object, ở đây ta chỉ log ra để xem

server.listen(3000); // Lắng nghe port 3000, nếu có request đến thì sẽ chạy function ở trên, nó sẽ luôn đảm bảo việc lắng nghe yêu cầu từ client

// Để chạy, vào browser rồi nhập localhost:3000 vào thanh địa chỉ, sau đó enter. Lúc này server sẽ nhận được request và chạy function ở trên
// Browser sẽ trả về đoạn đã được res.write() ở trên, tức là đoạn html
