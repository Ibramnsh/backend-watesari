const express = require('express');
const router = express.Router();
const newsController = require('../controllers/newsController');
const auth = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/', newsController.getAllNews);
router.get('/:id', newsController.getNewsById);
router.post('/', auth, upload.single('image'), newsController.createNews);
router.put('/:id', auth, upload.single('image'), newsController.updateNews);
router.delete('/:id', auth, newsController.deleteNews);

module.exports = router;
