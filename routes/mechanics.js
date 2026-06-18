const express = require('express');
const router = express.Router();
const mechanicsController = require('../controllers/mechanics');
const { verifyToken } = require('../middleware/auth');

// Public routes - read operations
//#swagger.tags = ['Mechanics']
router.get('/', mechanicsController.getAll);

//#swagger.tags = ['Mechanics']
router.get('/:id', mechanicsController.getSingle);

// Protected routes - write operations (require authentication)
//#swagger.tags = ['Mechanics']
router.post('/', verifyToken, mechanicsController.createMechanic);

//#swagger.tags = ['Mechanics']
router.put('/:id', verifyToken, mechanicsController.updateMechanic);

//#swagger.tags = ['Mechanics']
router.delete('/:id', verifyToken, mechanicsController.deleteMechanic);

module.exports = router;
