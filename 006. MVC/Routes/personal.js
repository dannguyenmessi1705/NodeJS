const express = require("express");
const route = express.Router();

const adminController = require("../controllers/products"); // import controller

route.get("/", adminController.getProduct); // điều hướng đến controller xư lý và trả về home.ejs
module.exports = route;
