const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const auth = require('../middleware/authMiddleware');

router.post('/', contactController.submitContact);
router.get('/', auth, contactController.getContacts); // Only admin can see messages

module.exports = router;
