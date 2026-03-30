import http from "http";
import { Server } from "socket.io";
import app from "./app";
import { registerNoteHandlers } from "./sockets/note.socket";
import { connectDB } from "./config/db";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes";
import jwt from "jsonwebtoken";



dotenv.config();

connectDB();

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
    },
});

const JWT_SECRET = "secret123";

io.use((socket, next) => {
    const token = socket.handshake.auth.token;

    if (!token) return next(new Error("Unauthorized"));

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
        (socket as any).userId = decoded.userId;
        next();
    } catch {
        next(new Error("Unauthorized"));
    }
});

io.on("connection", (socket) => {
    registerNoteHandlers(io, socket);
});




app.use("/api/auth", authRoutes);



const PORT = 5000;

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});