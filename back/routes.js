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

module.exports = router;
