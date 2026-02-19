const { Router } = require('express');
const passport = require('passport');
const { authorizeAdmin } = require('../middleware/authorizeAdmin');
const postController = require('../controller/postController');
const { generalLimiter } = require('../middleware/rateLimiter');

const router = Router();

// Create a new post (admin only)
router.post(
    '/new',
    generalLimiter,
    passport.authenticate('jwt', { session: false }),
    authorizeAdmin,
    postController.createNewPost
);

// Get all posts (admin only)
router.get(
    '/posts',
    generalLimiter,
    passport.authenticate('jwt', { session: false }),
    authorizeAdmin,
    postController.getAllPosts
);

// Get post by Id (admin only)
router.get(
    '/posts/:id',
    generalLimiter,
    passport.authenticate('jwt', { session: false }),
    authorizeAdmin,
    postController.getPostById
);

// Update a post by Id (admin only)
router.put(
    '/posts/:id',
    generalLimiter,
    passport.authenticate('jwt', { session: false }),
    authorizeAdmin,
    postController.updatePostById
);


// Publish a post by Id (admin only)
router.patch(
    '/posts/:id/publish',
    generalLimiter,
    passport.authenticate('jwt', { session: false }),
    authorizeAdmin,
    postController.publishPostById
);

// Unpublish a post by Id (admin only)
router.patch(
    '/posts/:id/unpublish',
    generalLimiter,
    passport.authenticate('jwt', { session: false }),
    authorizeAdmin,
    postController.unpublishPostById
);

// Delete a post by Id (admin only)
router.delete(
    '/posts/:id',
    generalLimiter,
    passport.authenticate('jwt', { session: false }),
    authorizeAdmin,
    postController.deletePostById
);

module.exports = router;
