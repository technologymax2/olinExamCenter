const express = require('express');
const router = express.Router();
const xlsx = require('xlsx');
const bcrypt = require('bcryptjs');
const multer = require('multer');

// Configure multer for file upload handling (temporary storage)
const upload = multer({ dest: 'uploads/' });

// Models (Imported using destructuring - Student ተጨምሯል)
const { User, Student, Exam, Content, QuestionBank } = require('./models');

// ==========================================
// USER ROUTES
// ==========================================

// Upload and register users from an Excel file
router.post('/users/upload-excel', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'እባክዎ የኤክሴል ፋይል ይጫኑ!' });
        }

        const workbook = xlsx.readFile(req.file.path);
        const sheetName = workbook.SheetNames[0];
        const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

        if (sheetData.length === 0) {
            return res.status(400).json({ error: 'የኤክሴል ፋይሉ ባዶ ነው!' });
        }

        for (let user of sheetData) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(user.password || '123456', salt);

            await User.findOneAndUpdate(
                { email: user.email },
                {
                    name: user.name,
                    email: user.email,
                    password: hashedPassword,
                    role: user.role || 'student'
                },
                { upsert: true, new: true }
            );
        }

        res.status(200).json({ message: 'ተጠቃሚዎች ከኤክሴል ፋይል ተጭነው ተመዝግበዋል!' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ==========================================
// HR / STUDENT REGISTRATION ROUTES (አዲስ የተጨመረ)
// ==========================================

// 1. ሁሉንም የተመዘገቡ ተማሪዎች ማምጣት (Get All Students)
router.get('/hr/students', async (req, res) => {
    try {
        const students = await Student.find().sort({ createdAt: -1 });
        res.status(200).json(students);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. አዲስ ተማሪ መዝግብ (Register Student)
router.post('/hr/students', async (req, res) => {
    try {
        const studentData = req.body;
        
        const existingStudent = await Student.findOne({ studentIdNumber: studentData.studentIdNumber });
        if (existingStudent) {
            return res.status(400).json({ error: 'ይህ የመታወቂያ ቁጥር ቀድሞ ተመዝግቧል!' });
        }

        const newStudent = new Student(studentData);
        await newStudent.save();

        res.status(201).json({ message: 'ተማሪው በተሳካ ሁኔታ ተመዝግቧል!', student: newStudent });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// 3. የተማሪን መረጃ ማስተካከል (Update Student)
router.put('/hr/students/:id', async (req, res) => {
    try {
        const updatedStudent = await Student.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!updatedStudent) {
            return res.status(404).json({ error: 'ተማሪው አልተገኘም!' });
        }

        res.status(200).json({ message: 'የተማሪው መረጃ በተሳካ ሁኔታ ተሻሽሏል!', student: updatedStudent });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 4. ተማሪን ከሲስተም መሰረዝ (Delete Student)
router.delete('/hr/students/:id', async (req, res) => {
    try {
        const deletedStudent = await Student.findByIdAndDelete(req.params.id);
        if (!deletedStudent) {
            return res.status(404).json({ error: 'ተማሪው አልተገኘም!' });
        }
        res.status(200).json({ message: 'ተማሪው በተሳካ ሁኔታ ተሰርዟል!' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 5. ለ QR ማረጋገጫ (Verify Student ID)
router.get('/students/verify/:id', async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) {
            return res.status(404).json({ error: 'የተማሪው መታወቂያ ትክክል አይደለም ወይም አልተገኘም!' });
        }
        res.status(200).json({ message: 'ታማኝ እና የተረጋገጠ ተማሪ ነው', student });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ==========================================
// PASSWORD MANAGEMENT ROUTES
// ==========================================

router.put('/users/change-password', async (req, res) => {
    try {
        const { email, oldPassword, newPassword } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: 'ተጠቃሚው አልተገኘም!' });
        }

        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'የድሮው የይለፍ ቃል ስህተት ነው!' });
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();

        res.status(200).json({ message: 'የይለፍ ቃልዎ በተሳካ ሁኔታ ተቀይሯል!' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/users/request-password-reset', async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: 'ይህ ኢሜይል በሲስተሙ ውስጥ አልተገኘም!' });
        }

        user.resetRequested = true;
        await user.save();

        res.status(200).json({ message: 'የፓስወርድ መቀየሪያ ጥያቄዎ ለአድሚን ተልኳል!' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/admin/approve-password-reset', async (req, res) => {
    try {
        const { email, hoursValid = 1 } = req.body; 
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: 'ተጠቃሚው አልተገኘም!' });
        }

        const expireTime = new Date();
        expireTime.setHours(expireTime.getHours() + Number(hoursValid));

        user.resetRequested = false;
        user.resetTokenExpire = expireTime;
        await user.save();

        res.status(200).json({ message: `ጥያቄው ጸድቋል! ተጠቃሚው እስከ ${expireTime.toLocaleString()} ድረስ መቀየር ይችላል።` });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/users/reset-password-with-approval', async (req, res) => {
    try {
        const { email, newPassword } = req.body;
        const user = await User.findOne({ email });

        if (!user || !user.resetTokenExpire) {
            return res.status(400).json({ error: 'ከአድሚን የተፈቀደ የፓስወርድ መቀየሪያ ፈቃድ የለዎትም!' });
        }

        if (new Date() > new Date(user.resetTokenExpire)) {
            return res.status(400).json({ error: 'የተሰጠዎት የሰዓት ገደብ (Time Limit) አልፏል! እባክዎ እንደገና ለአድሚን ጥያቄ ይላኩ።' });
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        user.resetTokenExpire = null; 
        await user.save();

        res.status(200).json({ message: 'አዲሱ የይለፍ ቃልዎ በተሳካ ሁኔታ ተቀይሯል!' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ==========================================
// QUESTION BANK ROUTES
// ==========================================

router.get('/admin/question-bank', async (req, res) => {
    try {
        const questions = await QuestionBank.find().sort({ createdAt: -1 });
        res.status(200).json(questions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/admin/question-bank/add', async (req, res) => {
    try {
        const { subject, questionText, optionA, optionB, optionC, optionD, correctAnswer, explanation } = req.body;
        
        if (!questionText || !optionA || !optionB) {
            return res.status(400).json({ error: 'እባክዎ ጥያቄውን እና ቢያንስ A እና B አማራጮችን ይሙሉ!' });
        }

        const newQuestion = new QuestionBank({
            subject: subject || 'General',
            questionText,
            optionA,
            optionB,
            optionC,
            optionD,
            correctAnswer: correctAnswer || 'A',
            explanation
        });

        await newQuestion.save();
        res.status(201).json({ message: 'ጥያቄው ወደ ፈተና ባንክ ተመዝግቧል!' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/admin/question-bank/bulk-add', async (req, res) => {
  try {
    const { questions, rawText, subject } = req.body;
    let parsedQuestions = [];

    if (questions && Array.isArray(questions)) {
      parsedQuestions = questions;
    } else if (rawText) {
      let cleanedText = rawText
        .replace(/🎓[^\n]*/g, '')         
        .replace(/advertisement/gi, '')         
        .replace(/View\s*Answer/gi, '')         
        .replace(/FoodAnswer:/gi, 'Answer:');     

      const blocks = cleanedText
        .split(/(?=\b\d+[\.\)]\s)/)
        .filter(b => b.trim().length > 0);

      for (let block of blocks) {
        try {
          const lines = block.split('\n').map(l => l.trim()).filter(Boolean);
          if (lines.length === 0) continue;

          let questionText = lines[0].replace(/^\d+[\.\)]\s*/, '');
          let optA = '', optB = '', optC = '', optD = '';
          let correctAnswer = 'A';
          let explanation = '';

          for (let i = 1; i < lines.length; i++) {
            const line = lines[i];
            if (line.toLowerCase().startsWith('a)')) optA = line.replace(/^a\)\s*/i, '');
            else if (line.toLowerCase().startsWith('b)')) optB = line.replace(/^b\)\s*/i, '');
            else if (line.toLowerCase().startsWith('c)')) optC = line.replace(/^c\)\s*/i, '');
            else if (line.toLowerCase().startsWith('d)')) optD = line.replace(/^d\)\s*/i, '');
            else if (line.toLowerCase().startsWith('answer:')) {
              const match = line.match(/answer:\s*([a-d])/i);
              if (match) correctAnswer = match[1].toUpperCase();
            } else if (line.toLowerCase().startsWith('explanation:')) {
              explanation = line.replace(/^explanation:\s*/i, '');
            } else if (explanation) {
              explanation += ' ' + line;
            }
          }

          if (questionText && optA && optB) {
            parsedQuestions.push({
              subject: subject || 'General',
              questionText,
              optionA: optA,
              optionB: optB,
              optionC: optC,
              optionD: optD,
              correctAnswer,
              explanation
            });
          }
        } catch (err) {
          console.error('Parsing error on single question block:', err);
        }
      }
    }

    if (parsedQuestions.length === 0) {
      return res.status(400).json({ error: 'ምንም ጥያቄ መለየት አልተቻለም። እባክዎ የፅሁፉን ቅርጸት ያረጋግጡ።' });
    }

    await QuestionBank.insertMany(parsedQuestions);

    res.status(200).json({
      message: `${parsedQuestions.length} ጥያቄዎች በተሳካ ሁኔታ ተለይተው ወደ ፈተና ባንክ ተመዝግበዋል!`,
      count: parsedQuestions.length
    });

  } catch (err) {
    console.error('Bulk Parse Error:', err);
    res.status(500).json({ error: 'ጥያቄዎችን በመጫን ላይ የሲስተም ስህተት ተፈጥሯል' });
  }
});

// ==========================================
// EXAM & CONTENT ROUTES
// ==========================================

router.get('/exams', async (req, res) => {
    try {
        const exams = await Exam.find({}, 'title subject examDate resultReleaseDate duration');
        res.json(exams);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/contents', async (req, res) => {
    try {
        const contents = await Content.find().sort({ createdAt: -1 });
        res.json(contents);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/contents', async (req, res) => {
    try {
        const { title, description, type } = req.body;
        const newContent = new Content({ title, description, type });
        await newContent.save();
        res.status(201).json({ message: 'መረጃው በተሳካ ሁኔታ ተለቋል!' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// ==========================================
// ADMIN STATS & MANAGEMENT ROUTES
// ==========================================

router.get('/admin/stats', async (req, res) => {
    try {
        const totalStudents = await Student.countDocuments(); // ከStudent ስኪማ የሚቆጠር ይሆናል
        const totalTeachers = await User.countDocuments({ role: 'teacher' });
        const totalExams = await Exam.countDocuments();
        
        res.status(200).json({ totalStudents, totalTeachers, totalExams });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/admin/users', async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password || '123456', salt);

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            role: role || 'student'
        });

        await newUser.save();
        res.status(201).json({ message: 'ተጠቃሚው ተመዝግቧል!' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.post('/admin/exams', async (req, res) => {
    try {
        const { title, subject, examDate, resultReleaseDate, duration } = req.body;

        const newExam = new Exam({
            title,
            subject,
            examDate,
            resultReleaseDate,
            duration
        });

        await newExam.save();
        res.status(201).json({ message: 'ፈተናው እና ቀናቱ ተይዘዋል!' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// ==========================================
// LOGIN ROUTE (Updated to support 'hr' role)
// ==========================================
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'ኢሜይል ወይም የይለፍ ቃል ስህተት ነው!' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'ኢሜይል ወይም የይለፍ ቃል ስህተት ነው!' });
        }

        res.status(200).json({
            message: 'በተሳካ ሁኔታ ገብተዋል!',
            token: user._id, 
            role: user.role, // 'admin', 'teacher', 'student', or 'hr'
            name: user.name,
            email: user.email
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/register-admin', async (req, res) => {
    try {
        const email = 'admin@max.com';
        const password = 'adminpassword123';
        const name = 'ማክ ዋና አድሚን';

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'ይህ አድሚን ቀድሞ ተመዝግቧል!' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newAdmin = new User({
            name,
            email,
            password: hashedPassword,
            role: 'admin'
        });

        await newAdmin.save();
        res.status(201).json({ 
            message: 'አድሚኑ በተሳካ ሁኔታ ተፈጥሯል!',
            email: email,
            password: password 
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/admin/change-password', async (req, res) => {
    try {
        const { email, newPassword } = req.body;

        const user = await User.findOne({ email, role: 'admin' });
        if (!user) {
            return res.status(404).json({ error: 'አድሚኑ አልተገኘም!' });
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();

        res.status(200).json({ message: 'የአድሚኑ የይለፍ ቃል በተሳካ ሁኔታ ተቀይሯል!' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/exams/:id', async (req, res) => {
    try {
        const exam = await Exam.findById(req.params.id);
        if (!exam) return res.status(404).json({ error: 'ፈተናው አልተገኘም' });

        const questions = await QuestionBank.find({ subject: exam.subject }).limit(20); 
        
        res.json({ exam, questions });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/exams/:id/submit', async (req, res) => {
    try {
        const { answers } = req.body; 
        let score = 0;
        let total = Object.keys(answers).length;

        for (let qId in answers) {
            const question = await QuestionBank.findById(qId);
            if (question && question.correctAnswer === answers[qId]) {
                score++;
            }
        }

        const percentage = total > 0 ? Math.round((score / total) * 100) : 0;

        res.status(200).json({ 
            message: 'ፈተናው ተጠናቋል',
            score: percentage,
            correctCount: score,
            totalQuestions: total
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});      

// ==========================================
// QUESTION BANK DELETE ROUTES
// ==========================================

router.delete('/admin/question-bank/all', async (req, res) => {
  try {
    await QuestionBank.deleteMany({});
    res.status(200).json({ message: 'ሁሉም ጥያቄዎች በተሳካ ሁኔታ ተሰርዘዋል!' });
  } catch (err) {
    res.status(500).json({ error: 'ሁሉንም ጥያቄዎች በመሰረዝ ላይ ስህተት ተፈጥሯል' });
  }
});

router.delete('/admin/question-bank/subject/:subject', async (req, res) => {
  try {
    const subjectName = decodeURIComponent(req.params.subject);
    
    const result = await QuestionBank.deleteMany({ 
      subject: { $regex: new RegExp(`^${subjectName}$`, 'i') } 
    });

    res.status(200).json({ 
      message: `የ "${subjectName}" ትምህርት ጥያቄዎች በሙሉ ተሰርዘዋል!`,
      deletedCount: result.deletedCount 
    });
  } catch (err) {
    console.error('Error deleting questions by subject:', err);
    res.status(500).json({ error: 'ጥያቄዎችን በመሰረዝ ላይ ስህተት ተፈጥሯል' });
  }
});

router.delete('/admin/question-bank/:id', async (req, res) => {
  try {
    const deletedQuestion = await QuestionBank.findByIdAndDelete(req.params.id);
    if (!deletedQuestion) {
      return res.status(404).json({ error: 'ጥያቄው አልተገኘም!' });
    }
    res.status(200).json({ message: 'ጥያቄው በተሳካ ሁኔታ ተሰርዟል!' });
  } catch (err) {
    res.status(500).json({ error: 'ጥያቄውን በመሰረዝ ላይ ስህተት ተፈጥሯል' });
  }
});

// ==========================================
// EXAM MANAGEMENT ROUTES
// ==========================================

router.get('/admin/exams', async (req, res) => {
    try {
        const exams = await Exam.find().sort({ createdAt: -1 });
        res.status(200).json(exams);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/admin/exams/:id', async (req, res) => {
    try {
        const { title, subject, examDate, resultReleaseDate, duration } = req.body;
        
        const updatedExam = await Exam.findByIdAndUpdate(
            req.params.id,
            { title, subject, examDate, resultReleaseDate, duration },
            { new: true }
        );

        if (!updatedExam) {
            return res.status(404).json({ error: 'ፈተናው አልተገኘም!' });
        }

        res.status(200).json({ message: 'ፈተናው በተሳካ ሁኔታ ተስተካክሏል!', updatedExam });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete('/admin/exams/:id', async (req, res) => {
    try {
        const deletedExam = await Exam.findByIdAndDelete(req.params.id);
        if (!deletedExam) {
            return res.status(404).json({ error: 'ፈተናው አልተገኘም!' });
        }
        res.status(200).json({ message: 'ፈተናው በተሳካ ሁኔታ ተሰርዟል!' });
    } catch (err)  {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
