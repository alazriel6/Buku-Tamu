// middleware/adminJwtAuth.js
const jwt = require('jsonwebtoken');

const allowedAdmins = [
  'admin@gmail.com',
  'boylazy801@gmail.com', // pastikan ini adalah email Google kamu
];

function adminJwtAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'No token provided' });

  const token = authHeader.split(' ')[1];

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    console.log('JWT verified:', user);

    if (!allowedAdmins.includes(user.email)) {
      return res.status(403).json({ message: 'Forbidden: Not an allowed admin email', email: user.email });
    }

    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden: Not an admin (role)', role: user.role });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error('JWT error:', err.message);
    return res.status(401).json({ message: 'Invalid token' });
  }
}

module.exports = adminJwtAuth;
