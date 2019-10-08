let users = [];

function addUser(user) {
    validateUser(user);
    user = sanitizeUser(user);
    checkUserDoesNotExist(user);

    users.push(user);
    return user;
}

function removeUser(id) {
    let foundIdx = users.findIndex(user => user.socketId === id);

    if (foundIdx !== -1)
        return users.splice(foundIdx, 1)[0];
}

function getUser(id) {
    return users.find(user => user.socketId === id);
}

function getUsersInRoom(room) {
    validateRoom(room);
    room = sanitizeRoom(room);
    return users.filter(user => user.room === room);
}

// helpers

function validateUser({username, room}) {
    validateUsername(username);
    validateRoom(room);
}
function validateUsername(username) {
    if (! username) {
        throw {error: 'Username is required'};
    }
}
function validateRoom(room) {
    if (! room) {
        throw {error: 'Room is required'};
    }
}
function sanitizeUser({socketId, username, room}) {
    let s_username = sanitizeUsername(username);
    let s_room = sanitizeRoom(room);
    return {socketId, username: s_username, room: s_room};
}
function sanitizeUsername(username) {
    return username.trim().toLowerCase();
}
function sanitizeRoom(room) {
    return room.trim().toLowerCase()
}
function checkUserDoesNotExist({username, room}) {
    let foundUser = users.find(user => {
        return user.username === username && user.room === room;
    });
    if (foundUser) {
        throw {error: `Username ${username} is already used!`};
    }
}

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
};