const express = require("express");
const route = express.Router(); 
const adminController = require("../controllers/products") // import controller

route.get("/add-product", adminController.addProduct); // điều hướng đến controller xư lý và trả về addProduct.ejs
route.post("/add-product", adminController.postProduct); // điều hướng đến controller xư lý và trả về addProduct.ejs

module.exports = route;
