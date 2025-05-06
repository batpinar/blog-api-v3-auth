import { PrismaClient, UserRole } from '@prisma/client';
import { hash } from 'argon2';
import { UpdateUserInput, RegisterInput } from '../validations/auth.user.validation.js';
import { SHOW_DELETED_OPTIONS } from '../constants.js';
import  prisma from '../config/database.js';

export const createUser =  (input: RegisterInput, currentUser: { id: number; role: UserRole }) => {
    if(currentUser.role !== 'ADMIN'){
        throw new Error('Forbidden');
    }
    return hash(input.password).then(hashedPassword => {
        return prisma.user.create({
            data: {
                ...input,
                password: hashedPassword,
                role: UserRole.MEMBER,
            },
        });
    });
};

export const getAllUsers =  (showDeleted: string) => { 
    return prisma.user.findMany(
        {
        where:
            showDeleted === SHOW_DELETED_OPTIONS.ONLY_DELETED
                ? { deleted_at: { not: null } } // Sadece silinmişleri getir
                : showDeleted !== SHOW_DELETED_OPTIONS.ALL
                ? { deleted_at: null } // Sadece aktifleri getir
                : undefined, // Hepsini getir
    }
);
};

export const getUserById =  (id: number) => {
    return prisma.user.findUnique({
        where: { id }
    });
};

export const updateUser = (id: number, data: UpdateUserInput, currentUser: { id: number; role: UserRole }) => {
    if(currentUser.role !== 'ADMIN' && currentUser.role !== 'MEMBER'){
        throw new Error('Forbidden');
    }
    const updateData = { ...data };
    if (data.password) {
        return hash(data.password).then(hashedPassword => {
            updateData.password = hashedPassword;
            return prisma.user.update({
                where: { id },
                data: updateData
            });
        });
    }
    return prisma.user.update({
        where: { id },
        data: updateData
    });
};

export const deleteUser = async (id: number, currentUser: { id: number; role: UserRole }) => {
    if(currentUser.role !== 'ADMIN' && currentUser.role !== 'MEMBER'){
        throw new Error('Forbidden');
    }
    return prisma.user.update({
        where: { id },
        data: { deleted_at: new Date() }
    });
};