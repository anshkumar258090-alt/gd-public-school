const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Media = require('../models/Media');
const { protect } = require('../middleware/auth');
const { uploadMedia, cloudinary } = require('../config/cloudinary');
const { readDB, writeDB } = require('../config/localStore');

const isMongo = () => mongoose.connection.readyState === 1;

// GET /api/media — public
router.get('/', async (req, res) => {
  if (isMongo()) {
    const media = await Media.find().sort({ order: 1, createdAt: -1 });
    return res.json({ success: true, data: media });
  }

  const db = readDB();
  res.json({ success: true, data: db.media });
});

// POST /api/media — upload (single or multiple)
router.post('/', protect, uploadMedia.array('files', 20), async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ success: false, message: 'No files uploaded' });
  }
  const fs = require('fs');
  const path = require('path');
  const captions = req.body.captions ? JSON.parse(req.body.captions) : [];
  const docs = req.files.map((file, i) => {
    let url = file.path;
    if (!url || !url.startsWith('http')) {
      url = `/uploads/gallery/${file.filename}`;
      try {
        const feDest = path.join(__dirname, '../../../frontend/public/uploads/gallery', file.filename);
        fs.copyFileSync(file.path, feDest);
      } catch (e) {}
    }
    return {
      url,
      publicId: file.filename,
      caption: captions[i] || '',
      type: file.mimetype.startsWith('video/') ? 'video' : 'image',
    };
  });

  if (isMongo()) {
    const created = await Media.insertMany(docs);
    return res.status(201).json({ success: true, data: created });
  }

  const db = readDB();
  const created = docs.map((doc, idx) => ({
    _id: 'media_' + Date.now() + '_' + idx,
    ...doc,
    order: db.media.length + idx + 1,
    createdAt: new Date().toISOString(),
  }));
  db.media.unshift(...created);
  writeDB(db);
  res.status(201).json({ success: true, data: created });
});

// PUT /api/media/:id — update caption
router.put('/:id', protect, async (req, res) => {
  const { caption, order } = req.body;
  if (isMongo()) {
    const media = await Media.findByIdAndUpdate(req.params.id, { caption, order }, { new: true });
    if (!media) return res.status(404).json({ success: false, message: 'Not found' });
    return res.json({ success: true, data: media });
  }

  const db = readDB();
  const item = db.media.find((m) => m._id === req.params.id);
  if (!item) return res.status(404).json({ success: false, message: 'Not found' });
  if (caption !== undefined) item.caption = caption;
  if (order !== undefined) item.order = order;
  writeDB(db);
  res.json({ success: true, data: item });
});

// DELETE /api/media/:id
router.delete('/:id', protect, async (req, res) => {
  if (isMongo()) {
    const media = await Media.findById(req.params.id);
    if (!media) return res.status(404).json({ success: false, message: 'Not found' });
    await cloudinary.uploader.destroy(media.publicId, {
      resource_type: media.type === 'video' ? 'video' : 'image',
    }).catch(() => {});
    await media.deleteOne();
    return res.json({ success: true, message: 'Deleted' });
  }

  const db = readDB();
  db.media = db.media.filter((m) => m._id !== req.params.id);
  writeDB(db);
  res.json({ success: true, message: 'Deleted' });
});

module.exports = router;
