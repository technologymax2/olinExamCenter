const mongoose = require('mongoose');

// ==========================================
// 1. USER SCHEMA
// ==========================================
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['student', 'teacher', 'admin'], default: 'student' },
    resetRequested: { type: Boolean, default: false },
    resetTokenExpire: { type: Date, default: null },
    createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// ==========================================
// 2. EXAM SCHEMA
// ==========================================
const examSchema = new mongoose.Schema({
    title: { type: String, required: true },
    subject: { type: String, required: true },
    examDate: { type: Date, required: true },
    resultReleaseDate: { type: Date, required: true },
    duration: { type: Number, required: true }, // በደቂቃ (in minutes)
    createdAt: { type: Date, default: Date.now }
});

const Exam = mongoose.model('Exam', examSchema);

// ==========================================
// 3. CONTENT SCHEMA
// ==========================================
const contentSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    type: { type: String, default: 'general' },
    createdAt: { type: Date, default: Date.now }
});

const Content = mongoose.model('Content', contentSchema);

// ==========================================
// 4. QUESTION BANK SCHEMA (Bulk Parse የሚገቡበት)
// ==========================================
const questionBankSchema = new mongoose.Schema({
    subject: { type: String, required: true },
    questionText: { type: String, required: true },
    options: [{ type: String, required: true }], // [a, b, c, d]
    correctAnswer: { type: String, required: true }, // 'A', 'B', 'C', or 'D'
    explanation: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now }
});

const QuestionBank = mongoose.model('QuestionBank', questionBankSchema);

// ==========================================
// EXPORT MODELS
// ==========================================
module.exports = {
    User,
    Exam,
    Content,
    QuestionBank
};
