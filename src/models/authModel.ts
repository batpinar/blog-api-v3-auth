import { PrismaClient, User, UserRole } from '@prisma/client';
import { hash, verify } from 'argon2';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { RegisterInput, LoginInput, RefreshTokenInput } from '../validations/auth.user.validation.js';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'your-refresh-secret-key';
const ACCESS_TOKEN_EXPIRY = '15m';
const REFRESH_TOKEN_EXPIRY = '7d';
const {sign, verify: jwtVerify} = jwt

export const register = async (input: RegisterInput): Promise<{ user: User; accessToken: string; refreshToken: string }> => {
    const hashedPassword = await hash(input.password);
    
    const user = await prisma.user.create({
        data: {
            ...input,
            password: hashedPassword,
            role: UserRole.MEMBER,
        },
    });

    const { accessToken, refreshToken } = await generateTokens(user);
    return { user, accessToken, refreshToken };
};

export const login = async (input: LoginInput): Promise<{ user: User; accessToken: string; refreshToken: string }> => {
    const user = await prisma.user.findUnique({
        where: { email: input.email },
    });

    if (!user) {
        throw new Error('Invalid credentials');
    }

    const isValidPassword = await verify(user.password, input.password);
    if (!isValidPassword) {
        throw new Error('Invalid credentials');
    }

    const { accessToken, refreshToken } = await generateTokens(user);
    return { user, accessToken, refreshToken };
};

export const refreshToken = async (input: RefreshTokenInput): Promise<{ accessToken: string; refreshToken: string }> => {
    const refreshToken = await prisma.refreshToken.findUnique({
        where: { token: input.refreshToken },
        include: { user: true },
    });

    if (!refreshToken || refreshToken.revoked_at || refreshToken.expires_at < new Date()) {
        throw new Error('Invalid refresh token');
    }

    await prisma.refreshToken.update({
        where: { id: refreshToken.id },
        data: { revoked_at: new Date() },
    });

    const { accessToken, refreshToken: newRefreshToken } = await generateTokens(refreshToken.user);
    return { accessToken, refreshToken: newRefreshToken };
};

export const logout = async (refreshToken: string): Promise<void> => {
    await prisma.refreshToken.update({
        where: { token: refreshToken },
        data: { revoked_at: new Date() },
    });
};

const generateTokens = async (user: User): Promise<{ accessToken: string; refreshToken: string }> => {
    const accessToken = sign(
        { userId: user.id, role: user.role },
        JWT_SECRET,
        { expiresIn: ACCESS_TOKEN_EXPIRY }
    );

    const refreshToken = uuidv4();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await prisma.refreshToken.create({
        data: {
            token: refreshToken,
            user_id: user.id,
            expires_at: expiresAt,
        },
    });

    return { accessToken, refreshToken };
};

export const validateToken = async (token: string): Promise<User> => {
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
        });

        if (!user) {
            throw new Error('User not found');
        }

        return user;
    } catch (error) {
        throw new Error('Invalid token');
    }
}; 