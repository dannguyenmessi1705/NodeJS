const express = require("express");
const route = express.Router();
const Payment = require("../controllers/payment");
const ProtectRoute = require("../middleware/auth");
const { CreateCSRFTOKEN, verifyCSRFToken } = require("../middleware/csrfToken");

// {PAYMENT} //
// Chuyển hướng đến trang thanh toán của VNPAY
route.post("/payment", CreateCSRFTOKEN, ProtectRoute, verifyCSRFToken, Payment.getPayment);

// Trả về kết quả thanh toán
route.get(
  "/payment/vnpay_return",
  CreateCSRFTOKEN,
  ProtectRoute,
  Payment.VNPayReturn
);

module.exports = route;
