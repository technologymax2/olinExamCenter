const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    type: { type: String, enum: ['homework', 'assignment', 'message'], required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Content', contentSchema);
