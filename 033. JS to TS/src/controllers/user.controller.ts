import { HydratedDocument, Types } from "mongoose";
import Order, {OrderTypes} from "../models/orders";
import Product, { ProductTypes } from "../models/products";
import User, { UserTypes } from "../models/users";

import pdfkit from "pdfkit";
import fs from "fs";
import path from "path";
import rootDir from '../util/path'

const ITEMS_PER_PAGE: number = 6;
import { Err, codeError } from "../util/statusCode";
import exp from "constants";
const CODE = new codeError();

export const getAllProducts = async (req: any, res: any, next: any) => {
    try {
        const products = await Product.find() as HydratedDocument<ProductTypes>[];
        if (!products) {
            return res.status(CODE.NOTFOUND).json({ message: "No products found" });
        }
        res.status(CODE.OK).json({ products: products });
    } catch (err: any) {
        const error = new Err(err, CODE.INTERNALSERVERERROR);
        next(error);
    }
}

export const findProducts = async (req: any, res: any, next: any) => {
    try {
        const name: string = req.query.name || '';
        const products = await Product.find({ name: { $regex: name, $options: 'i' } }) as HydratedDocument<ProductTypes>[];
        return res.status(CODE.OK).json({ products: products });
    } catch (err: any) {
        const error = new Err(err, CODE.INTERNALSERVERERROR);
        next(error);
    }
}

export const getTopProducts = async (req: any, res: any, next: any) => {
    try {
        const numTopProducts: number = +req.query.num || 10;
        const products = await Product.find().sort({ soldQuantity: -1 }).limit(numTopProducts) as HydratedDocument<ProductTypes>[];
        if (!products) {
            return res.status(CODE.NOTFOUND).json({ message: "No products found" });
        }
        res.status(CODE.OK).json({ products: products });
    } catch (err: any) {
        const error = new Err(err, CODE.INTERNALSERVERERROR);
        next(error);
    }
}

export const getProductById = async (req: any, res: any, next: any) => {
    try {
        const productId = req.params.productId;
        const product = await Product.findById(productId) as HydratedDocument<ProductTypes>;
        if (!product) {
            return res.status(CODE.NOTFOUND).json({ message: "Product not found" });
        }
        res.status(CODE.OK).json({ product: product });
    } catch (err: any) {
        const error = new Err(err, CODE.INTERNALSERVERERROR);
        next(error);
    }
}

export const addProductToCart = async (req: any, res: any, next: any) => {
    try {
        const productId = req.params.productId;
        const product = await Product.findById(productId) as HydratedDocument<ProductTypes>;
        if (!product) {
            return res.status(CODE.NOTFOUND).json({ message: "Product not found" });
        }
        if (product.quantity === 0) {
            return res.status(CODE.NOTFOUND).json({ message: "Product out of stock" });
        }
        await req.user.postCartByUser(product);
        return res.status(CODE.OK).json({ message: "Add product to cart successfully" });
    } catch (err: any) {
        const error = new Err(err, CODE.INTERNALSERVERERROR);
        next(error);
    }
}

export const getCart = async (req: any, res: any, next: any) => {
    try {
        interface productCart {
            productId: HydratedDocument<ProductTypes>;
            quantity: number;
        }
        interface CartTypes extends Omit<HydratedDocument<UserTypes>, 'cart'> {
            cart: {
                items: productCart[];
            }
        }
        const user = await req.user.populate('cart.items.productId') as CartTypes;
        let products = [...user.cart.items];

        let totalPrice: number = products.reduce((sum: number, product: productCart, index: number) => {
            return sum + product.quantity * product.productId.price;
        }, 0)
        if (!products) {
            return res.status(CODE.NOTFOUND).json({ message: "Cart is empty" });
        }
        return res.status(CODE.OK).json({ 
            products: products, 
            totalPrice: totalPrice, 
            userId: user._id
        });
    } catch (err: any) {
        const error = new Err(err, CODE.INTERNALSERVERERROR);
        next(error);
    }
}

export const deleteProductFromCart = async (req: any, res: any, next: any) => {
    try {
        const productId = req.params.productId;
        const product = await Product.findById(productId) as HydratedDocument<ProductTypes>;
        if (!product) {
            return res.status(CODE.NOTFOUND).json({ message: "Product not found" });
        }
        await req.user.deleteCartByUser(product);
        return res.status(CODE.OK).json({
            message: "Delete product from cart successfully",
            product: product
        })
    } catch (err: any) {
        const error = new Err(err, CODE.INTERNALSERVERERROR);
        next(error);
    }
}

