const express = require('express');
const router = express.Router();
const User = require('../models/User');
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');

// ፋይል መቀበያ (Multer setup)
const upload = multer({ dest: 'uploads/' });

// 1. በጅምላ ተማሪዎችን መመዝገብ (Bulk Registration via CSV/Excel)
router.post('/bulk-register', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'እባክዎ ፋይል ይምረጡ!' });
  }

  const results = [];
  const filePath = req.file.path;

  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', async () => {
      try {
        let count = 0;
        for (const row of results) {
          // row አወቃቀር: name, email, password, studentId, department, academicYear
          const existing = await User.findOne({ email: row.email });
          if (!existing) {
            const newUser = new User({
              name: row.name,
              email: row.email,
              password: row.password || '123456', // ነባሪ የይለፍ ቃል
              role: 'student',
              studentId: row.studentId,
              department: row.department,
              academicYear: row.academicYear || '1st Year',
              status: row.status || 'Active'
            });
            await newUser.save();
            count++;
          }
        }

        // ፋይሉን ከሰርቨር መሰረዝ
        fs.unlinkSync(filePath);

        res.status(201).json({ 
          message: `በጅምላ ምዝገባው ተጠናቋል! ${count} ተማሪዎች ተመዝግበዋል።` 
        });
      } catch (error) {
        fs.unlinkSync(filePath);
        res.status(500).json({ message: 'በምዝገባ ወቅት ስህተት ተፈጥሯል', error: error.message });
      }
    });
});

// 2. የተማሪዎችን ዝርዝር ማግኘት
router.get('/', async (req, res) => {
  try {
    const students = await User.find({ role: 'student' }).select('-password');
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: 'የሰርቨር ስህተት', error: error.message });
  }
});

module.exports = router;
