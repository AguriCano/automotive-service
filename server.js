const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mongodb = require('./data/database');
const bodyParser = require('body-parser');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// CORS configuration using the cors package (cleaner)
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Z-Key', 'Authorization'],
    credentials: true
}));

// Body parser middleware
app.use(bodyParser.json());

// Routes (all, included /auth/login y las protegidas)
app.use('/', require('./routes'));

// Initialize MongoDB and then the server
mongodb.initDB((err) => {
    if (err) {
        console.error('MongoDB init failed:', err);
        return;
    }

    app.listen(PORT, () => {
        console.log(`✅ Database initialized and Node running on port ${PORT}`);
        console.log(`📚 Swagger UI available at: http://localhost:${PORT}/api-docs`);
        console.log(`🔐 Login endpoint: http://localhost:${PORT}/auth/login`);
    });
});