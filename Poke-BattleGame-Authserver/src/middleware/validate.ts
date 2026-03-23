import type { RequestHandler } from 'express';
import type { z } from 'zod';

type ValidationErrorItem = {
    path: string;
    message: string;
};

const mapZodIssues = (issues: z.core.$ZodIssue[]): ValidationErrorItem[] => {
    return issues.map((issue) => ({
        path: issue.path.map(String).join('.'),
        message: issue.message,
    }));
};

export const validateBody = (schema: z.ZodType): RequestHandler => {
    return (req, res, next) => {
        const parsed = schema.safeParse(req.body);

        if (!parsed.success) {
            return res.status(400).json({
                message: 'Validation failed',
                errors: mapZodIssues(parsed.error.issues),
            });
        }

        req.body = parsed.data;
        next();
    };
};