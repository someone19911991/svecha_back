const bcrypt = require('bcrypt')
const uuid = require('uuid')
const db = require('../db')
const ApiError = require('../exceptions/ApiError')
const { REG_SECRET } = process.env
const { errMsg } = require('../constants')
const TokenService = require('../services/TokenService')
const MailService = require('../services/MailService')
const UserDto = require('../dtos/UserDto')

class AuthService {
    async signup(data) {
        try {
            const { username, email, password, secret } = data
            if (secret !== REG_SECRET) {
                throw ApiError.BadRequest(errMsg)
            }
            const query = `SELECT * FROM admin WHERE email = "${email}"`
            let result = await db.promise().query(query)
            if (result?.[0]?.[0]) {
                throw ApiError.BadRequest(
                    'User with the specified email already exists'
                )
            }
            const activation_link = uuid.v4()
            const hashedPass = await bcrypt.hash(password, 12)
            let sql = `INSERT INTO admin SET ?`
            await db.promise().query(sql, {
                username,
                password: hashedPass,
                email,
                activation_link,
            })
            await MailService.sendActivationMail(email, activation_link)
            return true
        } catch (err) {
            throw ApiError.BadRequest(err.message)
        }
    }

    async signIn(userData) {
        try {
            const { email, password } = userData
            let sql = `SELECT * FROM admin WHERE email = "${email}"`
            const admin = await db.promise().query(sql)
            if (!admin[0][0]) {
                throw ApiError.BadRequest('User does not exist')
            }
            if (!admin[0][0].is_active) {
                throw ApiError.BadRequest('Your account is not active')
            }
            const pass = admin[0][0].password
            const arePassEqual = await bcrypt.compare(password, pass)
            if (!arePassEqual) {
                throw ApiError.BadRequest('Incorrect password')
            }

            const userDto = { ...new UserDto(admin[0][0]) }
            const tokens = TokenService.generateTokens(userDto)
            await TokenService.saveToken(userDto.admin_id, tokens.refreshToken)
            return { ...tokens, user: userDto }
        } catch (err) {
            throw ApiError.BadRequest(err)
        }
    }

    async logout(refreshToken) {
        try {
            await TokenService.deleteToken(refreshToken)
            return true
        } catch (err) {
            ApiError.BadRequest(err.message)
        }
    }

    async activateAccount(activation_link) {
        try {
            let sql = `SELECT * FROM admin WHERE activation_link = "${activation_link}"`
            let result = await db.promise().query(sql)
            if (!result?.[0]?.[0]) {
                throw ApiError.BadRequest('Unknown user')
            }
            sql = `UPDATE admin SET is_active = true WHERE activation_link = "${activation_link}"`
            await db.promise().query(sql)
            return true
        } catch (err) {
            throw ApiError.BadRequest(err.message)
        }
    }

    async refresh(refreshToken) {
        if (!refreshToken) {
            throw ApiError.UnauthorizedError()
        }

        const userData = TokenService.validateRefreshToken(refreshToken)
        if(!userData){
            throw ApiError.UnauthorizedError()
        }
        const tokenInDb = await TokenService.checkToken(userData.admin_id, refreshToken)
        if(!tokenInDb){
            throw ApiError.UnauthorizedError()
        }
        const userDto = { ...new UserDto(userData) }
        const tokens = TokenService.generateTokens(userDto)
        await TokenService.saveToken(userDto.admin_id, tokens.refreshToken)
        return { ...tokens, user: userDto }
    }
}

module.exports = new AuthService()
