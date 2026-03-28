import http from "http";
import { Server } from "socket.io";
import app from "./app";
import { registerNoteHandlers } from "./sockets/note.socket";
import { connectDB } from "./config/db";
import dotenv from "dotenv";

dotenv.config();

connectDB();

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
    },
});

io.on("connection", (socket) => {
    registerNoteHandlers(io, socket);
});


const PORT = 5000;

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});