require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

const authRoutes = require('./routes/auth');
const bookingRoutes = require('./routes/bookings');

const {
  PORT = 4000,
  MONGO_URI,
  JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET
} = process.env;

if (!MONGO_URI || !JWT_ACCESS_SECRET || !JWT_REFRESH_SECRET) {
  console.error('Please set MONGO_URI, JWT_ACCESS_SECRET and JWT_REFRESH_SECRET in .env');
  process.exit(1);
}

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(()=> console.log('MongoDB connected'))
  .catch(err => { console.error('MongoDB connection error', err); process.exit(1); });

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use('/auth', authRoutes);
app.use('/bookings', bookingRoutes);

// health
app.get('/', (req, res) => res.send('Service Booking Auth API'));

app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`));
