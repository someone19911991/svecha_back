const bcrypt = require('bcrypt')
const uuid = require("uuid")
const db = require('../db')
const ApiError = require('../exceptions/ApiError')
const { REG_SECRET } = process.env
const { errMsg } = require('../constants')
const TokenService = require("../services/TokenService")
const MailService = require("../services/MailService")
const UserDto = require("../dtos/UserDto")

class AuthService {
    async signup(data) {
        try {
            const { username, email, password, secret } = data
            if (secret !== REG_SECRET) {
                throw ApiError.BadRequest(
                    errMsg
                )
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
            result = await db
                .promise()
                .query(sql, { username, password: hashedPass, email, activation_link })
            const insertId = result[0].insertId
            const userDto = new UserDto({admin_id: insertId, email, username})
            const tokens = TokenService.generateTokens({...userDto})
            await TokenService.saveToken(insertId, tokens.refreshToken)
            await MailService.sendActivationMail(email, activation_link)
            return {...tokens, user: userDto}
        } catch (err) {
            throw ApiError.BadRequest(err.message)
        }
    }

    async signIn(){

    }

    async activateAccount(activation_link){
        try{
            let sql = `SELECT * FROM admin WHERE activation_link = "${activation_link}"`
            let result = await db.promise().query(sql)
            if(!result?.[0]?.[0]){
                throw ApiError.BadRequest('Unknown user')
            }
            sql = `UPDATE admin SET is_active = true WHERE activation_link = "${activation_link}"`
            result = await db.promise().query(sql)
        }catch(err){
            throw ApiError.BadRequest(err.message)
        }

    }
}

module.exports = new AuthService()
