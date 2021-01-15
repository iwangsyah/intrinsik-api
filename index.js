// var mysql = require('mysql');
// var connection = mysql.createConnection({
//     host: 'us-cdbr-east-03.cleardb.com',
//     user: 'ba40db63d59eac',
//     password: 'e7421c9a',
//     database: 'heroku_77109471d4e6761'
// });

// connection.connect(function (err) {
//     if (err) {
//         console.error('error connecting: ' + err.stack);
//         return;
//     }

//     console.log('connected as id ' + connection.threadId);
// });

const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server)
const port = process.env.PORT || 3000;

io.on("connection", socket => {
    console.log("connected: ");
    socket.on("chat message", msg => {
        console.log('msg: ', msg);
        io.emit("chat message", msg);
    })
});

server.listen(port, () => console.log("server running: " + port));