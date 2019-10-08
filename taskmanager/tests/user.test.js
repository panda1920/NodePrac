const request  = require('supertest');
const app      = require('../src/app.js');
const User     = require('../src/models/user');
const {setupDB, testUsers, getAuthorizationHeaderStrings, getTestUserFromStorage} = require('./fixtures/db');

beforeEach(setupDB);

// test cases

test('Create new user', async () => {
    let newUser = {
        name: "Josh",
        age: 13,
        email: "JoshTest@taskmanagerapp.com",
        password: "112233445566"
    };
    let response = await request(app)
        .post('/users')
        .send(newUser)
        .expect(201);

    // validate response
    expect(response.body.newUser).not.toBeNull();
    expect(response.body.token).not.toBeNull();

    // validate that it is stored in database
    let storedUser = await User.findOne({_id: response.body.newUser._id});
    expect(storedUser).not.toBeNull();
    expect(storedUser).not.toBe(newUser.password);
});
test('Should update valid user fields', async () => {
    await request(app)
        .patch('/users/me')
        .set(...getAuthorizationHeaderStrings(testUsers[0]))
        .send({name: 'Peter'})
        .expect(200)

    let storedUser = await getTestUserFromStorage(testUsers[0]);
    expect(storedUser.name).toBe('Peter');        
});
test('Should not update invalid user fields', async () => {
    await request(app)
        .patch('/users/me')
        .set(...getAuthorizationHeaderStrings(testUsers[0]))
        .send({location: 'New York'})
        .expect(400)
});
test('Log in existing user', async () => {
    let response = await request(app)
        .post('/users/login')
        .send({email: testUsers[0].email, password: testUsers[0].password})
        .expect(200);

    let storedUser = await getTestUserFromStorage(testUsers[0]);
    expect(storedUser.tokens[1].token).toBe(response.body.token);
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
        .set(...getAuthorizationHeaderStrings(testUsers[0]))
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
        .set(...getAuthorizationHeaderStrings(testUsers[0]))
        .send()
        .expect(200)

    let storedUser = await getTestUserFromStorage(testUsers[0]);
    expect(storedUser).toBeNull();
});
test('Should not delete account for unauthenticated user', async () => {
    await request(app)
        .delete('/users/me')
        .send()
        .expect(401)
});
test('Should upload avatar image', async () => {
    await request(app)
        .post('/users/me/avatar')
        .set(...getAuthorizationHeaderStrings(testUsers[0]))
        .attach('avatar', 'tests/fixtures/dog1.jpg')
        .expect(200);
    
    const storedUser = await getTestUserFromStorage(testUsers[0]);
    expect(storedUser.avatar).toEqual(expect.any(Buffer));
});