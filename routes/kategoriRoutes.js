const express = require('express');
const router = express.Router();
const kategoriController = require('../controllers/kategoriController');
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');

// Akses Publik
router.get('/', kategoriController.getAllKategori);

// Akses Khusus Admin / Superadmin (Poin 8)
const adminAuth = [auth, role('admin', 'superadmin')];

router.post('/', adminAuth, kategoriController.createKategori);
router.put('/:id', adminAuth, kategoriController.updateKategori);
router.delete('/:id', adminAuth, kategoriController.deleteKategori);

module.exports = router;
