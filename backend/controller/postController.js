const db = require('../queries/posts');

// Create a new post
const createNewPost = async (req, res) => {
    try {
        // Assuming user is authenticated and user ID is available
        const authorId = req.user.id; // Assuming user ID is available in req.user

        const { title, content, published } = req.body;

        // Create new post
        const newPost = await db.createPost({ title, content, published, authorId });
        res.status(201).json(newPost);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get all posts in the database
const getAllPosts = async (req, res) => {
    try {
        const posts = await db.getAllPosts();
        res.json(posts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get all published posts
const getPublishedPosts = async (req, res) => {
    try {
        const posts = await db.getPublishedPosts();
        res.json(posts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get published post By Id
const getPublishedPostById = async (req, res) => {
    try {
        const postId = parseInt(req.params.id, 10);
        const post = await db.getPublishedPostById(postId);

        res.json(post);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get Post by ID
const getPostById = async (req, res) => {
    try {
        const postId = parseInt(req.params.id, 10);
        const post = await db.getPostById(postId);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        
        res.json(post);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update Post by ID
const updatePostById = async (req, res) => {
    try {
        const postId = parseInt(req.params.id, 10);
        const { title, content, published } = req.body;

        const updatedPost = await db.updatePostById(postId, { title, content, published });
        res.json({ message: "Post updated successfully", updatedPost });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Publish post that is saved to draft
const publishPostById = async (req, res) => {
    try {
        const postId = parseInt(req.params.id, 10);

        const publishedPost = await db.publishPostById(postId);
        res.json({ message: "Post published successfully", publishedPost });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Unpublish post that is published
const unpublishPostById = async (req, res) => {
    try {
        const postId = parseInt(req.params.id, 10);

        const unpublishedPost = await db.unpublishPostById(postId);
        res.json({ message: "Post unpublished successfully", unpublishedPost });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete post by ID
const deletePostById = async (req, res) => {
    try {
        const postId = parseInt(req.params.id, 10);

        const deletedPost = await db.deletePost(postId);
        res.json({ message: "Post deleted successfully", deletedPost });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    createNewPost,
    getAllPosts,
    getPublishedPosts,
    getPublishedPostById,
    getPostById,
    updatePostById,
    publishPostById,
    unpublishPostById,
    deletePostById
};