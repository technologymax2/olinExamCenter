const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// 1. መመዝገቢያ (Register)
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, studentId, department, academicYear } = req.body;

    // ኢሜል መኖሩን ማረጋገጥ
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'ይህ ኢሜል አስቀድሞ ተመዝግቧል!' });
    }

    // የይለፍ ቃል ማቀዝቀዝ (Hashing)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
      studentId,
      department,
      academicYear
    });

    await newUser.save();
    res.status(201).json({ message: 'ተጠቃሚው በተሳካ ሁኔታ ተመዝግቧል!' });
  } catch (error) {
    res.status(500).json({ message: 'የሰርቨር ስህተት ተፈጥሯል', error: error.message });
  }
});

// 2. መግቢያ (Login)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'ኢሜል ወይም የይለፍ ቃል ስህተት ነው!' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'ኢሜል ወይም የይለፍ ቃል ስህተት ነው!' });
    }

    // ቶከን ማመንጨት (JWT Token)
    const token = jwt.sign(
      { id: user._id, role: user.role }, 
      process.env.JWT_SECRET || 'secret_key_college', 
      { expiresIn: '1d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        studentId: user.studentId,
        department: user.department,
        status: user.status
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'የሰርቨር ስህተት ተፈጥሯል', error: error.message });
  }
});

module.exports = router;
