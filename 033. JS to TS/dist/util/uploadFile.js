"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fileFilter = exports.fileStorage = void 0;
const multer_1 = __importDefault(require("multer"));
exports.fileStorage = multer_1.default.diskStorage({
    destination(req, file, cb) {
        var _a;
        if (req.originalUrl.includes("profile") && ((_a = req.session) === null || _a === void 0 ? void 0 : _a.user)) {
            cb(null, 'images/avatar');
        }
        else {
            cb(null, 'images');
        }
    },
    filename(req, file, cb) {
        var _a;
        let userId = '';
        let formatedDate = '';
        if (req.originalUrl.includes("profile") && ((_a = req.session) === null || _a === void 0 ? void 0 : _a.user)) {
            userId = req.session.user._id;
            cb(null, userId + '.' + file.originalname.split('.')[1]);
        }
        else {
            const date = new Date();
            formatedDate = date.toISOString().replace(/:/g, '_').replace(/\./g, '');
            cb(null, formatedDate + file.originalname);
        }
    }
});
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg') {
        cb(null, true);
    }
    else {
        cb(null, false);
    }
};
exports.fileFilter = fileFilter;
