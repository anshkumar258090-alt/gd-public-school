const mongoose = require('mongoose');

const enquirySchema = new mongoose.Schema({
  parentName: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, default: '' },
  studentGrade: { type: String, default: 'Class 1' },
  message: { type: String, default: '' },
  status: { type: String, enum: ['new', 'contacted'], default: 'new' },
}, { timestamps: true });

module.exports = mongoose.model('Enquiry', enquirySchema);
