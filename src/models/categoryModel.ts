import prisma from '../config/database.js';
import { SHOW_DELETED_OPTIONS, USER_ROLE } from '../constants.js';
import { UserRole } from '@prisma/client';

export const getAllCategories = (showDeleted: string) => {
    return prisma.category.findMany(
            {
            where:
                showDeleted === SHOW_DELETED_OPTIONS.ONLY_DELETED
                    ? { deleted_at: { not: null } }
                    : showDeleted !== SHOW_DELETED_OPTIONS.ALL
                    ? { deleted_at: null } 
                    : undefined, 
        }
    );
};

export const getCategoryById =  (id: number) => {
    return  prisma.category.findUnique({ where: { id }, });
};

export const createCategory =  (data: { name: string }, userRole: UserRole ) => {
    if(userRole !== USER_ROLE.ADMIN){
        throw new Error('Forbidden');
    }
    return  prisma.category.create({
        data,
    });
};

export const updateCategory =  (id: number, data: { name: string }, userRole: UserRole ) => {
    if(userRole !== USER_ROLE.ADMIN){
        throw new Error('Forbidden');
    }
    return  prisma.category.update({
        where: { id },
        data,
    });
};

export const deleteCategory =  (id: number, userRole: UserRole ) => {
    if(userRole !== USER_ROLE.ADMIN){
        throw new Error('Forbidden');
    }
    return  prisma.category.update({
        where: { id },
        data: { deleted_at: new Date() },
    });
};

