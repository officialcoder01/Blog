const { Router } = require('express');
const postController = require('../controller/postController');

const router = Router();

// Get all published posts
router.get('/', postController.getPublishedPosts);

router.get('/:id', postController.getPublishedPostById);

module.exports = router;