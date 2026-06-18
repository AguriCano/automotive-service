const express = require('express');
const router = express.Router();
const appointmentsController = require('../controllers/appointments');
const { verifyToken } = require('../middleware/auth');

// Public routes - read operations
//#swagger.tags = ['Appointments']
router.get('/', appointmentsController.getAll);

//#swagger.tags = ['Appointments']
router.get('/:id', appointmentsController.getSingle);

// Protected routes - write operations (require authentication)
//#swagger.tags = ['Appointments']
router.post('/', verifyToken, appointmentsController.createAppointment);

//#swagger.tags = ['Appointments']
router.put('/:id', verifyToken, appointmentsController.updateAppointment);

//#swagger.tags = ['Appointments']
router.delete('/:id', verifyToken, appointmentsController.deleteAppointment);

module.exports = router;
