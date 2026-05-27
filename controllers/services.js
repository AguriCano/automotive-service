const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

// Get all services from the database and return them as JSON
//#swagger.tags = ['Services']
const getAll = async (req, res) => {
const result = await mongodb.getDatabase().db().collection('services').find();
    result.toArray().then((services) => {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(services);
    });
};

// Get a single service by its ID from the database and return it as JSON
//#swagger.tags = ['Services']
const getSingle = async (req, res) => {
    const servicesId = new ObjectId(req.params.id);
    const result = await mongodb.getDatabase().db().collection('services').find({_id: servicesId});
    result.toArray().then((services) => {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(services[0]);
    });
};

// Create a new service in the database
//#swagger.tags = ['Services']
const createServices = async (req, res) => {
    const services = {
        license_plate: req.body.license_plate,
        model: req.body.model,
        brand: req.body.brand,
        service_type: req.body.service_type,
        description: req.body.description,
        cost: req.body.cost,
        entry_date: req.body.entry_date,
        delivery_date: req.body.delivery_date,
        status: req.body.status
      
    };

    const response = await mongodb.getDatabase().db().collection('services').insertOne(services);

    if (response.acknowledged) {
        res.status(201).send();
    } else {
        return res.status(500).json(response.error || 'Some error occurred while creating the service.');
    }
};


// Update an existing service in the database
//#swagger.tags = ['Services']
const updateServices = async (req, res) => {
    const servicesId = new ObjectId(req.params.id);
    const update = {
        license_plate: req.body.license_plate,
        model: req.body.model,
        brand: req.body.brand,
        service_type: req.body.service_type,
        description: req.body.description,
        cost: req.body.cost,
        entry_date: req.body.entry_date,
        delivery_date: req.body.delivery_date,
        status: req.body.status
    };

const response = await mongodb
    .getDatabase().db().collection('services')
    .replaceOne({ _id: servicesId }, update);


    if (response.modifiedCount > 0) {
       res.status(204).send();
    } else {
       res.status(500).json(response.error || 'Some error occurred while updating the client.');
    }
};

// Delete a service from the database
//#swagger.tags = ['Services']
const deleteServices = async (req, res) => {
    const servicesId = new ObjectId(req.params.id);
    const response = await mongodb.getDatabase().db().collection('services').deleteOne({ _id: servicesId });

    if (response.deletedCount > 0) {
     res.status(204).send();
  } else{
     res.status(500).json(response.error || 'Some error occurred while deleting the client.');
  }
};

    module.exports = {
        getAll,
        getSingle,
        createServices,
        updateServices,
        deleteServices
    };