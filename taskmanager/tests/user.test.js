const request  = require('supertest');
const mongoose = require('mongoose');
const jwt      = require('jsonwebtoken');
const app      = require('../src/app.js');
const User     = require('../src/models/user');

let testUsers = [
    {name: "example1", email: "korean.panda@gmail.com", password: "11223344" },
    // {name: "example2", email: "korean.panda@gmail.com", password: "11223344"},
    // {name: "example3", email: "korean.panda@gmail.com", password: "11223344"},
];

beforeEach(async () => {
    await User.deleteMany();
    addDynamicPropertiesToUsers();
    await createTestUsers();
});

function addDynamicPropertiesToUsers() {
    let id = new mongoose.Types.ObjectId;
    let token = jwt.sign({_id: id.toString()}, process.env.JWT_SECRET);
    for (testUser of testUsers) {
        testUser["_id"] = id;
        testUser["tokens"] = [{token}];
    }
}

async function createTestUsers() {
    for (testUser of testUsers) {
        await createUser(testUser);
    }
}
async function createUser(userJson) {
    return await new User(userJson).save();
}

test('Log in existing user', async () => {
    await request(app)
        .post('/users/login')
        .send({email: testUsers[0].email, password: testUsers[0].password})
        .expect(200);
});
test('Log in with wrong password', async () => {
    await request(app)
        .post('/users/login')
        .send({email: testUsers[0].email, password: "1122334455"})
        .expect(400);
});
test('Log in with non existing email', async () => {
    await request(app)
        .post('/users/login')
        .send({email: "non-existentEmail112233@gmail.com", password: "11223344"})
        .expect(400);
});
test('Fetch user profile', async () => {
    await request(app)
        .get('/users/me')
        .set('Authorization', `Bearer ${testUsers[0].tokens[0].token}`)
        .send()
        .expect(200)
});
test('Should not get profile for unauthenticated user', async () => {
    await request(app)
        .get('/users/me')
        .send()
        .expect(401)
});
test('Should delete account for user', async () => {
    await request(app)
        .delete('/users/me')
        .set('Authorization', `Bearer ${testUsers[0].tokens[0].token}`)
        .send()
        .expect(200)
});
test('Should not delete account for unauthenticated user', async () => {
    await request(app)
        .delete('/users/me')
        .send()
        .expect(401)
});