"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCSRFTOKEN = exports.verifyCSRFTOKEN = exports.CreateCSRFTOKEN = void 0;
const csrf_1 = __importDefault(require("csrf"));
const csrf = new csrf_1.default();
const secret = process.env.SECRET_KEY_CSRF;
let csrfToken;
const CreateCSRFTOKEN = (req, res, next) => {
    csrfToken = csrf.create(process.env.SECRET_KEY_CSRF);
    req.session.csrfToken = csrfToken;
    res.locals.authenicate = req.session.isLogin;
    res.locals.csrfToken = csrfToken;
    next();
};
exports.CreateCSRFTOKEN = CreateCSRFTOKEN;
const verifyCSRFTOKEN = (req, res, next) => {
    const token = req.get('X-CSRF-Token');
    if (!csrf.verify(process.env.SECRET_KEY_CSRF, token)) {
        const err = new Error('Invalid CSRF Token');
        return next(err);
    }
    next();
};
exports.verifyCSRFTOKEN = verifyCSRFTOKEN;
const getCSRFTOKEN = () => {
    return csrfToken;
};
exports.getCSRFTOKEN = getCSRFTOKEN;
