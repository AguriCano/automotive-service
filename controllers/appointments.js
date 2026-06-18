const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

// Helper validation function
const validateAppointmentData = (data, isUpdate = false) => {
    const errors = [];
    
    if (!isUpdate || data.clientId !== undefined) {
        const clientIdStr = data.clientId?.toString?.() || data.clientId;
        if (!clientIdStr || clientIdStr.length !== 24) {
            errors.push("Valid clientId (24-character ObjectId) is required");
        }
    }
    
    if (!isUpdate || data.serviceId !== undefined) {
        const serviceIdStr = data.serviceId?.toString?.() || data.serviceId;
        if (!serviceIdStr || serviceIdStr.length !== 24) {
            errors.push("Valid serviceId (24-character ObjectId) is required");
        }
    }
    
    if (!isUpdate || data.appointmentDate !== undefined) {
        if (!data.appointmentDate || !data.appointmentDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
            errors.push("Appointment date is required and must be in format YYYY-MM-DD");
        }
    }
    
    if (!isUpdate || data.appointmentTime !== undefined) {
        if (!data.appointmentTime || !data.appointmentTime.match(/^\d{2}:\d{2}$/)) {
            errors.push("Appointment time is required and must be in format HH:MM");
        }
    }
    
    if (!isUpdate || data.status !== undefined) {
        const validStatuses = ['pending', 'confirmed', 'completed', 'cancelled'];
        if (data.status !== undefined && data.status !== null && !validStatuses.includes(data.status)) {
            errors.push(`Status must be one of: ${validStatuses.join(', ')}`);
        }
    }
    
    return errors;
};

// Get all appointments
//#swagger.tags = ['Appointments']
const getAll = async (req, res) => {
    try {
        const result = await mongodb.getDatabase().db().collection('appointments').find();
        const appointments = await result.toArray();
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(appointments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get single appointment by ID
//#swagger.tags = ['Appointments']
const getSingle = async (req, res) => {
    try {
        if (!req.params.id || req.params.id.length !== 24) {
            return res.status(400).json({ error: "Invalid appointment ID format" });
        }
        
        const appointmentId = new ObjectId(req.params.id);
        const result = await mongodb.getDatabase().db().collection('appointments').find({ _id: appointmentId });
        const appointments = await result.toArray();
        
        if (appointments.length === 0) {
            return res.status(404).json({ error: "Appointment not found" });
        }
        
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(appointments[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Create new appointment
//#swagger.tags = ['Appointments']
const createAppointment = async (req, res) => {
    try {
        // Validate data
        const validationErrors = validateAppointmentData(req.body, false);
        if (validationErrors.length > 0) {
            return res.status(400).json({ errors: validationErrors });
        }
        
        // Convert IDs to ObjectId - handle both string and ObjectId inputs
        let clientId, serviceId;
        try {
            clientId = req.body.clientId instanceof ObjectId ? req.body.clientId : new ObjectId(req.body.clientId);
            serviceId = req.body.serviceId instanceof ObjectId ? req.body.serviceId : new ObjectId(req.body.serviceId);
        } catch (e) {
            return res.status(400).json({ errors: ["Invalid clientId or serviceId format"] });
        }
        
        const appointment = {
            clientId: clientId,
            serviceId: serviceId,
            appointmentDate: req.body.appointmentDate,
            appointmentTime: req.body.appointmentTime,
            status: req.body.status || 'pending',
            notes: req.body.notes || '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        const response = await mongodb.getDatabase().db().collection('appointments').insertOne(appointment);
        
        if (response.acknowledged) {
            res.status(201).json({ 
                message: "Appointment created successfully", 
                id: response.insertedId 
            });
        } else {
            res.status(500).json({ error: 'Some error occurred while creating the appointment.' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update existing appointment
//#swagger.tags = ['Appointments']
const updateAppointment = async (req, res) => {
    try {
        if (!req.params.id || req.params.id.length !== 24) {
            return res.status(400).json({ error: "Invalid appointment ID format" });
        }
        
        // Validate data (only validate fields that are being updated)
        const validationErrors = validateAppointmentData(req.body, true);
        if (validationErrors.length > 0) {
            return res.status(400).json({ errors: validationErrors });
        }
        
        const appointmentId = new ObjectId(req.params.id);
        const update = {};
        
        // Only include fields that are provided in the request
        if (req.body.clientId) {
            try {
                update.clientId = req.body.clientId instanceof ObjectId ? req.body.clientId : new ObjectId(req.body.clientId);
            } catch (e) {
                return res.status(400).json({ errors: ["Invalid clientId format"] });
            }
        }
        if (req.body.serviceId) {
            try {
                update.serviceId = req.body.serviceId instanceof ObjectId ? req.body.serviceId : new ObjectId(req.body.serviceId);
            } catch (e) {
                return res.status(400).json({ errors: ["Invalid serviceId format"] });
            }
        }
        if (req.body.appointmentDate) update.appointmentDate = req.body.appointmentDate;
        if (req.body.appointmentTime) update.appointmentTime = req.body.appointmentTime;
        if (req.body.status) update.status = req.body.status;
        if (req.body.notes !== undefined) update.notes = req.body.notes;
        update.updatedAt = new Date().toISOString();
        
        const response = await mongodb
            .getDatabase().db().collection('appointments')
            .updateOne({ _id: appointmentId }, { $set: update });
        
        if (response.modifiedCount > 0) {
            res.status(200).json({ message: "Appointment updated successfully" });
        } else if (response.matchedCount === 0) {
            res.status(404).json({ error: "Appointment not found" });
        } else {
            res.status(500).json({ error: 'Some error occurred while updating the appointment.' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete appointment
//#swagger.tags = ['Appointments']
const deleteAppointment = async (req, res) => {
    try {
        if (!req.params.id || req.params.id.length !== 24) {
            return res.status(400).json({ error: "Invalid appointment ID format" });
        }
        
        const appointmentId = new ObjectId(req.params.id);
        const response = await mongodb.getDatabase().db().collection('appointments').deleteOne({ _id: appointmentId });
        
        if (response.deletedCount > 0) {
            res.status(200).json({ message: "Appointment deleted successfully" });
        } else {
            res.status(404).json({ error: "Appointment not found" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getAll,
    getSingle,
    createAppointment,
    updateAppointment,
    deleteAppointment
};
