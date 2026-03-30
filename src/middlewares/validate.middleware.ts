import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";
import { AppError } from "../utils/app-error";

export const validate = (schema: ZodSchema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const result = schema.safeParse(req.body);

        if (!result.success) {
            return new AppError(
                "Validation failed",
                400,
                result.error.flatten().fieldErrors
            );
        }

        req.body = result.data;
        next();
    };
};