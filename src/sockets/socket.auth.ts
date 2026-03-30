import { Socket } from "socket.io";
import jwt from "jsonwebtoken";

export const socketAuthMiddleware = (socket: Socket, next: any) => {
    const token = socket.handshake.auth.token;

    if (!token) return next(new Error("Unauthorized"));

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
        socket.data.userId = decoded.userId;
        next();
    } catch {
        next(new Error("Unauthorized"));
    }
};