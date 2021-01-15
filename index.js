var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

var users = []
var port = process.env.PORT || 3000

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function (socket) {
    console.log('a user connected');
    socket.on('disconnect', function () {
        console.log('user disconnected');
    });
    socket.on('chat message', function (data) {
        let index = users.findIndex(user => {
            return user.userId === data.userId
        });
        users[index].socket.emit('chat message', data.message);
    });
    socket.on('online', function (userId) {
        users.push({
            socket,
            userId
        })
        console.log(users)
        // io.emit('chat message', msg);
    });
});

http.listen(port, function () {
    console.log('listening on *:3000');
});