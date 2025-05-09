// userRoleCheck.ts
import { Request, Response } from 'express';
import { UserRole } from '@prisma/client';

// Rolü kontrol eden yardımcı fonksiyon
export const checkUserRole = (req: Request, res: Response): UserRole | null => {
    const { role } = req.query;
    if (role && role.toString() in UserRole) {
        return role.toString() as UserRole;
    } else {
        return null;
    }
};