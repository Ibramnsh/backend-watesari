const express = require('express');
const router = express.Router();
const newsController = require('../controllers/newsController');
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Akses Publik
router.get('/', newsController.getAllNews);
router.get('/:id', newsController.getNewsById);

// Akses Khusus Admin / Superadmin (Poin 8)
const adminAuth = [auth, role('admin', 'superadmin')];

router.post('/', adminAuth, upload.single('image'), newsController.createNews);
router.put('/:id', adminAuth, upload.single('image'), newsController.updateNews);
router.delete('/:id', adminAuth, newsController.deleteNews);

module.exports = router;
