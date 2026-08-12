const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const { loginLimiter } = require('../middleware/rateLimiter');

// Login endpoint dilindungi loginLimiter (Maksimal 5 percobaan / 15 menit per IP - Poin 3)
router.post('/login', loginLimiter, authController.login);

// Logout & Check Auth Me
router.post('/logout', authController.logout);
router.get('/me', authMiddleware, authController.getMe);

module.exports = router;
