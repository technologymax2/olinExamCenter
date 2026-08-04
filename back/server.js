const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // የ .env ፋይል ማንበቢያ
const studentRoutes = require('./routes/studentRoutes');
app.use('/api/student', studentRoutes);

const app = express();
app.use(express.json());
app.use(cors());

// ከ MongoDB Atlas ጋር መገናኘት (ከ .env የተወሰደው URI)
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB Atlas Successfully Connected!'))
  .catch(err => console.log('Database Connection Error:', err));

// የአድሚን ሮውቶችን ማስገባት
const adminRoutes = require('./routes/adminRoutes');
app.use('/api/admin', adminRoutes);

// ሰርቨሩን ማስጀመር
app.listen(PORT, () => {
    console.log(`Max Technology Server is running on port ${PORT}`);
});
