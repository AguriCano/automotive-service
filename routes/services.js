const express = require('express');
const router = express.Router();

const servicesController = require('../controllers/services');

router.get('/', servicesController.getAll);

router.get('/:id', servicesController.getSingle);

module.exports = router;