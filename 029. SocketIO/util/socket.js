let io; // Tạo biến io để lưu socket
module.exports = {
  init: (httpServer) => {
    // httpServer là server được tạo ở file server.js (VD như app.listen(3000))
    io = require("socket.io")(httpServer); // Khởi tạo socket.io và lưu vào biến io, sẽ được khởi tạo ở file server.js
    return io; // Trả về biến io
  },
  getIO: () => {
    // Lấy biến io để sử dụng ở các file khác
    if (!io) {
      // Nếu chưa khởi tạo socket.io thì throw error
      throw new Error("Socket.io not initialized!");
    }
    return io; // Nếu đã khởi tạo thì trả về biến io
  },
};
