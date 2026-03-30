import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/app-error";

export const globalErrorHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    console.error(err);

    if (err instanceof AppError) {
        console.error("AppError:", err.message, err.errors);

        return res.status(err.status).json({
            message: err.message,
            errors: err.errors,
        });
    }

    res.status(err.status || 500).json({
        message: err.message || "Internal Server Error",
    });
};