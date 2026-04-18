const express = require('express');
const router = express.Router();
const { handleChat, getHistory } = require('../controllers/chatController');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const optionalAuth = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('-password');
      if (user) {
        req.user = user;
      }
    }
  } catch (error) {
    req.user = null;
  }
  next();
};

router.post('/', optionalAuth, handleChat);
router.get('/history/:sessionId', getHistory);

module.exports = router;