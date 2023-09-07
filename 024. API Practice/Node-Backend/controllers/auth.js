const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const User = require("../models/users");
const genAuth = require("../middleware/generateToken");
const jwt = require("jsonwebtoken");

const authController = {
  // // {LẤY THÔNG TIN XÁC THỰC NGƯỜI DÙNG} dùng cho việc xác thực người dùng mới khi vào trang web (bắt buộc phải đăng nhập mới vào được trang web)
  // verify: async (req, res, next) => {
  //     try {
  //         const user = await User.findById(req.userId).select('-password');
  //         if (!user){
  //             const error = new Error('User not found!');
  //             error.statusCode = 404;
  //             throw error;
  //         }
  //         res.status(200).json({message: 'User found!', user: user});
  //     } catch (error) {
  //         if (!error.statusCode){
  //             error.statusCode = 500;
  //         }
  //         next(error);
  //     }
  // },

  postSignup: async (req, res, next) => {
    const errors = validationResult(req);
    const { email, name, password } = req.body;
    try {
      if (!errors.isEmpty()) {
        const err = new Error("Validation failed, entered data is incorrect.");
        err.statusCode = 422;
        const data = errors.array();
        throw err;
      }
      const hashPassword = await bcrypt.hash(password, 12);
      const user = new User({
        email,
        password: hashPassword,
        name,
      });
      const result = await user.save();
      if (!result) {
        const error = new Error("User not found!");
        error.statusCode = 404;
        throw error;
      }
      const accessToken = genAuth.generateAccessToken({
        userId: result._id.toString(),
      });
      const refreshToken = genAuth.generateRefreshToken({
        userId: result._id.toString(),
      });
      res.cookie("refreshToken", refreshToken, { httpOnly: true }); // lưu refreshToken vào cookie
      res.status(201).json({
        message: "User created!",
        userId: user._id.toString(),
        accessToken,
        refreshToken,
      });
    } catch (error) {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    }
  },
  postLogin: async (req, res, next) => {
    const { email, password } = req.body;
    try {
      const user = await User.findOne({email: email});
      if (!user) {
        const error = new Error("User not found!");
        error.statusCode = 404;
        throw error;
      }
      const isEqual = await bcrypt.compare(password, user.password);
      if (!isEqual) {
        const error = new Error("Wrong password!");
        error.statusCode = 401;
        throw error;
      }
      const accessToken = genAuth.generateAccessToken({ userId: user._id.toString() });
      const refreshToken = genAuth.generateRefreshToken({ userId: user._id.toString() });
      res
        .status(200)
        .json(
          { message: "Login successfully!", userId: user._id.toString(), accessToken, refreshToken },
          accessToken,
          refreshToken
        );
    } catch (error) {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    }
  },

};

module.exports = authController;
