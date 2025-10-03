require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const axios = require('axios');
const cors = require('cors');
const cookieSession = require('cookie-session');

const {
  PORT = 4000,
  MONGO_URI,
  JWT_SECRET,
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
  GITHUB_CALLBACK_URL
} = process.env;

if (!MONGO_URI || !JWT_SECRET || !GITHUB_CLIENT_ID || !GITHUB_CLIENT_SECRET || !GITHUB_CALLBACK_URL) {
  console.error('Please set MONGO_URI, JWT_SECRET, GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET and GITHUB_CALLBACK_URL in .env');
  process.exit(1);
}

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(()=> console.log('MongoDB connected'))
  .catch(err => { console.error('MongoDB connection error', err); process.exit(1); });

const app = express();
app.use(cors());
app.use(express.json());

// Optional: cookie session required by passport to store OAuth state (or you can use custom state)
app.use(cookieSession({
  name: 'session',
  keys: [JWT_SECRET],
  maxAge: 24 * 60 * 60 * 1000 // 1 day
}));

app.use(passport.initialize());
app.use(passport.session());

// Minimal passport serialize/deserialize (we won't use sessions heavily)
passport.serializeUser((user, done) => done(null, user.githubId));
passport.deserializeUser(async (id, done) => {
  const user = await User.findOne({ githubId: id }).exec();
  done(null, user);
});

// Passport GitHub strategy
passport.use(new GitHubStrategy({
    clientID: GITHUB_CLIENT_ID,
    clientSecret: GITHUB_CLIENT_SECRET,
    callbackURL: GITHUB_CALLBACK_URL,
    scope: ['user:email']
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // profile may or may not include email depending on user's privacy & scopes
      let email = null;
      if (profile.emails && profile.emails.length) {
        // passport often provides emails array
        email = profile.emails.find(e => e.primary)?.value || profile.emails[0].value;
      } else {
        // fallback: query GitHub API for user emails using accessToken
        const resp = await axios.get('https://api.github.com/user/emails', {
          headers: { Authorization: `token ${accessToken}`, 'User-Agent': 'Node.js' }
        });
        if (Array.isArray(resp.data)) {
          const primary = resp.data.find(e => e.primary && e.verified);
          email = (primary && primary.email) || (resp.data[0] && resp.data[0].email);
        }
      }

      // Build user object
      const userData = {
        githubId: profile.id,
        username: profile.username,
        displayName: profile.displayName || profile.username,
        email,
        avatarUrl: profile._json && profile._json.avatar_url
      };

      // Upsert (create if not exists)
      let user = await User.findOne({ githubId: profile.id }).exec();
      if (!user) {
        user = await User.create(userData);
      } else {
        // optional: update fields if changed
        const needsUpdate = ['username','displayName','email','avatarUrl'].some(k => user[k] !== userData[k]);
        if (needsUpdate) {
          Object.assign(user, userData);
          await user.save();
        }
      }

      // done -> we return user; callback route will create JWT and return to client
      return done(null, user);
    } catch (err) {
      console.error('GitHub strategy error', err);
      return done(err);
    }
  }
));

// Routes

app.get('/', (req, res) => {
  res.send('GitHub OAuth with JWT — visit /auth/github to login');
});

// 1) Kick off auth
app.get('/auth/github', passport.authenticate('github'));

// 2) Callback
app.get('/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/auth/failure', session: false }),
  (req, res) => {
    // req.user populated by passport verify callback
    const user = req.user;
    // sign JWT
    const payload = {
      sub: user._id.toString(),
      githubId: user.githubId,
      username: user.username
    };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });

    // Return JSON with token (you can also redirect with token as query param or set cookie)
    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        githubId: user.githubId,
        username: user.username,
        email: user.email,
        avatarUrl: user.avatarUrl
      }
    });
  }
);

app.get('/auth/failure', (req, res) => {
  res.status(401).json({ success: false, message: 'Authentication failed' });
});

// Example protected route
app.get('/me', async (req, res) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ message: 'Missing token' });
  const token = auth.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.sub).select('-__v').lean();
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ user });
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token', error: err.message });
  }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
