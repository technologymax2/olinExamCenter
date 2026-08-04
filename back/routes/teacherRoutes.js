const express = require('express');
const router = express.Router();
const Content = require('../models/Content');

// መምህሩ የቤት ስራ፣ አሳይንመንት ወይም መልዕክት የሚለቀው API
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
