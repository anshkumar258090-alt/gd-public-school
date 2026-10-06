const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Notice = require('../models/Notice');
const { protect } = require('../middleware/auth');
const { readDB, writeDB } = require('../config/localStore');

const isMongo = () => mongoose.connection.readyState === 1;

// GET /api/notices — public
router.get('/', async (req, res) => {
  if (isMongo()) {
    const notices = await Notice.find({ isActive: true }).sort({ createdAt: -1 });
    return res.json({ success: true, data: notices });
  }

  const db = readDB();
  res.json({ success: true, data: db.notices.filter((n) => n.isActive !== false) });
});

// POST /api/notices — admin
router.post('/', protect, async (req, res) => {
  const { title, content, date } = req.body;
  if (!title || !content) return res.status(400).json({ success: false, message: 'Title and content required' });

  if (isMongo()) {
    const notice = await Notice.create({ title, content, date: date || Date.now() });
    return res.status(201).json({ success: true, data: notice });
  }

  const db = readDB();
  const newNotice = {
    _id: 'notice_' + Date.now(),
    title,
    content,
    date: date || new Date().toISOString(),
    isActive: true,
  };
  db.notices.unshift(newNotice);
  writeDB(db);
  res.status(201).json({ success: true, data: newNotice });
});

// DELETE /api/notices/:id — admin
router.delete('/:id', protect, async (req, res) => {
  if (isMongo()) {
    const notice = await Notice.findByIdAndDelete(req.params.id);
    if (!notice) return res.status(404).json({ success: false, message: 'Not found' });
    return res.json({ success: true, message: 'Deleted' });
  }

  const db = readDB();
  db.notices = db.notices.filter((n) => n._id !== req.params.id);
  writeDB(db);
  res.json({ success: true, message: 'Deleted' });
});

module.exports = router;
