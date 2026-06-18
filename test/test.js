const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const dotenv = require('dotenv');
const mongodb = require('../data/database');
const app = require('../server');

dotenv.config();
chai.use(chaiHttp);

const validCredentials = {
    email: 'admin@automotive.com',
    password: 'admin123'
};

let authToken = null;

describe('Automotive Service API - Comprehensive Test Suite', function() {
    
    before(function(done) {
        this.timeout(10000);
        mongodb.initDB((err) => {
            if (err) console.log('Database init:', err.message);
            done();
        });
    });

    // ==================== AUTHENTICATION TESTS ====================
    describe('Authentication', function() {
        it('should login successfully with valid credentials', function(done) {
            chai.request(app)
                .post('/auth/login')
                .send(validCredentials)
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('token');
                    authToken = res.body.token;
                    done();
                });
        });

        it('should fail login with invalid credentials', function(done) {
            chai.request(app)
                .post('/auth/login')
                .send({ email: 'wrong@test.com', password: 'wrongpass' })
                .end((err, res) => {
                    expect(res).to.have.status(401);
                    done();
                });
        });

        it('should verify token successfully', function(done) {
            chai.request(app)
                .get('/auth/verify')
                .set('Authorization', `Bearer ${authToken}`)
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    done();
                });
        });

        it('should reject invalid token', function(done) {
            chai.request(app)
                .get('/auth/verify')
                .set('Authorization', 'Bearer invalid')
                .end((err, res) => {
                    expect(res).to.have.status(401);
                    done();
                });
        });
    });

    // ==================== APPOINTMENTS TESTS ====================
    describe('Appointments - CRUD Operations', function() {
        let testClientId, testServiceId, testAppointmentId;

        before(function(done) {
            chai.request(app)
                .post('/clients')
                .send({
                    name: 'Appt',
                    last_name: 'Client',
                    email: 'appt.client@example.com',
                    phone: '5551234567',
                    dni: '111111'
                })
                .end((err, res) => {
                    testClientId = res.body.id;
                    chai.request(app)
                        .post('/services')
                        .send({
                            name: 'Appointment Service',
                            description: 'Test service',
                            price: 99,
                            duration: 60
                        })
                        .end((err, res) => {
                            testServiceId = res.body.id;
                            done();
                        });
                });
        });

        it('GET /appointments - should get all appointments', function(done) {
            chai.request(app)
                .get('/appointments')
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.an('array');
                    done();
                });
        });

        it('POST /appointments - should create appointment with auth', function(done) {
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
                    expect(res).to.have.status(201);
                    testAppointmentId = res.body.id;
                    done();
                });
        });

        it('POST /appointments - should fail without authentication', function(done) {
            chai.request(app)
                .post('/appointments')
                .send({
                    clientId: testClientId,
                    serviceId: testServiceId,
                    appointmentDate: '2026-07-11',
                    appointmentTime: '11:00'
                })
                .end((err, res) => {
                    expect(res).to.have.status(401);
                    done();
                });
        });

        it('GET /appointments/:id - should get single appointment', function(done) {
            if (!testAppointmentId) return done(new Error('No ID'));
            chai.request(app)
                .get(`/appointments/${testAppointmentId}`)
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    done();
                });
        });

        it('GET /appointments/:id - should return 404 for non-existent', function(done) {
            chai.request(app)
                .get('/appointments/507f1f77bcf86cd799439011')
                .end((err, res) => {
                    expect(res).to.have.status(404);
                    done();
                });
        });

        it('PUT /appointments/:id - should update with auth', function(done) {
            if (!testAppointmentId) return done(new Error('No ID'));
            chai.request(app)
                .put(`/appointments/${testAppointmentId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({ status: 'confirmed' })
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    done();
                });
        });

        it('PUT /appointments/:id - should fail without auth', function(done) {
            chai.request(app)
                .put('/appointments/507f1f77bcf86cd799439011')
                .send({ status: 'confirmed' })
                .end((err, res) => {
                    expect(res).to.have.status(401);
                    done();
                });
        });

        it('DELETE /appointments/:id - should delete with auth', function(done) {
            if (!testAppointmentId) return done(new Error('No ID'));
            chai.request(app)
                .delete(`/appointments/${testAppointmentId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    done();
                });
        });

        it('DELETE /appointments/:id - should fail without auth', function(done) {
            chai.request(app)
                .delete('/appointments/507f1f77bcf86cd799439011')
                .end((err, res) => {
                    expect(res).to.have.status(401);
                    done();
                });
        });
    });

    // ==================== MECHANICS TESTS ====================
    describe('Mechanics - CRUD Operations', function() {
        let testMechanicId;

        it('GET /mechanics - should get all mechanics', function(done) {
            chai.request(app)
                .get('/mechanics')
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.an('array');
                    done();
                });
        });

        it('POST /mechanics - should create mechanic with auth', function(done) {
            chai.request(app)
                .post('/mechanics')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    name: 'John Doe',
                    email: 'john@mechanics.com',
                    specialization: 'Engine Repair',
                    phone: '5559876543',
                    experienceYears: 5
                })
                .end((err, res) => {
                    expect(res).to.have.status(201);
                    testMechanicId = res.body.id;
                    done();
                });
        });

        it('POST /mechanics - should fail without authentication', function(done) {
            chai.request(app)
                .post('/mechanics')
                .send({
                    name: 'Jane Smith',
                    email: 'jane@mechanics.com',
                    specialization: 'Electrical',
                    phone: '5555555555',
                    experienceYears: 3
                })
                .end((err, res) => {
                    expect(res).to.have.status(401);
                    done();
                });
        });

        it('GET /mechanics/:id - should get single mechanic', function(done) {
            if (!testMechanicId) return done(new Error('No ID'));
            chai.request(app)
                .get(`/mechanics/${testMechanicId}`)
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    done();
                });
        });

        it('GET /mechanics/:id - should return 404 for non-existent', function(done) {
            chai.request(app)
                .get('/mechanics/507f1f77bcf86cd799439011')
                .end((err, res) => {
                    expect(res).to.have.status(404);
                    done();
                });
        });

        it('PUT /mechanics/:id - should update with auth', function(done) {
            if (!testMechanicId) return done(new Error('No ID'));
            chai.request(app)
                .put(`/mechanics/${testMechanicId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({ experienceYears: 6 })
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    done();
                });
        });

        it('PUT /mechanics/:id - should fail without auth', function(done) {
            chai.request(app)
                .put('/mechanics/507f1f77bcf86cd799439011')
                .send({ experienceYears: 7 })
                .end((err, res) => {
                    expect(res).to.have.status(401);
                    done();
                });
        });

        it('DELETE /mechanics/:id - should delete with auth', function(done) {
            if (!testMechanicId) return done(new Error('No ID'));
            chai.request(app)
                .delete(`/mechanics/${testMechanicId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    done();
                });
        });

        it('DELETE /mechanics/:id - should fail without auth', function(done) {
            chai.request(app)
                .delete('/mechanics/507f1f77bcf86cd799439011')
                .end((err, res) => {
                    expect(res).to.have.status(401);
                    done();
                });
        });
    });

    // ==================== ERROR HANDLING TESTS ====================
    describe('Error Handling', function() {
        it('should handle invalid ObjectId format', function(done) {
            chai.request(app)
                .get('/mechanics/invalid-id')
                .end((err, res) => {
                    expect(res).to.have.status(400);
                    done();
                });
        });

        it('should handle 404 gracefully', function(done) {
            chai.request(app)
                .get('/appointments/507f1f77bcf86cd799439099')
                .end((err, res) => {
                    expect(res).to.have.status(404);
                    done();
                });
        });

        it('should validate input fields', function(done) {
            chai.request(app)
                .post('/mechanics')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    name: 'X',
                    experienceYears: -1
                })
                .end((err, res) => {
                    expect(res).to.have.status(400);
                    done();
                });
        });
    });

    // ==================== INTEGRATION TESTS ====================
    describe('Integration Tests', function() {
        it('should perform full CRUD on mechanics', function(done) {
            let testId;

            chai.request(app)
                .post('/mechanics')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    name: 'Integration Test',
                    email: 'integration@mechanics.com',
                    specialization: 'Transmission',
                    phone: '5551112233',
                    experienceYears: 2
                })
                .end((err, res) => {
                    expect(res).to.have.status(201);
                    testId = res.body.id;

                    chai.request(app)
                        .get(`/mechanics/${testId}`)
                        .end((err, res) => {
                            expect(res).to.have.status(200);

                            chai.request(app)
                                .put(`/mechanics/${testId}`)
                                .set('Authorization', `Bearer ${authToken}`)
                                .send({ experienceYears: 3 })
                                .end((err, res) => {
                                    expect(res).to.have.status(200);

                                    chai.request(app)
                                        .delete(`/mechanics/${testId}`)
                                        .set('Authorization', `Bearer ${authToken}`)
                                        .end((err, res) => {
                                            expect(res).to.have.status(200);
                                            done();
                                        });
                                });
                        });
                });
        });

        it('should handle full appointment workflow', function(done) {
            let clientId, serviceId, apptId;

            chai.request(app)
                .post('/clients')
                .send({
                    name: 'Workflow',
                    last_name: 'Test',
                    email: 'workflow@test.com',
                    phone: '5554443322',
                    dni: '222222'
                })
                .end((err, res) => {
                    clientId = res.body.id;

                    chai.request(app)
                        .post('/services')
                        .send({
                            name: 'Workflow Service',
                            description: 'Integration test service',
                            price: 125,
                            duration: 90
                        })
                        .end((err, res) => {
                            serviceId = res.body.id;

                            chai.request(app)
                                .post('/appointments')
                                .set('Authorization', `Bearer ${authToken}`)
                                .send({
                                    clientId: clientId,
                                    serviceId: serviceId,
                                    appointmentDate: '2026-08-01',
                                    appointmentTime: '09:00'
                                })
                                .end((err, res) => {
                                    expect(res).to.have.status(201);
                                    apptId = res.body.id;

                                    chai.request(app)
                                        .get(`/appointments/${apptId}`)
                                        .end((err, res) => {
                                            expect(res).to.have.status(200);
                                            done();
                                        });
                                });
                        });
                });
        });
    });
});
