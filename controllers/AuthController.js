const AuthService = require('../services/AuthService')
const { APP_FRONT } = process.env
const { validationResult } = require('express-validator')
const ApiError = require('../exceptions/ApiError')

class AuthController {
    async signIn(req, res, next) {
        try {
            const user = await AuthService.signIn(req.body)
            const { refreshToken, ...userData } = user
            res.cookie('refreshToken', refreshToken, {
                maxAge: 30 * 24 * 60 * 60 * 1000,
                httpOnly: true,
                secure: true,
            })
            return res.json(userData)
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
        } catch (err) {
            next(err)
        }
    }

    async passwordForgotten(req, res, next){
        try{
            const {email} = req.body
            await AuthService.passwordForgotten(email)
            return res.json({message: 'All right'})
        }catch(err){
            next(err)
        }
    }

    async changePassword(req, res, next){
        try{
            const {password, token} = req.body
            await AuthService.changePassword({password, token})
            return res.json({message: 'All right'})
        }catch(err){
            next(err)
        }
    }

    async logout(req, res, next) {
        try {
            const { refreshToken } = req.cookies
            await AuthService.logout(refreshToken)
            res.clearCookie('refreshToken')
            return res.json({message: 'Logout success'})
        } catch (err) {
            next(err)
        }
    }


    async refresh(req, res, next) {
        try{
            if(!req?.cookies?.refreshToken){
                throw ApiError.UnauthorizedError()
            }
            const {refreshToken} = req.cookies
            const user = await AuthService.refresh(refreshToken)
            const {refreshToken: rToken, ...userData} = user
            res.cookie('refreshToken', rToken, {
                maxAge: 30 * 24 * 60 * 60 * 1000,
                httpOnly: true,
                secure: true,
            })
            return res.json(userData)
        }catch(err){
            next(err)
        }
    }

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
