import {Schema, Types, model, HydratedDocument} from "mongoose";
import { ProductTypes } from "./products";
export interface UserTypes {
    username: string;
    email: string;
    password: string;
    re_password?: string;
    avatar?: string;
    resetPasswordToken?: string;
    resetPasswordExpires?: number;
    cart: {
        items: [
            {
                productId: Types.ObjectId;
                quantity: number;
            }
        ]
    }
}
const UserSchema = new Schema<UserTypes>({
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
                    type: Schema.Types.ObjectId,
                    ref: 'products'
                },
                quantity: {
                    type: Number
                }
            }
        ]
    }
})

UserSchema.methods.postCartByUser = function (product: HydratedDocument<ProductTypes>) {
    let newQuantity: number = 1;
    const cartIndex: number = this.cart.items.findIndex((item: {productId: string, quantity: number}) => {
        return item.productId.toString() === product._id.toString();
    })
    let cartUpdate = [...this.cart.items];
    if (cartIndex >= 0) {
        newQuantity = cartUpdate[cartIndex].quantity + 1;
        cartUpdate[cartIndex].quantity = newQuantity;
    } else {
        cartUpdate.push({
            productId: product._id,
            quantity: newQuantity
        })
    }
    const Update = {
        items: cartUpdate
    }
    this.cart = Update;
    return this.save();
}

UserSchema.methods.deleteCartByUser = function (product: HydratedDocument<ProductTypes>) {
    const cartIndex: number = this.cart.items.findIndex((item: {productId: string, quantity: number}) => {
        return item.productId.toString() === product._id.toString();
    })
    let updateCart = [...this.cart.items];
    if (cartIndex >= 0) {
        updateCart.splice(cartIndex, 1);
    }
    const Update = {
        items: updateCart
    }
    this.cart = Update;
    return this.save();
}

UserSchema.methods.clearCart = function () {
    this.cart.items = [];
    return this.save();
}

const User = model<UserTypes>('users', UserSchema);
export default User;