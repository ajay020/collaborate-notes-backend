import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/User";


export const register = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "User already exists" });

        const hashed = await bcrypt.hash(password, 10);
        const user = await User.create({ email, password: hashed });

        res.status(201).json({ message: "User created", userId: user._id });
    } catch (error) {
        res.status(500).json({ message: "Server error during registration" });
    }
};

export const login = async (req: Request, res: Response) => {

    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET!,
        { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.json({ token });
};