export const postOrder = async (req: any, res: any, next: any) => {
    try {
        interface productCart {
            productId: HydratedDocument<ProductTypes>;
            quantity: number;
        }
        interface CartTypes extends Omit<HydratedDocument<UserTypes>, 'cart'> {
            cart: {
                items: productCart[];
            }
        }
        const currentDate = new Date();
        const options = { timeZone: "Asia/Ho_Chi_Minh" };
        const localTime = currentDate.toLocaleString("en-US", options);
        const user = await req.user.populate('cart.items.productId') as CartTypes;
        let products = [...user.cart.items];
        if (!products) {
            return res.status(CODE.NOTFOUND).json({ message: "Cart is empty" });
        }
        if (products.some(async (product) => {
            const prod = await Product.findById(product.productId._id) as HydratedDocument<ProductTypes>;
            return prod.quantity < product.quantity;
        })) {
            return res.status(CODE.NOTFOUND).json({ message: "Some products out of stock" });
        }
        const productArray = products.map((product) => {
            return {
                product: {
                    ...(product.productId as any)._doc,
                    quantity: product.quantity
                }
            }
        })
        const order: HydratedDocument<OrderTypes> = new Order({
            products: productArray,
            user: {
                username: user.username,
                email: user.email,
                userId: user._id
            },
            date: localTime,
        })
        await order.save();
        await req.user.clearCart();
        productArray.forEach(async (product) => {
            const prod = await Product.findById(product.product._id) as HydratedDocument<ProductTypes>;
            prod.quantity = prod.quantity - product.product.quantity;
            prod.soldQuantity = prod.soldQuantity + product.product.quantity;
            await prod.save();
        })
        return res.status(CODE.OK).json({ message: "Order successfully" });
    } catch (err: any) {
        const error = new Err(err, CODE.INTERNALSERVERERROR);
        next(error);
    }
}

export const getOrders = async (req: any, res: any, next: any) => {
    try {
        let orders: HydratedDocument<OrderTypes>[] = [];
        if (req.user._id.toString() === process.env.ADMIN_ID as string) {
            orders = await Order.find() as HydratedDocument<OrderTypes>[];
        } else {
            orders = await Order.find({ 'user.userId': req.user._id }) as HydratedDocument<OrderTypes>[];
        }
        if (!orders) {
            return res.status(CODE.NOTFOUND).json({ message: "No orders found" });
        }
        return res.status(CODE.OK).json({ orders: orders });
    } catch (err: any) {
        const error = new Err(err, CODE.INTERNALSERVERERROR);
        next(error);
    }
}

export const getInvoice = async (req: any, res: any, next: any) => {
    try {
        const orderId: string = req.params.orderId;
        const order = await Order.findById(orderId) as HydratedDocument<OrderTypes>;
        if (!order) {
            return res.status(CODE.NOTFOUND).json({ message: "Order not found" });
        }
        if (order.user.userId.toString() !== req.user._id.toString() && req.user._id.toString() !== process.env.ADMIN_ID as string) {
            return res.status(CODE.FORBIDDEN).json({
                errorMessage: 'You are not authorized to get this invoice'
            })
        }
        const fontPath: string = path.join(rootDir, 'public', 'fonts', 'fontvn.ttf');
        const nameInvoice: string = 'Invoice-' + orderId + '.pdf';
        const dateOrder: string = order.date;
        const pdfDoc = new pdfkit();
        pdfDoc.pipe(
            fs.createWriteStream(path.join(rootDir, 'data', 'invoices', nameInvoice))
        );
        pdfDoc.pipe(res);
        pdfDoc.font(fontPath);
        pdfDoc.fontSize(36).text("SHOP DIDAN", {
            align: "center",
            underline: true
        })
        pdfDoc.fontSize(22).text("Invoice "+dateOrder, {
            align: "center",
            lineGap: 16
        })
        pdfDoc.fontSize(16).text("Customer: " + order.user.username)
        pdfDoc.fontSize(16).text("Invoice ID: " + order._id, {
            lineGap: 16
        })
        let data: any = [["ID", "NAME", "QUANTITY", "PRICE"]];
        let numth: number = 0;
        let totalPrice: number = 0;
        order.products.forEach((prod) => {
            numth++;
            let price: number = prod.product.price * prod.product.quantity;
            totalPrice += price;
            data = data.concat([
                [numth, prod.product.name, prod.product.quantity, "$" + price, ,],
            ]);
        });
        data.push(["", "", "Total Price", "$" + totalPrice.toFixed(2)]);
        const startX: number = -40;
        const startY: number = 210;
        const rowHeight: number = 30;
        const colWidth: number = 170;
        pdfDoc.font(fontPath);
        pdfDoc.fontSize(16);
        data.forEach((row: number[], rowIndex: number) => {
            row.forEach((cell: any, colIndex: number) => {
                const x = startX + colIndex * colWidth;
                const y = startY + rowIndex * rowHeight;
                pdfDoc.rect(x, y-10, colWidth, rowHeight).stroke();
                pdfDoc.text(cell, x, y, {
                    width: colWidth,
                    height: rowHeight,
                    align: "center",
                    lineGap: 5,
                })
            })
        })
        pdfDoc.end();
        return res.status(CODE.OK).json({ 
            message: "Get invoice successfully",
            url: `${req.protocol}://${req.get('host')}/order/${order._id}` 
        });

    } catch (err: any) {
        const error = new Err(err, CODE.INTERNALSERVERERROR);
        next(error);
    }
}