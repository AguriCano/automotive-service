const jwt = require('jsonwebtoken');

// Versión SIMPLE (sin bcrypt) - Recomendada para pruebas
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validar que se enviaron email y password
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        // Credenciales fijas para demostración
        // Usuario: admin@automotive.com / Contraseña: admin123
        if (email !== 'admin@automotive.com' || password !== 'admin123') {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generar token JWT
        const token = jwt.sign(
            { 
                email: email,
                role: 'admin',
                exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // expira en 24 horas
            },
            process.env.JWT_SECRET || 'automotive-service-secret-key-2026'
        );

        // Devolver token
        res.status(200).json({
            message: 'Login successful',
            token: token,
            expires_in: 86400
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const verifyToken = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'No token provided' });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'automotive-service-secret-key-2026');
        
        res.status(200).json({ 
            valid: true, 
            user: { email: decoded.email, role: decoded.role }
        });
    } catch (error) {
        res.status(401).json({ valid: false, error: error.message });
    }
};

module.exports = {
    login,
    verifyToken
};