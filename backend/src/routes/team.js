const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const TeamMember = require('../models/TeamMember');
const { protect } = require('../middleware/auth');
const { uploadTeamPhoto, cloudinary } = require('../config/cloudinary');
const { readDB, writeDB } = require('../config/localStore');

const isMongo = () => mongoose.connection.readyState === 1;

// GET /api/team — public
router.get('/', async (req, res) => {
  if (isMongo()) {
    let team = await TeamMember.find({ isActive: true }).sort({ order: 1, createdAt: 1 });
    if (team.length === 0) {
      const db = readDB();
      team = await TeamMember.insertMany(db.team);
    }
    return res.json({ success: true, data: team });
  }

  const db = readDB();
  res.json({ success: true, data: db.team.filter((t) => t.isActive !== false) });
});

// POST /api/team — admin
router.post('/', protect, async (req, res) => {
  const { name, role, qualification, experience, bio, email, order, photoUrl } = req.body;
  if (isMongo()) {
    const member = await TeamMember.create({
      name,
      role,
      qualification,
      experience,
      bio,
      email,
      photoUrl: photoUrl || '',
      order: order || 0,
    });
    return res.status(201).json({ success: true, data: member });
  }

  const db = readDB();
  const newMember = {
    _id: 'member_' + Date.now(),
    name: name || '',
    role: role || '',
    qualification: qualification || '',
    experience: experience || '',
    bio: bio || '',
    email: email || '',
    photoUrl: photoUrl || '',
    order: order || db.team.length + 1,
    isActive: true,
  };
  db.team.push(newMember);
  writeDB(db);
  res.status(201).json({ success: true, data: newMember });
});

// PUT /api/team/:id — admin
router.put('/:id', protect, async (req, res) => {
  const { name, role, qualification, experience, bio, email, order, isActive, photoUrl } = req.body;
  const targetId = req.params.id;

  if (isMongo()) {
    const updateData = {
      ...(name !== undefined && { name }),
      ...(role !== undefined && { role }),
      ...(qualification !== undefined && { qualification }),
      ...(experience !== undefined && { experience }),
      ...(bio !== undefined && { bio }),
      ...(email !== undefined && { email }),
      ...(order !== undefined && { order }),
      ...(isActive !== undefined && { isActive }),
      ...(photoUrl !== undefined && { photoUrl }),
    };
    const member = await TeamMember.findByIdAndUpdate(targetId, updateData, { new: true });
    if (!member) return res.status(404).json({ success: false, message: 'Member not found' });
    return res.json({ success: true, data: member });
  }

  const db = readDB();
  let idx = db.team.findIndex(
    (m) => m._id === targetId || (m._id && m._id.toLowerCase() === targetId.toLowerCase())
  );

  if (idx === -1) {
    // If not found, create it so updates never fail
    const newMember = {
      _id: targetId,
      name: name || '',
      role: role || targetId,
      qualification: qualification || '',
      experience: experience || '',
      bio: bio || '',
      email: email || '',
      photoUrl: photoUrl || '',
      order: order || db.team.length + 1,
      isActive: isActive !== false,
    };
    db.team.push(newMember);
    writeDB(db);
    return res.json({ success: true, data: newMember });
  }

  db.team[idx] = {
    ...db.team[idx],
    ...(name !== undefined && { name }),
    ...(role !== undefined && { role }),
    ...(qualification !== undefined && { qualification }),
    ...(experience !== undefined && { experience }),
    ...(bio !== undefined && { bio }),
    ...(email !== undefined && { email }),
    ...(order !== undefined && { order }),
    ...(isActive !== undefined && { isActive }),
    ...(photoUrl !== undefined && { photoUrl }),
  };
  writeDB(db);
  res.json({ success: true, data: db.team[idx] });
});

// POST /api/team/:id/photo — upload photo
router.post('/:id/photo', protect, uploadTeamPhoto.single('photo'), async (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });

  let photoUrl = req.file.path;
  let photoPublicId = req.file.filename;

  // If local disk storage was used (not a remote http URL)
  if (!photoUrl || !photoUrl.startsWith('http')) {
    photoUrl = `/uploads/team/${req.file.filename}`;
    // Also copy to frontend/public for instant Next.js serving
    try {
      const feDest = path.join(__dirname, '../../../frontend/public/uploads/team', req.file.filename);
      fs.copyFileSync(req.file.path, feDest);
    } catch (e) {}
  }

  const targetId = req.params.id;

  if (isMongo()) {
    const member = await TeamMember.findById(targetId);
    if (!member) return res.status(404).json({ success: false, message: 'Member not found' });
    if (member.photoPublicId && member.photoPublicId.startsWith('gdps/')) {
      await cloudinary.uploader.destroy(member.photoPublicId).catch(() => {});
    }
    member.photoUrl = photoUrl;
    member.photoPublicId = photoPublicId;
    await member.save();
    return res.json({ success: true, data: member });
  }

  const db = readDB();
  let idx = db.team.findIndex(
    (m) => m._id === targetId || (m._id && m._id.toLowerCase() === targetId.toLowerCase())
  );

  if (idx === -1) {
    const newMember = {
      _id: targetId,
      name: '',
      role: targetId,
      qualification: '',
      experience: '',
      bio: '',
      email: '',
      photoUrl,
      photoPublicId,
      order: db.team.length + 1,
      isActive: true,
    };
    db.team.push(newMember);
    writeDB(db);
    return res.json({ success: true, data: newMember });
  }

  db.team[idx].photoUrl = photoUrl;
  db.team[idx].photoPublicId = photoPublicId;
  writeDB(db);
  res.json({ success: true, data: db.team[idx] });
});

// DELETE /api/team/:id — admin
router.delete('/:id', protect, async (req, res) => {
  if (isMongo()) {
    const member = await TeamMember.findById(req.params.id);
    if (!member) return res.status(404).json({ success: false, message: 'Member not found' });
    if (member.photoPublicId) {
      await cloudinary.uploader.destroy(member.photoPublicId).catch(() => {});
    }
    await member.deleteOne();
    return res.json({ success: true, message: 'Member deleted' });
  }

  const db = readDB();
  db.team = db.team.filter((m) => m._id !== req.params.id);
  writeDB(db);
  res.json({ success: true, message: 'Member deleted' });
});

module.exports = router;
