import { Schema, Types, model } from "mongoose";
export interface ProductTypes {
    name: string;
    price: number;
    url: string;
    description: string;
    soldQuantity: number;
    quantity: number;
    userId: Types.ObjectId;
}
const ProductSchema = new Schema({
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
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'users'
    }
})

const Product = model<ProductTypes>('products', ProductSchema);
export default Product;