// {ADDING VALIDATION} // Thêm check validation vào các route cần thiết
const { check } = require("express-validator");

const express = require("express");
const route = express.Router();
const getAuth = require("../controllers/auth");

route.get("/login", getAuth.getAuth);
route.post("/login", getAuth.postAuth);
route.post("/logout", getAuth.postLogout);
route.get("/signup", getAuth.getSignup);
// {VALIDATION INPUT} check("email").isEmail().withMessage() -> kiểm tra req.body.email nhập vào có phải là 1 email hợp lệ không
// -> Nếu không hợp lệ, giá trị bên trong hàm withMessage() sẽ được gán vào thuộc tính msg của {validationResult}
route.post(
  "/signup",
  [
    check("email").isEmail().withMessage("Please enter the valid email"),
    check("password")
      .isLength({ min: 5 }) // Độ dài mật khẩu tối thiểu là 5
      .withMessage("The password must be at least 5"),
    // Kiểm tra password và re_password có giống nhau không
    check("re_password").custom((value, { req }) => {
      // value là giá trị của re_password, req là request
      if (value !== req.body.password) {
        // Nếu giá trị của re_password khác với giá trị của password
        throw new Error("Password and Re-Password do not match"); // Thì throw error và gán vào thuộc tính msg của {validationResult}
      }
      return true; // Nếu không có lỗi thì return true
    }),
  ],
  getAuth.postSignup
);
// {RESET PASSWORD} //
route.get("/reset", getAuth.getReset);
route.post("/reset", getAuth.postReset);
// {UPDATE PASSWORD} //
route.get("/reset/:tokenReset", getAuth.getUpdatePassword);
route.post("/update-password", getAuth.postUpdatePassword);
module.exports = route;
