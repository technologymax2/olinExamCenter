const express = require('express');
const router = express.Router();

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const xlsx = require('xlsx');
const fs = require('fs');

const {
    User,
    Student,
    Exam,
    Content,
    QuestionBank,
    ExamSubmission
} = require('./models');

// ==========================================
// CONFIG
// ==========================================

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is missing.');
}

// ==========================================
// MULTER
// ==========================================

const upload = multer({
    dest: 'uploads/',
    limits: {
        fileSize: 10 * 1024 * 1024
    },
    fileFilter: (req, file, cb) => {
        const allowed = [
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'application/vnd.ms-excel'
        ];

        if (
            allowed.includes(file.mimetype) ||
            file.originalname.match(/\.(xlsx|xls)$/i)
        ) {
            cb(null, true);
        } else {
            cb(new Error('Only Excel files are allowed.'));
        }
    }
});

// ==========================================
// JWT AUTH
// ==========================================

function generateToken(user) {
    return jwt.sign(
        {
            id: user._id.toString(),
            role: user.role,
            email: user.email
        },
        JWT_SECRET,
        {
            expiresIn: '7d'
        }
    );
}

function authenticate(req, res, next) {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                error: 'Authentication required.'
            });
        }

        const token = authHeader.split(' ')[1];

        const decoded = jwt.verify(token, JWT_SECRET);

        req.user = decoded;

        next();
    } catch (error) {
        return res.status(401).json({
            error: 'Invalid or expired authentication token.'
        });
    }
}

function authorize(...roles) {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                error: 'Authentication required.'
            });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                error: 'You do not have permission to perform this action.'
            });
        }

        next();
    };
}

// ==========================================
// AUTH
// ==========================================

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                error: 'Email and password are required.'
            });
        }

        const user = await User.findOne({
            email: email.toLowerCase().trim()
        });

        if (!user) {
            return res.status(401).json({
                error: 'ኢሜይል ወይም የይለፍ ቃል ስህተት ነው!'
            });
        }

        const validPassword = await bcrypt.compare(
            password,
            user.password
        );

        if (!validPassword) {
            return res.status(401).json({
                error: 'ኢሜይል ወይም የይለፍ ቃል ስህተት ነው!'
            });
        }

        const token = generateToken(user);

        res.json({
            success: true,
            message: 'በተሳካ ሁኔታ ገብተዋል!',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Login error:', error);

        res.status(500).json({
            error: 'Login failed.'
        });
    }
});

// ==========================================
// CURRENT USER
// ==========================================

router.get('/auth/me', authenticate, async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
            .select('-password');

        if (!user) {
            return res.status(404).json({
                error: 'User not found.'
            });
        }

        res.json({
            success: true,
            user
        });
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});

// ==========================================
// CHANGE PASSWORD
// ==========================================

router.put(
    '/users/change-password',
    authenticate,
    async (req, res) => {
        try {
            const {
                oldPassword,
                newPassword
            } = req.body;

            if (!oldPassword || !newPassword) {
                return res.status(400).json({
                    error: 'Old and new passwords are required.'
                });
            }

            if (newPassword.length < 6) {
                return res.status(400).json({
                    error: 'New password must contain at least 6 characters.'
                });
            }

            const user = await User.findById(req.user.id);

            if (!user) {
                return res.status(404).json({
                    error: 'User not found.'
                });
            }

            const valid = await bcrypt.compare(
                oldPassword,
                user.password
            );

            if (!valid) {
                return res.status(400).json({
                    error: 'የድሮው የይለፍ ቃል ስህተት ነው!'
                });
            }

            user.password = await bcrypt.hash(
                newPassword,
                12
            );

            await user.save();

            res.json({
                success: true,
                message: 'የይለፍ ቃልዎ ተቀይሯል!'
            });
        } catch (error) {
            res.status(500).json({
                error: error.message
            });
        }
    }
);

// ==========================================
// STUDENT ROUTES
// ==========================================

