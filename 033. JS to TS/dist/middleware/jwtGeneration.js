"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRefreshToken = exports.generateAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const statusCode_1 = require("../util/statusCode");
const CODE = new statusCode_1.codeError();
const generateAccessToken = (payload) => {
    try {
        const accessToken = jsonwebtoken_1.default.sign(payload, process.env.SECRET_KEY_JWT, { expiresIn: '10m' });
        return accessToken;
    }
    catch (err) {
        const error = new statusCode_1.Err(err, CODE.INTERNALSERVERERROR);
        throw error;
    }
};
exports.generateAccessToken = generateAccessToken;
const generateRefreshToken = (payload) => {
    try {
        const refreshToken = jsonwebtoken_1.default.sign(payload, process.env.SECRET_KEY_JWT, { expiresIn: '3d' });
        return refreshToken;
    }
    catch (err) {
        const error = new statusCode_1.Err(err, CODE.INTERNALSERVERERROR);
        throw error;
    }
};
exports.generateRefreshToken = generateRefreshToken;
