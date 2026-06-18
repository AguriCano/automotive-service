const router = require('express').Router();

router.use('/', require('./swagger'));
/* The code `router.get('/', (req, res) => {
    res.send('Welcome to the Automotive Service');
});` is setting up a route in an Express router. */
router.get('/', (req, res) => {
    //#swagger.tags = ['Welcome to the Automotive Service']
    res.send('Welcome to the Automotive Service');
});

router.use('/auth', require('./auth'));
router.use('/clients', require('./clients'));
router.use('/services', require('./services'));
router.use('/appointments', require('./appointments'));
router.use('/mechanics', require('./mechanics'));

module.exports = router;
