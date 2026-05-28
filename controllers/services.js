const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

// Helper validation function
const validateServiceData = (data, isUpdate = false) => {
    const errors = [];
    
    if (!isUpdate || data.license_plate !== undefined) {
        if (!data.license_plate || data.license_plate.trim().length < 5) {
            errors.push("License plate is required and must have at least 5 characters");
        }
    }
    
    if (!isUpdate || data.model !== undefined) {
        if (!data.model || data.model.trim().length < 1) {
            errors.push("Model is required");
        }
    }
    
    if (!isUpdate || data.brand !== undefined) {
        if (!data.brand || data.brand.trim().length < 1) {
            errors.push("Brand is required");
        }
    }
    
    if (!isUpdate || data.service_type !== undefined) {
        if (!data.service_type || data.service_type.trim().length < 3) {
            errors.push("Service type is required");
        }
    }
    
    if (!isUpdate || data.cost !== undefined) {
        if (data.cost === undefined || data.cost === null || isNaN(parseFloat(data.cost)) || parseFloat(data.cost) < 0) {
            errors.push("Cost must be a positive number");
        }
    }
    
    if (!isUpdate || data.status !== undefined) {
        const validStatuses = ['pending', 'in_progress', 'completed', 'cancelled'];
        if (!data.status || !validStatuses.includes(data.status)) {
            errors.push(`Status must be one of: ${validStatuses.join(', ')}`);
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
            license_plate: req.body.license_plate,
            model: req.body.model,
            brand: req.body.brand,
            service_type: req.body.service_type,
            description: req.body.description || "",
            cost: parseFloat(req.body.cost),
            entry_date: req.body.entry_date || new Date().toISOString().split('T')[0],
            delivery_date: req.body.delivery_date || null,
            status: req.body.status || "pending"
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
        const update = {
            license_plate: req.body.license_plate,
            model: req.body.model,
            brand: req.body.brand,
            service_type: req.body.service_type,
            description: req.body.description || "",
            cost: req.body.cost !== undefined ? parseFloat(req.body.cost) : 0,
            entry_date: req.body.entry_date,
            delivery_date: req.body.delivery_date || null,
            status: req.body.status
        };
        
        const response = await mongodb
            .getDatabase().db().collection('services')
            .replaceOne({ _id: servicesId }, update);
        
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