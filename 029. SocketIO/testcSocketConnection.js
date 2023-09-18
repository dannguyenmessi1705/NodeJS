const Socket = require("socket.io-client")
const io = Socket("http://localhost:3000"); // Khởi tạo socket.io ở client
io.on("connect", (socket) => {
    console.log("Client connected!");
})
io.emit("message", "Hello from client!") // Gửi 1 message lên server