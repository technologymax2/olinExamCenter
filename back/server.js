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
const mainRoutes = require('./routes');
app.use('/api', mainRoutes);

// ሰርቨሩን ማስጀመር
app.listen(PORT, () => {
    console.log(`Max Technology Server is running on port ${PORT}`);
});
