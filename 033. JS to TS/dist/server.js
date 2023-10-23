"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
// Thiết lập các biến môi trường
require("dotenv/config");
// Dùng helmet để bảo mật ứng dụng Express bằng cách sử dụng các HTTP header
const helmet_1 = __importDefault(require("helmet"));
app.use((0, helmet_1.default)());
// Thêm Content Security Policy (CSP) để cho phép các tài nguyên nào được load từ đâu (VD: dùng google maps)
app.use(helmet_1.default.contentSecurityPolicy({
    directives: {
        defaultSrc: ["'self'"],
        frameSrc: ["'self'", 'https://www.google.com/'],
        formAction: ["'self'", "https://sandbox.vnpayment.vn/"],
        connectSrc: ["'self'", "https://sandbox.vnpayment.vn/"],
        scriptSrcAttr: ["'unsafe-inline'"], // Allow inline event handlers
    },
}));
