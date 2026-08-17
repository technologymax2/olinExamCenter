const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

const PORT = process.env.PORT || 10000;
const MONGO_URI = process.env.MONGO_URI;

// ==========================================
// CORS
// ==========================================

const allowedOrigins = [
    'https://olin-exam-center.vercel.app',
    'http://localhost:3000',
    'http://localhost:3001'
];

app.use(
    cors({
        origin: function (origin, callback) {
            // Allow requests without origin
            // such as Postman/server-to-server
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
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: [
            'Content-Type',
            'Authorization'
        ]
    })
);

// Explicit preflight
app.options('*', cors());

// ==========================================
// BODY PARSERS
// ==========================================

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ==========================================
// HEALTH CHECK
// ==========================================

app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Olin Exam Center API is running',
        status: 'online'
    });
});

app.get('/api/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'API is healthy'
    });
});

// ==========================================
// MONGODB
// ==========================================

mongoose
    .connect(MONGO_URI)
    .then(() => {
        console.log('MongoDB Atlas Successfully Connected!');
    })
    .catch((err) => {
        console.error(
            'Database Connection Error:',
            err.message
        );
    });

// ==========================================
// ROUTES
// ==========================================

const mainRoutes = require('./routes');

app.use('/api', mainRoutes);

// ==========================================
// 404
// ==========================================

app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'API endpoint not found',
        path: req.originalUrl
    });
});

// ==========================================
// ERROR HANDLER
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
    console.log(
        `Olin Exam Center Server running on port ${PORT}`
    );
});
