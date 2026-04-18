const express = require('express');
const router = express.Router();
const { getPosts, createPost, likePost, addReply, deletePost } = require('../controllers/forumController');
const { protect } = require('../middleware/auth');

router.get('/', getPosts);
router.post('/', protect, createPost);
router.post('/:id/like', protect, likePost);
router.post('/:id/reply', protect, addReply);
router.delete('/:id', protect, deletePost);

module.exports = router;
