"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const ChatSchema = new mongoose_1.Schema({
    message: {
        type: String,
        require: true
    },
    url: {
        type: String,
        require: false
    },
    sender: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'users'
    },
    receiver: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'users'
    }
}, { timestamps: true });
const Chat = (0, mongoose_1.model)('chats', ChatSchema);
exports.default = Chat;
