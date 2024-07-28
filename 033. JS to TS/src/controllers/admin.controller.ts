import Product,  { ProductTypes } from '../models/products'
import { HydratedDocument } from 'mongoose';
import fs from 'fs'
const ITEMS_PER_PAGE: number = 6;
import {validationResult} from 'express-validator'
import {Err, codeError} from '../util/statusCode'
const CODE = new codeError();

export const postProduct = async (req: any, res: any, next: any) => {
    const body = req.body as ProductTypes;
    const name = body.name;
    const price = body.price;
    const image = req.file as Express.Multer.File;
    if (!image) {
        return res.status(CODE.UNPROCESSABLEENTITY).json({
            errorMessage: 'Attached file is not an image.'
        })
    }
    const description = body.description;
    const quantity = body.quantity;
    const userId = req.user._id;

    const errorValidation = validationResult(req);
    if (!errorValidation.isEmpty()) {
        return res.status(CODE.UNPROCESSABLEENTITY).json({
            errorMessage: errorValidation.array()[0].msg
        })
    }
    try {
        const product: HydratedDocument<ProductTypes> = new Product({
            name: name,
            price: price,
            url: image.path as string,
            description: description,
            quantity: quantity,
            userId: userId
        })
        const result = await product.save();
        if (result) {
            res.status(CODE.CREATED).json({
                message: 'Create product successfully',
                product: result
            })
        } else {
            res.status(CODE.INTERNALSERVERERROR).json({
                errorMessage: 'Create product failed'
            })
        }
    } catch (err: any) {
        const error = new Err(err, CODE.INTERNALSERVERERROR);
        next(error);
    }
}

export const getProducts = async (req: any, res: any, next: any) => {
    const page: number = +req.query.page || 1;
    let numProducts: number = 0;
    let numOfProducts: number;
    let products;
    let totalItems: number = 0;
    try {
        if (req.user._id.toString() === process.env.ADMIN_ID as string) {
            numOfProducts = await Product.countDocuments({
                userId: req.user._id
            })
            numProducts = numOfProducts;
            products = await Product.find({
                userId: req.user._id
            })
                .skip((page - 1) * ITEMS_PER_PAGE)
                .limit(ITEMS_PER_PAGE)
                .select("name price url description _id soldQuantity quantity")
                .exec() as HydratedDocument<ProductTypes>[]; 
        } else {
            numOfProducts = await Product.countDocuments()
            numProducts = numOfProducts;
            products = await Product.find()
                .skip((page - 1) * ITEMS_PER_PAGE)
                .limit(ITEMS_PER_PAGE)
                .select("name price url description _id soldQuantity quantity")
                .exec() as HydratedDocument<ProductTypes>[];
        }
        if (!products) {
            return res.status(CODE.NOTFOUND).json({
                errorMessage: 'Products not found'
            })
        }
        res.status(CODE.OK).json({
            message: 'Get products successfully',
            products: products,
            totalItems: products
        })
    } catch (err: any) {
        const error = new Err(err, CODE.INTERNALSERVERERROR);
        next(error);
    }
}

export const postEditProduct = async (req: any, res: any, next: any) => {
    const body = req.body as ProductTypes;
    const name = body.name;
    const price = body.price;
    const image = req.file as Express.Multer.File;
    const description = body.description;
    const quantity = body.quantity;
    const productId = req.params.productId;
    let url: string = '';
    if (image) {
        url = image.path as string;
    }
    const errorValidation = validationResult(req);
    try {
        const product = await Product.findById(productId) as HydratedDocument<ProductTypes>;
        if (!product) {
            return res.status(CODE.NOTFOUND).json({
                errorMessage: 'Product not found'
            })
        }
        if (!errorValidation.isEmpty()) {
            return res.status(CODE.UNPROCESSABLEENTITY).json({
                errorMessage: errorValidation.array()[0].msg
            })
        }
        if (product.userId.toString() !== req.user._id.toString() && req.user._id.toString() !== process.env.ADMIN_ID as string) {
            return res.status(CODE.FORBIDDEN).json({
                errorMessage: 'You are not authorized to edit this product'
            })
        }
        product.name = name;
        product.price = price;
        product.description = description;
        product.quantity = quantity;
        if (url) {
            fs.unlink(product.url as string, (err) => {
                if (err) {
                    return res.status(CODE.INTERNALSERVERERROR).json({ message: "Server error" })
                }
            })
            product.url = url;
        }
        const result = await product.save();
        if (result) {
            res.status(CODE.OK).json({
                message: 'Edit product successfully',
                product: result
            })
        } else {
            res.status(CODE.INTERNALSERVERERROR).json({
                errorMessage: 'Edit product failed'
            })
        }
    } catch (err: any) {
        const error = new Err(err, CODE.INTERNALSERVERERROR);
        next(error);
    }
}

export const deleteProduct = async (req: any, res: any, next: any) => {
    const productId = req.params.productId;
    let result: any = undefined;
    try {
        const product = await Product.findById(productId) as HydratedDocument<ProductTypes>;
        if (!product) {
            return res.status(CODE.NOTFOUND).json({
                errorMessage: 'Product not found'
            })
        }
        if (product.userId.toString() !== req.user._id.toString() && req.user._id.toString() !== process.env.ADMIN_ID as string) {
            return res.status(CODE.FORBIDDEN).json({
                errorMessage: 'You are not authorized to delete this product'
            })
        }
        else if (process.env.ADMIN_ID as string === req.user._id.toString()) {
            result = await Product.deleteOne({_id: productId});
        }
        else {
            result = await Product.deleteOne({_id: productId, userId: req.user._id});
        }
        if (result) {
            fs.unlink(product.url as string, (err) => {
                if (err) {
                    return res.status(CODE.INTERNALSERVERERROR).json({ message: "Server error" })
                }
            })
            req.user.cart.items = req.user.cart.items.filter((item: any) => {
                return item.productId.toString() !== productId.toString();
            })
            const save = await req.user.save();
            if (!save) {
                return res.status(CODE.INTERNALSERVERERROR).json({ message: "Server error" })
            }
            return res.status(CODE.OK).json({
                message: 'Delete product successfully',
                product: result
            })
        } else {
            return res.status(CODE.INTERNALSERVERERROR).json({
                errorMessage: 'Delete product failed'
            })
        }
    } catch (err: any) {
        const error = new Err(err, CODE.INTERNALSERVERERROR);
        next(error);
    }
}