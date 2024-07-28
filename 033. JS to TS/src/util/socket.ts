let ioServer: any;
import {Server} from 'socket.io'
export const Socket = {
    init: (httpServer: any) => {
        ioServer = new Server(httpServer);
        return ioServer;
    },
    getIO: () => {
        if (!ioServer) {
            throw new Error('Socket.io not initialized!');
        }
        return ioServer;
    }
}