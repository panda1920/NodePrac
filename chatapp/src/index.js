const express  = require('express');
const http     = require('http');
const socketio = require('socket.io');

const {
    generateMessage,
    generateLocationMessage
} = require('./utils/messages');
const {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
} = require('./utils/users');

const app      = express();
const port     = process.env.PORT;
const server   = http.createServer(app);
const io       = socketio(server);

app.use(express.static(process.env.STATIC_PATH));

io.on('connection', (socket) => {
    socket.on('join', (userinfo, callback) => {
        try {
            let user = addUser({socketId: socket.id, ...userinfo});
            socket.join(user.room);
            socket.emit('message', generateMessage('Admin', 'Welcome to the chat!'));
            socket.broadcast.to(user.room).emit('message', generateMessage('Admin', `${user.username} has joined the chat!`));

            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getUsersInRoom(user.room)
            });
        }
        catch(e) {
            return callback(e);
        }
 
        callback();
    });
    socket.on('sendMessage', (msg, callback) => {
        let user = getUser(socket.id);
        io.to(user.room).emit('message', generateMessage(user.username, msg)); 
        callback();
    });
    socket.on('disconnect', () => {
        let removedUser = removeUser(socket.id);
        if (!removedUser)
            return;
        
        io.to(removedUser.room).emit('message', generateMessage('Admin', `${removedUser.username} has left the chat!`));
        io.to(removedUser.room).emit('roomData', {
            room: removedUser.room,
            users: getUsersInRoom(removedUser.room)
        });
    });
    socket.on('send-location', (loc, callback) => {
        let user = getUser(socket.id);
        io.to(user.room).emit('locationMessage', generateLocationMessage(user.username, loc));
        callback();
    });
});

server.listen(port, () => {
    console.log(`server running on port: ${port}`);
})