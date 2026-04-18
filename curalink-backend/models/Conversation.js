const mongoose = require('mongoose');

const ConversationSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
    index: true
  },
  messages: [
    {
      role: {
        type: String,
        enum: ['user', 'assistant'],
        required: true
      },
      content: {
        type: String,
        required: true
      },
      timestamp: {
        type: Date,
        default: Date.now
      }
    }
  ],
  userContext: {
    patientName: String,
    disease: String,
    location: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Conversation', ConversationSchema);
