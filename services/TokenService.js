const jwt = require('jsonwebtoken')
const db = require("../db")
const {JWT_ACCESS,JWT_REFRESH} = process.env
const ApiError = require('../exceptions/ApiError')

class TokenService{
    generateTokens(payload){
        const accessToken = jwt.sign(payload, JWT_ACCESS, {expiresIn: '15m'})
        const refreshToken = jwt.sign(payload, JWT_REFRESH, {expiresIn: '30d'})
        return {accessToken, refreshToken}
    }

    async saveToken(admin_id, refresh_token){
        try{
            let sql = `INSERT INTO tokens SET ?`
            await db.promise().query(sql, {admin_id, refresh_token})
            return true
        }catch(err){
            throw ApiError.BadRequest(err.message)
        }
    }
}

module.exports = new TokenService()