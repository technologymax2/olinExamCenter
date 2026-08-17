const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

const PORT = process.env.PORT || 10000;
const MONGO_URI = process.env.MONGO_URI;

// ==========================================
// CORS CONFIGURATION
// ==========================================

const allowedOrigins = [
    'https://olin-exam-center.vercel.app',
    'http://localhost:3000',
    'http://localhost:3001'
];

app.use(cors({
    origin: function (origin, callback) {

        // Allow requests without origin
        // Example: Postman, Render health checks
        if (!origin) {
            return callback(null, true);
        }

        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        console.log('Blocked CORS origin:', origin);

        return callback(
            new Error('Not allowed by CORS')
        );
    },

    methods: [
        'GET',
        'POST',
        'PUT',
        'DELETE',
        'PATCH',
        'OPTIONS'
    ],

    allowedHeaders: [
        'Content-Type',
        'Authorization'
    ],

    credentials: true
}));

// Handle preflight requests
app.options('*', cors());

// ==========================================
// BODY PARSER
// ==========================================

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({
    extended: true,
    limit: '10mb'
}));

// ==========================================
// HEALTH CHECK
// ==========================================

app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Olin Exam Center API is running',
        database: mongoose.connection.readyState === 1
            ? 'connected'
            : 'disconnected'
    });
});

// ==========================================
// MONGODB CONNECTION
// ==========================================

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('==========================================');
        console.log('MongoDB Atlas Successfully Connected!');
        console.log('==========================================');
    })
    .catch((err) => {
        console.error('MongoDB Connection Error:', err);
    });

// ==========================================
// ROUTES
// ==========================================

const mainRoutes = require('./routes');

app.use('/api', mainRoutes);

// ==========================================
// 404 HANDLER
// ==========================================

app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'API endpoint not found',
        path: req.originalUrl
    });
});

// ==========================================
// GLOBAL ERROR HANDLER
// ==========================================

app.use((err, req, res, next) => {
    console.error('Server Error:', err);

    if (err.message === 'Not allowed by CORS') {
        return res.status(403).json({
            success: false,
            error: 'CORS origin not allowed'
        });
    }

    res.status(500).json({
        success: false,
        error: 'Internal server error'
    });
});

// ==========================================
// START SERVER
// ==========================================

app.listen(PORT, () => {
    console.log('==========================================');
    console.log(`Olin Exam Center Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'production'}`);
    console.log('==========================================');
});
