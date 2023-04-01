const mysql = require('mysql2')
const { HOST, USER, PASSWORD, DATABASE } = process.env

const db = mysql.createConnection({
    host: HOST,
    user: USER,
    password: PASSWORD,
    database: DATABASE,
})

const db2 = mysql.createConnection({
    host: HOST,
    user: USER,
    password: PASSWORD,
    database: DATABASE,
})

module.exports = db
