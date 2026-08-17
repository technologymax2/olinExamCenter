const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

const PORT = process.env.PORT || 10000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
    console.error('❌ MONGO_URI is missing from .env');
    process.exit(1);
}

if (!process.env.JWT_SECRET) {
    console.error('❌ JWT_SECRET is missing from .env');
    process.exit(1);
}

// ==========================================
// CORS
// ==========================================

const allowedOrigins = [
    process.env.CLIENT_URL,
    'http://localhost:3000',
    'http://localhost:3001'
].filter(Boolean);

app.use(
    cors({
        origin: function (origin, callback) {
            // Allow server-to-server / Postman requests
            if (!origin) {
                return callback(null, true);
            }

            if (allowedOrigins.includes(origin)) {
                return callback(null, true);
            }

            console.warn(`⚠️ CORS blocked origin: ${origin}`);
            return callback(new Error('Not allowed by CORS'));
        },
        credentials: true
    })
);

// ==========================================
// BODY PARSER
// ==========================================

app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));

// ==========================================
// HEALTH CHECK
// ==========================================

app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Max Technology Exam Center API is running.',
        version: '1.0.0'
    });
});

app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        database:
            mongoose.connection.readyState === 1
                ? 'connected'
                : 'disconnected',
        timestamp: new Date().toISOString()
    });
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
        error: 'API endpoint not found.'
    });
});

// ==========================================
// GLOBAL ERROR HANDLER
// ==========================================

app.use((err, req, res, next) => {
    console.error('Global error:', err);

    if (err.message === 'Not allowed by CORS') {
        return res.status(403).json({
            success: false,
            error: 'CORS request blocked.'
        });
    }

    res.status(500).json({
        success: false,
        error: 'Internal server error.'
    });
});

// ==========================================
// DATABASE + SERVER
// ==========================================

async function startServer() {
    try {
        await mongoose.connect(MONGO_URI);

        console.log('✅ MongoDB Atlas Successfully Connected!');

        app.listen(PORT, () => {
            console.log(`🚀 Max Technology Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
        process.exit(1);
    }
}

startServer();

// ==========================================
// PROCESS ERROR HANDLING
// ==========================================

process.on('unhandledRejection', (error) => {
    console.error('Unhandled Promise Rejection:', error);
});

process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
});
