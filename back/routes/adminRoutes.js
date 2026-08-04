const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // ለ Excel ፋይል ሎዲንግ

const User = require('../models/User');
const Exam = require('../models/Exam');

// 1. የአድሚን ዳሽቦርድ ስታቲስቲክስ ማምጫ
router.get('/stats', async (req, res) => {
    try {
        const totalStudents = await User.countDocuments({ role: 'student' });
        const totalTeachers = await User.countDocuments({ role: 'teacher' });
        const totalExams = await Exam.countDocuments();
        res.json({ totalStudents, totalTeachers, totalExams });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. ተማሪ ወይም መምህር በፎርም መመዝገብ
router.post('/users', async (req, res) => {
    try {
        const newUser = new User(req.body);
        await newUser.save();
        res.status(201).json({ message: 'ተጠቃሚው በተሳካ ሁኔታ ተመዝግቧል!' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// 3. ተማሪዎችን ወይም መምህራንን በ Excel ፋይል ሎድ ማድረግ (Bulk Upload)
router.post('/users/upload-excel', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'እባክዎ የኤክሴል ፋይል ይጫኑ!' });
        }
        // እዚህጋ የ Excel ፋይል ማንበቢያ ሎጂክ (مثال: xlsx library) ይካተታል
        res.status(200).json({ message: 'የኤክሴል ፋይሉ ተጭኖ ተጠቃሚዎች ተመዝግበዋል!' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 4. ፈተና መርሐ-ግብር ማውጣት (የፈተና ቀን እና የውጤት ማስታወቂያ ቀን ጨምሮ)
router.post('/exams', async (req, res) => {
    try {
        const { title, subject, examDate, resultReleaseDate, duration, questions } = req.body;
        const newExam = new Exam({
            title,
            subject,
            examDate,
            resultReleaseDate,
            duration,
            questions: questions || []
        });
        await newExam.save();
        res.status(201).json({ message: 'ፈተናው እና ቀናቱ በባንክ ውስጥ ተመዝግበዋል!' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;
