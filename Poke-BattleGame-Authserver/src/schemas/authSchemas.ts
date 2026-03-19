import { z } from 'zod';

const emailSchema = z
    .email('Valid email required')
    .trim();

const passwordSchema = z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(72, 'Password is too long');

export const registerSchema = z.object({
    email: emailSchema,
    password: passwordSchema,
}).strict();

export const loginSchema = z.object({
    email: emailSchema,
    password: passwordSchema,
}).strict();

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
