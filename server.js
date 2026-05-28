const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const mongodb = require('./data/database');
const bodyParser = require('body-parser');
const app = express();


const PORT = process.env.PORT || 3000;

// Middleware (must be BEFORE routes)
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Z-Key');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    next();
});

// Routes
app.use('/', require('./routes'));

mongodb.initDB((err) => {
    if (err) {
        console.error('MongoDB init failed:', err);
        return;
    }

    app.listen(PORT, () => {
        console.log(`Database is initialized and Node is running on port ${PORT}`);
    });
});

