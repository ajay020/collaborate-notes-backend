import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/User";
import { AppError } from "../utils/app-error";

export const registerUser = async (email: string, password: string) => {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new AppError("User already exists", 400);
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
        email,
        password: hashed,
    });

    return { userId: user._id };
};

export const loginUser = async (email: string, password: string) => {
    const user = await User.findOne({ email });
    if (!user) {
        throw new AppError("Invalid credentials", 400);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new AppError("Invalid credentials", 400);
    }

    const secret = process.env.JWT_SECRET;

    if (!secret) {
        throw new AppError("JWT_SECRET is not configured", 500);
    }

    const token = jwt.sign(
        { userId: user._id },
        secret,
        { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
    );

    return { token };
};