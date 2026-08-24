// routes/noticeRoutes.js
const express = require('express');
const router = express.Router();
const Notice = require('../models/Notice');

// ማስታወቂያዎችን ማምጣት
router.get('/', async (req, res) => {
  try {
    const notices = await Notice.find().sort({ createdAt: -1 });
    res.json(notices);
  } catch (error) {
    res.status(500).json({ message: 'የሰርቨር ስህተት', error: error.message });
  }
});

// አዲስ ማስታወቂያ መለጠፍ
router.post('/', async (req, res) => {
  try {
    const { title, content, targetAudience, postedBy, date } = req.body;
    const newNotice = new Notice({
      title,
      content,
      targetAudience,
      postedBy,
      date: date || new Date().toISOString().split('T')[0]
    });
    await newNotice.save();
    res.status(201).json({ message: 'ማስታወቂያው ተለጥፏል!' });
  } catch (error) {
    res.status(500).json({ message: 'የሰርቨር ስህተት', error: error.message });
  }
});

module.exports = router;
