const { Router } = require('express');
const postController = require('../controller/postController');
const { generalLimiter } = require('../middleware/rateLimiter');

const router = Router();

// Get all published posts
router.get('/', generalLimiter, postController.getPublishedPosts);

router.get('/:id', generalLimiter, postController.getPublishedPostById);

module.exports = router;