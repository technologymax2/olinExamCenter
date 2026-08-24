const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  course: { type: String, required: true },
  teacher: { type: String, required: true },
  description: { type: String, required: true },
  dueDate: { type: String, required: true },
  submissions: [
    {
      studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      fileUrl: { type: String },
      submittedAt: { type: Date, default: Date.now }
    }
  ],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Assignment', assignmentSchema);
