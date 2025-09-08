const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Guest = require('../models/guest');
const adminJwtAuth = require('../middleware/adminJwtAuth');

router.get('/', async (req, res) => {
  const guests = await Guest.find().sort({ createdAt: -1 });
  res.json(guests);
});

router.post('/', async (req, res) => {
  const { name, email, phone, message } = req.body;
  const guest = new Guest({ name, email, phone, message });
  await guest.save();
  res.status(201).json(guest);
});

router.delete('/:id', adminJwtAuth, async (req, res) => {
  const { id } = req.params;
  try {
    const deletedGuest = await Guest.findByIdAndDelete(new mongoose.Types.ObjectId(id));
    if (!deletedGuest) {
      return res.status(404).json({ message: 'Guest not found' });
    }
    res.json({ message: 'Guest deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting guest', error });
  }
});

module.exports = router;