router.get(
    '/hr/students',
    authenticate,
    authorize('hr', 'admin'),
    async (req, res) => {
        try {
            const students = await Student.find()
                .sort({ createdAt: -1 });

            res.json(students);
        } catch (error) {
            res.status(500).json({
                error: error.message
            });
        }
    }
);

router.post(
    '/hr/students',
    authenticate,
    authorize('hr', 'admin'),
    async (req, res) => {
        try {
            const existing = await Student.findOne({
                studentIdNumber: req.body.studentIdNumber
            });

            if (existing) {
                return res.status(409).json({
                    error: 'ይህ የተማሪ መታወቂያ ቀድሞ ተመዝግቧል!'
                });
            }

            const student = await Student.create(req.body);

            res.status(201).json({
                success: true,
                message: 'ተማሪው ተመዝግቧል!',
                student
            });
        } catch (error) {
            res.status(400).json({
                error: error.message
            });
        }
    }
);

router.put(
    '/hr/students/:id',
    authenticate,
    authorize('hr', 'admin'),
    async (req, res) => {
        try {
            const student =
                await Student.findByIdAndUpdate(
                    req.params.id,
                    req.body,
                    {
                        new: true,
                        runValidators: true
                    }
                );

            if (!student) {
                return res.status(404).json({
                    error: 'ተማሪው አልተገኘም!'
                });
            }

            res.json({
                success: true,
                message: 'የተማሪው መረጃ ተሻሽሏል!',
                student
            });
        } catch (error) {
            res.status(400).json({
                error: error.message
            });
        }
    }
);

router.delete(
    '/hr/students/:id',
    authenticate,
    authorize('hr', 'admin'),
    async (req, res) => {
        try {
            const student =
                await Student.findByIdAndDelete(
                    req.params.id
                );

            if (!student) {
                return res.status(404).json({
                    error: 'ተማሪው አልተገኘም!'
                });
            }

            res.json({
                success: true,
                message: 'ተማሪው ተሰርዟል!'
            });
        } catch (error) {
            res.status(500).json({
                error: error.message
            });
        }
    }
);

// ==========================================
// QUESTION BANK
// ==========================================

router.get(
    '/admin/question-bank',
    authenticate,
    authorize('admin', 'teacher'),
    async (req, res) => {
        try {
            const questions =
                await QuestionBank.find()
                    .sort({ createdAt: -1 });

            res.json(questions);
        } catch (error) {
            res.status(500).json({
                error: error.message
            });
        }
    }
);

router.post(
    '/admin/question-bank/add',
    authenticate,
    authorize('admin', 'teacher'),
    async (req, res) => {
        try {
            const {
                subject,
                questionText,
                optionA,
                optionB,
                optionC,
                optionD,
                correctAnswer,
                explanation
            } = req.body;

            if (
                !subject ||
                !questionText ||
                !optionA ||
                !optionB
            ) {
                return res.status(400).json({
                    error:
                        'Subject, question, A and B are required.'
                });
            }

            if (!['A', 'B', 'C', 'D'].includes(correctAnswer)) {
                return res.status(400).json({
                    error: 'Invalid correct answer.'
                });
            }

            const question =
                await QuestionBank.create({
                    subject,
                    questionText,
                    optionA,
                    optionB,
                    optionC,
                    optionD,
                    correctAnswer,
                    explanation
                });

            res.status(201).json({
                success: true,
                message: 'ጥያቄው ተመዝግቧል!',
                question
            });
        } catch (error) {
            res.status(400).json({
                error: error.message
            });
        }
    }
);

router.delete(
    '/admin/question-bank/:id',
    authenticate,
    authorize('admin', 'teacher'),
    async (req, res) => {
        try {
            const question =
                await QuestionBank.findByIdAndDelete(
                    req.params.id
                );

            if (!question) {
                return res.status(404).json({
                    error: 'ጥያቄው አልተገኘም!'
                });
            }

            res.json({
                success: true,
                message: 'ጥያቄው ተሰርዟል!'
            });
        } catch (error) {
            res.status(500).json({
                error: error.message
            });
        }
    }
);

