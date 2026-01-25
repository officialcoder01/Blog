const { Router } = require('express');
const commentController = require('../controller/commentController');
const { authorizeCommentEditAndDelete } = require('../middleware/identityCheck');
const passport = require('passport');

const router = Router();

const optionalAuth =  (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user) => {
        if (err) return next(err);
        if (user) req.user = user;

        next();
    })(req, res, next);
};

// Route to create a new comment (accessible to both authenticated users and guests)
router.post('/', optionalAuth, commentController.createComment);

// Route to get comments for a post
router.get('/:postId', commentController.getCommentsByPostId);

// Route to update comments
router.put('/edit/:Id',
    passport.authenticate('jwt', { session: false }),
    authorizeCommentEditAndDelete,
    commentController.editComment
);

// Route to delete comments
router.delete('/delete/:Id',
    passport.authenticate('jwt', { session: false }),
    authorizeCommentEditAndDelete,
    commentController.deleteComment
);

module.exports = router;