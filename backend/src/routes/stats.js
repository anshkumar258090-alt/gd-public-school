const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Stats = require('../models/Stats');
const { protect } = require('../middleware/auth');
const { readDB, writeDB } = require('../config/localStore');

const isMongo = () => mongoose.connection.readyState === 1;

// GET /api/stats — public
router.get('/', async (req, res) => {
  if (isMongo()) {
    let stats = await Stats.findOne();
    if (!stats) {
      const db = readDB();
      stats = await Stats.create(db.stats);
    }
    return res.json({ success: true, data: stats });
  }

  const db = readDB();
  res.json({ success: true, data: db.stats });
});

// PUT /api/stats — admin
router.put('/', protect, async (req, res) => {
  const { students, teachers, years, classes } = req.body;
  if (isMongo()) {
    let stats = await Stats.findOne();
    if (!stats) stats = new Stats();
    Object.assign(stats, { students, teachers, years, classes });
    await stats.save();
    return res.json({ success: true, data: stats });
  }

  const db = readDB();
  db.stats = {
    ...db.stats,
    ...(students !== undefined && { students }),
    ...(teachers !== undefined && { teachers }),
    ...(years !== undefined && { years }),
    ...(classes !== undefined && { classes }),
  };
  writeDB(db);
  res.json({ success: true, data: db.stats });
});

module.exports = router;
