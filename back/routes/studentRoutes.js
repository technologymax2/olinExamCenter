const express = require('express');
const router = express.Router();

const Exam = require('../models/Exam');
const Content = require('../models/Content'); // የቤት ስራ እና መልዕክቶች ሞዴል

// 1. ተማሪዎች ሊወስዷቸው የሚችሏቸውን ፈተናዎች ማምጫ
router.get('/exams', async (req, res) => {
    try {
        const exams = await Exam.find({}, 'title subject examDate resultReleaseDate duration');
        res.json(exams);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. ተማሪዎች የቤት ስራዎችን፣ አሳይንመንቶችን እና መልዕክቶችን የሚያዩበት API
router.get('/contents', async (req, res) => {
    try {
        const contents = await Content.find().sort({ createdAt: -1 });
        res.json(contents);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
