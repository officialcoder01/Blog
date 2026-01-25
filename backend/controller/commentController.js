const db = require('../queries/comments');
const { body, validationResult } = require('express-validator');

// Create a new comment
const createComment = async (req, res) => {
    try {
        await body('content')
            .trim()
            .notEmpty()
            .withMessage('Comment can not be empty')
            .isLength({ min: 3, max: 1000 }).withMessage('Comment can not exceed 1000 characters')
            .run(req);
        await body('postId').isInt().withMessage('Invalid post Id').run(req);

        // Validate input
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const isAuthenticated = !!req.user;

        let authorId = null;

        // Registered user comment
        if (isAuthenticated) authorId = req.user.id;

        const comment = await db.createComment({
            content: req.body.content,
            postId: req.body.postId,
            authorId,
        });

        res.status(201).json(comment);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


// Update comment
const editComment = async (req, res) => {
    try {
        // Check if user is Authenticated
        const isAuthenticated = !!req.user;

        let authorId = null;
        if (isAuthenticated) authorId = req.user.id; // If user is authenticated, set authorId

        const commentId = parseInt(req.params.Id, 10); // Get comment Id from the params
        const { content } = req.body;
        const updateComment = await db.updateComment(commentId, { content, authorId });  // Update comment in db
        res.json(updateComment);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Delete comment
const deleteComment = async (req, res) => {
    try {
        const commentId = parseInt(req.params.Id, 10); // Get comment Id from the params
        await db.deleteComment(commentId);  // Delete comment in db
        res.json({ message: 'Comment deleted successfully' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

// Get comments for a post
const getCommentsByPostId = async (req, res) => {
    try {
        const postId = parseInt(req.params.postId, 10);
        const comments = await db.getCommentsByPostId(postId);
        res.json(comments);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}

module.exports = {
    createComment,
    editComment,
    deleteComment,
    getCommentsByPostId,
};