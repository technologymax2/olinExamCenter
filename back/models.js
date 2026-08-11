const mongoose = require('mongoose');

// ==========================================
// 1. USER SCHEMA (የተስተካከለ - hr ሮል ተጨምሯል)
// ==========================================
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['student', 'teacher', 'admin', 'hr'], default: 'student' }, // 'hr' ተካትቷል
    resetRequested: { type: Boolean, default: false },
    resetTokenExpire: { type: Date, default: null },
    createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// ==========================================
// 2. STUDENT SCHEMA (አዲስ የተጨመረ - የHR ተማሪ መዝገብ)
// ==========================================
const studentSchema = new mongoose.Schema({
    nameAmh: { type: String, required: true },
    nameEng: { type: String, required: true },
    fatherNameAmh: { type: String, required: true },
    grandfatherNameAmh: { type: String, required: true },
    motherNameAmh: { type: String, required: true }, // የእናት ስም
    gender: { type: String, default: 'ወንድ' },
    birthDate: { type: String, required: true },
    age: { type: Number, required: true },
    studentIdNumber: { type: String, required: true, unique: true },
    gradeAmh: { type: String, required: true },
    gradeEng: { type: String, required: true },
    dateOfIssue: { type: String, required: true },
    expireDate: { type: String, required: true },
    city: { type: String, required: true },
    woreda: { type: String, required: true },
    nationality: { type: String, default: 'ኢትዮጵያዊ' },
    phoneNumber: { type: String, default: '' },
    guardianName: { type: String, required: true },
    guardianPhone: { type: String, required: true },
    imageUrl: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now }
});

const Student = mongoose.model('Student', studentSchema);

// ==========================================
// 3. EXAM SCHEMA
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
// 4. CONTENT SCHEMA
// ==========================================
const contentSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    type: { type: String, default: 'general' },
    createdAt: { type: Date, default: Date.now }
});

const Content = mongoose.model('Content', contentSchema);

// ==========================================
// 5. QUESTION BANK SCHEMA
// ==========================================
const questionBankSchema = new mongoose.Schema({
    subject: { type: String, required: true },
    questionText: { type: String, required: true },
    optionA: { type: String, required: true },
    optionB: { type: String, required: true },
    optionC: { type: String, default: '' },
    optionD: { type: String, default: '' },
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
    Student, // 👈 አዲሱ የተማሪ ሞዴል እዚህ ተጨምሯል
    Exam,
    Content,
    QuestionBank
};
