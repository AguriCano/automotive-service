const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const dotenv = require('dotenv');
const mongodb = require('./data/database');
const app = require('./server');

dotenv.config();
chai.use(chaiHttp);

const validCredentials = {
    email: 'admin@automotive.com',
    password: 'admin123'
};

let authToken = null;
let testClientId, testServiceId;

async function run() {
    return new Promise((resolve) => {
        mongodb.initDB((err) => {
            if (err) console.log('Database init:', err.message);
            
            // Login
            chai.request(app)
                .post('/auth/login')
                .send(validCredentials)
                .end((err, res) => {
                    authToken = res.body.token;
                    console.log('Auth token:', authToken ? 'obtained' : 'failed');
                    
                    // Create client
                    chai.request(app)
                        .post('/clients')
                        .send({
                            name: 'Debug',
                            last_name: 'Test',
                            email: 'debug@test.com',
                            phone: '5551234567',
                            dni: '222222'
                        })
                        .end((err, res) => {
                            testClientId = res.body.id;
                            console.log('Client ID:', testClientId);
                            console.log('Client ID type:', typeof testClientId);
                            console.log('Client ID stringified:', JSON.stringify(testClientId));
                            
                            // Create service
                            chai.request(app)
                                .post('/services')
                                .send({
                                    name: 'Debug Service',
                                    description: 'Test service',
                                    price: 99,
                                    duration: 60
                                })
                                .end((err, res) => {
                                    testServiceId = res.body.id;
                                    console.log('Service ID:', testServiceId);
                                    console.log('Service ID type:', typeof testServiceId);
                                    console.log('Service ID stringified:', JSON.stringify(testServiceId));
                                    
                                    // Try to create appointment
                                    console.log('\nTrying to create appointment with:');
                                    console.log('clientId:', testClientId);
                                    console.log('serviceId:', testServiceId);
                                    
                                    chai.request(app)
                                        .post('/appointments')
                                        .set('Authorization', `Bearer ${authToken}`)
                                        .send({
                                            clientId: testClientId,
                                            serviceId: testServiceId,
                                            appointmentDate: '2026-07-10',
                                            appointmentTime: '10:00',
                                            status: 'pending'
                                        })
                                        .end((err, res) => {
                                            console.log('\nAppointment POST response:');
                                            console.log('Status:', res.status);
                                            console.log('Body:', JSON.stringify(res.body, null, 2));
                                            resolve();
                                        });
                                });
                        });
                });
        });
    });
}

run().then(() => process.exit(0)).catch(err => {
    console.error('Error:', err);
    process.exit(1);
});
