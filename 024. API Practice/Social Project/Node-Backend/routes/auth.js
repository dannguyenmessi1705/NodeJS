const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");
const { body } = require("express-validator");
const User = require("../models/users");

// // Xác thưc người dùng mới khi vào trang web (bắt buộc phải đăng nhập mới vào được trang web)
// router.get("/verify", Authenticate, authController.verify);

// POST http://localhost:4000/v1/auth/signup
router.post(
  "/register",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email")
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject("Email address already exists!");
          }
        });
      }),
    body("password").trim().isLength({ min: 5 }),
    body("name").trim().not().isEmpty(),
  ],
  authController.postSignup
);

router.post("/login", authController.postLogin);

module.exports = router; 