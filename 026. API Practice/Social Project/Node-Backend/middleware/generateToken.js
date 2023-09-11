const jwt = require("jsonwebtoken");

const authToken = {
  generateAccessToken: (payload) => {
    const accessToken = jwt.sign(payload, "nguyendidan", { expiresIn: "10m" });
    // Bên phía client sẽ lưu accessToken vào localStorage, hoặc header Authorization Bear + token, rồi gửi lên server

    return accessToken;
  }, // expiresIn: '10m' - thời gian sống của token là 10 phút, sau 10 phút token sẽ hết hạn, dùng để xác thực người dùng
  generateRefreshToken: (payload) => {
    const refreshToken = jwt.sign(payload, "nguyendidan", { expiresIn: "7d" });
    return refreshToken;
  }, // expiresIn: '7d' - thời gian sống của token là 7 ngày, sau 7 ngày token sẽ hết hạn, dùng để tạo ra accesstoken khi hết hạn
  verifyToken: (token) => {
    const decoded = jwt.verify(token, "nguyendidan");
    return decoded;
  }, // hàm này dùng để giải mã token, trả về payload
};

module.exports = authToken;