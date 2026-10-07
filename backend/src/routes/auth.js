const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  const adminUser = process.env.ADMIN_USERNAME || 'admin';
  const adminPass = process.env.ADMIN_PASSWORD || 'gdps2024';
  const jwtSecret = process.env.JWT_SECRET || 'gdps_jwt_secret_dev_key_2024';

  if (username === adminUser && password === adminPass) {
    const token = jwt.sign(
      { username, role: 'admin' },
      jwtSecret,
      { expiresIn: '7d' }
    );
    res.json({ success: true, token, username });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

// GET /api/auth/verify
router.get('/verify', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ valid: false });
  }
  try {
    const token = authHeader.split(' ')[1];
    const jwtSecret = process.env.JWT_SECRET || 'gdps_jwt_secret_dev_key_2024';
    jwt.verify(token, jwtSecret);
    res.json({ valid: true });
  } catch {
    res.status(401).json({ valid: false });
  }
});

module.exports = router;
