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
// PASSWORD MANAGEMENT ROUTES (Student, Teacher & Admin)
// ==========================================

// 1. የድሮውን ፓስወርድ በማስገባት መቀየር (ለ ተማሪ/መምህር)
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

// 2. ፓስወርድ ሲረሳ ለአድሚን ጥያቄ መላክ
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

// 3. አድሚኑ ጥያቄውን ማጽደቅ እና የሰዓት ገደብ (Time Limit በሰዓት) መስጠት
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

// 4. አድሚኑ በፈቀደው የሰዓት ገደብ ውስጥ አዲስ ፓስወርድ ማስተካከል
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
// EXAM ROUTES
// ==========================================
router.get('/exams', async (req, res) => {
    try {
        const exams = await Exam.find({}, 'title subject examDate resultReleaseDate duration');
        res.json(exams);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ==========================================
// CONTENT ROUTES
// ==========================================
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
        const totalStudents = await User.countDocuments({ role: 'student' });
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
// LOGIN ROUTE (Updated to return 'token')
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
            token: user._id, // Frontend የProtected Route ማረጋገጫ እንዲኖረው ቶከን ተካቷል
            role: user.role,
            name: user.name,
            email: user.email
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ==========================================
// TEMPORARY REGISTER ROUTE (GET)
// ==========================================
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

module.exports = router;
