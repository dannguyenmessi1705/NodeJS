"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const rootDir = path_1.default.dirname(((_a = process.mainModule) === null || _a === void 0 ? void 0 : _a.filename) || '');
exports.default = rootDir;
