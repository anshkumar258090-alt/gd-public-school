const mongoose = require('mongoose');

const teamMemberSchema = new mongoose.Schema({
  name: { type: String, default: '' },
  role: { type: String, required: true },
  qualification: { type: String, default: '' },
  experience: { type: String, default: '' },
  bio: { type: String, default: '' },
  email: { type: String, default: '' },
  photoUrl: { type: String, default: '' },
  photoPublicId: { type: String, default: '' },
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('TeamMember', teamMemberSchema);
