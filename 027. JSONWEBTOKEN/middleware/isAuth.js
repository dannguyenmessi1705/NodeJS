const jwt = require("jsonwebtoken");
const genJWT = require("./jwtGeneration");
const ProtectRoute = async (req, res, next) => {
  try {
    let accessToken = req.session.accessToken; // Lấy token từ session
    const decoded = jwt.verify(accessToken, "nguyendidan"); // Giải mã token
    const currentTime = Math.floor(Date.now() / 1000); // Lấy thời gian hiện tại (tính bằng giây) để so sánh với thời gian hết hạn của token
    if (decoded.exp && decoded.exp < currentTime) {
      // Nếu token hết hạn
      console.log("Token expired");
      const refreshToken = req.session.refreshToken; // Lấy refreshToken từ session
      isVerify = jwt.verify(refreshToken, "nguyendidan"); // Giải mã refreshToken
      if (isVerify && isVerify.exp > currentTime) {
        const newAccessToken = genJWT.generateAccessToken(decoded.userId); // Tạo accessToken mới
        const newRefreshToken = genJWT.generateRefreshToken(decoded.userId); // Tạo refreshToken mới
        req.session.accessToken = newAccessToken; // Gán accessToken mới vào session
        req.session.refreshToken = newRefreshToken; // Gán refreshToken cũ vào session
        req.session.isLogin = true; // Gán isLogin = true để đánh dấu là đã đăng nhập
        req.session.save(() => {
          console.log("New accessToken generated");
        }); // Lưu lại session
      } else {
        console.log("RefreshToken expired");
        return res.redirect("/login");
      }
    }
    return next();
  } catch (error) {
    await req.session.destroy(); // Xóa session để đăng xuất
    res.redirect("/login"); // Nếu không có token thì chuyển hướng về trang login
  }
};

module.exports = ProtectRoute;
