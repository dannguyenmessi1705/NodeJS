const http = require('http') // Nhập module http vào

const server = http.createServer((req, res) => {
    console.log(req.url) // url là đường dẫn mà client gửi lên server, ví dụ như /, /about, /contact, /product, ...
    console.log(req.method) // method là phương thức mà client gửi lên server, ví dụ như GET, POST, PUT, DELETE, ...
    console.log(req.headers) // headers là những thông tin mà client gửi lên server, ví dụ như user-agent, cookie, host, accept, accept-language, accept-encoding, connection, cache-control, upgrade-insecure-requests, ...
    res.setHeader('Content-Type', 'text/html') // setHeader là phương thức để set header cho response, ở đây ta set header là Content-Type và value là text/html
    res.write('<html>') // write là phương thức để ghi dữ liệu vào response, ở đây ta ghi dữ liệu là 1 đoạn html
    res.write('<head><title>My first page</title></head>') // Tiếp tục ghi dữ liệu vào response
    res.write('<body><h1>Hello from my Node.js Server!</h1></body>') // Tiếp tục ghi dữ liệu vào response
    res.write('</html>') // Tiếp tục ghi dữ liệu vào response
    res.end() // end là phương thức để kết thúc response, nếu không có thì server sẽ không biết khi nào dữ liệu gửi đi là hết
    // Sau res,end() thì không được gọi thêm bất kỳ phương thức nào khác
}) // Tạo server, truyền vào 1 function có 2 tham số là là request, response. 2 tham số này là 2 object, ở đây ta chỉ log ra để xem

server.listen(3000) // Lắng nghe port 3000, nếu có request đến thì sẽ chạy function ở trên, nó sẽ luôn đảm bảo việc lắng nghe yêu cầu từ client 

// Để chạy, vào browser rồi nhập localhost:3000 vào thanh địa chỉ, sau đó enter. Lúc này server sẽ nhận được request và chạy function ở trên
// Browser sẽ trả về đoạn đã được res.write() ở trên, tức là đoạn html