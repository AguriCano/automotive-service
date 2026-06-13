const express = require('express');
const router = express.Router();
const servicesController = require('../controllers/services');

// All routes are public (no authentication required)
//#swagger.tags = ['Services']
router.get('/', servicesController.getAll);

//#swagger.tags = ['Services']
router.get('/:id', servicesController.getSingle);

//#swagger.tags = ['Services']
router.post('/', servicesController.createServices);

//#swagger.tags = ['Services']
router.put('/:id', servicesController.updateServices);

//#swagger.tags = ['Services']
router.delete('/:id', servicesController.deleteServices);   


module.exports = router;