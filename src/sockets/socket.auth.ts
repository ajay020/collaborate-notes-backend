import { Socket } from "socket.io";
import { verifyToken } from "../utils/jwt";

export const socketAuthMiddleware = (socket: Socket, next: any) => {
    const token = socket.handshake.auth.token;

    if (!token) return next(new Error("Unauthorized"));

    try {
        const decoded = verifyToken(token);
        socket.data.userId = decoded.userId;
        next();
    } catch {
        next(new Error("Unauthorized"));
    }
};