const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const {
    createUser,
    getUserByEmail
} = require('../queries/user');

// Registration validation and handler
const register = [

    // Validation rules
    body('username').trim().notEmpty().withMessage('Username is required'),
    body('email').isEmail().withMessage('Invalid email address'),
    body('password')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/).withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
    body('confirmPassword').custom((value, { req }) => value === req.body.password).withMessage('Passwords do not match'),

    async (req, res) => {

        // Validate input
        const errors = validationResult(req);

        // Handle validation errors
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { username, email, password } = req.body;

        try {

            // Hash password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Create user
            const newUser = await createUser({ username, email, password: hashedPassword });

            res.status(201).json({ message: 'User registered successfully', userId: newUser.id });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server error' });
        }
    },
];

const login = [
    // Login handler code would go here
    body('email').isEmail().withMessage('Invalid email address'),
    body('password').notEmpty().withMessage('Password is required'),

    async (req, res, next) => {
        // Validate input
        const errors = validationResult(req);

        // Handle validation errors
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

// Configure Passport Local Strategy
passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
}, async (email, password, done) => {
    try {

        // Find user by email
        const user = await getUserByEmail(email);
        // If user not found
        if (!user) {
            return done(null, false, { message: 'Incorrect email or password.' });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        // If password does not match
        if (!isMatch) {
            return done(null, false, { message: 'Incorrect email or password.' });
        }

        // Successful authentication
        return done(null, user);
    } catch (error) {
        return done(error);
    }
}));

module.exports = {
    register,
    login,
};