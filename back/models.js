const mongoose = require('mongoose');

// ==========================================
// USER
// ==========================================

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },

        password: {
            type: String,
            required: true
        },

        role: {
            type: String,
            enum: ['student', 'teacher', 'admin', 'hr'],
            default: 'student'
        },

        resetRequested: {
            type: Boolean,
            default: false
        },

        resetTokenExpire: {
            type: Date,
            default: null
        },

        createdAt: {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: true
    }
);

const User = mongoose.model('User', userSchema);

// ==========================================
// STUDENT
// ==========================================

const studentSchema = new mongoose.Schema(
    {
        nameAmh: {
            type: String,
            required: true,
            trim: true
        },

        nameEng: {
            type: String,
            required: true,
            trim: true
        },

        fatherNameAmh: {
            type: String,
            required: true,
            trim: true
        },

        grandfatherNameAmh: {
            type: String,
            required: true,
            trim: true
        },

        motherNameAmh: {
            type: String,
            required: true,
            trim: true
        },

        gender: {
            type: String,
            default: 'ወንድ'
        },

        birthDate: {
            type: String,
            required: true
        },

        age: {
            type: Number,
            required: true,
            min: 0
        },

        studentIdNumber: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },

        programLevel: {
            type: String,
            enum: ['Level', 'Degree', 'Master', 'PhD'],
            default: 'Degree'
        },

        department: {
            type: String,
            required: true,
            trim: true
        },

        academicYear: {
            type: String,
            default: '1ኛ ዓመት'
        },

        semester: {
            type: String,
            default: '1ኛ ሴሚስተር'
        },

        gradeAmh: {
            type: String,
            default: ''
        },

        gradeEng: {
            type: String,
            default: ''
        },

        dateOfIssue: {
            type: String,
            required: true
        },

        expireDate: {
            type: String,
            required: true
        },

        city: {
            type: String,
            required: true
        },

        woreda: {
            type: String,
            required: true
        },

        nationality: {
            type: String,
            default: 'ኢትዮጵያዊ'
        },

        phoneNumber: {
            type: String,
            default: ''
        },

        guardianName: {
            type: String,
            required: true
        },

        guardianPhone: {
            type: String,
            required: true
        },

        imageUrl: {
            type: String,
            default: ''
        }
    },
    {
        timestamps: true
    }
);

const Student = mongoose.model('Student', studentSchema);

// ==========================================
// EXAM
// ==========================================

const examSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },

        subject: {
            type: String,
            required: true,
            trim: true
        },

        examDate: {
            type: Date,
            required: true
        },

        resultReleaseDate: {
            type: Date,
            required: true
        },

        duration: {
            type: Number,
            required: true,
            min: 1
        },

        questionLimit: {
            type: Number,
            default: 20,
            min: 1
        },

        passingScore: {
            type: Number,
            default: 50,
            min: 0,
            max: 100
        },

        isPublished: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

const Exam = mongoose.model('Exam', examSchema);

// ==========================================
// CONTENT
// ==========================================

const contentSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            required: true,
            trim: true
        },

        type: {
            type: String,
            enum: ['homework', 'assignment', 'message', 'general'],
            default: 'general'
        },

        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null
        }
    },
    {
        timestamps: true
    }
);

const Content = mongoose.model('Content', contentSchema);

// ==========================================
// QUESTION BANK
// ==========================================

const questionBankSchema = new mongoose.Schema(
    {
        subject: {
            type: String,
            required: true,
            trim: true
        },

        questionText: {
            type: String,
            required: true,
            trim: true
        },

        optionA: {
            type: String,
            required: true,
            trim: true
        },

        optionB: {
            type: String,
            required: true,
            trim: true
        },

        optionC: {
            type: String,
            default: '',
            trim: true
        },

        optionD: {
            type: String,
            default: '',
            trim: true
        },

        correctAnswer: {
            type: String,
            required: true,
            enum: ['A', 'B', 'C', 'D']
        },

        explanation: {
            type: String,
            default: ''
        }
    },
    {
        timestamps: true
    }
);

const QuestionBank = mongoose.model(
    'QuestionBank',
    questionBankSchema
);

// ==========================================
// EXAM SUBMISSION
// ==========================================

const examSubmissionSchema = new mongoose.Schema(
    {
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },

        exam: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Exam',
            required: true
        },

        answers: {
            type: Map,
            of: String,
            default: {}
        },

        correctCount: {
            type: Number,
            default: 0
        },

        totalQuestions: {
            type: Number,
            default: 0
        },

        answeredQuestions: {
            type: Number,
            default: 0
        },

        score: {
            type: Number,
            default: 0
        },

        passed: {
            type: Boolean,
            default: false
        },

        submittedAt: {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: true
    }
);

examSubmissionSchema.index(
    { student: 1, exam: 1 },
    { unique: true }
);

const ExamSubmission = mongoose.model(
    'ExamSubmission',
    examSubmissionSchema
);

// ==========================================
// EXPORT
// ==========================================

module.exports = {
    User,
    Student,
    Exam,
    Content,
    QuestionBank,
    ExamSubmission
};
