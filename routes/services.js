const express = require('express');
const router = express.Router();

const servicesController = require('../controllers/services');

router.get('/', servicesController.getAll);

router.get('/:id', servicesController.getSingle);

router.post('/', servicesController.createServices);

router.put('/:id', servicesController.updateServices);

router.delete('/:id', servicesController.deleteServices);   


module.exports = router;