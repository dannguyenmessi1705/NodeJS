const express = require("express");
const route = express.Router(); 
const adminController = require("../controllers/admin") 

route.get("/add-product", adminController.addProduct); 
route.post("/add-product", adminController.postProduct); 
route.get("/product", adminController.getProduct);

module.exports = route;
