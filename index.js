require('dotenv').config()
const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const db = require('./db')
const app = express()
const router = require('./router')
const ErrorMiddleware = require('./middlewares/ErrorMiddleware')
const { PORT } = process.env

app.use(express.json())
app.use(cookieParser())
app.use(cors())
app.use('/api', router)
app.use(ErrorMiddleware)

const start = () => {
    app.listen(PORT, (err) => {
        db.connect((err) => {
            if (err) {
                throw err
            }
            console.log('Server started')
        })
        console.log(`App running on port ${PORT}`)
    })
}

start()
