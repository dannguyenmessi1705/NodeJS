const express = require("express");
const route = express.Router(); 
const adminController = require("../controllers/admin") 

route.get("/add-product", adminController.addProduct); 
route.post("/add-product", adminController.postProduct); 
// route.get("/product", adminController.getProduct);

// // {ADD EDIT PRODUCT} //
// // url = "http://.../edit-poduct/id"
// route.get("/edit-product/:productID", adminController.getEditProduct)
// // {UPDATE PRODUCT}
// route.post("/edit-product", adminController.postEditProduct)

// // {DELETE PRODUCT} //
// route.post("/delete-product", adminController.deleteProduct)

module.exports = route;
