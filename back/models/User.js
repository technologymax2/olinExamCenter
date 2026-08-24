const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['admin', 'teacher', 'student'], 
    default: 'student' 
  },
  studentId: { type: String }, // ለተማሪዎች ብቻ
  department: { type: String },
  status: { type: String, default: 'Active' }, // Active, Graduated, etc.
  academicYear: { type: String }, // 1st Year, 2nd Year, etc.
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
