const express  = require("express");
const mongoose = require('./db/mongoose');
const User = require("./models/user");
const Task = require("./models/task");

const app      = express();
const PORTNUM  = process.env.port || 3200;

// populate body property in requests
app.use(express.json());

// route get requests
app.get('/users', (req, res) => {
    User.find({}).then(result => {
        res.send(result);
    }).catch(reason => {
        res.status(500).send();
    });
});
app.get('/users/:id', (req, res) => {
    let userId = req.params.id;
    User.findOne({_id: userId}).then(result => {
        if (! result) req.status(404).send();
        res.send(result);
    }).catch(reason => {
        res.status(500).send();
    });
});

// route post requests
app.post('/users', (req, res) => {
    let newUser = new User(req.body);
    newUser.save().then(() => {
        res.status(201).send(newUser);
    }).catch((reason) => {
        res.status(400).send(reason);
    });
});
app.post('/tasks', (req, res) => {
    let newTask = new Task(req.body);
    newTask.save().then(() => {
        res.status(201).send(newTask);
    }).catch((reason) => {
        res.status(400).send(reason);
    });
});

app.listen(PORTNUM, () => {
    console.log(`Server num is ${PORTNUM}`);
});