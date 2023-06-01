require('dotenv').config()
const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const fileUpload = require('express-fileupload')
const path = require('path')
const db = require('./db')
const app = express()
const router = require('./router')
const ErrorMiddleware = require('./middlewares/ErrorMiddleware')
const { PORT, APP_FRONT, APP_ADMIN  } = process.env

app.use(express.static(path.resolve(__dirname, 'static')))
app.use(cookieParser())
app.use(express.json())
app.use(fileUpload({}))
app.use(
    cors({ origin: [APP_FRONT, APP_ADMIN], credentials: true })
);
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
