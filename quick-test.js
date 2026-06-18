const app = require('./server');
const request = require('superagent');

async function quickTest() {
    try {
        // Start server implicitly through app loading
        console.log('Testing API endpoints...\n');

        // Login
        let res = await request
            .post('http://localhost:3000/auth/login')
            .send({email: 'admin@automotive.com', password: 'admin123'});
        console.log('✓ Login:', res.status);
        const token = res.body.token;

        // Create client
        res = await request
            .post('http://localhost:3000/clients')
            .send({
                name: 'Debug', last_name: 'Test', email: 'debug@example.com', 
                phone: '1234567890', dni: '123456'
            });
        console.log('✓ Create Client:', res.status);
        const clientId = res.body.id;
        console.log('  Client ID type:', typeof clientId, 'value:', clientId);
        console.log('  Client ID length:', clientId?.toString?.().length);

        // Create service
        res = await request
            .post('http://localhost:3000/services')
            .send({
                name: 'Debug Service', description: 'Test', price: 50, duration: 30
            });
        console.log('✓ Create Service:', res.status);
        const serviceId = res.body.id;
        console.log('  Service ID type:', typeof serviceId, 'value:', serviceId);
        console.log('  Service ID length:', serviceId?.toString?.().length);

        // Create appointment
        console.log('\nCreating appointment with:');
        console.log('  clientId:', clientId);
        console.log('  serviceId:', serviceId);
        
        res = await request
            .post('http://localhost:3000/appointments')
            .set('Authorization', `Bearer ${token}`)
            .send({
                clientId: clientId,
                serviceId: serviceId,
                appointmentDate: '2026-07-10',
                appointmentTime: '10:00'
            });
        console.log('✓ Create Appointment:', res.status);
        console.log('  Response:', res.body);

    } catch (err) {
        console.error('✗ Error:', err.status, err.response?.body?.errors || err.response?.body || err.message);
    }
    
    process.exit(0);
}

// Give server time to start
setTimeout(() => quickTest(), 1000);
