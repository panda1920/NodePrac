const express  = require("express");
const mongoose = require('./db/mongoose');
const userRouter = require("./routers/userRouters");
const taskRouter = require("./routers/taskRouters");

const app      = express();
const PORTNUM  = process.env.PORT;

// populate body property in requests
app.use(express.json());
// use routers
app.use(userRouter);
app.use(taskRouter);

// start listening to port
app.listen(PORTNUM, () => {
    console.log(`Server is running on ${PORTNUM}`);
});

