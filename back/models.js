const mongoose = require('mongoose');

// ==========================================
// 1. USER SCHEMA (የተስተካከለ - hr ሮል ተጨምሯል)
// ==========================================
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['student', 'teacher', 'admin', 'hr'], default: 'student' },
    resetRequested: { type: Boolean, default: false },
    resetTokenExpire: { type: Date, default: null },
    createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// ==========================================
// 2. STUDENT SCHEMA (ለኮሌጅ ደረጃዎች የተስተካከለ)
// ==========================================
const studentSchema = new mongoose.Schema({
    nameAmh: { type: String, required: true },
    nameEng: { type: String, required: true },
    fatherNameAmh: { type: String, required: true },
    grandfatherNameAmh: { type: String, required: true },
    motherNameAmh: { type: String, required: true },
    gender: { type: String, default: 'ወንድ' },
    birthDate: { type: String, required: true },
    age: { type: Number, required: true },
    studentIdNumber: { type: String, required: true, unique: true },
    
    // 🎓 አዳዲስ የኮሌጅ መስኮች (እዚህ ተጨምረዋል)
    programLevel: { type: String, enum: ['Level', 'Degree', 'Master', 'PhD'], default: 'Degree' },
    department: { type: String, required: true },
    academicYear: { type: String, default: '1ኛ ዓመት' },
    semester: { type: String, default: '1ኛ ሴሚስተር' },

    gradeAmh: { type: String, default: '' }, // ከአሁን በኋላ required አያስፈልገውም
    gradeEng: { type: String, default: '' }, // ከአሁን በኋላ required አያስፈልገውም
    
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
    duration: { type: Number, required: true },
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
    correctAnswer: { type: String, required: true },
    explanation: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now }
});

const QuestionBank = mongoose.model('QuestionBank', questionBankSchema);

// ==========================================
// EXPORT MODELS
// ==========================================
module.exports = {
    User,
    Student,
    Exam,
    Content,
    QuestionBank
};
