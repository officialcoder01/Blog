const { rateLimit } = require('express-rate-limit');

// Rate limiter for authentication routes
const authLimit = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 request per windowMs
    message: {
        error: "Too many attempts. Please try again later."
    },
    standardHeaders: true,
    legacyHeaders: false
});

// General rate limiter for all other routes
const generalLimit = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 100, // limit each IP to 100 requests per windowMs
    message: {
        error: "Too many requests. Please try again later."
    },
    standardHeaders: true,
    legacyHeaders: false
});

module.exports = {
    authLimiter: authLimit,
    generalLimiter: generalLimit
};