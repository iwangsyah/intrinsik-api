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

router.post('/register', (req, res) => {
    const { email, username, password } = req.body;

    const sqlCheck = "SELECT * FROM users WHERE email = " + connection.escape(email);

    connection.query(sqlCheck, (error, results) => {
        if (error) throw error;

        if (results.length == 0) {
            const sqlQuery = "INSERT INTO users ( email, username, password ) VALUES ( " + connection.escape(email) + ", " + connection.escape(username) + ", " + connection.escape(password) + " )";

            connect(sqlQuery, req, res);
        } else {
            connect(sqlCheck, req, res);
        }
    })
})

router.post('/contacts', (req, res) => {
    const { email } = req.body;
    const sqlQuery = "SELECT * FROM users WHERE email != " + connection.escape(email);
    connect(sqlQuery, req, res);
});

router.post('/chat/rooms/create', (req, res) => {
    const { id_user_1, id_user_2, username_1, username_2, last_chat_id } = req.body;

    const sqlCheck = "SELECT * FROM rooms WHERE (id_user_1 = " + connection.escape(id_user_1) + " AND id_user_2 = " + connection.escape(id_user_2) + ") OR (id_user_1 = " + connection.escape(id_user_2) + " AND id_user_2 = " + connection.escape(id_user_1) + ")";


    connection.query(sqlCheck, (error, results) => {
        if (error) throw error;
        if (results.length == 0) {
            const sqlQuery = "INSERT INTO rooms ( id_user_1, id_user_2, username_1, username_2, last_chat_id) VALUES (" + connection.escape(id_user_1) + ", " + connection.escape(id_user_2) + ", " + connection.escape(username_1) + ", " + connection.escape(username_2) + ", " + connection.escape(last_chat_id) + ")";

            connection.query(sqlQuery, (error, results) => {
                if (error) throw error;
                connect(sqlCheck, req, res);
            })
        }
    })
});

router.get('/chat/rooms/:id', (req, res) => {
    const { id } = req.params;
    const sqlQuery = "SELECT distinct rooms.id_room, rooms.id_user_1, rooms.username_1, username_2, rooms.id_user_2, chat.type, chat.message, chat.data, chat.is_read, chat.created_at FROM((rooms INNER JOIN users ON rooms.id_user_1 = " + connection.escape(id) + " OR rooms.id_user_2 = " + connection.escape(id) + ") INNER JOIN chat ON rooms.last_chat_id = chat.id_chat)";

    connect(sqlQuery, req, res);
});

router.get('/chat/list/:id', (req, res) => {
    const { id } = req.params;
    const sqlQuery = "SELECT * FROM chat WHERE id_room = " + connection.escape(id);

    connect(sqlQuery, req, res);
});

router.post('/chat/send', (req, res) => {
    const { id_room, id_user, type, data, message, created_at } = req.body;
    const sqlQuery = "INSERT INTO chat (id_room, id_user, type, data, message, created_at) VALUES (" + connection.escape(id_room) + ", " + connection.escape(id_user) + ", " + connection.escape(type) + ", " + connection.escape(data) + ", " + connection.escape(message) + ", " + connection.escape(created_at) + ")";

    connect(sqlQuery, req, res);
});


router.post('/chat/read', (req, res) => {
    const { id } = req.body;
    const sqlQuery = "UPDATE rooms SET is_read = 1 WHERE id_room = " + connection.escape(id);

    connect(sqlQuery, req, res);
});


router.post('/chat/last', (req, res) => {
    const { id_room, id_chat } = req.body;
    const sqlQuery = "UPDATE rooms SET last_chat_id = " + connection.escape(id_chat) + " WHERE id_room = " + connection.escape(id_room);

    connect(sqlQuery, req, res);
});

router.get('/chat/rooms/:id_1/:id_2', (req, res) => {
    const { id_1, id_2 } = req.params;
    const sqlQuery = "SELECT * FROM rooms WHERE id_user_1 = " + connection.escape(id_1) + " AND id_user_2 = " + connection.escape(id_2) + " OR id_user_1 = " + connection.escape(id_2) + " AND id_user_2 = " + connection.escape(id_1);

    connect(sqlQuery, req, res);
});

router.delete('/chat-list/:id', (req, res) => {
    res.send('delete list')
});

module.exports = router;

