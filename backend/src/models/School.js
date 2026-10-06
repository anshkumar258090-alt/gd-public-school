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
}, { timestamps: true });

module.exports = mongoose.model('School', schoolSchema);
