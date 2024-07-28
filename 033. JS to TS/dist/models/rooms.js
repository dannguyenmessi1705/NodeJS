"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const RoomSchema = new mongoose_1.Schema({
    participants: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'users'
        }
    ],
    messages: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'chats'
        }
    ],
    marked: {
        type: Boolean,
        require: true
    },
    countUnRead: {
        type: Number,
        require: true
    }
}, { timestamps: true });
const Room = (0, mongoose_1.model)('rooms', RoomSchema);
exports.default = Room;
