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
exports.deleteProduct = exports.postEditProduct = exports.getProducts = exports.postProduct = void 0;
const products_1 = __importDefault(require("../models/products"));
const fs_1 = __importDefault(require("fs"));
const ITEMS_PER_PAGE = 6;
const express_validator_1 = require("express-validator");
const statusCode_1 = require("../util/statusCode");
const CODE = new statusCode_1.codeError();
const postProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const name = body.name;
    const price = body.price;
    const image = req.file;
    if (!image) {
        return res.status(CODE.UNPROCESSABLEENTITY).json({
            errorMessage: 'Attached file is not an image.'
        });
    }
    const description = body.description;
    const quantity = body.quantity;
    const userId = req.user._id;
    const errorValidation = (0, express_validator_1.validationResult)(req);
    if (!errorValidation.isEmpty()) {
        return res.status(CODE.UNPROCESSABLEENTITY).json({
            errorMessage: errorValidation.array()[0].msg
        });
    }
    try {
        const product = new products_1.default({
            name: name,
            price: price,
            url: image.path,
            description: description,
            quantity: quantity,
            userId: userId
        });
        const result = yield product.save();
        if (result) {
            res.status(CODE.CREATED).json({
                message: 'Create product successfully',
                product: result
            });
        }
        else {
            res.status(CODE.INTERNALSERVERERROR).json({
                errorMessage: 'Create product failed'
            });
        }
    }
    catch (err) {
        const error = new statusCode_1.Err(err, CODE.INTERNALSERVERERROR);
        next(error);
    }
});
exports.postProduct = postProduct;
const getProducts = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const page = +req.query.page || 1;
    let numProducts = 0;
    let numOfProducts;
    let products;
    let totalItems = 0;
    try {
        if (req.user._id.toString() === process.env.ADMIN_ID) {
            numOfProducts = yield products_1.default.countDocuments({
                userId: req.user._id
            });
            numProducts = numOfProducts;
            products = (yield products_1.default.find({
                userId: req.user._id
            })
                .skip((page - 1) * ITEMS_PER_PAGE)
                .limit(ITEMS_PER_PAGE)
                .select("name price url description _id soldQuantity quantity")
                .exec());
        }
        else {
            numOfProducts = yield products_1.default.countDocuments();
            numProducts = numOfProducts;
            products = (yield products_1.default.find()
                .skip((page - 1) * ITEMS_PER_PAGE)
                .limit(ITEMS_PER_PAGE)
                .select("name price url description _id soldQuantity quantity")
                .exec());
        }
        if (!products) {
            return res.status(CODE.NOTFOUND).json({
                errorMessage: 'Products not found'
            });
        }
        res.status(CODE.OK).json({
            message: 'Get products successfully',
            products: products,
            totalItems: products
        });
    }
    catch (err) {
        const error = new statusCode_1.Err(err, CODE.INTERNALSERVERERROR);
        next(error);
    }
});
exports.getProducts = getProducts;
const postEditProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const name = body.name;
    const price = body.price;
    const image = req.file;
    const description = body.description;
    const quantity = body.quantity;
    const productId = req.params.productId;
    let url = '';
    if (image) {
        url = image.path;
    }
    const errorValidation = (0, express_validator_1.validationResult)(req);
    try {
        const product = yield products_1.default.findById(productId);
        if (!product) {
            return res.status(CODE.NOTFOUND).json({
                errorMessage: 'Product not found'
            });
        }
        if (!errorValidation.isEmpty()) {
            return res.status(CODE.UNPROCESSABLEENTITY).json({
                errorMessage: errorValidation.array()[0].msg
            });
        }
        if (product.userId.toString() !== req.user._id.toString() && req.user._id.toString() !== process.env.ADMIN_ID) {
            return res.status(CODE.FORBIDDEN).json({
                errorMessage: 'You are not authorized to edit this product'
            });
        }
        product.name = name;
        product.price = price;
        product.description = description;
        product.quantity = quantity;
        if (url) {
            fs_1.default.unlink(product.url, (err) => {
                if (err) {
                    return res.status(CODE.INTERNALSERVERERROR).json({ message: "Server error" });
                }
            });
            product.url = url;
        }
        const result = yield product.save();
        if (result) {
            res.status(CODE.OK).json({
                message: 'Edit product successfully',
                product: result
            });
        }
        else {
            res.status(CODE.INTERNALSERVERERROR).json({
                errorMessage: 'Edit product failed'
            });
        }
    }
    catch (err) {
        const error = new statusCode_1.Err(err, CODE.INTERNALSERVERERROR);
        next(error);
    }
});
exports.postEditProduct = postEditProduct;
const deleteProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const productId = req.params.productId;
    let result = undefined;
    try {
        const product = yield products_1.default.findById(productId);
        if (!product) {
            return res.status(CODE.NOTFOUND).json({
                errorMessage: 'Product not found'
            });
        }
        if (product.userId.toString() !== req.user._id.toString() && req.user._id.toString() !== process.env.ADMIN_ID) {
            return res.status(CODE.FORBIDDEN).json({
                errorMessage: 'You are not authorized to delete this product'
            });
        }
        else if (process.env.ADMIN_ID === req.user._id.toString()) {
            result = yield products_1.default.deleteOne({ _id: productId });
        }
        else {
            result = yield products_1.default.deleteOne({ _id: productId, userId: req.user._id });
        }
        if (result) {
            fs_1.default.unlink(product.url, (err) => {
                if (err) {
                    return res.status(CODE.INTERNALSERVERERROR).json({ message: "Server error" });
                }
            });
            req.user.cart.items = req.user.cart.items.filter((item) => {
                return item.productId.toString() !== productId.toString();
            });
            const save = yield req.user.save();
            if (!save) {
                return res.status(CODE.INTERNALSERVERERROR).json({ message: "Server error" });
            }
            return res.status(CODE.OK).json({
                message: 'Delete product successfully',
                product: result
            });
        }
        else {
            return res.status(CODE.INTERNALSERVERERROR).json({
                errorMessage: 'Delete product failed'
            });
        }
    }
    catch (err) {
        const error = new statusCode_1.Err(err, CODE.INTERNALSERVERERROR);
        next(error);
    }
});
exports.deleteProduct = deleteProduct;
