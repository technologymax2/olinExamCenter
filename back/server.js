const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // የ .env ፋይል ማንበቢያ

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// ከ MongoDB Atlas ጋር መገናኘት (ከ .env የተወሰደው URI)
const PORT = process.env.PORT || 10000;
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB Atlas Successfully Connected!'))
  .catch(err => console.log('Database Connection Error:', err));

// --- ሮውቶችን (Routes) ማገናኘት ---

// 1. የአድሚን ሮውቶች (ተማሪ/መምህር መመዝገቢያ፣ ስታቲስቲክስ እና የፈተና መርሐ-ግብር)
const adminRoutes = require('./routes/adminRoutes');
app.use('/api/admin', adminRoutes);

// 2. የተማሪ ሮውቶች (ፈተናዎች፣ የቤት ስራዎች እና መልዕክቶች ማያ)
const studentRoutes = require('./routes/studentRoutes');
app.use('/api/student', studentRoutes);

// 3. የመምህር ሮውቶች (የቤት ስራ እና መልዕክቶች መለቀቂያ)
// (ማስታወሻ: የ teacherRoutes ፋይል ከፈጠሩ እዚህ ጋር ማገናኘት ይችላሉ)
const teacherRoutes = require('./routes/teacherRoutes');
app.use('/api/teacher', teacherRoutes);

// ሰርቨሩን ማስጀመር
app.listen(PORT, () => {
    console.log(`Max Technology Server is running on port ${PORT}`);
});
