import { validationResult } from "express-validator";
import { Err, codeError } from "../util/statusCode";
const CODE = new codeError();
import { generateAccessToken, generateRefreshToken } from "../middleware/jwtGeneration";
import crypto from "crypto";
import rootDir from "../util/path";
import path from "path";
import User, { UserTypes } from "../models/users";
import {HydratedDocument} from "mongoose";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
const transporter = nodemailer.createTransport({
    host: process.env.SECRET_SMTP_HOST,
    port: 465,
    secure: true,
    auth: {
        user: process.env.SECRET_SMTP_USER,
        pass: process.env.SECRET_SMTP_PASSWORD,
    },
})

export const getCsrfToken = (req: any, res: any) => {
    return res.status(CODE.OK).json({ csrfToken: res.locals.csrfToken })
}

export const postAuth = async (req: any, res: any, next: any) => {
    const body = req.body as UserTypes;
    const email = body.email;
    const password = body.password;
    const errorValidation = validationResult(req);
    try {
        if (!errorValidation.isEmpty()) {
            return res.status(CODE.UNPROCESSABLEENTITY).json({
                errorMessage: errorValidation.array()[0].msg,
            })
        }
        const user = await User.findOne({ email: email }) as HydratedDocument<UserTypes>; 
        if (!user) {
            return res.status(CODE.UNAUTHORIZED).json({
                errorMessage: "Email or password is incorrect",
            })
        }
        const checkPassword = bcrypt.compareSync(password, user.password);
        if (checkPassword) {
            const accessToken = generateAccessToken({userId: user._id.toString()});
            const refreshToken = generateRefreshToken({userId: user._id.toString()});
            req.session.accessToken = accessToken;
            req.session.refreshToken = refreshToken;
            req.session.isLogin = true;
            req.session.user = user;
            req.session.save(() => {
                return res.status(CODE.OK).json({
                    message: "Login successfully",
                    userId: user._id.toString(),
                    accessToken: accessToken,
                })
            });
        } else {
            return res.status(CODE.UNAUTHORIZED).json({
                errorMessage: "Email or password is incorrect",
            })
        }
    } catch (err: any) {
        const error = new Err(err, CODE.INTERNALSERVERERROR);
        next(error);
    }
}

export const postLogout = (req: any, res: any, next: any) => {
    try {
        req.session.destroy(() => {
            return res.status(CODE.OK).json({ message: "Logout successfully" })
        })
    } catch (err: any) {
        return res.status(CODE.INTERNALSERVERERROR).json({ message: "Server error" })
    }
}

export const postSignup = async (req: any, res: any, next: any) => {
    const body = req.body as UserTypes;
    const username = body.username;
    const email = body.email;
    const password = body.password;
    const re_password = body.re_password;
    const errorValidation = validationResult(req);
    try {
        if (!errorValidation.isEmpty()) {
            return res.status(CODE.UNPROCESSABLEENTITY).json({
                errorMessage: errorValidation.array()[0].msg,
            })
        }
        const hashedPassword = bcrypt.hashSync(password, 12);
        const newUser: HydratedDocument<UserTypes> = new User({
            username,
            email,
            password: hashedPassword,
            cart: { items: [] },
        });
        const result = await newUser.save();
        if (result) {
            transporter.sendMail({
                from: process.env.SECRET_SMTP_USER,
                to: email,
                subject: "Signup successfully",
                html: `
                    <h1>You successfully signed up!</h1>
                `,
            }).then(() => {
                return res.status(CODE.CREATED).json({
                    message: "Signup successfully",
                    userId: result._id.toString()
                })
            }).catch((err) => {
                return res.status(CODE.INTERNALSERVERERROR).json({
                    errorMessage: "Signup failed",
                })
            })
        } else {
            return res.status(CODE.INTERNALSERVERERROR).json({
                errorMessage: "Signup failed",
            })
        }
    } catch (err: any) {
        const error = new Err(err, CODE.INTERNALSERVERERROR);
        next(error);
    }
}

