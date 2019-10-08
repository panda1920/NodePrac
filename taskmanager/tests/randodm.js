const mongoose = require('mongoose');
const jwt      = require('jsonwebtoken');
const User     = require('../src/models/user');
const Task     = require('../src/models/task');

const testUsersBlueprint = [
    {name: 'example1', email: 'sampleEmail@taskmanagerapp.com', password: '11223344' },
    {name: 'example2', email: 'sampleEmail2@taskmanagerapp.com', password: '11223344' },
];

const testTasksBlueprint = [
    {description: `${testUsersBlueprint[0].name}: workout`, owner: 0},
    {description: `${testUsersBlueprint[0].name}: study`, owner: 0},
    {description: `${testUsersBlueprint[1].name}: workout`, owner: 1},
    {description: `${testUsersBlueprint[1].name}: study`, owner: 1},
];

let testUsers = [];
let testTasks = [];

async function setupDB() {
    // await User.deleteMany();
    addDynamicPropertiesToUsers();
    // await createTestUsers();

    // await Task.deleteMany();
    addDynamicPropertiesToTasks();
    // await createTestTasks();
}
function addDynamicPropertiesToUsers() {
    testUsers = [];
    for (blueprint of testUsersBlueprint) {
        let _id = new mongoose.Types.ObjectId;
        let token = jwt.sign({_id: _id.toString()}, process.env.JWT_SECRET);
        let testUser = {...blueprint, _id, tokens: [{token: token}]};
        testUsers.push(testUser);
    }
}
async function createTestUsers() {
    for (user of testUsers) {
        await new User(user).save();
    }
}
function addDynamicPropertiesToTasks() {
    testTasks = [];
    for (blueprint of testTasksBlueprint) {
        let testTask = {...blueprint};
        testTask.owner = testUsers[testTask.owner]._id;
        testTasks.push(testTask);
    }
}
async function createTestTasks() {
    for (task of testTasks) {
        await new Task(task).save();
    }
}

setupDB().then(() => {
    console.log(testTasks);
});