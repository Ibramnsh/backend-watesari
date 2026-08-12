const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Akses Publik
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);

// Akses Khusus Admin / Superadmin (Poin 8)
const adminAuth = [auth, role('admin', 'superadmin')];

router.post('/', adminAuth, upload.array('images', 5), productController.createProduct);
router.put('/:id', adminAuth, upload.array('images', 5), productController.updateProduct);
router.delete('/:id', adminAuth, productController.deleteProduct);

module.exports = router;
