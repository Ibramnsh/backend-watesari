const express = require('express');
const router = express.Router();
const kategoriController = require('../controllers/kategoriController');
const auth = require('../middleware/authMiddleware');

router.get('/', kategoriController.getAllKategori);
router.post('/', auth, kategoriController.createKategori);
router.put('/:id', auth, kategoriController.updateKategori);
router.delete('/:id', auth, kategoriController.deleteKategori);

module.exports = router;
