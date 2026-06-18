const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

// Helper validation function
const validateMechanicData = (data, isUpdate = false) => {
    const errors = [];
    
    if (!isUpdate || data.name !== undefined) {
        if (!data.name || data.name.trim().length < 2) {
            errors.push("Name is required and must have at least 2 characters");
        }
    }
    
    if (!isUpdate || data.email !== undefined) {
        if (!data.email || !data.email.includes('@') || !data.email.includes('.')) {
            errors.push("Valid email is required");
        }
    }
    
    if (!isUpdate || data.specialization !== undefined) {
        if (!data.specialization || data.specialization.trim().length < 3) {
            errors.push("Specialization is required and must have at least 3 characters");
        }
    }
    
    if (!isUpdate || data.phone !== undefined) {
        if (!data.phone || data.phone.toString().length < 8) {
            errors.push("Phone is required and must have at least 8 digits");
        }
    }
    
    if (!isUpdate || data.experienceYears !== undefined) {
        if (data.experienceYears === undefined || data.experienceYears === null) {
            errors.push("Experience years is required");
        } else if (typeof data.experienceYears !== 'number' || data.experienceYears < 0) {
            errors.push("Experience years must be a non-negative number");
        }
    }
    
    if (!isUpdate || data.status !== undefined) {
        const validStatuses = ['active', 'inactive', 'on-leave'];
        if (data.status !== undefined && data.status !== null && !validStatuses.includes(data.status)) {
            errors.push(`Status must be one of: ${validStatuses.join(', ')}`);
        }
    }
    
    return errors;
};

// Get all mechanics
//#swagger.tags = ['Mechanics']
const getAll = async (req, res) => {
    try {
        const result = await mongodb.getDatabase().db().collection('mechanics').find();
        const mechanics = await result.toArray();
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(mechanics);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get single mechanic by ID
//#swagger.tags = ['Mechanics']
const getSingle = async (req, res) => {
    try {
        if (!req.params.id || req.params.id.length !== 24) {
            return res.status(400).json({ error: "Invalid mechanic ID format" });
        }
        
        const mechanicId = new ObjectId(req.params.id);
        const result = await mongodb.getDatabase().db().collection('mechanics').find({ _id: mechanicId });
        const mechanics = await result.toArray();
        
        if (mechanics.length === 0) {
            return res.status(404).json({ error: "Mechanic not found" });
        }
        
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(mechanics[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Create new mechanic
//#swagger.tags = ['Mechanics']
const createMechanic = async (req, res) => {
    try {
        // Validate data
        const validationErrors = validateMechanicData(req.body, false);
        if (validationErrors.length > 0) {
            return res.status(400).json({ errors: validationErrors });
        }
        
        const mechanic = {
            name: req.body.name,
            email: req.body.email,
            specialization: req.body.specialization,
            phone: req.body.phone,
            experienceYears: req.body.experienceYears,
            availableSlots: req.body.availableSlots || 5,
            status: req.body.status || 'active',
            hireDate: req.body.hireDate || new Date().toISOString().split('T')[0],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        const response = await mongodb.getDatabase().db().collection('mechanics').insertOne(mechanic);
        
        if (response.acknowledged) {
            res.status(201).json({ 
                message: "Mechanic created successfully", 
                id: response.insertedId 
            });
        } else {
            res.status(500).json({ error: 'Some error occurred while creating the mechanic.' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update existing mechanic
//#swagger.tags = ['Mechanics']
const updateMechanic = async (req, res) => {
    try {
        if (!req.params.id || req.params.id.length !== 24) {
            return res.status(400).json({ error: "Invalid mechanic ID format" });
        }
        
        // Validate data (only validate fields that are being updated)
        const validationErrors = validateMechanicData(req.body, true);
        if (validationErrors.length > 0) {
            return res.status(400).json({ errors: validationErrors });
        }
        
        const mechanicId = new ObjectId(req.params.id);
        const update = {};
        
        // Only include fields that are provided in the request
        if (req.body.name) update.name = req.body.name;
        if (req.body.email) update.email = req.body.email;
        if (req.body.specialization) update.specialization = req.body.specialization;
        if (req.body.phone) update.phone = req.body.phone;
        if (req.body.experienceYears !== undefined) update.experienceYears = req.body.experienceYears;
        if (req.body.availableSlots !== undefined) update.availableSlots = req.body.availableSlots;
        if (req.body.status) update.status = req.body.status;
        if (req.body.hireDate) update.hireDate = req.body.hireDate;
        update.updatedAt = new Date().toISOString();
        
        const response = await mongodb
            .getDatabase().db().collection('mechanics')
            .updateOne({ _id: mechanicId }, { $set: update });
        
        if (response.modifiedCount > 0) {
            res.status(200).json({ message: "Mechanic updated successfully" });
        } else if (response.matchedCount === 0) {
            res.status(404).json({ error: "Mechanic not found" });
        } else {
            res.status(500).json({ error: 'Some error occurred while updating the mechanic.' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete mechanic
//#swagger.tags = ['Mechanics']
const deleteMechanic = async (req, res) => {
    try {
        if (!req.params.id || req.params.id.length !== 24) {
            return res.status(400).json({ error: "Invalid mechanic ID format" });
        }
        
        const mechanicId = new ObjectId(req.params.id);
        const response = await mongodb.getDatabase().db().collection('mechanics').deleteOne({ _id: mechanicId });
        
        if (response.deletedCount > 0) {
            res.status(200).json({ message: "Mechanic deleted successfully" });
        } else {
            res.status(404).json({ error: "Mechanic not found" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getAll,
    getSingle,
    createMechanic,
    updateMechanic,
    deleteMechanic
};
