const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');

//#swagger.tags = ['Authentication']
router.post('/login', authController.login);

//#swagger.tags = ['Authentication']
router.get('/verify', authController.verifyToken);

module.exports = router;