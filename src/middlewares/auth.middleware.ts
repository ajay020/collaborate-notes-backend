import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/app-error";
import { verifyToken } from "../utils/jwt";

interface AuthRequest extends Request {
    user?: {
        userId: string;
    };
}

export const protect = (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return next(new AppError("Unauthorized", 401));
        }

        const token = authHeader.split(" ")[1];

        const decoded = verifyToken(token);

        // attach user info to request
        req.user = { userId: decoded.userId };

        next();
    } catch (error) {
        next(new AppError("Unauthorized", 401));
    }
};