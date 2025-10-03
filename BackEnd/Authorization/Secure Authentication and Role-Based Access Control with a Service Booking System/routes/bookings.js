const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const User = require('../models/User');
const { authenticateAccessToken, authorizeRoles } = require('../middleware/auth');

// Create booking - users only (role 'user' or admins can create too)
router.post('/', authenticateAccessToken, async (req, res) => {
  try {
    const { serviceName, requestedAt } = req.body;
    if (!serviceName || !requestedAt) return res.status(400).json({ message: 'serviceName and requestedAt are required' });

    const requestedDate = new Date(requestedAt);
    if (isNaN(requestedDate)) return res.status(400).json({ message: 'Invalid requestedAt date' });

    const booking = await Booking.create({
      user: req.user.id,
      serviceName,
      requestedAt: requestedDate,
      status: 'pending'
    });

    res.status(201).json({ booking });
  } catch (err) {
    console.error('Create booking error', err);
    res.status(500).json({ message: 'Internal error', error: err.message });
  }
});

// GET /bookings
// Users: their bookings. Admins: all bookings.
router.get('/', authenticateAccessToken, async (req, res) => {
  try {
    const role = req.user.role;
    const query = role === 'admin' ? {} : { user: req.user.id };
    const bookings = await Booking.find(query).populate('user', 'username email role').sort({ requestedAt: 1 });
    res.json({ bookings });
  } catch (err) {
    console.error('Get bookings error', err);
    res.status(500).json({ message: 'Internal error', error: err.message });
  }
});

// PUT /bookings/:id -> update booking (only by owner and only if pending)
router.put('/:id', authenticateAccessToken, async (req, res) => {
  try {
    const id = req.params.id;
    const booking = await Booking.findById(id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden - not owner' });
    }

    if (booking.status !== 'pending' && req.user.role !== 'admin') {
      return res.status(400).json({ message: 'Only pending bookings can be updated by the user' });
    }

    // Allowed fields to update by user: serviceName, requestedAt
    const { serviceName, requestedAt, status } = req.body;
    if (serviceName) booking.serviceName = serviceName;
    if (requestedAt) {
      const d = new Date(requestedAt);
      if (isNaN(d)) return res.status(400).json({ message: 'Invalid requestedAt' });
      booking.requestedAt = d;
    }

    // admins could change status via admin endpoints (approve/reject)
    await booking.save();
    res.json({ booking });
  } catch (err) {
    console.error('Update booking error', err);
    res.status(500).json({ message: 'Internal error', error: err.message });
  }
});

// DELETE /bookings/:id -> cancel (user) or delete (admin)
// For users: can cancel own booking only if pending. For admins: can delete any booking.
router.delete('/:id', authenticateAccessToken, async (req, res) => {
  try {
    const id = req.params.id;
    const booking = await Booking.findById(id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    if (req.user.role === 'admin') {
      // Admin delete any booking
      await Booking.deleteOne({ _id: id });
      return res.json({ message: 'Booking deleted by admin' });
    }

    // regular user: must be owner and pending
    if (booking.user.toString() !== req.user.id) return res.status(403).json({ message: 'Forbidden - not owner' });
    if (booking.status !== 'pending') return res.status(400).json({ message: 'Only pending bookings can be cancelled' });

    booking.status = 'cancelled';
    await booking.save();
    res.json({ message: 'Booking cancelled', booking });
  } catch (err) {
    console.error('Delete booking error', err);
    res.status(500).json({ message: 'Internal error', error: err.message });
  }
});

// PATCH /bookings/:id/approve -> admin approves
router.patch('/:id/approve', authenticateAccessToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const id = req.params.id;
    const booking = await Booking.findById(id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    if (booking.status !== 'pending') return res.status(400).json({ message: 'Only pending bookings can be approved' });

    booking.status = 'approved';
    await booking.save();
    res.json({ message: 'Booking approved', booking });
  } catch (err) {
    console.error('Approve error', err);
    res.status(500).json({ message: 'Internal error', error: err.message });
  }
});

// PATCH /bookings/:id/reject -> admin rejects
router.patch('/:id/reject', authenticateAccessToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const id = req.params.id;
    const booking = await Booking.findById(id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    if (booking.status !== 'pending') return res.status(400).json({ message: 'Only pending bookings can be rejected' });

    booking.status = 'rejected';
    await booking.save();
    res.json({ message: 'Booking rejected', booking });
  } catch (err) {
    console.error('Reject error', err);
    res.status(500).json({ message: 'Internal error', error: err.message });
  }
});

module.exports = router;
