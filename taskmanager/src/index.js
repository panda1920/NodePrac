const express  = require("express");
const mongoose = require('./db/mongoose');
const User = require("./models/user");
const Task = require("./models/task");
const utils = require("./models/utility");

const app      = express();
const PORTNUM  = process.env.port || 3200;

// populate body property in requests
app.use(express.json());

//////////////////////////////
// route handlers
//////////////////////////////

// route read requests
app.get('/users', async (req, res) => {
    try {
        let users = await User.find({});
        res.status(200).send(users);
    }
    catch(e) {
        res.status(500).send(e);
    }
});
app.get('/users/:id', async (req, res) => {
    let userId = req.params.id;

    try {
        let user = await User.findOne({_id: userId});
        if (!user) res.status(404).send();
        else res.status(200).send(user);
    } catch(e) {
        res.status(500).send(e);
    }
});

app.get('/tasks', async (req, res) => {
    try {
        let tasks = await Task.find({});
        res.status(200).send(tasks);
    } catch(e) {
        res.status(500).send(e);
    }
});
app.get('/tasks/:taskId', async (req, res) => {
    let taskId = req.params.taskId;

    try {
        let task = await Task.find({_id: taskId});
        if (!task) res.status(404).send();
        else res.status(200).send(task);
    } catch(e) {
        res.status(500).send(e);
    }
});

// route create requests
app.post('/users', async (req, res) => {
    let newUser = new User(req.body);
    try {
        await newUser.save();
        res.status(201).send(newUser);
    }
    catch (e) {
        res.status(400).send(e);
    }
});
app.post('/tasks', async (req, res) => {
    let newTask = new Task(req.body);
    try {
        await newTask.save();
        res.status(201).send(newTask);
    } catch(e) {
        res.status(400).send(e);
    }
});

// route update requests
app.patch('/users/:id', async (req, res) => {
    let update = req.body;
    if (!isUpdateValid(update, User))
        return res.status(400).send("Invalid update");

    let userId = req.params.id;
    try {
        let user = await User.findByIdAndUpdate(userId, update, {new: true, runValidators: true});
        if (!user) {
            return res.status(404).send("User not found");
        }
        else
            return res.status(200).send(user);
    } catch(e) {
        res.status(500).send(e);
    }
});
app.patch('/tasks/:id', async (req, res) => {
    let update = req.body;
    if (!isUpdateValid(update, Task))
        return res.status(400).send("Invalid update");

    let taskId = req.params.id;
    try {
        let task = await Task.findByIdAndUpdate(taskId, update, {new: true, runValidators: true});
        if (!task) {
            return res.status(404).send("Task not found");
        }
        else
            return res.status(200).send(task);
    } catch(e) {
        res.status(500).send(e);
    }
});

//////////////////////////////
// some functions
//////////////////////////////

// if there is a field in req that is not defined in model schema, returns false
function isUpdateValid(update, model) {
    let updateFields = Object.keys(update);
    return updateFields.every((field) => {
        return utils.getAllFieldsFromModel(model).includes(field);
    });
}

app.listen(PORTNUM, () => {
    console.log(`Server num is ${PORTNUM}`);
});