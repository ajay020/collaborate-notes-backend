import { z } from "zod";

export const registerSchema = z.object({
    name: z.string().min(2, "Name is required"),
    email: z.email("Invalid email format"),
    password: z
        .string()
        .min(5, "Password must be at least 5 characters"),
});

export const loginSchema = z.object({
    email: z.email("Invalid email format"),
    password: z.string().min(5, "Password must be at least 5 characters"),
});