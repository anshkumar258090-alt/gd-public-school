const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { readDB, writeDB } = require('../config/localStore');

// GET /api/students (Public)
router.get('/', (req, res) => {
  const db = readDB();
  res.json({ success: true, data: db.students || [] });
});

// POST /api/students (Admin protected)
router.post('/', protect, (req, res) => {
  const { name, rollNo, grade } = req.body;
  if (!name || !rollNo) {
    return res.status(400).json({ success: false, message: 'Name and Roll No are required' });
  }

  const db = readDB();
  const newStudent = {
    _id: 'std_' + Date.now(),
    name,
    rollNo,
    grade: grade || 'Class 1',
    section: req.body.section || 'A',
    gender: req.body.gender || 'Male',
    fatherName: req.body.fatherName || '',
    phone: req.body.phone || '',
    dob: req.body.dob || '',
    bloodGroup: req.body.bloodGroup || '',
    performance: req.body.performance || '',
    achievements: req.body.achievements || '',
  };

  if (!db.students) db.students = [];
  db.students.unshift(newStudent);
  writeDB(db);
  res.status(201).json({ success: true, data: newStudent });
});

// PUT /api/students/:id (Admin protected)
router.put('/:id', protect, (req, res) => {
  const db = readDB();
  const index = (db.students || []).findIndex((s) => s._id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Student not found' });
  }

  db.students[index] = { ...db.students[index], ...req.body, _id: req.params.id };
  writeDB(db);
  res.json({ success: true, data: db.students[index] });
});

// DELETE /api/students/:id (Admin protected)
router.delete('/:id', protect, (req, res) => {
  const db = readDB();
  db.students = (db.students || []).filter((s) => s._id !== req.params.id);
  writeDB(db);
  res.json({ success: true, message: 'Student deleted' });
});

module.exports = router;
