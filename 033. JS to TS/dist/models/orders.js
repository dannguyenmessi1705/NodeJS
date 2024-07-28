"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const OrderSchema = new mongoose_1.Schema({
    products: [{
            type: Object
        }],
    user: {
        username: {
            type: String,
            require: true
        },
        userId: {
            type: mongoose_1.Schema.Types.ObjectId,
            required: true,
            ref: 'users'
        },
        email: {
            type: String,
            require: true
        }
    },
    date: {
        type: String,
        require: true
    }
});
const Order = (0, mongoose_1.model)('orders', OrderSchema);
exports.default = Order;
