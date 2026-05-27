const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

const getAll = async (req, res) => {

const result = await mongodb.getDatabase().db().collection('services').find();
    result.toArray().then((services) => {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(services);
    });
};

const getSingle = async (req, res) => {
    const servicesId = new ObjectId(req.params.id);
    const result = await mongodb.getDatabase().db().collection('services').find({_id: servicesId});
    result.toArray().then((services) => {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(services[0]);
    });
};
module.exports = {
    getAll,
    getSingle,
};