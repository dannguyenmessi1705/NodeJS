const jwt = require("jsonwebtoken");
const genJWT = require("./jwtGeneration");
const ProtectRoute = async (req, res, next) => {
  try {
    let accessToken = req.session.accessToken; // Lấy token từ session
    const decoded = jwt.verify(accessToken, "nguyendidan"); // Giải mã token
    const currentTime = Math.floor(Date.now() / 1000); // Lấy thời gian hiện tại (tính bằng giây) để so sánh với thời gian hết hạn của token
    if (decoded.exp && decoded.exp < currentTime) {
      console.log("Token expired");
      const refreshToken = req.session.refreshToken; // Lấy refreshToken từ session
      isVerify = jwt.verify(refreshToken, "nguyendidan"); // Giải mã refreshToken
      if (isVerify && isVerify.exp > currentTime) {
        const newAccessToken = genJWT.generateAccessToken(decoded.userId); // Tạo accessToken mới
        const newRefreshToken = genJWT.generateRefreshToken(decoded.userId); // Tạo refreshToken mới
        req.session.accessToken = newAccessToken; // Gán accessToken mới vào session
        req.session.refreshToken = newRefreshToken; // Gán refreshToken cũ vào session
        req.session.isLogin = true; // Gán isLogin = true để đánh dấu là đã đăng nhập
        await req.session.save(); // Lưu lại session
        console.log("New accessToken generated");
      } else {
        console.log("RefreshToken expired");
        return res.redirect("/login");
      } 
    }
    return next();
  } catch (error) {
    req.session.isLogin = false; // Gán isLogin = false để đánh dấu là chưa đăng nhập
    await req.session.save(); // Lưu lại session
    res.redirect("/login"); // Nếu không có token thì chuyển hướng về trang login
  }
};

module.exports = ProtectRoute;
