"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Socket = void 0;
let ioServer;
const socket_io_1 = require("socket.io");
exports.Socket = {
    init: (httpServer) => {
        ioServer = new socket_io_1.Server(httpServer);
        return ioServer;
    },
    getIO: () => {
        if (!ioServer) {
            throw new Error('Socket.io not initialized!');
        }
        return ioServer;
    }
};
