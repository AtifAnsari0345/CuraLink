const express = require('express');
const router = express.Router();
const { addFavorite, removeFavorite, getFavorites, getUserStats } = require('../controllers/userController');
const { protect } = require('../middleware/auth');

router.get('/favorites', protect, getFavorites);
router.post('/favorites', protect, addFavorite);
router.delete('/favorites/:encodedUrl', protect, removeFavorite);
router.get('/stats', protect, getUserStats);

module.exports = router;
