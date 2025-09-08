const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {type: String, required: true, unique: true},
    password: {type: String}, //Untuk manual Login
    googleId: {type: String}, //Untuk Google Login
    role: {type: String, default: 'user'},
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);