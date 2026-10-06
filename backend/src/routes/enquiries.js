const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Enquiry = require('../models/Enquiry');
const { protect } = require('../middleware/auth');
const { readDB, writeDB } = require('../config/localStore');

const isMongo = () => mongoose.connection.readyState === 1;

// POST /api/enquiries — public (from admission enquiry form)
router.post('/', async (req, res) => {
  const { parentName, phone, email, studentGrade, message } = req.body;
  if (!parentName || !phone) {
    return res.status(400).json({ success: false, message: 'Name and phone are required' });
  }

  if (isMongo()) {
    const item = await Enquiry.create({
      parentName,
      phone,
      email: email || '',
      studentGrade: studentGrade || 'Class 1',
      message: message || '',
      status: 'new',
    });
    return res.status(201).json({ success: true, data: item });
  }

  const db = readDB();
  const newEnquiry = {
    _id: 'enq_' + Date.now(),
    parentName,
    phone,
    email: email || '',
    studentGrade: studentGrade || 'Class 1',
    message: message || '',
    status: 'new',
    createdAt: new Date().toISOString(),
  };
  db.enquiries.unshift(newEnquiry);
  writeDB(db);
  res.status(201).json({ success: true, data: newEnquiry });
});

// GET /api/enquiries — admin only
router.get('/', protect, async (req, res) => {
  if (isMongo()) {
    const items = await Enquiry.find().sort({ createdAt: -1 });
    return res.json({ success: true, data: items });
  }

  const db = readDB();
  res.json({ success: true, data: db.enquiries || [] });
});

// PUT /api/enquiries/:id — admin update status (new / contacted)
router.put('/:id', protect, async (req, res) => {
  const { status } = req.body;
  if (isMongo()) {
    const item = await Enquiry.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!item) return res.status(404).json({ success: false, message: 'Enquiry not found' });
    return res.json({ success: true, data: item });
  }

  const db = readDB();
  const idx = db.enquiries.findIndex((e) => e._id === req.params.id);
  if (idx === -1) return res.status(404).json({ success: false, message: 'Enquiry not found' });
  db.enquiries[idx].status = status;
  writeDB(db);
  res.json({ success: true, data: db.enquiries[idx] });
});

// DELETE /api/enquiries/:id — admin delete
router.delete('/:id', protect, async (req, res) => {
  if (isMongo()) {
    const item = await Enquiry.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Enquiry not found' });
    return res.json({ success: true, message: 'Enquiry deleted' });
  }

  const db = readDB();
  db.enquiries = db.enquiries.filter((e) => e._id !== req.params.id);
  writeDB(db);
  res.json({ success: true, message: 'Enquiry deleted' });
});

module.exports = router;
