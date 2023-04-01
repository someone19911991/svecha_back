const { body } = require('express-validator')

const signup = [
    body('email').isEmail().withMessage('email must be a valid email'),
    body('password')
        .trim()
        .isLength({ min: 6 })
        .withMessage('password must be at least 6 chars long'),
    body('brand').trim().not().isEmpty().withMessage('brand is required'),
]


module.exports = { signup }
