const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// ==========================================
// CONFIGURATION
// ==========================================

const PORT = process.env.PORT || 10000;
const MONGO_URI = process.env.MONGO_URI;

const allowedOrigins = [
    'https://olin-exam-center.vercel.app',
    'http://localhost:3000',
    'http://localhost:3001'
];

// ==========================================
// CORS
// ==========================================

app.use(cors({
    origin: function (origin, callback) {

        // Allow requests without an origin
        // such as Postman/server-to-server requests
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

    credentials: true,

    optionsSuccessStatus: 204
}));

// Explicitly handle preflight requests
app.options('*', cors());

// ==========================================
// BODY PARSERS
// ==========================================

app.use(express.json({
    limit: '10mb'
}));

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
        message: 'Max Technology Olin Exam Center API is running.',
        status: 'online'
    });
});

app.get('/api/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'API is healthy',
        database:
            mongoose.connection.readyState === 1
                ? 'connected'
                : 'disconnected'
    });
});

// ==========================================
// DATABASE
// ==========================================

if (!MONGO_URI) {
    console.error('❌ MONGO_URI is missing.');
    process.exit(1);
}

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('✅ MongoDB Atlas Successfully Connected!');
    })
    .catch((err) => {
        console.error(
            '❌ Database Connection Error:',
            err.message
        );

        process.exit(1);
    });

// ==========================================
// API ROUTES
// ==========================================

const mainRoutes = require('./routes');

app.use('/api', mainRoutes);

// ==========================================
// 404
// ==========================================

app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'API endpoint not found.'
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
            error: 'CORS origin not allowed.'
        });
    }

    res.status(err.status || 500).json({
        success: false,
        error: err.message || 'Internal server error.'
    });
});

// ==========================================
// START SERVER
// ==========================================

app.listen(PORT, () => {
    console.log(
        `🚀 Max Technology Server is running on port ${PORT}`
    );
});
