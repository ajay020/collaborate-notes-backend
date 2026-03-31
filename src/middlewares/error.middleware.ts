import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/app-error";

export const globalErrorHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    console.error(err);
    console.error(
        `${req.method} ${req.originalUrl} - ${err.status || 500} - ${err.message}`
    );

    if (err instanceof AppError) {
        console.error("AppError:", err.errors);

        return res.status(err.status).json({
            message: err.message,
            errors: err.errors || null,
        });
    }

    res.status(err.status || 500).json({
        message: err.message || "Internal Server Error",
        error: null
    });
};