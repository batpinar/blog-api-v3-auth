import prisma from '../config/database.js';
import { PrismaClient, UserRole } from '@prisma/client';

export const createPostTag = async (postId: number, tagId: number, currentUser: { id: number, role: UserRole }) => {
    const postItem = await prisma.post.findUnique({
        where: { id: postId },
        select: {
            user_id: true,
        },
    });

    if (postItem === null) {
        throw new Error('Post not found');
    }

    const isPostOwner = postItem?.user_id === currentUser.id;
    const isAdminOrModerator = currentUser.role === 'ADMIN' || currentUser.role === 'MODERATOR';
    if (!isPostOwner && !isAdminOrModerator) {
        throw new Error('Forbidden');
    }

    return prisma.postTag.create({
        data: {
            post_id: postId,
            tag_id: tagId,
        },
    });
};


export const deletePostTag = async (postId: number, tagId: number, currentUser: { id: number, role: UserRole }) => {
    
    const postItem = await prisma.post.findUnique({
        where: { id: postId },
        select: {
            user_id: true,
        },
    });

    if (postItem === null) {
        throw new Error('Post not found');
    }

    const isPostOwner = postItem?.user_id === currentUser.id;
    const isAdminOrModerator = currentUser.role === 'ADMIN' || currentUser.role === 'MODERATOR';    
    if (!isPostOwner && !isAdminOrModerator) {
        throw new Error('Forbidden');
    }
        
    return prisma.postTag.delete({
        where: {
            post_id_tag_id: {
                post_id: postId,
                tag_id: tagId,
            },
        },
    });
};
