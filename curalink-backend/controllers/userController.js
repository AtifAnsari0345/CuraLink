const User = require('../models/User');

const addFavorite = async (req, res) => {
  try {
    const { type, title, url, sourceData } = req.body;

    if (!type || !title || !url) {
      return res.status(400).json({ error: 'Type, title, and URL are required' });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const alreadyExists = user.favorites.some(fav => fav.url === url);
    if (alreadyExists) {
      return res.status(400).json({ error: 'Already saved' });
    }

    user.favorites.push({
      type,
      title,
      url,
      savedAt: new Date(),
      sourceData
    });

    await user.save();
    res.status(200).json(user.favorites);
  } catch (error) {
    console.error('Add favorite error:', error);
    res.status(500).json({ error: 'Server error adding favorite' });
  }
};

const removeFavorite = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const encodedUrl = req.params.encodedUrl;
    let targetUrl;

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    try {
      targetUrl = Buffer.from(encodedUrl, 'base64').toString('utf8');
    } catch (e) {
      targetUrl = decodeURIComponent(encodedUrl);
    }

    user.favorites = user.favorites.filter(f => f.url !== targetUrl);
    await user.save();
    res.json({ favorites: user.favorites, message: 'Removed from favorites' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const favorites = user.favorites.sort((a, b) => b.savedAt - a.savedAt);
    res.status(200).json(favorites);
  } catch (error) {
    console.error('Get favorites error:', error);
    res.status(500).json({ error: 'Server error fetching favorites' });
  }
};

const getUserStats = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const favPubs = user.favorites.filter(f => f.type === 'publication').length;
    const favTrials = user.favorites.filter(f => f.type === 'trial').length;
    const ForumPost = require('../models/ForumPost');
    const Meeting = require('../models/Meeting');
    const NetworkRequest = require('../models/NetworkRequest');
    const forumCount = await ForumPost.countDocuments({ author: req.user._id });
    const meetingCount = await Meeting.countDocuments({ owner: req.user._id, status: 'scheduled' });
    let connectionCount = 0;
    if (req.user.role === 'researcher') {
      const connections = await NetworkRequest.countDocuments({
        $or: [{ from: req.user._id }, { to: req.user._id }],
        status: 'accepted'
      });
      connectionCount = connections;
    }
    res.json({
      favoritesCount: user.favorites.length,
      publicationsSaved: favPubs,
      trialsSaved: favTrials,
      forumPostsCount: forumCount,
      meetingsCount: meetingCount,
      connectionsCount: connectionCount,
      conditions: user.profile?.conditions || [],
      medications: user.profile?.medications || [],
      joinDate: user.createdAt,
      lastActive: user.lastActive,
      role: user.role
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  addFavorite,
  removeFavorite,
  getFavorites,
  getUserStats
};
