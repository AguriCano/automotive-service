const router = require('express').Router();

/* The code `router.get('/', (req, res) => {
    res.send('Welcome to the Automotive Service');
});` is setting up a route in an Express router. */
router.get('/', (req, res) => {
    res.send('Welcome to the Automotive Service');
});

router.use('/clients', require('./clients'));

module.exports = router;
