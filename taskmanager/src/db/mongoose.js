const mongoose = require("mongoose");
const User     = require("../models/user");
const Task     = require("../models/task");

const connectionURL = "mongodb://192.168.1.6:3000/task-manager-api";

mongoose.connect(
    connectionURL, 
    {useNewUrlParser: true, useCreateIndex: true}
);

// populateDBWithUser();
// populateDBWithTask();

function populateDBWithUser() {
    // mongoose enforces type checking;
    // insertion fails when the age field is passed a string
    // when it expects a number
    // const sampleUser = new User({name: "Ian", age: "Brown"});
    // const sampleUser = new User({name: "Ian", age: -22});
    insertUser({name: "Password is password", email: "test@test.com", password: "password"});
    insertUser({name: "No password specified", email: "test@test.com"});
    insertUser({name: "Password too short", email: "test@test.com", password: "passKK"});
    insertUser({name: "Password is contains password", email: "test@test.com", password: "Mypassword22"});

    insertUser({name: "Ian", email: "sampleemail@sample.com", password: "123456789"});
}
function populateDBWithTask() {
    insertTask({description: "completed field is not mandator"});
    insertTask({completed: true});

    insertTask({description: "Study node.js", completed: true});
    insertTask({description: "  Study docker   ", completed: false});
}

function insertUser(userobj) {
    insertDocument(userobj, User);
}
function insertTask(taskobj) {
    insertDocument(taskobj, Task);
}
function insertDocument(obj, model) {
    const newDocument = new model(obj);

    newDocument.save().then(result => {
        console.log(result);
    }).catch(reason => {
        console.log(reason);
    });
}

module.exports = {insertUser, insertTask};