import { Server } from "socket.io";
import { registerNoteHandlers } from "./note.socket";
import { socketAuthMiddleware } from "./socket.auth";

export const initSockets = (server: any) => {
    const io = new Server(server, {
        cors: {
            origin: process.env.CLIENT_URL,
        },
    });

    io.use(socketAuthMiddleware);

    io.on("connection", (socket) => {
        registerNoteHandlers(io, socket);
    });

    return io;
};