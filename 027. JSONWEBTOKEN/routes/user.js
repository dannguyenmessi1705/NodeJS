const express = require("express");
const route = express.Router();

const userController = require("../controllers/user");
const ProtectRoute = require("../middleware/auth")
const {CreateCSRFTOKEN, verifyCSRFToken} = require("../middleware/csrfToken")


route.get("/", CreateCSRFTOKEN, userController.getIndex);

route.get("/product", CreateCSRFTOKEN, userController.getProduct);

// {ADD PRODUCT ID} //
route.get("/product/:productID", CreateCSRFTOKEN, userController.getDetail); // :productID là dynamic route, nó sẽ được thay thế bằng id của sản phẩm,
// vì là dynamic route nên tên route product/:productID bắt buộc phải đặt ở sau các route cố định của product/... khác, để cho đỡ hiểu nhầm với các route cố định

// {CART} //
route.get("/cart", CreateCSRFTOKEN, ProtectRoute, userController.getCart)
route.post("/cart", CreateCSRFTOKEN, ProtectRoute, verifyCSRFToken, userController.postCart)
route.post("/delete-cart", CreateCSRFTOKEN, ProtectRoute, verifyCSRFToken, userController.deleteCart)

// {GET, ADD PRODUCT FROM CART TO ORDER} //
route.get("/order", CreateCSRFTOKEN, ProtectRoute, userController.getOrder);
route.post("/add-order", CreateCSRFTOKEN, ProtectRoute, verifyCSRFToken, userController.postOrder);

// {GET INVOICE} //
route.get("/order/:orderId", CreateCSRFTOKEN, ProtectRoute, userController.getInvoice)


module.exports = route;
