import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import { globalErrorHandler } from "./middlewares/error.middleware";
import { logger } from "./middlewares/logger.moddleware";

const app = express();

app.use(cors());
app.use(express.json());
app.use(logger);

app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
});

app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
})

app.use("/api/auth", authRoutes);

// global error handler (must be last)
app.use(globalErrorHandler);

export default app;