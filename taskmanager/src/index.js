const express  = require("express");
const mongoose = require('./db/mongoose');
const userRouter = require("./routers/userRouters");
const taskRouter = require("./routers/taskRouters");

const app      = express();
const PORTNUM  = process.env.port || 3200;

// populate body property in requests
app.use(express.json());
// use routers
app.use(userRouter);
app.use(taskRouter);

// start listening to port
app.listen(PORTNUM, () => {
    console.log(`Server is running on ${PORTNUM}`);
});

// const Task = require('./models/task');
// const User = require('./models/user');

// async function pracref() {
//     let task = await Task.findOne({_id: '5d5b4f5cd2cffb2460d5800e'});
//     await task.populate('owner').execPopulate();
//     console.log(task.owner);

//     // let user = await User.findOne({_id: '5d51041794233e4fac3f37a1'});
//     // await user.populate('tasks').execPopulate();
//     // console.log(user.tasks);
// }

// pracref();