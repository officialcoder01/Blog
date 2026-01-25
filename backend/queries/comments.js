const prisma = require('../lib/prisma');

// Create a new comment
const createComment = async (commentData) => {
    return await prisma.comment.create({
        data: {
            content: commentData.content,
            postId: commentData.postId,
            authorId: commentData.authorId ?? null,
        }
    });
};

// Update comment
const updateComment =  async (id, commentData) => {
    return await prisma.comment.update({
        where: { id },
        data: commentData,
    })
}

// Get a comment by id (select minimal fields needed by middleware)
const getCommentById = async (id) => {
    return await prisma.comment.findUnique({
        where: { id },
        select: { id: true, authorId: true, content: true, postId: true },
    });
}

// Delete comment
const deleteComment = async (id) => {
    return await prisma.comment.delete({
        where: { id },
    });
}

// Get comments by post ID
const getCommentsByPostId = async (postId) => {
    return await prisma.comment.findMany({
        where: { postId: parseInt(postId) },
        include: {
            author: {
                select: { username: true }
            }
        },
        orderBy: { createdAt: 'desc' }
    });
}

module.exports = {
    createComment,
    updateComment,
    getCommentById,
    deleteComment,
    getCommentsByPostId,
};