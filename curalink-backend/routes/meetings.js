const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getMeetings,
  createMeeting,
  updateMeeting,
  deleteMeeting
} = require('../controllers/meetingController');

router.route('/')
  .get(protect, getMeetings)
  .post(protect, createMeeting);

router.route('/:id')
  .put(protect, updateMeeting)
  .delete(protect, deleteMeeting);

module.exports = router;
