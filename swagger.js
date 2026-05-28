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
    produces: ['application/json']
};

const outputFile = './swagger.json';
const endpointsFiles = ['./routes/index.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);