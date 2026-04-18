const ForumPost = require('../models/ForumPost');
const User = require('../models/User');

const getPosts = async (req, res) => {
  try {
    const filter = {};
    if (req.query.disease) {
      filter.disease = req.query.disease;
    }

    const posts = await ForumPost.find(filter)
      .sort({ createdAt: -1 })
      .limit(50)
      .populate('author', 'username role profile.firstName profile.lastName');

    res.status(200).json(posts);
  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({ error: 'Server error fetching posts' });
  }
};

const createPost = async (req, res) => {
  try {
    const { content, disease } = req.body;

    if (!content || content.trim() === '') {
      return res.status(400).json({ error: 'Content is required' });
    }

    if (content.length > 2000) {
      return res.status(400).json({ error: 'Content must be less than 2000 characters' });
    }

    const post = new ForumPost({
      author: req.user._id,
      authorName: req.user.username,
      authorRole: req.user.role,
      content,
      disease: disease || ''
    });

    await post.save();

    const user = await User.findById(req.user._id);
    if (user) {
      user.forumPosts.push(post._id);
      await user.save();
    }

    res.status(201).json(post);
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ error: 'Server error creating post' });
  }
};

const likePost = async (req, res) => {
  try {
    const post = await ForumPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const userIdStr = req.user._id.toString();
    const likeIndex = post.likes.findIndex(id => id.toString() === userIdStr);

    if (likeIndex !== -1) {
      post.likes.splice(likeIndex, 1);
    } else {
      post.likes.push(req.user._id);
    }

    await post.save();
    res.status(200).json(post);
  } catch (error) {
    console.error('Like post error:', error);
    res.status(500).json({ error: 'Server error liking post' });
  }
};

const addReply = async (req, res) => {
  try {
    const post = await ForumPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const { content } = req.body;
    if (!content || content.trim() === '') {
      return res.status(400).json({ error: 'Content is required' });
    }

    post.replies.push({
      author: req.user._id,
      authorName: req.user.username,
      content,
      createdAt: new Date()
    });

    await post.save();
    res.status(200).json(post);
  } catch (error) {
    console.error('Add reply error:', error);
    res.status(500).json({ error: 'Server error adding reply' });
  }
};

const deletePost = async (req, res) => {
  try {
    const post = await ForumPost.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized to delete this post' });
    }
    await ForumPost.findByIdAndDelete(req.params.id);
    res.json({ message: 'Post deleted successfully' });
  } catch(err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getPosts,
  createPost,
  likePost,
  addReply,
  deletePost
};