// ==========================================
// EXAMS - STUDENT
// ==========================================

// Important:
// correctAnswer is deliberately NOT returned.

router.get(
    '/exams',
    authenticate,
    async (req, res) => {
        try {
            const exams = await Exam.find({
                isPublished: true
            })
                .select(
                    'title subject examDate resultReleaseDate duration questionLimit passingScore'
                )
                .sort({ examDate: 1 });

            res.json(exams);
        } catch (error) {
            res.status(500).json({
                error: error.message
            });
        }
    }
);

router.get(
    '/exams/:id',
    authenticate,
    authorize('student'),
    async (req, res) => {
        try {
            const exam =
                await Exam.findById(req.params.id);

            if (!exam) {
                return res.status(404).json({
                    error: 'ፈተናው አልተገኘም!'
                });
            }

            if (!exam.isPublished) {
                return res.status(403).json({
                    error: 'ይህ ፈተና አሁን አይገኝም።'
                });
            }

            const existingSubmission =
                await ExamSubmission.findOne({
                    exam: exam._id,
                    student: req.user.id
                });

            if (existingSubmission) {
                return res.status(409).json({
                    error: 'ይህን ፈተና አስቀድመው ሰጥተዋል።'
                });
            }

            const questions =
                await QuestionBank.find({
                    subject: exam.subject
                })
                    .select(
                        '_id subject questionText optionA optionB optionC optionD'
                    )
                    .limit(exam.questionLimit);

            res.json({
                success: true,
                exam,
                questions
            });
        } catch (error) {
            console.error(error);

            res.status(500).json({
                error: error.message
            });
        }
    }
);

// ==========================================
// SUBMIT EXAM
// ==========================================

router.post(
    '/exams/:id/submit',
    authenticate,
    authorize('student'),
    async (req, res) => {
        try {
            const { answers } = req.body;

            if (
                !answers ||
                typeof answers !== 'object' ||
                Array.isArray(answers)
            ) {
                return res.status(400).json({
                    error: 'Invalid answer format.'
                });
            }

            const exam =
                await Exam.findById(req.params.id);

            if (!exam) {
                return res.status(404).json({
                    error: 'ፈተናው አልተገኘም!'
                });
            }

            const existing =
                await ExamSubmission.findOne({
                    exam: exam._id,
                    student: req.user.id
                });

            if (existing) {
                return res.status(409).json({
                    error: 'ይህን ፈተና አስቀድመው ሰጥተዋል።'
                });
            }

            const questions =
                await QuestionBank.find({
                    subject: exam.subject
                })
                    .limit(exam.questionLimit);

            let correctCount = 0;

            questions.forEach((question) => {
                const selected =
                    answers[question._id.toString()];

                if (
                    selected &&
                    selected === question.correctAnswer
                ) {
                    correctCount++;
                }
            });

            const totalQuestions =
                questions.length;

            const answeredQuestions =
                questions.filter(
                    (question) =>
                        answers[question._id.toString()]
                ).length;

            const score =
                totalQuestions > 0
                    ? Math.round(
                        (correctCount / totalQuestions) *
                        100
                    )
                    : 0;

            const passed =
                score >= exam.passingScore;

            const submission =
                await ExamSubmission.create({
                    student: req.user.id,
                    exam: exam._id,
                    answers,
                    correctCount,
                    totalQuestions,
                    answeredQuestions,
                    score,
                    passed
                });

            res.status(201).json({
                success: true,
                message: 'ፈተናው በተሳካ ሁኔታ ገብቷል!',
                score,
                correctCount,
                totalQuestions,
                answeredQuestions,
                passed,
                submissionId: submission._id
            });
        } catch (error) {
            console.error('Submit exam:', error);

            if (error.code === 11000) {
                return res.status(409).json({
                    error: 'ይህን ፈተና አስቀድመው ሰጥተዋል።'
                });
            }

            res.status(500).json({
                error: 'ፈተናውን ማስገባት አልተቻለም።'
            });
        }
    }
);

