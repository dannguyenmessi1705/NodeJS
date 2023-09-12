const express = require("express");
const route = express.Router();
const adminController = require("../controllers/admin");
const ProtectRoute = require("../middleware/auth");
const { CreateCSRFTOKEN, verifyCSRFToken } = require("../middleware/csrfToken");

// {VALIDATION INPUT} //
const { check } = require("express-validator");

route.get(
  "/add-product",
  CreateCSRFTOKEN,
  ProtectRoute,
  adminController.addProduct
);

// {VALIDATION INPUT} //
route.post(
  "/add-product",
  CreateCSRFTOKEN,
  ProtectRoute,
  verifyCSRFToken,
  [
    check("name", "Invallid name").trim().isString().notEmpty(),
    check("price", "Invalid price").isFloat().notEmpty(),
    check("description", "Please don't leave the blank description")
      .trim()
      .notEmpty(),
  ],
  adminController.postProduct
);

route.get(
  "/product",
  CreateCSRFTOKEN,
  ProtectRoute,
  adminController.getProduct
);

// {ADD EDIT PRODUCT} //
// url = "http://.../edit-poduct/id"
route.get(
  "/edit-product/:productID",
  CreateCSRFTOKEN,
  ProtectRoute,
  adminController.getEditProduct
);

// {UPDATE PRODUCT}
// {VALIDATION INPUT} //
route.post(
  "/edit-product",
  CreateCSRFTOKEN,
  ProtectRoute,
  verifyCSRFToken,
  [
    check("name", "Invallid name").trim().isString().notEmpty(),
    check("price", "Invalid price").isFloat().notEmpty(),
    check("description", "Please don't leave the blank description")
      .trim()
      .notEmpty(),
  ],
  adminController.postEditProduct
);

// {DELETE PRODUCT} //
route.delete(
  "/delete-product/:productID",
  CreateCSRFTOKEN,
  ProtectRoute,
  verifyCSRFToken,
  adminController.deleteProduct
); // Sửa method xoá sang delete

module.exports = route;
