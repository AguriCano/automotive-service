const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

const getAll = async (req, res) => {

const result = await mongodb.getDatabase().db().collection('clients').find();
    result.toArray().then((clients) => {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(clients);
    });
};

const getSingle = async (req, res) => {
    const clientsId = new ObjectId(req.params.id);
    const result = await mongodb.getDatabase().db().collection('clients').find({_id: clientsId});
    result.toArray().then((clients) => {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(clients[0]);
    });
};
module.exports = {
    getAll,
    getSingle,
};