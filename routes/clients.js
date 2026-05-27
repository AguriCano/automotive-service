const express = require('express');
const router = express.Router();

const clientsController = require('../controllers/clients');

router.get('/', clientsController.getAll);

router.get('/:id', clientsController.getSingle);

module.exports = router;