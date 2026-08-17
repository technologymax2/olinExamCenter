const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// ==========================================
// CONFIG
// ==========================================

const PORT = process.env.PORT || 10000;

const MONGO_URI = process.env.MONGO_URI;

const CLIENT_URL =
    process.env.CLIENT_URL ||
    'http://localhost:3000';

// ==========================================
// SECURITY / MIDDLEWARE
// ==========================================

app.disable('x-powered-by');

app.use(
    cors({
        origin: function (origin, callback) {
            // Allow requests without origin
            // such as Postman/server-to-server
            if (!origin) {
                return callback(null, true);
            }

            const allowedOrigins = [
                CLIENT_URL,
                'http://localhost:3000'
            ];

            if (allowedOrigins.includes(origin)) {
                return callback(null, true);
            }

            return callback(
                new Error('CORS policy: Origin not allowed')
            );
        },
        credentials: true
    })
);

app.use(
    express.json({
        limit: '2mb'
    })
);

app.use(
    express.urlencoded({
        extended: true,
        limit: '2mb'
    })
);

// ==========================================
// HEALTH CHECK
// ==========================================

app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Max Technology Olin Exam Center API',
        status: 'running',
        timestamp: new Date().toISOString()
    });
});

app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        database:
            mongoose.connection.readyState === 1
                ? 'connected'
                : 'disconnected'
    });
});

// ==========================================
// STATIC UPLOADS
// ==========================================

app.use(
    '/uploads',
    express.static(path.join(__dirname, 'uploads'))
);

// ==========================================
// DATABASE
// ==========================================

if (!MONGO_URI) {
    console.error(
        'ERROR: MONGO_URI is missing from environment variables.'
    );
} else {
    mongoose
        .connect(MONGO_URI)
        .then(() => {
            console.log(
                'MongoDB Atlas Successfully Connected!'
            );
        })
        .catch((error) => {
            console.error(
                'MongoDB Connection Error:',
                error.message
            );
        });
}

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
        error: 'API endpoint not found.'
    });
});

// ==========================================
// GLOBAL ERROR HANDLER
// ==========================================

app.use((err, req, res, next) => {
    console.error('Global server error:', err);

    if (err.message?.includes('CORS')) {
        return res.status(403).json({
            error: 'CORS request rejected.'
        });
    }

    res.status(500).json({
        error: 'Internal server error.'
    });
});

// ==========================================
// START SERVER
// ==========================================

app.listen(PORT, () => {
    console.log(
        `Max Technology Server is running on port ${PORT}`
    );
});
