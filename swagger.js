const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
        title: 'Automotive Service API',
        description: 'API for managing automotive service',
        version: '1.0.0'
    },
    host: 'automotive-service.onrender.com',  
    schemes: ['https'],                        
    basePath: '/',                             
    consumes: ['application/json'],
    produces: ['application/json'],
    tags: [
        {
            name: 'Clients',
            description: 'Client management endpoints'
        },
        {
            name: 'Services',
            description: 'Service management endpoints'
        },
        {
            name: 'Appointments',
            description: 'Appointment management endpoints'
        },
        {
            name: 'Mechanics',
            description: 'Mechanic management endpoints'
        },
        {
            name: 'Welcome to the Automotive Service',
            description: 'Root welcome endpoint'
        }
    ]
};

const outputFile = './swagger.json';
const endpointsFiles = ['./routes/index.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);
