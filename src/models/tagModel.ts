import { Prisma, UserRole } from '@prisma/client';
import prisma from '../config/database.js';

export const getAllTags = () => {
    return prisma.tag.findMany();
};

export const getTagById = (id: number) => {
    return prisma.tag.findUnique({
        where: { id },
    });
};

export const createTag = (body: Prisma.TagCreateInput, currentUser: {id : number, role: UserRole}) => {
    if(currentUser.role !== 'ADMIN'){
        throw new Error('Forbidden');
    }
    return prisma.tag.create({
        data: body
    });
};

export const updateTag = (id: number, data: Prisma.TagUpdateInput, currentUser: {id : number, role: UserRole}) => {
    if(currentUser.role !== 'ADMIN'){
        throw new Error('Forbidden');
    }
    return prisma.tag.update({
        where: { id },
        data,
    });
};

export const deleteTag = (id: number, currentUser: {id : number, role: UserRole}) => {
    if(currentUser.role !== 'ADMIN'){
        throw new Error('Forbidden');
    }
    return prisma.tag.delete({
        where: { id }
    });
};