export const postResetPassword = async (req: any, res: any, next: any) => {
    const email = req.body.email as string;
    const errorValidation = validationResult(req);
    try {
        if (!errorValidation.isEmpty()) {
            return res.status(CODE.UNPROCESSABLEENTITY).json({
                errorMessage: errorValidation.array()[0].msg,
            })
        } else {
            const user = await User.findOne({ email: email }) as HydratedDocument<UserTypes> ;
            if (!user) {
                return res.status(CODE.NOTFOUND).json({ message: "Email not found" })
            }
            crypto.randomBytes(32, async (err, buffer) => {
                if (err) {
                    return res.status(CODE.INTERNALSERVERERROR).json({ message: "Server error" })
                }
                const token = buffer.toString("hex");
                user.resetPasswordToken = token;
                user.resetPasswordExpires = Date.now() + 600000;
                const http: string = req.protocol + "://" + req.get("host");
                await user.save();
                transporter.sendMail({
                    from: process.env.SECRET_SMTP_USER,
                    to: email,
                    subject: "Reset password",
                    html: `
                        <p>You requested a password reset</p>
                        <p>Click this <a href="${http}/reset/${token}">link</a> to set a new password.</p>
                        <p>This link is valid for 10 minutes, token: ${token}</p>
                    `,
                }).then(() => {
                    return res.status(CODE.OK).json({ message: "Reset password successfully" })
                }).catch((err) => {
                    return res.status(CODE.INTERNALSERVERERROR).json({ message: "Server error" })
                })
            })
        }
    } catch (err: any) {
        const error = new Err(err, CODE.INTERNALSERVERERROR);
        next(error);
    }
}

const getUpdatePassword = async (req: any, res: any, next: any) => {
    const token = req.params.tokenReset;
    try {
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() },
        }) as HydratedDocument<UserTypes>;
        if (!user) {
            return res.status(CODE.NOTFOUND).json({ message: "Token is invalid or has expired" })
        }
        return res.status(CODE.OK).json({ 
            message: "Token is valid",
            userId: user._id.toString(),
            token: token
        })
    } catch (err: any) {
        const error = new Err(err, CODE.INTERNALSERVERERROR);
        next(error);
    }
}

const postUpdatePassword = async (req: any, res: any, next: any) => {
    const userId = req.body.userId as string;
    const token = req.body.token as string;
    const password = req.body.password as string;
    const errorValidation = validationResult(req);
    try {
        if (!errorValidation.isEmpty()) {
            return res.status(CODE.UNPROCESSABLEENTITY).json({
                errorMessage: errorValidation.array()[0].msg,
            })
        }
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() },
            _id: userId,
        }) as HydratedDocument<UserTypes>;
        if (!user) {
            return res.status(CODE.NOTFOUND).json({ message: "Token is invalid or has expired" })
        }
        const hashedPassword = bcrypt.hashSync(password, 12);
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        const result = await user.save();
        if (result) {
            return res.status(CODE.OK).json({ message: "Update password successfully" })
        } else {
            return res.status(CODE.INTERNALSERVERERROR).json({ message: "Server error" })
        }
    } catch (err: any) {
        const error = new Err(err, CODE.INTERNALSERVERERROR);
        next(error);
    }
}

export const getProfile = async (req: any, res: any, next: any) => {
    try {
        const userId: string = req.session.user._id;
        const user = await User.findById(userId).select("username email") as HydratedDocument<UserTypes>;
        if (!user) {
            return res.status(CODE.NOTFOUND).json({ message: "User not found" })
        }
        return res.status(CODE.OK).json({ message: "Get profile successfully", user: user })
    } catch (err: any) {
        const error = new Err(err, CODE.INTERNALSERVERERROR);
        next(error);
    }
}

export const updateProfile = async (req: any, res: any, next: any) => {
    try {
        let password: string = req.body?.password;
        const userId: string = req.session.user._id;
        const user = await User.findById(userId) as HydratedDocument<UserTypes>;
        if (!user) {
            return res.status(CODE.NOTFOUND).json({ message: "User not found" })
        }
        let username: string = req.body?.username;
        let email: string = req.body?.email;
        let newPasword: string = req.body?.new_password;
        const checkPassword = bcrypt.compareSync(password, user.password);
        if (!checkPassword) {
            return res.status(CODE.UNAUTHORIZED).json({ message: "Password is incorrect" })
        }
        const image = req.file as Express.Multer.File;
        if (image) {
            user.avatar = image.path as string;
        }
        if (username) {
            const findUser = await User.findOne({ username: username }) as HydratedDocument<UserTypes>;
            if (findUser) {
                return res.status(CODE.UNPROCESSABLEENTITY).json({ message: "Username already exists" })
            }
            user.username = username ? username : user.username;
        } 
        if (email) {
            const findUser = await User.findOne({ email: email }) as HydratedDocument<UserTypes>;
            if (findUser) {
                return res.status(CODE.UNPROCESSABLEENTITY).json({ message: "Username already exists" })
            }
            user.email = email ? email : user.email;
        }
        if (newPasword) {
            if (newPasword.length < 5) {
                return res.status(CODE.UNPROCESSABLEENTITY).json({ message: "Password must be at least 5 characters" })
            }
            const hashedPassword = bcrypt.hashSync(newPasword, 12);
            user.password = hashedPassword;
        }
        await user.save();
        req.session.user = user;
        return res.status(CODE.OK).json({ message: "Update profile successfully" })
    } catch (err: any) {
        const error = new Err(err, CODE.INTERNALSERVERERROR);
        next(error);
    }
}