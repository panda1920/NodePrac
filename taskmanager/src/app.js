const express  = require("express");
const mongoose = require('./db/mongoose');
const userRouter = require("./routers/userRouters");
const taskRouter = require("./routers/taskRouters");

const app      = express();

// populate body property in requests
app.use(express.json());
// use routers
app.use(userRouter);
app.use(taskRouter);

module.exports = app;
