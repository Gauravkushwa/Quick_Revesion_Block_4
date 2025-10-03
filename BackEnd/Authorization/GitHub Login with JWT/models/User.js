const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  githubId: { type: String, required: true, unique: true },
  username: { type: String },
  displayName: { type: String },
  email: { type: String },
  avatarUrl: { type: String },
  provider: { type: String, default: 'github' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
