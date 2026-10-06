const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const School = require('../models/School');
const { protect } = require('../middleware/auth');
const { uploadLogo, cloudinary } = require('../config/cloudinary');
const { readDB, writeDB } = require('../config/localStore');

const isMongo = () => mongoose.connection.readyState === 1;

// GET /api/school — public
router.get('/', async (req, res) => {
  if (isMongo()) {
    let school = await School.findOne();
    if (!school) {
      const db = readDB();
      school = await School.create(db.school);
    }
    return res.json({ success: true, data: school });
  }

  const db = readDB();
  res.json({ success: true, data: db.school });
});

// PUT /api/school — admin only
router.put('/', protect, async (req, res) => {
  const { address, phone, email, board, type, established, timings, heroDescription } = req.body;
  if (isMongo()) {
    let school = await School.findOne();
    if (!school) school = new School();
    Object.assign(school, { address, phone, email, board, type, established, timings, heroDescription });
    await school.save();
    return res.json({ success: true, data: school });
  }

  const db = readDB();
  db.school = {
    ...db.school,
    ...(address !== undefined && { address }),
    ...(phone !== undefined && { phone }),
    ...(email !== undefined && { email }),
    ...(board !== undefined && { board }),
    ...(type !== undefined && { type }),
    ...(established !== undefined && { established }),
    ...(timings !== undefined && { timings }),
    ...(heroDescription !== undefined && { heroDescription }),
  };
  writeDB(db);
  res.json({ success: true, data: db.school });
});

// POST /api/school/logo — admin only, upload logo
router.post('/logo', protect, uploadLogo.single('logo'), async (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });

  let logoUrl = req.file.path;
  let logoPublicId = req.file.filename;

  if (!logoUrl || !logoUrl.startsWith('http')) {
    logoUrl = `/uploads/logo/${req.file.filename}`;
    try {
      const fs = require('fs');
      const path = require('path');
      const feDest = path.join(__dirname, '../../../frontend/public/uploads/logo', req.file.filename);
      fs.copyFileSync(req.file.path, feDest);
    } catch (e) {}
  }

  if (isMongo()) {
    let school = await School.findOne();
    if (!school) school = new School();

    if (school.logoPublicId && school.logoPublicId.startsWith('gdps/')) {
      await cloudinary.uploader.destroy(school.logoPublicId).catch(() => {});
    }

    school.logoUrl = logoUrl;
    school.logoPublicId = logoPublicId;
    await school.save();

    return res.json({ success: true, logoUrl, data: school });
  }

  const db = readDB();
  db.school.logoUrl = logoUrl;
  db.school.logoPublicId = logoPublicId;
  writeDB(db);
  res.json({ success: true, logoUrl, data: db.school });
});

// DELETE /api/school/logo — remove logo
router.delete('/logo', protect, async (req, res) => {
  if (isMongo()) {
    let school = await School.findOne();
    if (school?.logoPublicId) {
      await cloudinary.uploader.destroy(school.logoPublicId).catch(() => {});
      school.logoUrl = '';
      school.logoPublicId = '';
      await school.save();
    }
    return res.json({ success: true, message: 'Logo removed' });
  }

  const db = readDB();
  db.school.logoUrl = '';
  db.school.logoPublicId = '';
  writeDB(db);
  res.json({ success: true, message: 'Logo removed' });
});

module.exports = router;
