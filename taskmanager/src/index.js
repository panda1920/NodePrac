const app      = require('./app');
const PORTNUM  = process.env.PORT;

// start listening to port
app.listen(PORTNUM, () => {
    console.log(`Server is running on ${PORTNUM}`);
});

