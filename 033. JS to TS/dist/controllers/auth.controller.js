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
exports.updateProfile = exports.getProfile = exports.postResetPassword = exports.postSignup = exports.postLogout = exports.postAuth = exports.getCsrfToken = void 0;
const express_validator_1 = require("express-validator");
const statusCode_1 = require("../util/statusCode");
const CODE = new statusCode_1.codeError();
const jwtGeneration_1 = require("../middleware/jwtGeneration");
const crypto_1 = __importDefault(require("crypto"));
const users_1 = __importDefault(require("../models/users"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const transporter = nodemailer_1.default.createTransport({
    host: process.env.SECRET_SMTP_HOST,
    port: 465,
    secure: true,
    auth: {
        user: process.env.SECRET_SMTP_USER,
        pass: process.env.SECRET_SMTP_PASSWORD,
    },
});
const getCsrfToken = (req, res) => {
    return res.status(CODE.OK).json({ csrfToken: res.locals.csrfToken });
};
exports.getCsrfToken = getCsrfToken;
const postAuth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const email = body.email;
    const password = body.password;
    const errorValidation = (0, express_validator_1.validationResult)(req);
    try {
        if (!errorValidation.isEmpty()) {
            return res.status(CODE.UNPROCESSABLEENTITY).json({
                errorMessage: errorValidation.array()[0].msg,
            });
        }
        const user = yield users_1.default.findOne({ email: email });
        if (!user) {
            return res.status(CODE.UNAUTHORIZED).json({
                errorMessage: "Email or password is incorrect",
            });
        }
        const checkPassword = bcryptjs_1.default.compareSync(password, user.password);
        if (checkPassword) {
            const accessToken = (0, jwtGeneration_1.generateAccessToken)({ userId: user._id.toString() });
            const refreshToken = (0, jwtGeneration_1.generateRefreshToken)({ userId: user._id.toString() });
            req.session.accessToken = accessToken;
            req.session.refreshToken = refreshToken;
            req.session.isLogin = true;
            req.session.user = user;
            req.session.save(() => {
                return res.status(CODE.OK).json({
                    message: "Login successfully",
                    userId: user._id.toString(),
                    accessToken: accessToken,
                });
            });
        }
        else {
            return res.status(CODE.UNAUTHORIZED).json({
                errorMessage: "Email or password is incorrect",
            });
        }
    }
    catch (err) {
        const error = new statusCode_1.Err(err, CODE.INTERNALSERVERERROR);
        next(error);
    }
});
exports.postAuth = postAuth;
const postLogout = (req, res, next) => {
    try {
        req.session.destroy(() => {
            return res.status(CODE.OK).json({ message: "Logout successfully" });
        });
    }
    catch (err) {
        return res.status(CODE.INTERNALSERVERERROR).json({ message: "Server error" });
    }
};
exports.postLogout = postLogout;
const postSignup = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const username = body.username;
    const email = body.email;
    const password = body.password;
    const re_password = body.re_password;
    const errorValidation = (0, express_validator_1.validationResult)(req);
    try {
        if (!errorValidation.isEmpty()) {
            return res.status(CODE.UNPROCESSABLEENTITY).json({
                errorMessage: errorValidation.array()[0].msg,
            });
        }
        const hashedPassword = bcryptjs_1.default.hashSync(password, 12);
        const newUser = new users_1.default({
            username,
            email,
            password: hashedPassword,
            cart: { items: [] },
        });
        const result = yield newUser.save();
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
                });
            }).catch((err) => {
                return res.status(CODE.INTERNALSERVERERROR).json({
                    errorMessage: "Signup failed",
                });
            });
        }
        else {
            return res.status(CODE.INTERNALSERVERERROR).json({
                errorMessage: "Signup failed",
            });
        }
    }
    catch (err) {
        const error = new statusCode_1.Err(err, CODE.INTERNALSERVERERROR);
        next(error);
    }
});
exports.postSignup = postSignup;
const postResetPassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.body.email;
    const errorValidation = (0, express_validator_1.validationResult)(req);
    try {
        if (!errorValidation.isEmpty()) {
            return res.status(CODE.UNPROCESSABLEENTITY).json({
                errorMessage: errorValidation.array()[0].msg,
            });
        }
        else {
            const user = yield users_1.default.findOne({ email: email });
            if (!user) {
                return res.status(CODE.NOTFOUND).json({ message: "Email not found" });
            }
            crypto_1.default.randomBytes(32, (err, buffer) => __awaiter(void 0, void 0, void 0, function* () {
                if (err) {
                    return res.status(CODE.INTERNALSERVERERROR).json({ message: "Server error" });
                }
                const token = buffer.toString("hex");
                user.resetPasswordToken = token;
                user.resetPasswordExpires = Date.now() + 600000;
                const http = req.protocol + "://" + req.get("host");
                yield user.save();
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
                    return res.status(CODE.OK).json({ message: "Reset password successfully" });
                }).catch((err) => {
                    return res.status(CODE.INTERNALSERVERERROR).json({ message: "Server error" });
                });
            }));
        }
    }
    catch (err) {
        const error = new statusCode_1.Err(err, CODE.INTERNALSERVERERROR);
        next(error);
    }
});
exports.postResetPassword = postResetPassword;
const getUpdatePassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.params.tokenReset;
    try {
        const user = yield users_1.default.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() },
        });
        if (!user) {
            return res.status(CODE.NOTFOUND).json({ message: "Token is invalid or has expired" });
        }
        return res.status(CODE.OK).json({
            message: "Token is valid",
            userId: user._id.toString(),
            token: token
        });
    }
    catch (err) {
        const error = new statusCode_1.Err(err, CODE.INTERNALSERVERERROR);
        next(error);
    }
});
const postUpdatePassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.body.userId;
    const token = req.body.token;
    const password = req.body.password;
    const errorValidation = (0, express_validator_1.validationResult)(req);
    try {
        if (!errorValidation.isEmpty()) {
            return res.status(CODE.UNPROCESSABLEENTITY).json({
                errorMessage: errorValidation.array()[0].msg,
            });
        }
        const user = yield users_1.default.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() },
            _id: userId,
        });
        if (!user) {
            return res.status(CODE.NOTFOUND).json({ message: "Token is invalid or has expired" });
        }
        const hashedPassword = bcryptjs_1.default.hashSync(password, 12);
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        const result = yield user.save();
        if (result) {
            return res.status(CODE.OK).json({ message: "Update password successfully" });
        }
        else {
            return res.status(CODE.INTERNALSERVERERROR).json({ message: "Server error" });
        }
    }
    catch (err) {
        const error = new statusCode_1.Err(err, CODE.INTERNALSERVERERROR);
        next(error);
    }
});
const getProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.session.user._id;
        const user = yield users_1.default.findById(userId).select("username email");
        if (!user) {
            return res.status(CODE.NOTFOUND).json({ message: "User not found" });
        }
        return res.status(CODE.OK).json({ message: "Get profile successfully", user: user });
    }
    catch (err) {
        const error = new statusCode_1.Err(err, CODE.INTERNALSERVERERROR);
        next(error);
    }
});
exports.getProfile = getProfile;
const updateProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    try {
        let password = (_a = req.body) === null || _a === void 0 ? void 0 : _a.password;
        const userId = req.session.user._id;
        const user = yield users_1.default.findById(userId);
        if (!user) {
            return res.status(CODE.NOTFOUND).json({ message: "User not found" });
        }
        let username = (_b = req.body) === null || _b === void 0 ? void 0 : _b.username;
        let email = (_c = req.body) === null || _c === void 0 ? void 0 : _c.email;
        let newPasword = (_d = req.body) === null || _d === void 0 ? void 0 : _d.new_password;
        const checkPassword = bcryptjs_1.default.compareSync(password, user.password);
        if (!checkPassword) {
            return res.status(CODE.UNAUTHORIZED).json({ message: "Password is incorrect" });
        }
        const image = req.file;
        if (image) {
            user.avatar = image.path;
        }
        if (username) {
            const findUser = yield users_1.default.findOne({ username: username });
            if (findUser) {
                return res.status(CODE.UNPROCESSABLEENTITY).json({ message: "Username already exists" });
            }
            user.username = username ? username : user.username;
        }
        if (email) {
            const findUser = yield users_1.default.findOne({ email: email });
            if (findUser) {
                return res.status(CODE.UNPROCESSABLEENTITY).json({ message: "Username already exists" });
            }
            user.email = email ? email : user.email;
        }
        if (newPasword) {
            if (newPasword.length < 5) {
                return res.status(CODE.UNPROCESSABLEENTITY).json({ message: "Password must be at least 5 characters" });
            }
            const hashedPassword = bcryptjs_1.default.hashSync(newPasword, 12);
            user.password = hashedPassword;
        }
        yield user.save();
        req.session.user = user;
        return res.status(CODE.OK).json({ message: "Update profile successfully" });
    }
    catch (err) {
        const error = new statusCode_1.Err(err, CODE.INTERNALSERVERERROR);
        next(error);
    }
});
exports.updateProfile = updateProfile;
