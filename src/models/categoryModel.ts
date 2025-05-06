import prisma from '../config/database.js';
import { SHOW_DELETED_OPTIONS } from '../constants.js';
import { PrismaClient, UserRole } from '@prisma/client';

/**
 * Tüm kategorileri getirir, silinmişleri dahil etmek için filtre uygular
 */
export const getAllCategories = (showDeleted: string) => {
    return prisma.category.findMany(
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

/**
 * Belirli bir ID'ye sahip kategoriyi getirir
 */
export const getCategoryById =  (id: number) => {
    return  prisma.category.findUnique({ where: { id }, });
};

/**
 * Yeni bir kategori oluşturur
 */
export const createCategory =  (data: { name: string }, currentUser: { id: number; role: UserRole } ) => {
    if(currentUser.role !== 'ADMIN'){
        throw new Error('Forbidden');
    }
    return  prisma.category.create({
        data,
    });
};

/**
 * Belirli bir kategoriyi günceller
 */
export const updateCategory =  (id: number, data: { name: string }, currentUser: { id: number; role: UserRole } ) => {
    if(currentUser.role !== 'ADMIN'){
        throw new Error('Forbidden');
    }
    return  prisma.category.update({
        where: { id },
        data,
    });
};

/**
 * Belirli bir kategoriyi soft delete olarak işaretler
 */
export const deleteCategory =  (id: number, currentUser: { id: number; role: UserRole } ) => {
    if(currentUser.role !== 'ADMIN'){
        throw new Error('Forbidden');
    }
    return  prisma.category.update({
        where: { id },
        data: { deleted_at: new Date() },
    });
};

