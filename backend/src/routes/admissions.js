const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { readDB, writeDB } = require('../config/localStore');

// POST /api/admissions (Public - submit admission form)
router.post('/', (req, res) => {
  const { studentName, fatherName, phone, grade } = req.body;
  if (!studentName || !fatherName || !phone) {
    return res.status(400).json({ success: false, message: 'Student Name, Father Name, and Phone are required' });
  }

  const db = readDB();
  const newApp = {
    _id: 'adm_' + Date.now(),
    studentName,
    fatherName,
    motherName: req.body.motherName || '',
    dob: req.body.dob || '',
    gender: req.body.gender || 'Male',
    grade: grade || 'Class 1',
    phone,
    email: req.body.email || '',
    address: req.body.address || '',
    prevSchool: req.body.prevSchool || '',
    remarks: req.body.remarks || '',
    status: 'pending',
    submittedAt: new Date().toISOString(),
  };

  db.admissions.unshift(newApp);
  writeDB(db);
  res.status(201).json({ success: true, data: newApp });
});

// GET /api/admissions (Admin protected)
router.get('/', protect, (req, res) => {
  const db = readDB();
  res.json({ success: true, data: db.admissions || [] });
});

// PUT /api/admissions/:id/status (Admin protected)
router.put('/:id/status', protect, (req, res) => {
  const { status } = req.body;
  const db = readDB();
  const index = (db.admissions || []).findIndex((a) => a._id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Application not found' });
  }

  db.admissions[index].status = status;
  writeDB(db);
  res.json({ success: true, data: db.admissions[index] });
});

// DELETE /api/admissions/:id (Admin protected)
router.delete('/:id', protect, (req, res) => {
  const db = readDB();
  db.admissions = (db.admissions || []).filter((a) => a._id !== req.params.id);
  writeDB(db);
  res.json({ success: true, message: 'Application deleted' });
});

module.exports = router;
