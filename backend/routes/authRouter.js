const { Router } = require('express');
const { register } = require('../controller/authController');
const passport = require('passport');
const jwt = require('jsonwebtoken');

require('dotenv').config();

const router = Router();

// Registration route
router.post('/register', register);

// Login route
// Authenticate using passport local strategy
// On successful authentication, generate JWT and send to client
router.post('/login', passport.authenticate('local', { session: false }), (req, res) => {
    // Generate JWT
    const user = req.user;
    const opts = {};
    opts.expiresIn = '1h';
    opts.secret = process.env.JWT_SECRET;

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, opts.secret, { expiresIn: opts.expiresIn });

    res.json({ message: 'Login successful', token });
});

router.get('/me', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.json({ user: req.user });
});

module.exports = router;