import prisma from '../config/database.js';
import { SHOW_DELETED_OPTIONS, POST_STATUS } from '../constants.js';
import { PrismaClient, UserRole } from '@prisma/client';

export const getAllPosts = (showDeleted?: string, status?: string, category?: number, tags?: string) => {
    const queryList: any[] = []

    if (category) {
        queryList.push({ category_id: category }) 
    }

    if (showDeleted === SHOW_DELETED_OPTIONS.ONLY_DELETED) {
        queryList.push({ deleted_at: { not: null } });
    } else if (showDeleted !== SHOW_DELETED_OPTIONS.ALL) {
        queryList.push({ deleted_at: null });
    }

    if (status === POST_STATUS.PUBLISHED) {
        queryList.push({ published_at: { not: null } });
    } else if (status === POST_STATUS.DRAFT) {
        queryList.push({ published_at: null });
    }

    if (tags) {
        const tagIds = tags.split(',').map(id => Number(id));
        queryList.push({ tags: { some: { tag_id: { in: tagIds } } } });
    }
    return prisma.post.findMany({
        where:{
            AND: queryList
        }
    });
};

export const getPostById =  (id: number) => {
    return  prisma.post.findUnique({
        where: { id, deleted_at: null },
    });
};

export const createPost =  (data: { category_id: number, user_id: number, title: string, content: string, published_at?: Date }, currentUser: { id: number; role: UserRole }) => {
    if (!currentUser) {
        throw new Error('Unauthorized');
    }
    return  prisma.post.create({
        data,
    });
};

export const updatePost = async  (id: number, data: { user_id: number, title?: string, content?: string, published_at?: Date }, currentUser: { id: number; role: UserRole }) => {
    const post = await  prisma.post.findUnique({ where: { id } });
    if (currentUser.id !==  post?.user_id && currentUser.role !== 'ADMIN' && currentUser.role !== 'MODERATOR') {
        throw new Error('Forbidden');
    }
    return  prisma.post.update({
        where: { id },
        data,
    });
};

export const deletePost = async  (id: number, currentUser: { id: number; role: UserRole }) => {
    const post = await  prisma.post.findUnique({ where: { id } }); 
    if (currentUser.id !==  post?.user_id && currentUser.role !== 'ADMIN') {
        throw new Error('Forbidden');
    }
    return  prisma.post.update({
        where: { id },
        data: { deleted_at: new Date() }
    });
};
