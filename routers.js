const express = require('express');
const router = express.Router();
const connection = require('./connection');

const connect = (sqlQuery, req, res) => {
    connection.query(sqlQuery, (error, results) => {
        if (error) throw error;
        res.send(results);
    });
}

router.post('/login', (req, res) => {
    const { email, password } = req.body;
    const sqlQuery = "SELECT * FROM users WHERE email = " + connection.escape(email) + "AND" + connection.escape(password);
    connect(sqlQuery, req, res);

})

router.post('/contacts', (req, res) => {
    const { email } = req.body;
    const sqlQuery = "SELECT * FROM users WHERE email != " + connection.escape(email);
    connect(sqlQuery, req, res);
});

// SELECT distinct rooms.id_room, rooms.id_user_1, rooms.id_user_2, chat.type, chat.message, chat.data, chat.is_read, chat.created_at
// FROM ((rooms
// INNER JOIN users ON rooms.id_user_1 = 1 OR rooms.id_user_2 = 1 )
// INNER JOIN chat ON rooms.last_chat_id = chat.id_chat);

// -- SELECT DISTINCT rooms.id_room, rooms.id_user_1, rooms.id_user_2, chat.type, chat.message, chat.data, chat.is_read, chat.created_at
// -- FROM rooms, users, chat
// -- WHERE rooms.id_user_1=1 OR rooms.id_user_2=1 AND rooms.last_chat_id=chat.id_chat;

router.post('/chat-rooms', (req, res) => {
    const { id } = req.body;
    const sqlQuery = "SELECT distinct rooms.id_room, rooms.id_user_1, rooms.username_1, username_2, rooms.id_user_2, chat.type, chat.message, chat.data, chat.is_read, chat.created_at FROM((rooms INNER JOIN users ON rooms.id_user_1 = " + connection.escape(id) + " OR rooms.id_user_2 = " + connection.escape(id) + ") INNER JOIN chat ON rooms.last_chat_id = chat.id_chat)";

    connect(sqlQuery, req, res);
});

router.get('/chat-list/:id', (req, res) => {
    const { id } = req.params;
    const sqlQuery = "SELECT * FROM chat WHERE id_room = " + connection.escape(id);

    connect(sqlQuery, req, res);
});

router.post('/chat-list', (req, res) => {
    const { id_room, id_user, type, data, message, created_at } = req.body;
    const sqlQuery = "INSERT INTO chat (id_room, id_user, type, data, message, created_at) VALUES (" + connection.escape(id_room) + ", " + connection.escape(id_user) + ", " + connection.escape(type) + ", " + connection.escape(data) + ", " + connection.escape(message) + ", " + connection.escape(created_at) + ")";

    connect(sqlQuery, req, res);
});


router.put('/chat-list/', (req, res) => {
    res.send('put chat list')
});

router.delete('/chat-list/:id', (req, res) => {
    res.send('delete list')
});

module.exports = router;

