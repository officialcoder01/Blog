// JWT strategy for Passport.js
// Uses passport-jwt to verify JWT tokens
const jwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const { getUserById } = require('../queries/user');
require('dotenv').config();

const opts = {};
// Extract JWT from Authorization header as Bearer token
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.JWT_SECRET;

// Define and export the JWT strategy
module.exports = new jwtStrategy(opts, async (jwt_payload, done) => {
    try {
        const user = await getUserById(jwt_payload.id);
        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
        }
    } catch (error) {
        return done(error, false);
    }
});