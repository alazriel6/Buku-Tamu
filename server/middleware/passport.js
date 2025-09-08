const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const allowedAdmins = [
  'admin@gmail.com',
  'boylazy801@gmail.com',
  // tambahkan email admin lain di sini
];

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/api/auth/google/callback',
}, async (accessToken, refreshToken, profile, done) => {
    try {
        let user = await User.findOne({ googleId: profile.id });
        const email = profile.emails[0].value;
        let role = allowedAdmins.includes(email) ? 'admin' : 'user';
        if (!user) {
            user = await User.create({
                googleId: profile.id,
                email,
                role,
            });
        } else if (user.role !== role) {
            user.role = role;
            await user.save();
        }
        return done(null, user);
    } catch (err) {
        return done(err, null);
    }
}));

// Serialize user to JWT
passport.serializeUser((user, done) => {
    const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
    done(null, token);
});

passport.deserializeUser((token, done) => {
    try {
        const user = jwt.verify(token, process.env.JWT_SECRET);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});
