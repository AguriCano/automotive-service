const express = require('express');
const router = express.Router();
const clientsController = require('../controllers/clients');
const { verifyToken } = require('../middleware/auth');


// Public routes (do not require authentication)
//#swagger.tags = ['Clients']
router.get('/', clientsController.getAll);

//#swagger.tags = ['Clients']
router.get('/:id', clientsController.getSingle);


// PROTECTED routes (require JWT token)
//#swagger.tags = ['Clients']
router.post('/', verifyToken, clientsController.createClients);

//#swagger.tags = ['Clients']
router.put('/:id', verifyToken, clientsController.updateClients);    

//#swagger.tags = ['Clients']
router.delete('/:id', verifyToken, clientsController.deleteClients);

module.exports = router;