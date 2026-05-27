const express = require('express');
const router = express.Router();

const clientsController = require('../controllers/clients');

router.get('/', clientsController.getAll);

router.get('/:id', clientsController.getSingle);

router.post('/', clientsController.createClients);

router.put('/:id', clientsController.updateClients);    

router.delete('/:id', clientsController.deleteClients);

module.exports = router;