const Meeting = require('../models/Meeting');

exports.getMeetings = async (req, res) => {
  try {
    const meetings = await Meeting.find({ owner: req.user._id }).sort({ date: 1 });
    res.json(meetings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createMeeting = async (req, res) => {
  try {
    const { title, date, time } = req.body;
    if (!title || !date || !time) {
      return res.status(400).json({ error: 'Title, date, and time are required' });
    }
    const meeting = await Meeting.create({
      owner: req.user._id,
      title,
      description: req.body.description || '',
      date: new Date(date),
      time,
      participants: req.body.participants || [],
      location: req.body.location || 'Virtual',
      meetingLink: req.body.meetingLink || '',
      status: req.body.status || 'scheduled'
    });
    res.status(201).json(meeting);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateMeeting = async (req, res) => {
  try {
    const meeting = await Meeting.findOne({ _id: req.params.id, owner: req.user._id });
    if (!meeting) {
      return res.status(404).json({ error: 'Meeting not found' });
    }
    const updates = {};
    if (req.body.title !== undefined) updates.title = req.body.title;
    if (req.body.description !== undefined) updates.description = req.body.description;
    if (req.body.date !== undefined) updates.date = new Date(req.body.date);
    if (req.body.time !== undefined) updates.time = req.body.time;
    if (req.body.participants !== undefined) updates.participants = req.body.participants;
    if (req.body.location !== undefined) updates.location = req.body.location;
    if (req.body.meetingLink !== undefined) updates.meetingLink = req.body.meetingLink;
    if (req.body.status !== undefined) updates.status = req.body.status;

    Object.assign(meeting, updates);
    await meeting.save();
    res.json(meeting);
  } catch (err) {
    console.error('Update meeting error:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.deleteMeeting = async (req, res) => {
  try {
    const meeting = await Meeting.findOne({ _id: req.params.id, owner: req.user._id });
    if (!meeting) {
      return res.status(404).json({ error: 'Meeting not found' });
    }
    await Meeting.deleteOne({ _id: req.params.id });
    res.json({ message: 'Meeting deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
