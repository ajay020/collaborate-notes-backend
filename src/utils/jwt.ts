import jwt, { SignOptions } from "jsonwebtoken";
import { AppError } from "./app-error";

if (!process.env.JWT_SECRET) {
    throw new AppError("FATAL ERROR: JWT_SECRET is not defined in .env", 500);
}

const JWT_SECRET = process.env.JWT_SECRET as string;
const JWT_EXPIRES_IN = (process.env.JWT_EXPIRES_IN || '7d') as SignOptions['expiresIn'];

export const generateToken = (userId: string) => {
    return jwt.sign({ userId }, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN,
    });
};

export const verifyToken = (token: string) => {
    try {
        return jwt.verify(token, JWT_SECRET) as { userId: string };
    } catch {
        throw new AppError("Unauthorized", 401);
    }
};