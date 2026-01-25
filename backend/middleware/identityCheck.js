const db = require('../queries/comments');

// Authorize users and Admin to edit comments Middleware
const authorizeCommentEditAndDelete = async (req, res, next) => {
    try {
        // Ensure user is authenticated first
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const commentId = parseInt(req.params.Id, 10);
        if (Number.isNaN(commentId)) {
            return res.status(400).json({ message: 'Invalid comment id' });
        }

        // Fetch comment from DB and attach to request for downstream handlers
        const comment = await db.getCommentById(commentId);
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }
        req.comment = comment;

        const authorId = comment.authorId;

        // Allow if the requesting user is the author or an admin
        if (req.user.id !== authorId && req.user.role !== 'ADMIN') {
            return res.status(403).json({ message: 'Forbidden: You do not have permission to perform this action' });
        }

        next();
    } catch (err) {
        next(err);
    }
};

module.exports = { authorizeCommentEditAndDelete };