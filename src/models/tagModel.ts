import { Prisma, UserRole } from '@prisma/client';
import prisma from '../config/database.js';
import { USER_ROLE } from '../constants.js';


export const getAllTags = () => {
    return prisma.tag.findMany();
};

export const getTagById = (id: number) => {
    return prisma.tag.findUnique({
        where: { id },
    });
};

export const createTag = (body: Prisma.TagCreateInput, userRole: UserRole) => {
    if(userRole !== USER_ROLE.ADMIN){
        throw new Error('Forbidden');
    }
    return prisma.tag.create({
        data: body
    });
};

export const updateTag = (id: number, data: Prisma.TagUpdateInput, userRole: UserRole) => {
    if(userRole !== USER_ROLE.ADMIN){
        throw new Error('Forbidden');
    }
    return prisma.tag.update({
        where: { id },
        data,
    });
};

export const deleteTag = (id: number, userRole: UserRole) => {
    if(userRole !== USER_ROLE.ADMIN){
        throw new Error('Forbidden');
    }
    return prisma.tag.delete({
        where: { id }
    });
};
