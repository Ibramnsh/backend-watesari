const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const auth = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);
router.post('/', auth, upload.array('images', 5), productController.createProduct);
router.put('/:id', auth, upload.array('images', 5), productController.updateProduct);
router.delete('/:id', auth, productController.deleteProduct);

module.exports = router;
