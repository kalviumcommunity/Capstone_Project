// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  mood: {
    type: String,
    enum: ['happy', 'sad', 'anxious', 'neutral'],
    default: 'neutral',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('User', userSchema);


const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }]
});

module.exports = mongoose.model('User', userSchema);
