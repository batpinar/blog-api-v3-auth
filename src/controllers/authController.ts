import { Request, Response } from 'express';
import { register, login, refreshToken, logout, validateToken } from '../models/authModel.js';
import { registerSchema, loginSchema, refreshTokenSchema } from '../validations/auth.user.validation.js';

export const registerController = async (req: Request, res: Response): Promise<void> => {
    try {
        const validatedData = registerSchema.parse(req.body);
        const result = await register(validatedData);
        
        res.status(201).json({
            user: {
                id: result.user.id,
                name: result.user.name,
                username: result.user.username,
                email: result.user.email,
                role: result.user.role,
            },
            accessToken: result.accessToken,
            refreshToken: result.refreshToken,
        });
    } catch (error) {
        if (error instanceof Error) {
            if (error.name === 'ZodError') {
                res.status(400).json({ error: error.message }); // Removed 'return'
                return; // Explicitly exit the function
            }
        }
        res.status(400).json({ error: 'Registration failed' });
    }
};

export const loginController = async (req: Request, res: Response): Promise<void> => {
    try {
        const validatedData = loginSchema.parse(req.body);
        const result = await login(validatedData);
        
        res.json({
            user: {
                id: result.user.id,
                name: result.user.name,
                username: result.user.username,
                email: result.user.email,
                role: result.user.role,
            },
            accessToken: result.accessToken,
            refreshToken: result.refreshToken,
        });
    } catch (error) {
        if (error instanceof Error) {
            if (error.name === 'ZodError') {
                 res.status(400).json({ error: error.message });
                 return;
            }
            if (error.message === 'Invalid credentials') {
                res.status(401).json({ error: error.message });
                return;
            }
        }
        res.status(401).json({ error: 'Login failed' });
    }
};

export const refreshTokenController = async (req: Request, res: Response): Promise<void> => {
    try {
        const validatedData = refreshTokenSchema.parse(req.body);
        const result = await refreshToken(validatedData);
        
        res.json({
            accessToken: result.accessToken,
            refreshToken: result.refreshToken,
        });
    } catch (error) {
        if (error instanceof Error) {
            if (error.name === 'ZodError') {
                res.status(400).json({ error: error.message });
                return;
            }
            if (error.message === 'Invalid refresh token') {
                res.status(401).json({ error: error.message });
                return;
            }
        }
        res.status(401).json({ error: 'Token refresh failed' });
    }
};

export const logoutController = async (req: Request, res: Response): Promise<void> => {
    try {
        const refreshToken = req.body.refreshToken;
        await logout(refreshToken);
        res.json({ message: 'Logged out successfully' });
    } catch (error) {
        res.status(400).json({ error: 'Logout failed' });
    }
};

export const meController = async (req: Request, res: Response): Promise<void> => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            throw new Error('No token provided');
        }

        const user = await validateToken(token);
        res.json({
            id: user.id,
            name: user.name,
            username: user.username,
            email: user.email,
            role: user.role,
        });
    } catch (error) {
        if (error instanceof Error) {
            if (error.message === 'No token provided' || error.message === 'Invalid token') {
                res.status(401).json({ error: error.message });
                return;
            }
        }
        res.status(401).json({ error: 'Authentication failed' });
    }
};