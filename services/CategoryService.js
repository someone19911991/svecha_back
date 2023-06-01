const db = require('../db')
const { errMsg } = require('../constants')
const ApiError = require('../exceptions/ApiError')
const path = require('path')
const fs = require('fs')
const uuid = require('uuid')

class CategoryService {
    async createCategory(data) {
        try {
            const { img, ...restData } = data
            if(!img){
                throw ApiError.BadRequest('Img is required!')
            }
            const fileName = `${uuid.v4()}.${img.mimetype.split('/')[1]}`
            img.mv(path.resolve(__dirname, '..', 'static', fileName))
            const sql = `INSERT INTO categories SET ?`
            await db.promise().query(sql, { img: fileName, ...restData })
            return true
        } catch (err) {
            throw ApiError.BadRequest(err.message)
        }
    }

    async getCategory(categoryId) {
        try {
            const sql = `SELECT * FROM categories WHERE category_id = ${categoryId}`
            const result = await db.promise().query(sql)
            if (result?.[0]?.[0]) {
                return result?.[0]?.[0]
            }
        } catch (err) {
            throw ApiError.BadRequest(err.message)
        }
    }

    async updateCategory(data) {
        try {
            const { category_id, img, ...rest } = data
            let sql = `SELECT * FROM categories WHERE category_id = ${category_id}`
            let result = await db.promise().query(sql)
            const oldImg = result[0][0].img
            let fileName = ''
            if(img){
                fileName = `${uuid.v4()}.${img.mimetype.split('/')[1]}`
            }

            let sqlRequest = ''
            for (let i in rest) {
                sqlRequest += `${i} = "${rest[i]}", `
            }
            if(fileName){
                sqlRequest += `img = "${fileName}"  `
            }

            sqlRequest = sqlRequest.slice(0, -2)
            // return sqlRequest
            sql = `UPDATE categories SET ${sqlRequest} WHERE category_id = ${category_id}`
            await db.promise().query(sql)
            img.mv(path.resolve(__dirname, '..', 'static', fileName))
            const pathToImg = path.resolve(
                __dirname,
                '..',
                'static',
                oldImg
            )
            fs.unlinkSync(pathToImg)
            sql = `SELECT * FROM categories WHERE category_id = ${category_id}`
            result = await db.promise().query(sql)
            return result[0][0]
        } catch (err) {
            throw ApiError.BadRequest(err.message)
        }
    }

    async deleteCategory(categoryId) {
        try {
            const category = await this.getCategory(categoryId)
            if (category) {
                const sql = `DELETE FROM categories WHERE category_id = ${categoryId}`
                await db.promise().query(sql)
                const pathToImg = path.resolve(
                    __dirname,
                    '..',
                    'static',
                    category.img
                )
                fs.unlinkSync(pathToImg)
                return true
            } else {
                throw ApiError.BadRequest('Category not found')
            }
        } catch (err) {
            throw ApiError.BadRequest(err.message)
        }
    }

    async getCategories() {
        try {
            const sql = `SELECT * FROM categories`
            const categories = await db.promise().query(sql)
            return categories?.[0]
        } catch (err) {
            throw ApiError.BadRequest(err.message)
        }
    }
}

module.exports = new CategoryService()
