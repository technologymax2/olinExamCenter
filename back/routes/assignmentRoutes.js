const express = require('express');
const router = express.Router();
const Assignment = require('../models/Assignment');

// 1. አሳይመንት መፍጠር (ለሰርቨር ማስገባት)
router.post('/', async (req, res) => {
  try {
    const { title, course, teacher, description, dueDate } = req.body;
    const newAssignment = new Assignment({
      title,
      course,
      teacher,
      description,
      dueDate
    });
    await newAssignment.save();
    res.status(201).json({ message: 'አሳይመንቱ በተሳካ ሁኔታ ተለጥፏል!' });
  } catch (error) {
    res.status(500).json({ message: 'የሰርቨር ስህተት', error: error.message });
  }
});

// 2. ሁሉንም አሳይመንቶች ማምጣት
router.get('/', async (req, res) => {
  try {
    const assignments = await Assignment.find().sort({ createdAt: -1 });
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ message: 'የሰርቨር ስህተት', error: error.message });
  }
});

// 3. አሳይመንት ማስረከብ (Student Submission)
router.post('/:id/submit', async (req, res) => {
  try {
    const { studentId, fileUrl } = req.body;
    const assignment = await Assignment.findById(req.params.id);
    
    if (!assignment) {
      return res.status(404).json({ message: 'አሳይመንቱ አልተገኘም!' });
    }

    assignment.submissions.push({ studentId, fileUrl });
    await assignment.save();

    res.json({ message: 'አሳይመንቱ በተሳካ ሁኔታ ተልኳል!' });
  } catch (error) {
    res.status(500).json({ message: 'የሰርቨር ስህተት', error: error.message });
  }
});

module.exports = router;
