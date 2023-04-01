const db = require('../db')
const { errMsg } = require('../constants')
const ApiError = require('../exceptions/ApiError')

class ProductService {
    async getProduct(category_name, product_id) {
        try {
            let sql = `SELECT * FROM products t1 INNER JOIN ${category_name} t2 ON t1.product_id = t2.product_id  
                            WHERE t1.category_name = "${category_name}" && t1.product_id = ${product_id}`
            let result = await db.promise().query(sql)
            if (!result?.[0]?.[0]) {
                throw ApiError.BadRequest('Unknown category/product specified')
            }
            return result[0][0]
        } catch (err) {
            throw ApiError.BadRequest(err.message)
        }
    }

    async getProducts(category_name) {
        try {
            const sql = `SELECT * FROM products t1 INNER JOIN ${category_name} t2 ON t1.product_id = t2.product_id
                            WHERE t1.category_name = "${category_name}"`
            const result = await db.promise().query(sql)
            return result[0]
        } catch (err) {
            throw ApiError.BadRequest(errMsg)
        }
    }

    async createProduct(data) {
        const {
            category_id,
            category_name,
            brand,
            model,
            ref_num,
            detail_number,
            ...rest
        } = data
        try {
            let sql = `SELECT * FROM categories WHERE category_id = ${category_id} && name_ = "${category_name}"`
            let result = await db.promise().query(sql)
            if (!result?.[0]?.[0]) {
                throw ApiError.BadRequest('Unknown category specified')
            }

            sql = `INSERT INTO products SET ?`
            result = await db.promise().query(sql, {
                brand,
                model,
                ref_num,
                detail_number,
                category_id,
                category_name,
            })
            let insertId = result[0].insertId
            const { references, oems, ...restData } = rest
            if (references.length) {
                const values = references.map((ref) => [ref, insertId])
                sql = `INSERT INTO refs (ref, product_id) VALUES ?`
                await db.promise().query(sql, [values])
            }

            if (oems && oems.length) {
                const values = oems.map((item) => {
                    return [item.oem, item.car, insertId]
                })
                sql = `INSERT INTO oems (oem, car, product_id) VALUES ?`
                await db.promise().query(sql, [values])
            }

            insertId = result[0].insertId
            sql = `INSERT INTO ${category_name} SET ?`
            await db.promise().query(sql, { ...restData, product_id: insertId })
            return true
        } catch (err) {
            throw ApiError.BadRequest(err.message)
        }
    }

    async updateProduct(data) {
        try {
            //checking if the product exists
            const { product_id, category_name, ...restData } = data
            let sql = `SELECT * FROM products WHERE product_id = ${product_id} && category_name = "${category_name}"`
            let result = await db.promise().query(sql)
            if (!result[0][0]) {
                throw ApiError.BadRequest('Unknown category/product specified')
            }

            //separating the props of product from category props
            const {
                category_id,
                brand,
                model,
                ref_num,
                detail_number,
                ...rest
            } = restData

            //preparing props to be updated for products and category props tables
            let propsToUpdate = ``
            let restPropsToUpdate = ``
            for (let i in data) {
                if (rest[i]) {
                    restPropsToUpdate += `${i} = "${data[i]}", `
                } else {
                    propsToUpdate += `${i} = "${data[i]}", `
                }
            }
            restPropsToUpdate = restPropsToUpdate.slice(0, -2)
            propsToUpdate = propsToUpdate.slice(0, -2)
            if (propsToUpdate) {
                sql = `UPDATE products SET ${propsToUpdate} WHERE product_id = ${product_id}`
                await db.promise().query(sql)
            }
            if (restPropsToUpdate) {
                sql = `UPDATE ${category_name} SET ${restPropsToUpdate} WHERE product_id = ${product_id}`
                await db.promise().query(sql)
            }
        } catch (err) {
            throw ApiError.BadRequest(err.message)
        }
    }

    async deleteProduct(data) {
        const { category_name, product_id } = data
        try {
            let sql = `DELETE FROM products WHERE category_name = "${category_name}" && product_id = ${product_id}`
            await db.promise().query(sql)
            return true
        } catch (err) {
            throw ApiError.BadRequest(errMsg)
        }
    }

    async getSparkPlugReferences(sparkPlug_id) {
        try {
            let sql = `SELECT * FROM products t1 INNER JOIN spark_plugs t2 ON t1.product_id = t2.product_id WHERE t1.product_id = ${sparkPlug_id} && t1.category_name = "spark_plugs"`
            let result = await db.promise().query(sql)
            if (!result?.[0]?.[0]) {
                throw ApiError.BadRequest('Unknown spark plug specified')
            }
            result = result?.[0]?.[0]
            const {
                key_type,
                key_size,
                seat_type,
                thread_size,
                thread_length,
                electrodes_number,
            } = result
            sql = `SELECT * FROM products t1 INNER JOIN spark_plugs t2 ON t1.product_id = t2.product_id
                        WHERE t2.key_type = "${key_type}" && t2.key_size = "${key_size}" && t2.seat_type = "${seat_type}"
                            && thread_size = ${thread_size} && thread_length = ${thread_length} 
                            && electrodes_number = "${electrodes_number}" && t2.product_id != ${sparkPlug_id}
                    `
            result = await db.promise().query(sql)
            return result[0]
        } catch (err) {
            throw ApiError.BadRequest(err.message)
        }
    }

    async searchProduct(searchData) {
        try {
            //search by ref_num
            let sql = `SELECT * FROM products WHERE ref_num = "${searchData}"`
            let result = await db.promise().query(sql)
            if (result[0].length) {
                const { category_name } = result[0][0]
                sql = `SELECT * FROM products t1 
                            INNER JOIN ${category_name} t2 ON t1.product_id = t2.product_id
                            WHERE t1.ref_num = "${searchData}"
                    `
                let product = await db.promise().query(sql)
                return product[0]
            }

            //search by detail_number
            sql = `SELECT * FROM products WHERE detail_number = "${searchData}"`
            result = await db.promise().query(sql)

            if (result[0].length) {
                let dataToReturn = result[0].map(async (item) => {
                    const { category_name } = item
                    sql = `SELECT * FROM products t1 INNER JOIN ${category_name} t2 ON t1.product_id = t2.product_id
                            WHERE t1.product_id = "${item.product_id}"`
                    const res = await db.promise().query(sql)
                    return res[0][0]
                })
                dataToReturn = await Promise.all(dataToReturn)
                return dataToReturn
            }

            //search by oem
            sql = `SELECT * FROM products t1 INNER JOIN oems t2 ON t1.product_id = t2.product_id WHERE t2.oem = ${searchData}`
            result = await db.promise().query(sql)
            if (result[0].length) {
                let promises = result[0].map(async (item) => {
                    const { category_name } = item
                    sql = `SELECT * FROM products t1 INNER JOIN ${category_name} t2 ON t1.product_id = t2.product_id
                            WHERE t1.product_id = t2.product_id`
                    const res = await db.promise().query(sql)
                    return res[0][0]
                })
                const allPromises = await Promise.all(promises)
                const dataToReturn = {}
                allPromises.forEach(item => {
                    dataToReturn[item.product_id] = item
                })
                return Object.values(dataToReturn)
            }
        } catch (err) {
            throw ApiError.BadRequest(err.message)
        }
    }
}

module.exports = new ProductService()
