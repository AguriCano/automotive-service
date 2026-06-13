const express = require('express');
const router = express.Router();
const clientsController = require('../controllers/clients');

// All routes are public (no authentication required)
//#swagger.tags = ['Clients']
router.get('/', clientsController.getAll);

//#swagger.tags = ['Clients']
router.get('/:id', clientsController.getSingle);

//#swagger.tags = ['Clients']
router.post('/', clientsController.createClients);

//#swagger.tags = ['Clients']
router.put('/:id', clientsController.updateClients);    

//#swagger.tags = ['Clients']
router.delete('/:id', clientsController.deleteClients);

module.exports = router;