const { check } = require('express-validator')

const signup = [
    check('email')
        .not()
        .isEmpty()
        .isEmail()
        .withMessage('Email must be a valid email'),
    check('password')
        .not()
        .isEmpty()
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 chars long'),
    check('username').trim().not().isEmpty().withMessage('Username is required'),
]

module.exports = { signup }
