const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

// Helper validation function
const validateServiceData = (data, isUpdate = false) => {
    const errors = [];
    
    if (!isUpdate || data.name !== undefined) {
        if (!data.name || data.name.trim().length < 2) {
            errors.push("Service name is required and must have at least 2 characters");
        }
    }
    
    if (!isUpdate || data.description !== undefined) {
        if (!data.description || data.description.trim().length < 5) {
            errors.push("Description is required and must have at least 5 characters");
        }
    }
    
    if (!isUpdate || data.price !== undefined) {
        if (data.price === undefined || data.price === null) {
            errors.push("Price is required");
        } else if (typeof data.price !== 'number' || data.price < 0) {
            errors.push("Price must be a non-negative number");
        }
    }
    
    if (!isUpdate || data.duration !== undefined) {
        if (data.duration === undefined || data.duration === null) {
            errors.push("Duration is required");
        } else if (typeof data.duration !== 'number' || data.duration <= 0) {
            errors.push("Duration must be a positive number (in minutes)");
        }
    }
    
    return errors;
};

// Get all services
//#swagger.tags = ['Services']
const getAll = async (req, res) => {
    try {
        const result = await mongodb.getDatabase().db().collection('services').find();
        const services = await result.toArray();
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(services);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get single service by ID
//#swagger.tags = ['Services']
const getSingle = async (req, res) => {
    try {
        if (!req.params.id || req.params.id.length !== 24) {
            return res.status(400).json({ error: "Invalid service ID format" });
        }
        
        const servicesId = new ObjectId(req.params.id);
        const result = await mongodb.getDatabase().db().collection('services').find({ _id: servicesId });
        const services = await result.toArray();
        
        if (services.length === 0) {
            return res.status(404).json({ error: "Service not found" });
        }
        
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(services[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Create new service
//#swagger.tags = ['Services']
const createServices = async (req, res) => {
    try {
        // Validate data
        const validationErrors = validateServiceData(req.body, false);
        if (validationErrors.length > 0) {
            return res.status(400).json({ errors: validationErrors });
        }
        
        const services = {
            name: req.body.name,
            description: req.body.description,
            price: parseFloat(req.body.price),
            duration: parseInt(req.body.duration),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        const response = await mongodb.getDatabase().db().collection('services').insertOne(services);
        
        if (response.acknowledged) {
            res.status(201).json({ 
                message: "Service created successfully", 
                id: response.insertedId 
            });
        } else {
            res.status(500).json({ error: 'Some error occurred while creating the service.' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update existing service
//#swagger.tags = ['Services']
const updateServices = async (req, res) => {
    try {
        if (!req.params.id || req.params.id.length !== 24) {
            return res.status(400).json({ error: "Invalid service ID format" });
        }
        
        // Validate data
        const validationErrors = validateServiceData(req.body, true);
        if (validationErrors.length > 0) {
            return res.status(400).json({ errors: validationErrors });
        }
        
        const servicesId = new ObjectId(req.params.id);
        const update = {};
        
        // Only include fields that are provided in the request
        if (req.body.name !== undefined) update.name = req.body.name;
        if (req.body.description !== undefined) update.description = req.body.description;
        if (req.body.price !== undefined) update.price = parseFloat(req.body.price);
        if (req.body.duration !== undefined) update.duration = parseInt(req.body.duration);
        update.updatedAt = new Date().toISOString();
        
        const response = await mongodb
            .getDatabase().db().collection('services')
            .updateOne({ _id: servicesId }, { $set: update });
        
        if (response.modifiedCount > 0) {
            res.status(200).json({ message: "Service updated successfully" });
        } else if (response.matchedCount === 0) {
            res.status(404).json({ error: "Service not found" });
        } else {
            res.status(500).json({ error: 'Some error occurred while updating the service.' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete service
//#swagger.tags = ['Services']
const deleteServices = async (req, res) => {
    try {
        if (!req.params.id || req.params.id.length !== 24) {
            return res.status(400).json({ error: "Invalid service ID format" });
        }
        
        const servicesId = new ObjectId(req.params.id);
        const response = await mongodb.getDatabase().db().collection('services').deleteOne({ _id: servicesId });
        
        if (response.deletedCount > 0) {
            res.status(200).json({ message: "Service deleted successfully" });
        } else {
            res.status(404).json({ error: "Service not found" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getAll,
    getSingle,
    createServices,
    updateServices,
    deleteServices
};