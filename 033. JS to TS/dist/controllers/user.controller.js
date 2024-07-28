"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInvoice = exports.getOrders = exports.postOrder = exports.deleteProductFromCart = exports.getCart = exports.addProductToCart = exports.getProductById = exports.getTopProducts = exports.findProducts = exports.getAllProducts = void 0;
const orders_1 = __importDefault(require("../models/orders"));
const products_1 = __importDefault(require("../models/products"));
const pdfkit_1 = __importDefault(require("pdfkit"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const path_2 = __importDefault(require("../util/path"));
const ITEMS_PER_PAGE = 6;
const statusCode_1 = require("../util/statusCode");
const CODE = new statusCode_1.codeError();
const getAllProducts = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield products_1.default.find();
        if (!products) {
            return res.status(CODE.NOTFOUND).json({ message: "No products found" });
        }
        res.status(CODE.OK).json({ products: products });
    }
    catch (err) {
        const error = new statusCode_1.Err(err, CODE.INTERNALSERVERERROR);
        next(error);
    }
});
exports.getAllProducts = getAllProducts;
const findProducts = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const name = req.query.name || '';
        const products = yield products_1.default.find({ name: { $regex: name, $options: 'i' } });
        return res.status(CODE.OK).json({ products: products });
    }
    catch (err) {
        const error = new statusCode_1.Err(err, CODE.INTERNALSERVERERROR);
        next(error);
    }
});
exports.findProducts = findProducts;
const getTopProducts = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const numTopProducts = +req.query.num || 10;
        const products = yield products_1.default.find().sort({ soldQuantity: -1 }).limit(numTopProducts);
        if (!products) {
            return res.status(CODE.NOTFOUND).json({ message: "No products found" });
        }
        res.status(CODE.OK).json({ products: products });
    }
    catch (err) {
        const error = new statusCode_1.Err(err, CODE.INTERNALSERVERERROR);
        next(error);
    }
});
exports.getTopProducts = getTopProducts;
const getProductById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const productId = req.params.productId;
        const product = yield products_1.default.findById(productId);
        if (!product) {
            return res.status(CODE.NOTFOUND).json({ message: "Product not found" });
        }
        res.status(CODE.OK).json({ product: product });
    }
    catch (err) {
        const error = new statusCode_1.Err(err, CODE.INTERNALSERVERERROR);
        next(error);
    }
});
exports.getProductById = getProductById;
const addProductToCart = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const productId = req.params.productId;
        const product = yield products_1.default.findById(productId);
        if (!product) {
            return res.status(CODE.NOTFOUND).json({ message: "Product not found" });
        }
        if (product.quantity === 0) {
            return res.status(CODE.NOTFOUND).json({ message: "Product out of stock" });
        }
        yield req.user.postCartByUser(product);
        return res.status(CODE.OK).json({ message: "Add product to cart successfully" });
    }
    catch (err) {
        const error = new statusCode_1.Err(err, CODE.INTERNALSERVERERROR);
        next(error);
    }
});
exports.addProductToCart = addProductToCart;
const getCart = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield req.user.populate('cart.items.productId');
        let products = [...user.cart.items];
        let totalPrice = products.reduce((sum, product, index) => {
            return sum + product.quantity * product.productId.price;
        }, 0);
        if (!products) {
            return res.status(CODE.NOTFOUND).json({ message: "Cart is empty" });
        }
        return res.status(CODE.OK).json({
            products: products,
            totalPrice: totalPrice,
            userId: user._id
        });
    }
    catch (err) {
        const error = new statusCode_1.Err(err, CODE.INTERNALSERVERERROR);
        next(error);
    }
});
exports.getCart = getCart;
const deleteProductFromCart = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const productId = req.params.productId;
        const product = yield products_1.default.findById(productId);
        if (!product) {
            return res.status(CODE.NOTFOUND).json({ message: "Product not found" });
        }
        yield req.user.deleteCartByUser(product);
        return res.status(CODE.OK).json({
            message: "Delete product from cart successfully",
            product: product
        });
    }
    catch (err) {
        const error = new statusCode_1.Err(err, CODE.INTERNALSERVERERROR);
        next(error);
    }
});
exports.deleteProductFromCart = deleteProductFromCart;
const postOrder = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const currentDate = new Date();
        const options = { timeZone: "Asia/Ho_Chi_Minh" };
        const localTime = currentDate.toLocaleString("en-US", options);
        const user = yield req.user.populate('cart.items.productId');
        let products = [...user.cart.items];
        if (!products) {
            return res.status(CODE.NOTFOUND).json({ message: "Cart is empty" });
        }
        if (products.some((product) => __awaiter(void 0, void 0, void 0, function* () {
            const prod = yield products_1.default.findById(product.productId._id);
            return prod.quantity < product.quantity;
        }))) {
            return res.status(CODE.NOTFOUND).json({ message: "Some products out of stock" });
        }
        const productArray = products.map((product) => {
            return {
                product: Object.assign(Object.assign({}, product.productId._doc), { quantity: product.quantity })
            };
        });
        const order = new orders_1.default({
            products: productArray,
            user: {
                username: user.username,
                email: user.email,
                userId: user._id
            },
            date: localTime,
        });
        yield order.save();
        yield req.user.clearCart();
        productArray.forEach((product) => __awaiter(void 0, void 0, void 0, function* () {
            const prod = yield products_1.default.findById(product.product._id);
            prod.quantity = prod.quantity - product.product.quantity;
            prod.soldQuantity = prod.soldQuantity + product.product.quantity;
            yield prod.save();
        }));
        return res.status(CODE.OK).json({ message: "Order successfully" });
    }
    catch (err) {
        const error = new statusCode_1.Err(err, CODE.INTERNALSERVERERROR);
        next(error);
    }
});
exports.postOrder = postOrder;
const getOrders = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let orders = [];
        if (req.user._id.toString() === process.env.ADMIN_ID) {
            orders = (yield orders_1.default.find());
        }
        else {
            orders = (yield orders_1.default.find({ 'user.userId': req.user._id }));
        }
        if (!orders) {
            return res.status(CODE.NOTFOUND).json({ message: "No orders found" });
        }
        return res.status(CODE.OK).json({ orders: orders });
    }
    catch (err) {
        const error = new statusCode_1.Err(err, CODE.INTERNALSERVERERROR);
        next(error);
    }
});
exports.getOrders = getOrders;
const getInvoice = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orderId = req.params.orderId;
        const order = yield orders_1.default.findById(orderId);
        if (!order) {
            return res.status(CODE.NOTFOUND).json({ message: "Order not found" });
        }
        if (order.user.userId.toString() !== req.user._id.toString() && req.user._id.toString() !== process.env.ADMIN_ID) {
            return res.status(CODE.FORBIDDEN).json({
                errorMessage: 'You are not authorized to get this invoice'
            });
        }
        const fontPath = path_1.default.join(path_2.default, 'public', 'fonts', 'fontvn.ttf');
        const nameInvoice = 'Invoice-' + orderId + '.pdf';
        const dateOrder = order.date;
        const pdfDoc = new pdfkit_1.default();
        pdfDoc.pipe(fs_1.default.createWriteStream(path_1.default.join(path_2.default, 'data', 'invoices', nameInvoice)));
        pdfDoc.pipe(res);
        pdfDoc.font(fontPath);
        pdfDoc.fontSize(36).text("SHOP DIDAN", {
            align: "center",
            underline: true
        });
        pdfDoc.fontSize(22).text("Invoice " + dateOrder, {
            align: "center",
            lineGap: 16
        });
        pdfDoc.fontSize(16).text("Customer: " + order.user.username);
        pdfDoc.fontSize(16).text("Invoice ID: " + order._id, {
            lineGap: 16
        });
        let data = [["ID", "NAME", "QUANTITY", "PRICE"]];
        let numth = 0;
        let totalPrice = 0;
        order.products.forEach((prod) => {
            numth++;
            let price = prod.product.price * prod.product.quantity;
            totalPrice += price;
            data = data.concat([
                [numth, prod.product.name, prod.product.quantity, "$" + price, ,],
            ]);
        });
        data.push(["", "", "Total Price", "$" + totalPrice.toFixed(2)]);
        const startX = -40;
        const startY = 210;
        const rowHeight = 30;
        const colWidth = 170;
        pdfDoc.font(fontPath);
        pdfDoc.fontSize(16);
        data.forEach((row, rowIndex) => {
            row.forEach((cell, colIndex) => {
                const x = startX + colIndex * colWidth;
                const y = startY + rowIndex * rowHeight;
                pdfDoc.rect(x, y - 10, colWidth, rowHeight).stroke();
                pdfDoc.text(cell, x, y, {
                    width: colWidth,
                    height: rowHeight,
                    align: "center",
                    lineGap: 5,
                });
            });
        });
        pdfDoc.end();
        return res.status(CODE.OK).json({
            message: "Get invoice successfully",
            url: `${req.protocol}://${req.get('host')}/order/${order._id}`
        });
    }
    catch (err) {
        const error = new statusCode_1.Err(err, CODE.INTERNALSERVERERROR);
        next(error);
    }
});
exports.getInvoice = getInvoice;
