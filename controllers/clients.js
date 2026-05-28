const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

// Helper validation function
const validateClientData = (data, isUpdate = false) => {
    const errors = [];
    
    if (!isUpdate || data.name !== undefined) {
        if (!data.name || data.name.trim().length < 2) {
            errors.push("Name is required and must have at least 2 characters");
        }
    }
    
    if (!isUpdate || data.last_name !== undefined) {
        if (!data.last_name || data.last_name.trim().length < 2) {
            errors.push("Last name is required and must have at least 2 characters");
        }
    }
    
    if (!isUpdate || data.email !== undefined) {
        if (!data.email || !data.email.includes('@') || !data.email.includes('.')) {
            errors.push("Valid email is required");
        }
    }
    
    if (!isUpdate || data.phone !== undefined) {
        if (!data.phone || data.phone.toString().length < 8) {
            errors.push("Phone is required and must have at least 8 digits");
        }
    }
    
    if (!isUpdate || data.dni !== undefined) {
        if (!data.dni || data.dni.toString().length < 6) {
            errors.push("DNI is required and must have at least 6 characters");
        }
    }
    
    return errors;
};

// Get all clients
//#swagger.tags = ['Clients']
const getAll = async (req, res) => {
    try {
        const result = await mongodb.getDatabase().db().collection('clients').find();
        const clients = await result.toArray();
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(clients);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get single client by ID
//#swagger.tags = ['Clients']
const getSingle = async (req, res) => {
    try {
        if (!req.params.id || req.params.id.length !== 24) {
            return res.status(400).json({ error: "Invalid client ID format" });
        }
        
        const clientsId = new ObjectId(req.params.id);
        const result = await mongodb.getDatabase().db().collection('clients').find({ _id: clientsId });
        const clients = await result.toArray();
        
        if (clients.length === 0) {
            return res.status(404).json({ error: "Client not found" });
        }
        
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(clients[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Create new client
//#swagger.tags = ['Clients']
const createClients = async (req, res) => {
    try {
        // Validate data
        const validationErrors = validateClientData(req.body, false);
        if (validationErrors.length > 0) {
            return res.status(400).json({ errors: validationErrors });
        }
        
        const clients = {
            name: req.body.name,
            last_name: req.body.last_name,
            phone: req.body.phone,
            email: req.body.email,
            address: req.body.address || "",
            dni: req.body.dni,
            registration_date: req.body.registration_date || new Date().toISOString().split('T')[0],
            customer_status: req.body.customer_status || "active"
        };
        
        const response = await mongodb.getDatabase().db().collection('clients').insertOne(clients);
        
        if (response.acknowledged) {
            res.status(201).json({ 
                message: "Client created successfully", 
                id: response.insertedId 
            });
        } else {
            res.status(500).json({ error: 'Some error occurred while creating the client.' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update existing client
//#swagger.tags = ['Clients']
const updateClients = async (req, res) => {
    try {
        if (!req.params.id || req.params.id.length !== 24) {
            return res.status(400).json({ error: "Invalid client ID format" });
        }
        
        // Validate data (only validate fields that are being updated)
        const validationErrors = validateClientData(req.body, true);
        if (validationErrors.length > 0) {
            return res.status(400).json({ errors: validationErrors });
        }
        
        const clientId = new ObjectId(req.params.id);
        const update = {
            name: req.body.name,
            last_name: req.body.last_name,
            phone: req.body.phone,
            email: req.body.email,
            address: req.body.address || "",
            dni: req.body.dni,
            registration_date: req.body.registration_date,
            customer_status: req.body.customer_status
        };
        
        const response = await mongodb
            .getDatabase().db().collection('clients')
            .replaceOne({ _id: clientId }, update);
        
        if (response.modifiedCount > 0) {
            res.status(200).json({ message: "Client updated successfully" });
        } else if (response.matchedCount === 0) {
            res.status(404).json({ error: "Client not found" });
        } else {
            res.status(500).json({ error: 'Some error occurred while updating the client.' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete client
//#swagger.tags = ['Clients']
const deleteClients = async (req, res) => {
    try {
        if (!req.params.id || req.params.id.length !== 24) {
            return res.status(400).json({ error: "Invalid client ID format" });
        }
        
        const clientId = new ObjectId(req.params.id);
        const response = await mongodb.getDatabase().db().collection('clients').deleteOne({ _id: clientId });
        
        if (response.deletedCount > 0) {
            res.status(200).json({ message: "Client deleted successfully" });
        } else {
            res.status(404).json({ error: "Client not found" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getAll,
    getSingle,
    createClients,
    updateClients,
    deleteClients
};