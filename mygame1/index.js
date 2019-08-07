const express = require('express');
const app = express();

const PORTNUM = 4000;

app.use((req, res, next) => {
    console.log("Request has been detected!");
    // res.send("Hello World!");
    next();
});
app.use(/\/api\/character/, (req, res) => {
    console.log("You are interacting with character api!");
    res.json({name: 'joshua', age: 14});
});
app.listen(PORTNUM, () => {
    console.log(`Listening on ${PORTNUM}`);
});