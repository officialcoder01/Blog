const prisma = require('../lib/prisma');

// Create a new post
const createPost = async (postData) => {
    return await prisma.post.create({
        data: {
            title: postData.title,
            content: postData.content,
            published: postData.published ?? false, // Default to false if not provided
            authorId: postData.authorId
        }
    });
};

// Get all posts
const getAllPosts = async () => {
    return await prisma.post.findMany({
        include: {
            author: {
                select: { 
                    id: true,
                    username: true,
                 },
            },
            comments: {
                include: {
                    author: {
                        select: { username: true }
                    }
                }
            }
        },
        orderBy: { createdAt: 'desc' }
    });
};

// Get all posts that are published
const getPublishedPosts = async () => {
    return await prisma.post.findMany({
        where: { published: true },
        include: {
            author: {
                select: { 
                    id: true,
                    username: true,
                 },
            },
            comments: true
        },
        orderBy: { createdAt: 'desc' }
    });
};

// Get published post by ID
const getPublishedPostById = async (id) => {
    return await prisma.post.findFirst({
        where: {
            id,
            published: true,
        },
        include: {
            author: {
                select: {
                    id: true,
                    username: true
                },
            },
            comments: true,
        }
    })
}

// Get a post by ID
const getPostById = async (id) => {
    return await prisma.post.findUnique({
        where: { id },
        include: {
            author: {
                select: { 
                    id: true,
                    username: true,
                 },
            },
            comments: true
        }
    });
};

// Update a post by ID
const updatePostById = async (id, postData) => {
    return await prisma.post.update({
        where: { id },
        data: postData
    });
};

// Delete a post
const deletePost = async (id) => {
    return await prisma.post.delete({
        where: { id }
    });
};

// Publish post that is saved to draft
const publishPostById = async (id) => {
    return await prisma.post.update({
        where: { id },
        data: { published: true }
    });
};

// Unpublish post that is published
const unpublishPostById = async (id) => {
    return await prisma.post.update({
        where: { id },
        data: { published: false }
    });
};

module.exports = {
    createPost,
    getAllPosts,
    getPublishedPosts,
    getPublishedPostById,
    getPostById,
    updatePostById,
    deletePost,
    publishPostById,
    unpublishPostById
};