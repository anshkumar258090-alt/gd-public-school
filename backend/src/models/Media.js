const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema({
  url: { type: String, required: true },
  publicId: { type: String, required: true },
  caption: { type: String, default: '' },
  type: { type: String, enum: ['image', 'video'], default: 'image' },
  order: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Media', mediaSchema);
