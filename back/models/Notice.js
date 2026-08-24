// models/Notice.js
const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  targetAudience: { type: String, enum: ['All', 'Students', 'Teachers'], default: 'All' },
  postedBy: { type: String, required: true },
  date: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Notice', noticeSchema);
