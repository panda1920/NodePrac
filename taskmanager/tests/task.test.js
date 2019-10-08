const request = require('supertest');
const app     = require('../src/app.js');
const Task    = require('../src/models/task');
const {setupDB, testUsers, testTasks, getAuthorizationHeaderStrings, getTestUserFromStorage} = require('./fixtures/db');

beforeEach(setupDB);

test('Create task', async () => {
    let response = await request(app)
        .post('/tasks')
        .set(...getAuthorizationHeaderStrings(testUsers[0]))
        .send({description: "Workout"})
        .expect(201);

    let storedTask = await Task.findOne({_id: response.body._id});
    expect(storedTask).not.toBeNull();
    expect(storedTask.description).toEqual('Workout');
    expect(storedTask.owner).toEqual(testUsers[0]._id);
});
test('Fetch tasks for user1 should return 2 tasks', async () => {
    let response = await request(app)
        .get('/tasks')
        .set(...getAuthorizationHeaderStrings(testUsers[0]))
        .send()
        .expect(200);

    expect(response.body.length).toEqual(2);
})
test('user2 cannot delete tasks of user1', async () => {
    await request(app)
        .delete(`/tasks/${testTasks[0]._id.toString()}`)
        .set(...getAuthorizationHeaderStrings(testUsers[1]))
        .send()
        .expect(404);
    
    let tasks = await Task.find({owner: testUsers[0]._id});
    expect(tasks.length).toBe(2);
});