import prisma from '../config/database.js';
import { PrismaClient, UserRole } from '@prisma/client';

export const getAllComments = (commenter?: string, post?: number) => {
    return prisma.comment.findMany({
        where: {
            post_id: post || undefined,
            commenter_name: commenter || undefined,
        }
    });
}
export const getCommentById = (id: number) => {
    return prisma.comment.findUnique({
        where: { id },
    });
}

export const createComment = (data: { post_id: number, commenter_name: string, content: string }, currentUser: { id: number, role: UserRole }) => {
    if (!currentUser) {
        throw new Error('Unauthorized');
    }
    return prisma.comment.create({
        data: {
            ...data,
            user_id: currentUser.id
        }
    });
}


export const updateComment = async (id: number, data: object, currentUser: { id: number, role: UserRole }) => {

    const commentItem = await prisma.comment.findUnique({
        where: { id },
        select: {
            user_id: true
        }
    });

    if (!commentItem) {
        throw new Error('Comment not found');
    }

    if (commentItem.user_id !== currentUser.id) {
        throw new Error('Forbidden');
    }

    return prisma.comment.update({
        where: { id },
        data: data
    });
}

export const deleteComment = async (id: number, currentUser: { id: number, role: UserRole }) => {
    const commentItem = await prisma.comment.findUnique({
        where: { id },
        include: {
            post: {
                select: {
                    user_id: true,
                },
            },
        }
    });

    if (!commentItem) {
        throw new Error('Comment not found');
    }

    const isCommenter = commentItem.user_id === currentUser.id;
    const isPostOwner = commentItem.post.user_id === currentUser.id;
    const isAdminOrModerator = currentUser.role === 'ADMIN' || currentUser.role === 'MODERATOR';
    if (!isCommenter && !isPostOwner && !isAdminOrModerator) {
        return prisma.comment.delete({
            where: { id },
        });
    } else {
        throw new Error('Forbidden');
    }
}
