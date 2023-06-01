const jwt = require('jsonwebtoken')
const db = require('../db')
const { JWT_ACCESS, JWT_REFRESH } = process.env
const ApiError = require('../exceptions/ApiError')

class TokenService {
    generateTokens(payload) {
        const accessToken = jwt.sign(payload, JWT_ACCESS, { expiresIn: '15m' })
        const refreshToken = jwt.sign(payload, JWT_REFRESH, {
            expiresIn: '30d',
        })
        return { accessToken, refreshToken }
    }

    async saveToken(admin_id, refresh_token) {
        try {
            let sql = `SELECT * FROM tokens WHERE admin_id = ${admin_id}`
            let result = await db.promise().query(sql)
            if (result[0][0]) {
                sql = `UPDATE tokens SET refresh_token = "${refresh_token}" WHERE admin_id = ${admin_id}`
                await db.promise().query(sql)
            } else {
                sql = `INSERT INTO tokens SET ?`
                await db.promise().query(sql, { admin_id, refresh_token })
            }

            return true
        } catch (err) {
            throw ApiError.BadRequest(err.message)
        }
    }

    async checkToken(admin_id, refresh_token){
        try{
            if(!admin_id || !refresh_token){
                throw ApiError.UnauthorizedError()
            }
            let sql = `SELECT * FROM tokens WHERE admin_id = ${admin_id}`
            let result = await db.promise().query(sql)
            if(result?.[0]?.[0].refresh_token !== refresh_token){
                throw ApiError.UnauthorizedError()
            }
            return true
        }catch(err){
            throw ApiError.UnauthorizedError()
        }

    }

    async deleteToken(refreshToken) {
        try {
            let sql = `DELETE FROM tokens WHERE refresh_token = "${refreshToken}"`
            await db.promise().query(sql)
        } catch (err) {
            throw ApiError.BadRequest(err.message)
        }
    }

    validateAccessToken(accessToken) {
        try {
            const userData = jwt.verify(accessToken, JWT_ACCESS)
            return userData
        } catch (err) {
            return null
        }
    }

    validateRefreshToken(refreshToken) {
        try {
            const userData = jwt.verify(refreshToken, JWT_REFRESH)
            return userData
        } catch (err) {
            console.log(err.message)
            return null
        }
    }
}

module.exports = new TokenService()
