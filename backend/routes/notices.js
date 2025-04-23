const express = require('express');
const router = express.Router();
const Notice = require('../models/Notice');
const { protect, admin } = require('../middleware/auth');

// Get all notices
router.get('/', async (req, res) => {
  try {
    const notices = await Notice.find().sort('-createdAt').populate('postedBy', 'email');
    res.json(notices);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create notice (admin only)
router.post('/', protect, admin, async (req, res) => {
  try {
    const { title, content, category } = req.body;
    const notice = await Notice.create({
      title,
      content,
      category,
      postedBy: req.user._id,
    });
    res.status(201).json(notice);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update notice (admin only)
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const notice = await Notice.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!notice) {
      return res.status(404).json({ message: 'Notice not found' });
    }
    res.json(notice);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete notice (admin only)
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const notice = await Notice.findByIdAndDelete(req.params.id);
    if (!notice) {
      return res.status(404).json({ message: 'Notice not found' });
    }
    res.json({ message: 'Notice deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
