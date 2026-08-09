const express = require('express');
const router = express.Router();
const xlsx = require('xlsx');
const bcrypt = require('bcryptjs');
const multer = require('multer');

// Configure multer for file upload handling (temporary storage)
const upload = multer({ dest: 'uploads/' });

// Models (Imported using destructuring)
const { User, Exam, Content } = require('./models');

// ==========================================
// USER ROUTES
// ==========================================

// Upload and register users from an Excel file
router.post('/users/upload-excel', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'እባክዎ የኤክሴል ፋይል ይጫኑ!' });
        }

        // Read Excel file
        const workbook = xlsx.readFile(req.file.path);
        const sheetName = workbook.SheetNames[0];
        const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

        if (sheetData.length === 0) {
            return res.status(400).json({ error: 'የኤክሴል ፋይሉ ባዶ ነው!' });
        }

        // Process records, hash passwords, and save to database
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
// EXAM ROUTES
// ==========================================

// Get available exams for students
router.get('/exams', async (req, res) => {
    try {
        const exams = await Exam.find({}, 'title subject examDate resultReleaseDate duration');
        res.json(exams);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ==========================================
// CONTENT ROUTES (Homework, Assignments, Messages)
// ==========================================

// Get all contents/homework/messages
router.get('/contents', async (req, res) => {
    try {
        const contents = await Content.find().sort({ createdAt: -1 });
        res.json(contents);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Post a new homework, assignment, or message (Teacher route)
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

// Get admin stats (total students, teachers, exams)
router.get('/admin/stats', async (req, res) => {
    try {
        const totalStudents = await User.countDocuments({ role: 'student' });
        const totalTeachers = await User.countDocuments({ role: 'teacher' });
        const totalExams = await Exam.countDocuments();
        
        res.status(200).json({ totalStudents, totalTeachers, totalExams });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Register a single user (Student, Teacher, or Admin)
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

// Create/Schedule an exam
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
// LOGIN ROUTE
// ==========================================
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // ተጠቃሚውን በኢሜይል መፈለግ
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'ኢሜይል ወይም የይለፍ ቃል ስህተት ነው!' });
        }

        // ፓስወርዱን ማመሳከር
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'ኢሜይል ወይም የይለፍ ቃል ስህተት ነው!' });
        }

        // እንደ ሮላቸው (Role) መረጃ መመለስ
        res.status(200).json({
            message: 'በተሳካ ሁኔታ ገብተዋል!',
            role: user.role,
            name: user.name,
            email: user.email
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// ==========================================
// TEMPORARY REGISTER ROUTE (ለአድሚን መመዝገቢያ)
// ==========================================
router.post('/register-admin', async (req, res) => {
    try {
        const { name, email, password, secretKey } = req.body;
        
        // ደህንነትን ለመጠበቅ ሚስጥራዊ ቁጥር መጠቀም (ማንኛውም ሰው እንዳይመዘገብ)
        if (secretKey !== 'MaxTech2026Secure!') {
            return res.status(403).json({ error: 'ሚስጥራዊ ቁጥሩ ስህተት ነው!' });
        }

        // ዩዘሩ ቀድሞ መኖሩን ማረጋገጥ
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'ይህ ኢሜይል ቀድሞ ተመዝግቧል!' });
        }

        // ፓስወርዱን ማቀናበር (Hashing)
        const hashedPassword = await bcrypt.hash(password, 10);

        // አዲሱን አድሚን መፍጠር
        const newAdmin = new User({
            name,
            email,
            password: hashedPassword,
            role: 'admin' // ሮሉን አድሚን እናደርገዋለን
        });

        await newAdmin.save();
        res.status(201).json({ message: 'አድሚኑ በተሳካ ሁኔታ ተፈጥሯል!' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// ==========================================
// TEMPORARY REGISTER ROUTE (በ GET የተስተካከለ)
// ==========================================
router.get('/register-admin', async (req, res) => {
    try {
        const email = 'admin@max.com';
        const password = 'adminpassword123';
        const name = 'ማክ ዋና አድሚን';

        // አድሚኑ ቀድሞ መኖሩን ማረጋገጥ
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'ይህ አድሚን ቀድሞ ተመዝግቧል!' });
        }

        // ፓስወርዱን ማቀናበር (Hashing)
        const hashedPassword = await bcrypt.hash(password, 10);

        // አዲሱን አድሚን መፍጠር
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

// ==========================================
// ADMIN PASSWORD CHANGE ROUTE
// ==========================================
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
// ሁልጊዜ ማስተላለፊያው (module.exports) ከፋይሉ መጨረሻ ላይ መሆን አለበት
module.exports = router;
