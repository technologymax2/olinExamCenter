const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// የዳታቤዝ ትስስር (MongoDB Connection)
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/college_system';

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB ከኮሌጅ ሲስተም ጋር ተሳክቶ ተገናኝቷል!'))
.catch((err) => console.error('❌ የዳታቤዝ ትስስር ስህተት:', err));

// መነሻ ሩት (Test Route)
app.get('/', (req, res) => {
  res.send('ኮሌጅ ሲስተም ባክኤንድ ኤፒአይ በስራ ላይ ነው...');
});

// የኤፒአይ ሩቶች (Routes)
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/students', require('./routes/studentRoutes'));
app.use('/api/assignments', require('./routes/assignmentRoutes'));
app.use('/api/notices', require('./routes/noticeRoutes'));

// ሰርቨሩን ማስጀመር
app.listen(PORT, () => {
  console.log(`🚀 ሰርቨሩ በፖርት ${PORT} ላይ እየሰራ ነው...`);
});
