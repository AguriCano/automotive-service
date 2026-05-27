const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;


// Get all clients from the database and return them as JSON
//#swagger.tags = ['Clients']
const getAll = async (req, res) => {
    const result = await mongodb.getDatabase().db().collection('clients').find();
    result.toArray().then((clients) => {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(clients);
    });
};

// Get a single client by its ID from the database and return it as JSON
//#swagger.tags = ['Clients']
const getSingle = async (req, res) => {
    const clientsId = new ObjectId(req.params.id);
    const result = await mongodb.getDatabase().db().collection('clients').find({ _id: clientsId });
    result.toArray().then((clients) => {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(clients[0]);
    });
};

// Create a new client in the database
//#swagger.tags = ['Clients']
const createClients = async (req, res) => {
    const clients = {
        name: req.body.name,
        last_name: req.body.last_name,
        phone: req.body.phone,
        email: req.body.email,
        address: req.body.address,
        dni: req.body.dni,
        registration_date: req.body.registration_date,
        customer_status: req.body.customer_status
      
    };

    const response = await mongodb.getDatabase().db().collection('clients').insertOne(clients);

    if (response.acknowledged) {
        res.status(201).send();
    } else {
        return res.status(500).json(response.error || 'Some error occurred while creating the contact.');
    }
};

// Update an existing client in the database
//#swagger.tags = ['Clients']
const updateClients = async (req, res) => {
    const clientId = new ObjectId(req.params.id);
const update = {
        name: req.body.name,
        last_name: req.body.last_name,
        phone: req.body.phone,
        email: req.body.email,
        address: req.body.address,
        dni: req.body.dni,
        registration_date: req.body.registration_date,
        customer_status: req.body.customer_status
    };

const response = await mongodb
    .getDatabase().db().collection('clients')
    .replaceOne({ _id: clientId }, update);


    if (response.modifiedCount > 0) {
       res.status(204).send();
    } else {
       res.status(500).json(response.error || 'Some error occurred while updating the client.');
    }
};

// Delete a client from the database
//#swagger.tags = ['Clients']
const deleteClients = async (req, res) => {
    const clientId = new ObjectId(req.params.id);
    const response = await mongodb.getDatabase().db().collection('clients').deleteOne({ _id: clientId });

    if (response.deletedCount > 0) {
     res.status(204).send();
  } else{
     res.status(500).json(response.error || 'Some error occurred while deleting the client.');
  }
};

    module.exports = {
        getAll,
        getSingle,
        createClients,
        updateClients,
        deleteClients
    };
