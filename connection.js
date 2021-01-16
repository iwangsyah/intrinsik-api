const mysql = require('mysql');
const connection = mysql.createPool({
    host: 'us-cdbr-east-03.cleardb.com',
    user: 'b0510d86d617f6',
    password: 'f8e01844',
    database: 'heroku_869dca18e0dbb80'
});

connection.connect(function (err) {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }
});

module.exports = connection;