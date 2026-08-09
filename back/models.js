const mongoose = require('mongoose');

// ==========================================
// USER SCHEMA
// ==========================================
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'teacher', 'student'], default: 'student' },
    resetRequested: { type: Boolean, default: false },
    resetTokenExpire: { type: Date, default: null }
});

const User = mongoose.model('User', userSchema);

// ==========================================
// EXAM SCHEMA
// ==========================================
const examSchema = new mongoose.Schema({
    title: { type: String, required: true },
    subject: { type: String, required: true },
    duration: { type: Number, required: true }, // በደቂቃ
    examDate: { type: Date, required: true }, // የፈተና ቀን እና ሰዓት
    resultReleaseDate: { type: Date, required: true }, // ውጤት የሚገለጽበት ቀን
    questions: [
        {
            questionText: String,
            options: [String],
            correctAnswer: String
        }
    ]
});

const Exam = mongoose.model('Exam', examSchema);

// ==========================================
// CONTENT SCHEMA
// ==========================================
const contentSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    type: { type: String, enum: ['homework', 'assignment', 'message'], required: true },
    createdAt: { type: Date, default: Date.now }
});

const Content = mongoose.model('Content', contentSchema);

// Export all models together
module.exports = {
    User,
    Exam,
    Content
};
