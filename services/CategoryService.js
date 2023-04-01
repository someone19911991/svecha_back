const db = require('../db')
const { errMsg } = require('../constants')
const ApiError = require('../exceptions/ApiError')

class CategoryService {
    async createCategory(data) {
        try {
            const sql = `INSERT INTO categories SET ?`
            await db.promise().query(sql, data)
            return true
        } catch (err) {
            throw ApiError.BadRequest(errMsg)
        }
    }
}

module.exports = new CategoryService()
