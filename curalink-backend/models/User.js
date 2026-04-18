const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const profileSchema = new mongoose.Schema({
  conditions: { type: [String], default: [] },
  medications: { type: [String], default: [] },
  specialties: { type: [String], default: [] },
  researchInterests: { type: [String], default: [] },
  availability: { type: String, default: 'available' },
  contactPreference: { type: String, default: 'direct' },
  institution: { type: String, default: '' },
  orcidId: { type: String, default: '' },
  dateOfBirth: { type: Date },
  bio: { type: String, default: '' },
  firstName: { type: String, default: '' },
  lastName: { type: String, default: '' },
  location: { type: String, default: '' }
}, { _id: false });

const favoriteSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['publication', 'trial']
  },
  title: String,
  url: String,
  savedAt: {
    type: Date,
    default: Date.now
  },
  sourceData: {
    type: mongoose.Schema.Types.Mixed,
    default: null
  }
}, { _id: false });

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['patient', 'researcher'],
    required: true
  },
  profile: {
    type: profileSchema,
    default: () => ({})
  },
  favorites: {
    type: [favoriteSchema],
    default: []
  },
  forumPosts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ForumPost'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastActive: {
    type: Date,
    default: Date.now
  }
});

userSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return;
  }
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
