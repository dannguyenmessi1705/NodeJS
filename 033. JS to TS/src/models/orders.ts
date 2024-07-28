import {Schema, Types, model, HydratedDocument} from "mongoose";
import { ProductTypes } from "./products";
export interface OrderTypes {
    products: {
        product: HydratedDocument<ProductTypes>;
        quantity: number;
    }[];
    user: {username: string, userId: Types.ObjectId, email: string};
    date: string;
}
const OrderSchema = new Schema({
    products: [{
        type: Object
    }],
    user: {
        username: {
            type: String,
            require: true
        },
        userId: {
            type: Schema.Types.ObjectId,
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
})

const Order = model<OrderTypes>('orders', OrderSchema);

export default Order;