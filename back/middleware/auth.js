const jwt = require('jsonwebtoken');
const { User } = require('../models');

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    console.warn(
        'WARNING: JWT_SECRET is not configured in environment variables.'
    );
}

// ==========================================
// VERIFY JWT
// ==========================================
const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                error: 'የመግቢያ ፈቃድ ያስፈልጋል።'
            });
        }

        const token = authHeader.split(' ')[1];

        if (!JWT_SECRET) {
            return res.status(500).json({
                error: 'Authentication configuration error.'
            });
        }

        const decoded = jwt.verify(token, JWT_SECRET);

        const user = await User.findById(decoded.userId).select(
            '-password'
        );

        if (!user) {
            return res.status(401).json({
                error: 'ተጠቃሚው አልተገኘም።'
            });
        }

        req.user = user;

        next();
    } catch (error) {
        console.error('Authentication error:', error);

        return res.status(401).json({
            error: 'የመግቢያ ቶከኑ ልክ አይደለም ወይም ጊዜው አልፏል።'
        });
    }
};

// ==========================================
// ROLE AUTHORIZATION
// ==========================================
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                error: 'Unauthorized.'
            });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                error: 'ይህን ክፍል ለመጠቀም ፈቃድ የለዎትም።'
            });
        }

        next();
    };
};

module.exports = {
    authenticate,
    authorize
};
