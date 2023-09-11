const jwt = require("jsonwebtoken");
const Auth = require("./generateToken");
module.exports = (req, res, next) => {
  try {
    const authHeader = req.get("Authorization"); // lấy header Authorization
    if (!authHeader) {
      // nếu không có header Authorization thì throw error (không có token thì không cho truy cập)
      const error = new Error("Not authenticated"); // tạo ra 1 error
      error.statusCode = 401; // set statusCode cho error
      throw error; // throw error
    }
    const accessToken = authHeader.split(" ")[1]; // Bearer token => split xong lấy token
    const decoded = Auth.verifyToken(accessToken); // giải mã token
    if (!decoded) {
      // nếu không giải mã được token thì kiểm tra refreshToken
      const refreshToken = req.cookies.refreshToken; // lấy refreshToken từ cookie
      if (!refreshToken) {
        // nếu không có refreshToken thì throw error (không có token thì không cho truy cập)
        const err = new Error("Not authenticated");
        err.statusCode = 401;
        throw err;
      }
      const decodedRefreshToken = Auth.verifyToken(refreshToken); // giải mã refreshToken
      if (!decodedRefreshToken) {
        // nếu không giải mã được refreshToken thì throw error (không có token thì không cho truy cập)
        const err = new Error("Not authenticated");
        err.statusCode = 401;
        throw err;
      }
      // tạo ra accessToken mới
      const newAccessToken = Auth.generateAccessToken({
        userId: decodedRefreshToken.userId, // userId lấy từ refreshToken
      });
      // gửi accessToken mới về cho client
      res.status(200).json({
        message: "New accessToken",
        accessToken: newAccessToken,
      });
      req.userId = decodedRefreshToken.userId; // lưu userId vào req
      next(); // next để đi tiếp các middleware khác
    }
    req.userId = decoded.userId; // lưu userId vào req
    next(); // next để đi tiếp các middleware khác
  } catch (err) {
    // bắt lỗi
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
