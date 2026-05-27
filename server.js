const express = require('express');
const app = express();

const PORT = process.env.PORT || 3000;

//midware
/* The line `app.use('/', require('./routes'));` is setting up a middleware in the Express application. */
app.use('/',require('./routes'));

/* The `app.listen(PORT, () => { console.log(`Server is running on port `); });` code is
starting the Express server and telling it to listen for incoming requests on the specified port.
When a request is received, the server will log a message to the console indicating that it is
running on the specified port. */
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