// ==========================================
// CONTENT
// ==========================================

router.get(
    '/contents',
    authenticate,
    async (req, res) => {
        try {
            const contents =
                await Content.find()
                    .populate('author', 'name email')
                    .sort({ createdAt: -1 });

            res.json(contents);
        } catch (error) {
            res.status(500).json({
                error: error.message
            });
        }
    }
);

router.post(
    '/contents',
    authenticate,
    authorize('teacher', 'admin'),
    async (req, res) => {
        try {
            const {
                title,
                description,
                type
            } = req.body;

            if (!title || !description) {
                return res.status(400).json({
                    error:
                        'Title and description are required.'
                });
            }

            const content =
                await Content.create({
                    title: title.trim(),
                    description: description.trim(),
                    type: type || 'general',
                    author: req.user.id
                });

            res.status(201).json({
                success: true,
                message: 'መረጃው በተሳካ ሁኔታ ተለቋል!',
                content
            });
        } catch (error) {
            res.status(400).json({
                error: error.message
            });
        }
    }
);

// ==========================================
// ADMIN USER CREATION
// ==========================================

router.post(
    '/admin/users',
    authenticate,
    authorize('admin'),
    async (req, res) => {
        try {
            const {
                name,
                email,
                password,
                role
            } = req.body;

            if (!name || !email || !password) {
                return res.status(400).json({
                    error:
                        'Name, email and password are required.'
                });
            }

            if (password.length < 6) {
                return res.status(400).json({
                    error:
                        'Password must contain at least 6 characters.'
                });
            }

            const existing =
                await User.findOne({
                    email: email.toLowerCase().trim()
                });

            if (existing) {
                return res.status(409).json({
                    error:
                        'ይህ ኢሜይል ቀድሞ ተመዝግቧል!'
                });
            }

            const hashed =
                await bcrypt.hash(password, 12);

            const user =
                await User.create({
                    name: name.trim(),
                    email: email.toLowerCase().trim(),
                    password: hashed,
                    role: role || 'student'
                });

            res.status(201).json({
                success: true,
                message: 'ተጠቃሚው ተፈጥሯል!',
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            });
        } catch (error) {
            res.status(400).json({
                error: error.message
            });
        }
    }
);

// ==========================================
// ADMIN STATS
// ==========================================

router.get(
    '/admin/stats',
    authenticate,
    authorize('admin'),
    async (req, res) => {
        try {
            const [
                totalStudents,
                totalTeachers,
                totalHR,
                totalExams,
                totalQuestions
            ] = await Promise.all([
                Student.countDocuments(),
                User.countDocuments({
                    role: 'teacher'
                }),
                User.countDocuments({
                    role: 'hr'
                }),
                Exam.countDocuments(),
                QuestionBank.countDocuments()
            ]);

            res.json({
                totalStudents,
                totalTeachers,
                totalHR,
                totalExams,
                totalQuestions
            });
        } catch (error) {
            res.status(500).json({
                error: error.message
            });
        }
    }
);

// ==========================================
// ADMIN EXAMS
// ==========================================

router.get(
    '/admin/exams',
    authenticate,
    authorize('admin', 'teacher'),
    async (req, res) => {
        try {
            const exams =
                await Exam.find()
                    .sort({ createdAt: -1 });

            res.json(exams);
        } catch (error) {
            res.status(500).json({
                error: error.message
            });
        }
    }
);

