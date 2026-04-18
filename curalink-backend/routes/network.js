const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  sendRequest,
  cancelRequest,
  getMyRequests,
  getSentRequests,
  getConnections,
  respondToRequest,
  getAllResearchers
} = require('../controllers/networkController');
const DirectMessage = require('../models/DirectMessage');

router.get('/researchers', protect, getAllResearchers);
router.get('/requests', protect, getMyRequests);
router.get('/sent', protect, getSentRequests);
router.get('/connections', protect, getConnections);
router.post('/request', protect, sendRequest);
router.put('/request/:id', protect, respondToRequest);
router.delete('/cancel/:toUserId', protect, cancelRequest);

// GET messages between two users
router.get('/messages/:userId', protect, async (req, res) => {
  try {
    const msgs = await DirectMessage.find({
      $or: [
        { from: req.user._id, to: req.params.userId },
        { from: req.params.userId, to: req.user._id }
      ]
    }).sort('createdAt').limit(100);
    res.json(msgs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST send message
router.post('/messages/:userId', protect, async (req, res) => {
  try {
    const msg = await DirectMessage.create({ from: req.user._id, to: req.params.userId, message: req.body.message });
    res.status(201).json(msg);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
