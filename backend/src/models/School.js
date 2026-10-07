const mongoose = require('mongoose');

const schoolSchema = new mongoose.Schema({
  address: { type: String, default: '' },
  phone: { type: String, default: '' },
  email: { type: String, default: '' },
  board: { type: String, default: '' },
  type: { type: String, default: '' },
  established: { type: String, default: '' },
  timings: { type: String, default: '' },
  logoUrl: { type: String, default: '' },
  logoPublicId: { type: String, default: '' },
  heroDescription: { type: String, default: '' },
  announcementBadge: { type: String, default: 'Admissions 2025–26' },
  announcementText: { type: String, default: '🎉 Admissions Open for Session 2025–26 (Nursery to Class 12th)' },
  showAnnouncement: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('School', schoolSchema);
