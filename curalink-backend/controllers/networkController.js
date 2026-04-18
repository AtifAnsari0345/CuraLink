const NetworkRequest = require('../models/NetworkRequest');
const User = require('../models/User');

exports.sendRequest = async (req, res) => {
  try {
    const { toUserId, message } = req.body;

    if (!toUserId) {
      return res.status(400).json({ error: 'toUserId is required' });
    }

    if (toUserId.startsWith('dummy_')) {
      return res.status(400).json({ error: 'Cannot send requests to demo profiles. Connect with real researchers.' });
    }

    if (toUserId.toString() === req.user._id.toString()) {
      return res.status(400).json({ error: 'Cannot send request to yourself' });
    }

    const targetUser = await User.findById(toUserId);
    if (!targetUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    const existingRequest = await NetworkRequest.findOne({
      $or: [
        { from: req.user._id, to: toUserId },
        { from: toUserId, to: req.user._id }
      ]
    });

    if (existingRequest) {
      if (existingRequest.status === 'accepted') {
        return res.status(400).json({ error: 'Already connected' });
      } else if (existingRequest.status === 'pending') {
        if (existingRequest.from.toString() === req.user._id.toString()) {
          return res.status(400).json({ error: 'Request already sent' });
        } else {
          return res.status(400).json({ error: 'You have a pending request from this user' });
        }
      }
    }

    const request = await NetworkRequest.create({
      from: req.user._id,
      to: toUserId,
      message: message || ''
    });
    res.status(201).json(request);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.cancelRequest = async (req, res) => {
  try {
    const { toUserId } = req.params;

    if (!toUserId) {
      return res.status(400).json({ error: 'toUserId is required' });
    }

    const deleted = await NetworkRequest.findOneAndDelete({
      from: req.user._id,
      to: toUserId,
      status: 'pending'
    });

    if (!deleted) {
      return res.status(404).json({ error: 'Pending request not found' });
    }

    res.json({ message: 'Request canceled successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getMyRequests = async (req, res) => {
  try {
    const requests = await NetworkRequest.find({
      to: req.user._id,
      status: 'pending'
    }).populate('from', 'username email role profile.firstName profile.lastName');
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getSentRequests = async (req, res) => {
  try {
    const requests = await NetworkRequest.find({
      from: req.user._id
    }).populate('to', 'username email role profile.firstName profile.lastName');
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getConnections = async (req, res) => {
  try {
    const connections = await NetworkRequest.find({
      $or: [{ from: req.user._id }, { to: req.user._id }],
      status: 'accepted'
    }).populate('from', 'username email role profile').populate('to', 'username email role profile');

    const result = connections.map(conn => {
      if (conn.from._id.toString() === req.user._id.toString()) {
        return conn.to;
      }
      return conn.from;
    });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.respondToRequest = async (req, res) => {
  try {
    const { action } = req.body;
    if (!['accept', 'decline'].includes(action)) {
      return res.status(400).json({ error: 'Invalid action' });
    }
    const request = await NetworkRequest.findOne({
      _id: req.params.id,
      to: req.user._id
    });
    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }
    request.status = action === 'accept' ? 'accepted' : 'declined';
    await request.save();
    res.json(request);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllResearchers = async (req, res) => {
  try {
    const realResearchers = await User.find({ role: 'researcher', _id: { $ne: req.user._id } }).select('username email profile role');

    const realWithStatus = await Promise.all(realResearchers.map(async (r) => {
      const existing = await NetworkRequest.findOne({
        $or: [{ from: req.user._id, to: r._id }, { from: r._id, to: req.user._id }]
      });

      let status = 'none';
      if (existing) {
        if (existing.status === 'accepted') {
          status = 'accepted';
        } else if (existing.status === 'declined') {
          status = 'declined';
        } else if (existing.from.toString() === req.user._id.toString()) {
          status = 'pending_sent';
        } else {
          status = 'pending_received';
        }
      }
      return { ...r.toObject(), connectionStatus: status };
    }));

    res.json(realWithStatus);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
