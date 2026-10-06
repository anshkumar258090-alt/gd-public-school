const mongoose = require('mongoose');

const statsSchema = new mongoose.Schema({
  students: { type: String, default: '' },
  teachers: { type: String, default: '' },
  years: { type: String, default: '' },
  classes: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Stats', statsSchema);
