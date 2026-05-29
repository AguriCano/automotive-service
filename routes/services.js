const express = require('express');
const router = express.Router();
const servicesController = require('../controllers/services');
const { verifyToken } = require('../middleware/auth');

// Public routes (do not require authentication)
//#swagger.tags = ['Services']
router.get('/', servicesController.getAll);

//#swagger.tags = ['Services']
router.get('/:id', servicesController.getSingle);

// PROTECTED routes (require JWT token)
//#swagger.tags = ['Services']
router.post('/', verifyToken, servicesController.createServices);

//#swagger.tags = ['Services']
router.put('/:id', verifyToken, servicesController.updateServices);

//#swagger.tags = ['Services']
router.delete('/:id', verifyToken, servicesController.deleteServices);   


module.exports = router;