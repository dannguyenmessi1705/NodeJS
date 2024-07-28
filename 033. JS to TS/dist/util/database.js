"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const URLMongo = process.env.URL_MONGO;
const dbname = "shop";
const URL = URLMongo === null || URLMongo === void 0 ? void 0 : URLMongo.replace(/\?retryWrites=true/i, dbname + "?retryWrites=true");
exports.default = URL;
