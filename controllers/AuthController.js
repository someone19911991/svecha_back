const AuthService = require('../services/AuthService')
const { APP_FRONT } = process.env
const { validationResult } = require('express-validator')
const ApiError = require('../exceptions/ApiError')

class AuthController {
    async signIn(req, res, next) {
        try {
            const result = await AuthService.signIn(req.body)
        } catch (err) {
            next(err)
        }
    }
    async signup(req, res, next) {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            const errorsToShow = {}
            errors.array().forEach((err) => {
                errorsToShow[err.param] = err.msg
            })
            return next(
                ApiError.BadRequest(
                    'Invalid credentials specified',
                    errorsToShow
                )
            )
        }
        try {
            await AuthService.signup(req.body)
            return res.json({
                message:
                    'Account successfully created, pls check your email to activate it',
            })
            // res.cookie('refreshToken', user.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true, secure: true})
            // const {refreshToken, ...userData} = user
            // return res.json(userData)
        } catch (err) {
            next(err)
        }
    }
    async logout(req, res, next) {}
    async refresh(req, res, next) {}

    async activateAccount(req, res, next) {
        try {
            const { activation_link } = req.params
            await AuthService.activateAccount(activation_link)
            res.redirect(APP_FRONT)
        } catch (err) {
            next(err)
        }
    }
}

module.exports = new AuthController()
