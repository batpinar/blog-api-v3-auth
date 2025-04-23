import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(3).max(50),
  username: z.string().min(3).max(30),
  email: z.string().email(),
  password: z.string().min(8).max(100),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(100),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string(),
});

export const updateUserSchema = z.object({
  name: z.string().min(2).max(50).optional(),
  username: z.string().min(3).max(30).optional(),
  password: z.string().min(8).max(100).optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>; 