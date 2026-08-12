const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');

// Akses Publik untuk mengirim pesan kontak
router.post('/', contactController.submitContact);

// Akses Khusus Admin / Superadmin untuk melihat pesan (Poin 8)
router.get('/', auth, role('admin', 'superadmin'), contactController.getContacts);

module.exports = router;
