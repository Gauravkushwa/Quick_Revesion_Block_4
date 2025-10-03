const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');

const User = require('../models/User');
const RefreshToken = require('../models/RefreshToken');

const ACCESS_EXPIRES = process.env.ACCESS_TOKEN_EXPIRY || '15m';
const REFRESH_EXPIRES = process.env.REFRESH_TOKEN_EXPIRY || '7d';

function signAccessToken(user) {
  const payload = { sub: user._id.toString(), role: user.role };
  return jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: ACCESS_EXPIRES });
}

function generateRefreshTokenString() {
  // cryptographically strong random string
  return uuidv4() + '.' + crypto.randomBytes(48).toString('hex');
}

// Create a refresh token document, set expiry
async function createRefreshToken(userId) {
  const tokenString = generateRefreshTokenString();
  const expiresAt = new Date(Date.now() + msFromJWTExpiry(REFRESH_EXPIRES));
  const doc = await RefreshToken.create({ token: tokenString, user: userId, expiresAt });
  return doc.token;
}

// utility to convert jwt expiry format '7d', '15m' to milliseconds
function msFromJWTExpiry(exp) {
  // basic parser: only supports 's', 'm', 'h', 'd'
  const match = /^(\d+)([smhd])$/.exec(exp);
  if (!match) {
    // fallback 7 days
    return 7 * 24 * 60 * 60 * 1000;
  }
  const n = parseInt(match[1], 10);
  const unit = match[2];
  switch(unit) {
    case 's': return n * 1000;
    case 'm': return n * 60 * 1000;
    case 'h': return n * 60 * 60 * 1000;
    case 'd': return n * 24 * 60 * 60 * 1000;
    default: return n * 1000;
  }
}

// POST /signup
router.post('/signup', async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    if (!username || !email || !password) return res.status(400).json({ message: 'username, email and password are required' });

    const existing = await User.findOne({ $or: [{ username }, { email }] });
    if (existing) return res.status(409).json({ message: 'User with that username/email already exists' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, password: hashed, role: role === 'admin' ? 'admin' : 'user' });
    res.status(201).json({ message: 'User created', user: { id: user._id, username: user.username, email: user.email, role: user.role } });
  } catch (err) {
    console.error('Signup error', err);
    res.status(500).json({ message: 'Internal error', error: err.message });
  }
});

// POST /login
router.post('/login', async (req, res) => {
  try {
    const { usernameOrEmail, password } = req.body;
    if (!usernameOrEmail || !password) return res.status(400).json({ message: 'usernameOrEmail and password required' });

    const user = await User.findOne({ $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }] });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

    const accessToken = signAccessToken(user);
    const refreshToken = await createRefreshToken(user._id);

    res.json({
      accessToken,
      refreshToken,
      user: { id: user._id, username: user.username, email: user.email, role: user.role }
    });
  } catch (err) {
    console.error('Login error', err);
    res.status(500).json({ message: 'Internal error', error: err.message });
  }
});

// POST /refresh
// body: { refreshToken: '...' }
router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).json({ message: 'refreshToken required' });

    const tokenDoc = await RefreshToken.findOne({ token: refreshToken }).populate('user');
    if (!tokenDoc) return res.status(401).json({ message: 'Invalid refresh token' });

    if (tokenDoc.expiresAt < new Date()) {
      // token expired
      await RefreshToken.deleteOne({ _id: tokenDoc._id });
      return res.status(401).json({ message: 'Refresh token expired' });
    }

    const user = tokenDoc.user;
    if (!user) {
      // user deleted: revoke token
      await RefreshToken.deleteOne({ _id: tokenDoc._id });
      return res.status(401).json({ message: 'Invalid refresh token (no user)' });
    }

    // rotate: delete old refresh token and issue a new one
    await RefreshToken.deleteOne({ _id: tokenDoc._id });
    const newRefreshToken = await createRefreshToken(user._id);
    const newAccessToken = jwt.sign({ sub: user._id.toString(), role: user.role }, process.env.JWT_ACCESS_SECRET, { expiresIn: ACCESS_EXPIRES });

    res.json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken
    });
  } catch (err) {
    console.error('Refresh error', err);
    res.status(500).json({ message: 'Internal error', error: err.message });
  }
});

// POST /logout -> revoke a refresh token
router.post('/logout', async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).json({ message: 'refreshToken required' });
    await RefreshToken.deleteOne({ token: refreshToken });
    res.json({ message: 'Logged out (refresh token revoked)' });
  } catch (err) {
    console.error('Logout error', err);
    res.status(500).json({ message: 'Internal error', error: err.message });
  }
});

module.exports = router;
