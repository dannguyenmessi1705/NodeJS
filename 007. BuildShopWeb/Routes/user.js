const express = require("express");
const route = express.Router();

const adminController = require("../controllers/user");

route.get("/", adminController.getIndex);

route.get("/product", adminController.getProduct);

route.get("/cart", adminController.getCart);

route.get("/checkout", adminController.getCheckout);

route.get("/order", adminController.getOrder);

module.exports = route;
