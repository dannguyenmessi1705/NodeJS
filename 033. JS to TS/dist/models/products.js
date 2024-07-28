"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const ProductSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        require: true,
    },
    url: {
        type: String,
        require: true
    },
    description: {
        type: String,
        require: true
    },
    soldQuantity: {
        type: Number,
        require: true
    },
    quantity: {
        type: Number,
        require: true
    },
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: 'users'
    }
});
const Product = (0, mongoose_1.model)('products', ProductSchema);
exports.default = Product;
