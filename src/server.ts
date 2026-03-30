import http from "http";
import dotenv from "dotenv";
import app from "./app";
import { connectDB } from "./config/db";
import { initSockets } from "./sockets";

dotenv.config();

const startServer = async () => {
    try {
        await connectDB();

        const server = http.createServer(app);

        initSockets(server);

        const PORT = process.env.PORT || 5000;

        server.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });

    } catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
};

startServer();