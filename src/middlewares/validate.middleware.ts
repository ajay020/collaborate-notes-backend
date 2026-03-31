import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/app-error";
import { ZodSchema, z } from "zod";

export const validate = (schema: ZodSchema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const result = schema.safeParse(req.body);

        if (!result.success) {
            return next(new AppError(
                "Validation failed",
                400,
                result.error.flatten().fieldErrors
            ));
        }

        req.body = result.data;
        next();
    };
};