router.post(
    '/admin/exams',
    authenticate,
    authorize('admin', 'teacher'),
    async (req, res) => {
        try {
            const {
                title,
                subject,
                examDate,
                resultReleaseDate,
                duration,
                questionLimit,
                passingScore
            } = req.body;

            if (
                !title ||
                !subject ||
                !examDate ||
                !resultReleaseDate ||
                !duration
            ) {
                return res.status(400).json({
                    error:
                        'Please complete all required exam fields.'
                });
            }

            const exam =
                await Exam.create({
                    title,
                    subject,
                    examDate,
                    resultReleaseDate,
                    duration,
                    questionLimit:
                        Number(questionLimit) || 20,
                    passingScore:
                        Number(passingScore) || 50
                });

            res.status(201).json({
                success: true,
                message: 'ፈተናው ተፈጥሯል!',
                exam
            });
        } catch (error) {
            res.status(400).json({
                error: error.message
            });
        }
    }
);

router.put(
    '/admin/exams/:id',
    authenticate,
    authorize('admin', 'teacher'),
    async (req, res) => {
        try {
            const exam =
                await Exam.findByIdAndUpdate(
                    req.params.id,
                    req.body,
                    {
                        new: true,
                        runValidators: true
                    }
                );

            if (!exam) {
                return res.status(404).json({
                    error: 'ፈተናው አልተገኘም!'
                });
            }

            res.json({
                success: true,
                message: 'ፈተናው ተስተካክሏል!',
                exam
            });
        } catch (error) {
            res.status(400).json({
                error: error.message
            });
        }
    }
);

router.delete(
    '/admin/exams/:id',
    authenticate,
    authorize('admin'),
    async (req, res) => {
        try {
            const exam =
                await Exam.findByIdAndDelete(
                    req.params.id
                );

            if (!exam) {
                return res.status(404).json({
                    error: 'ፈተናው አልተገኘም!'
                });
            }

            await ExamSubmission.deleteMany({
                exam: exam._id
            });

            res.json({
                success: true,
                message: 'ፈተናው ተሰርዟል!'
            });
        } catch (error) {
            res.status(500).json({
                error: error.message
            });
        }
    }
);

// ==========================================
// EXCEL USER IMPORT
// ==========================================

router.post(
    '/users/upload-excel',
    authenticate,
    authorize('admin'),
    upload.single('file'),
    async (req, res) => {
        let filePath = null;

        try {
            if (!req.file) {
                return res.status(400).json({
                    error:
                        'እባክዎ Excel ፋይል ይጫኑ!'
                });
            }

            filePath = req.file.path;

            const workbook =
                xlsx.readFile(filePath);

            const sheet =
                workbook.Sheets[
                    workbook.SheetNames[0]
                ];

            const rows =
                xlsx.utils.sheet_to_json(sheet);

            if (!rows.length) {
                return res.status(400).json({
                    error:
                        'የExcel ፋይሉ ባዶ ነው!'
                });
            }

            let created = 0;
            let updated = 0;

            for (const row of rows) {
                if (!row.email) continue;

                const email =
                    String(row.email)
                        .trim()
                        .toLowerCase();

                const password =
                    String(
                        row.password || '123456'
                    );

                const hashed =
                    await bcrypt.hash(
                        password,
                        12
                    );

                const existing =
                    await User.findOne({
                        email
                    });

                if (existing) {
                    existing.name =
                        row.name ||
                        existing.name;

                    existing.password = hashed;

                    existing.role =
                        row.role ||
                        existing.role;

                    await existing.save();

                    updated++;
                } else {
                    await User.create({
                        name:
                            row.name ||
                            'User',
                        email,
                        password: hashed,
                        role:
                            row.role ||
                            'student'
                    });

                    created++;
                }
            }

            res.json({
                success: true,
                message:
                    'Excel import completed.',
                created,
                updated
            });
        } catch (error) {
            console.error(
                'Excel import:',
                error
            );

            res.status(500).json({
                error: error.message
            });
        } finally {
            if (
                filePath &&
                fs.existsSync(filePath)
            ) {
                fs.unlink(
                    filePath,
                    () => {}
                );
            }
        }
    }
);

// ==========================================
// EXPORT
// ==========================================

module.exports = router;
