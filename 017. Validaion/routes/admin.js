const express = require("express");
const route = express.Router();
const adminController = require("../controllers/admin");
const ProtectRoute = require("../middleware/auth");

// {VALIDATION INPUT} //
const { check } = require("express-validator");

route.get("/add-product", ProtectRoute, adminController.addProduct);
// {VALIDATION INPUT} //
route.post(
  "/add-product",
  ProtectRoute,
  [
    check("name", "Invallid name").isString().notEmpty(),
    check("price", "Invalid price").isFloat().notEmpty(),
    check("url", "Invalid URL").isURL(),
    check("description", "Please don't leave the blank description").notEmpty()
  ],
  adminController.postProduct
);
route.get("/product", ProtectRoute, adminController.getProduct);

// {ADD EDIT PRODUCT} //
// url = "http://.../edit-poduct/id"
route.get(
  "/edit-product/:productID",
  ProtectRoute,
  adminController.getEditProduct
);
// {UPDATE PRODUCT}
// {VALIDATION INPUT} //
route.post(
  "/edit-product",
  ProtectRoute,
  [
    check("name", "Invallid name").isString().notEmpty(),
    check("price", "Invalid price").isFloat().notEmpty(),
    check("url", "Invalid URL").isURL(),
    check("description", "Please don't leave the blank description").notEmpty()
  ],
  adminController.postEditProduct
);

// {DELETE PRODUCT} //
route.post("/delete-product", ProtectRoute, adminController.deleteProduct);

module.exports = route;
