const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { readDB, writeDB } = require('../config/localStore');

// GET /api/fees (Public)
router.get('/', (req, res) => {
  const db = readDB();
  res.json({ success: true, data: db.fees || [] });
});

// PUT /api/fees (Admin protected)
router.put('/', protect, (req, res) => {
  const { fees } = req.body;
  if (!Array.isArray(fees)) {
    return res.status(400).json({ success: false, message: 'Fees array is required' });
  }
  const db = readDB();
  db.fees = fees;
  writeDB(db);
  res.json({ success: true, data: db.fees });
});

module.exports = router;
