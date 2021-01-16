const express = require("express");
const app = express();
const routers = require('./routers');
const bodyParser = require('body-parser');
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

app.use(bodyParser.json());
app.use(routers);

server.listen(port, () => console.log("server running: " + port));