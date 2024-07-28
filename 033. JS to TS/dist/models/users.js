"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const UserSchema = new mongoose_1.Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        require: true,
    },
    password: {
        type: String,
        require: true
    },
    avatar: {
        type: String,
        require: false
    },
    resetPasswordToken: String,
    resetPasswordExpires: Number,
    cart: {
        items: [
            {
                productId: {
                    type: mongoose_1.Schema.Types.ObjectId,
                    ref: 'products'
                },
                quantity: {
                    type: Number
                }
            }
        ]
    }
});
UserSchema.methods.postCartByUser = function (product) {
    let newQuantity = 1;
    const cartIndex = this.cart.items.findIndex((item) => {
        return item.productId.toString() === product._id.toString();
    });
    let cartUpdate = [...this.cart.items];
    if (cartIndex >= 0) {
        newQuantity = cartUpdate[cartIndex].quantity + 1;
        cartUpdate[cartIndex].quantity = newQuantity;
    }
    else {
        cartUpdate.push({
            productId: product._id,
            quantity: newQuantity
        });
    }
    const Update = {
        items: cartUpdate
    };
    this.cart = Update;
    return this.save();
};
UserSchema.methods.deleteCartByUser = function (product) {
    const cartIndex = this.cart.items.findIndex((item) => {
        return item.productId.toString() === product._id.toString();
    });
    let updateCart = [...this.cart.items];
    if (cartIndex >= 0) {
        updateCart.splice(cartIndex, 1);
    }
    const Update = {
        items: updateCart
    };
    this.cart = Update;
    return this.save();
};
UserSchema.methods.clearCart = function () {
    this.cart.items = [];
    return this.save();
};
const User = (0, mongoose_1.model)('users', UserSchema);
exports.default = User;
