const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user:         { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  serviceName:  { type: String, required: true },
  requestedAt:  { type: Date, required: true }, // requested date/time
  status:       { type: String, enum: ['pending','approved','rejected','cancelled'], default: 'pending' },
  createdAt:    { type: Date, default: Date.now },
  updatedAt:    { type: Date, default: Date.now }
});

bookingSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Booking', bookingSchema);
