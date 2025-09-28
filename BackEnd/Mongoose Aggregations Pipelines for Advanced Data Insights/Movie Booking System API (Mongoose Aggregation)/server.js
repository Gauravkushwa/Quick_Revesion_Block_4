
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/moviebooking';
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const movieSchema = new mongoose.Schema({ _id: String, title: String, genre: String, releaseYear: Number, durationMins: Number }, { collection: 'movies' });
const userSchema = new mongoose.Schema({ _id: String, name: String, email: String, joinedAt: Date }, { collection: 'users' });
const bookingSchema = new mongoose.Schema({ _id: String, userId: String, movieId: String, bookingDate: Date, seats: Number, status: String }, { collection: 'bookings' });

const Movie = mongoose.model('Movie', movieSchema);
const User = mongoose.model('User', userSchema);
const Booking = mongoose.model('Booking', bookingSchema);

const makeIdIfMissing = id => id || new mongoose.Types.ObjectId().toString();

app.post('/movies', async (req, res) => {
  try {
    const { _id, title, genre, releaseYear, durationMins } = req.body;
    if (!title || !genre) return res.status(400).json({ error: 'title and genre required' });
    const movie = new Movie({ _id: makeIdIfMissing(_id), title, genre, releaseYear, durationMins });
    await movie.save();
    return res.status(200).json({ message: 'Movie created', movie });
  } catch (err) {
    if (err && err.code === 11000) return res.status(400).json({ error: 'Duplicate _id' });
    return res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/users', async (req, res) => {
  try {
    const { _id, name, email, joinedAt } = req.body;
    if (!name || !email) return res.status(400).json({ error: 'name and email required' });
    const user = new User({ _id: makeIdIfMissing(_id), name, email, joinedAt: joinedAt ? new Date(joinedAt) : new Date() });
    await user.save();
    return res.status(200).json({ message: 'User created', user });
  } catch (err) {
    if (err && err.code === 11000) return res.status(400).json({ error: 'Duplicate _id' });
    return res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/bookings', async (req, res) => {
  try {
    const { _id, userId, movieId, bookingDate, seats, status } = req.body;
    if (!userId || !movieId || !seats) return res.status(400).json({ error: 'userId, movieId and seats required' });
    const userExists = await User.exists({ _id: userId });
    const movieExists = await Movie.exists({ _id: movieId });
    if (!userExists || !movieExists) return res.status(400).json({ error: 'User or Movie does not exist' });
    const booking = new Booking({ _id: makeIdIfMissing(_id), userId, movieId, bookingDate: bookingDate ? new Date(bookingDate) : new Date(), seats, status: status || 'Booked' });
    await booking.save();
    return res.status(200).json({ message: 'Booking created', booking });
  } catch (err) {
    if (err && err.code === 11000) return res.status(400).json({ error: 'Duplicate _id' });
    return res.status(500).json({ error: 'Internal server error' });
  }
});

/* Aggregation routes (use Mongoose aggregate pipelines) */

app.get('/analytics/movie-bookings', async (req, res) => {
  try {
    const pipeline = [
      { $group: { _id: '$movieId', totalBookings: { $sum: 1 }, totalSeats: { $sum: '$seats' } } },
      { $lookup: { from: 'movies', localField: '_id', foreignField: '_id', as: 'movie' } },
      { $unwind: { path: '$movie', preserveNullAndEmptyArrays: true } },
      { $project: { _id: 0, movieId: '$_id', title: '$movie.title', totalBookings: 1, totalSeats: 1 } },
      { $sort: { totalBookings: -1 } }
    ];
    const result = await Booking.aggregate(pipeline);
    return res.status(200).json(result);
  } catch (err) { return res.status(500).json({ error: 'Internal server error' }); }
});

app.get('/analytics/user-bookings', async (req, res) => {
  try {
    const pipeline = [
      { $lookup: { from: 'users', localField: 'userId', foreignField: '_id', as: 'user' } },
      { $unwind: '$user' },
      { $lookup: { from: 'movies', localField: 'movieId', foreignField: '_id', as: 'movie' } },
      { $unwind: '$movie' },
      { $group: { _id: '$user._id', name: { $first: '$user.name' }, bookings: { $push: { bookingId: '$_id', movieTitle: '$movie.title', seats: '$seats', bookingDate: '$bookingDate', status: '$status' } } } },
      { $project: { _id: 0, userId: '$_id', name: 1, bookings: 1 } }
    ];
    const result = await Booking.aggregate(pipeline);
    return res.status(200).json(result);
  } catch (err) { return res.status(500).json({ error: 'Internal server error' }); }
});

app.get('/analytics/top-users', async (req, res) => {
  try {
    const pipeline = [
      { $group: { _id: '$userId', totalBookings: { $sum: 1 } } },
      { $match: { totalBookings: { $gt: 2 } } },
      { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'user' } },
      { $unwind: '$user' },
      { $project: { _id: 0, userId: '$_id', name: '$user.name', email: '$user.email', totalBookings: 1 } },
      { $sort: { totalBookings: -1 } }
    ];
    const result = await Booking.aggregate(pipeline);
    return res.status(200).json(result);
  } catch (err) { return res.status(500).json({ error: 'Internal server error' }); }
});

app.get('/analytics/genre-wise-bookings', async (req, res) => {
  try {
    const pipeline = [
      { $lookup: { from: 'movies', localField: 'movieId', foreignField: '_id', as: 'movie' } },
      { $unwind: '$movie' },
      { $group: { _id: '$movie.genre', totalSeats: { $sum: '$seats' } } },
      { $project: { _id: 0, genre: '$_id', totalSeats: 1 } },
      { $sort: { totalSeats: -1 } }
    ];
    const result = await Booking.aggregate(pipeline);
    return res.status(200).json(result);
  } catch (err) { return res.status(500).json({ error: 'Internal server error' }); }
});

app.get('/analytics/active-bookings', async (req, res) => {
  try {
    const pipeline = [
      { $match: { status: 'Booked' } },
      { $lookup: { from: 'users', localField: 'userId', foreignField: '_id', as: 'user' } },
      { $unwind: '$user' },
      { $lookup: { from: 'movies', localField: 'movieId', foreignField: '_id', as: 'movie' } },
      { $unwind: '$movie' },
      { $project: { _id: 0, bookingId: '$_id', bookingDate: 1, seats: 1, user: { userId: '$user._id', name: '$user.name', email: '$user.email' }, movie: { movieId: '$movie._id', title: '$movie.title', genre: '$movie.genre' } } }
    ];
    const result = await Booking.aggregate(pipeline);
    return res.status(200).json(result);
  } catch (err) { return res.status(500).json({ error: 'Internal server error' }); }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
