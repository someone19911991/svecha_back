const ApiError = require('../exceptions/ApiError')

const ErrorMiddleware = (err, req, res, next) => {
    if(err instanceof ApiError){
        const {status, message, errors} = err
        return res.status(status).json({message, errors})
    }
    // return res.status(500).json({message: 'Unknown error'})
    return res.status(500).json(err.message)
}

module.exports = ErrorMiddleware