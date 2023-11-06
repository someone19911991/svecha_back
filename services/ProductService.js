const db = require('../db')
const { errMsg } = require('../constants')
const ApiError = require('../exceptions/ApiError')
const path = require('path')
const fs = require('fs')
const uuid = require('uuid')

class ProductService {
    async getProduct(category_name, product_id) {
        try {
            let sql = `SELECT * FROM products t1 INNER JOIN ${category_name} t2 ON t1.product_id = t2.product_id  
                            WHERE t1.category_name = "${category_name}" && t1.product_id = ${product_id}`
            let result = await db.query(sql)
            if (!result?.[0]?.[0]) {
                throw ApiError.BadRequest('Unknown category/product specified')
            }
            sql = `SELECT img, master FROM imgs WHERE product_id = ${product_id}`
            let imgs = await db.query(sql)
            sql = `SELECT ref_num, brand, product_id, ref_id FROM refs WHERE product_id = ${product_id}`
            let refs = await db.query(sql)
            sql = `SELECT oem, model, product_id, oem_id FROM oems WHERE product_id = ${product_id}`
            let oems = await db.query(sql)

            return {
                ...result[0][0],
                imgs: imgs?.[0],
                refs: refs?.[0],
                oems: oems?.[0],
            }
        } catch (err) {
            throw ApiError.BadRequest(err.message)
        }
    }

    async getAllProducts() {
        try {
            let sql = `SELECT p.*, i.img FROM products p INNER JOIN imgs i ON p.product_id = i.product_id WHERE i.master = 1`
            let result = await db.query(sql)
            return result[0]
        } catch (err) {
            throw ApiError.ServerError(err.message)
        }
    }

    async getProducts(category_name) {
        try {
            let sql = `SELECT * FROM products t1 
                            INNER JOIN ${category_name} t2 ON t1.product_id = t2.product_id 
                            INNER JOIN imgs i ON t1.product_id = i.product_id 
                            WHERE t1.category_name = "${category_name}" 
                            AND t1.product_id = i.product_id
                            AND i.master = 1`
            const result = await db.query(sql)
            return result?.[0]
        } catch (err) {
            throw ApiError.BadRequest(err.message)
        }
    }

    async getTopSellingProducts(){
        try{
            const sql = `SELECT p.*, COUNT(t.product_id) AS total_count
                                    FROM top_sellers t
                                  INNER JOIN products p ON t.product_id = p.product_id
                                GROUP BY p.product_id
                                 ORDER BY COUNT(t.product_id) DESC LIMIT 50`
            const res = await db.query(sql)
            return res[0]
        }catch(err){
            throw ApiError.BadRequest(err.message)
        }
    }

    async createProduct(data) {
        const {
            imgs,
            img_master,
            category_id,
            category_name,
            brand,
            model,
            refs,
            oems,
            detail_number,
            count_original,
            count_copy,
            price_copy,
            price_original,
            discount,
            top_selling,
            ...rest
        } = data

        try {
            const fileNames = []
            let sql = `SELECT * FROM categories WHERE category_id = ${category_id} && name_ = "${category_name}"`
            let result = await db.query(sql)
            if (!result?.[0]?.[0]) {
                throw ApiError.BadRequest('Unknown category specified')
            }

            sql = `INSERT INTO products SET ?`
            result = await db.query(sql, {
                brand,
                model,
                detail_number,
                category_id,
                category_name,
                count_original,
                count_copy,
                price_original,
                price_copy,
                top_selling
            })
            let insertId = result[0].insertId

            if(refs.length){
                const refValues = refs.map((ref) => [
                    ref.ref_num,
                    ref.brand,
                    insertId,
                ])
                sql = `INSERT INTO refs (ref_num, brand, product_id) VALUES ?`
                await db.query(sql, [refValues])    
            }
            
            if(oems.length){
                const oemValues = oems.map((item) => {
                    return [item.oem, item.model, insertId]
                })

                sql = `INSERT INTO oems (oem, model, product_id) VALUES ?`
                await db.query(sql, [oemValues])                
            }


            imgs.forEach((img) => {
                const fileName = `${uuid.v4()}.${img.mimetype.split('/')[1]}`
                img.mv(path.resolve(__dirname, '..', 'static', fileName))
                fileNames.push(fileName)
            })
            const imgValues = fileNames.map((imgItem, index) => [
                imgItem,
                img_master == index ? 1 : 0,
                insertId,
            ])

            sql = `INSERT INTO imgs (img, master, product_id) VALUES ?`
            await db.query(sql, [imgValues])

            sql = `INSERT INTO ${category_name} SET ?`
            await db.query(sql, { ...rest, product_id: insertId })
            return true
        } catch (err) {
            throw ApiError.BadRequest(err.message)
        }
    }

    async updateProduct(data) {
        try {
            //checking if the product exists
            const {
                product_id: prId,
                category_name: catName,
                ...restData
            } = data
            let sql = `SELECT * FROM products WHERE product_id = ${prId} && category_name = "${catName}"`
            let result = await db.query(sql)
            if (!result[0][0]) {
                throw ApiError.BadRequest('Unknown category/product specified')
            }

            //separating the props of product from category props
            let {
                category_id,
                brand,
                model,
                refs,
                oems,
                imgs,
                deleted_imgs,
                img_master,
                discount,
                count_original,
                count_copy,
                price_original,
                price_copy,
                detail_number,
                top_selling,
                ...rest
            } = restData

            oems = JSON.parse(oems)

            refs = JSON.parse(refs)

            deleted_imgs = JSON.parse(deleted_imgs)

            if(refs.length){
                const refValues = refs.map((ref) => [ref.ref_num, ref.brand, prId])
                if (refValues.length) {
                    sql = `DELETE FROM refs WHERE product_id = ${prId}`
                    await db.query(sql)
                    sql = `INSERT INTO refs (ref_num, brand, product_id) VALUES ?`
                    await db.query(sql, [refValues])
                }
            }
            
            if(oems.length){
                const oemValues = oems.map((item) => {
                    return [item.oem, item.model, prId]
                })
                sql = `DELETE FROM oems WHERE product_id = ${prId}`
                await db.query(sql)
                sql = `INSERT INTO oems (oem, model, product_id) VALUES ?`
                await db.query(sql, [oemValues])    
            }
            

            let propsToUpdate = ``
            let restPropsToUpdate = ``
            const keysToOmit = [
                'refs',
                'oems',
                'imgs',
                'img_master',
                'deleted_imgs',
                'category_name',
                'category_id',
                'product_id',
            ]
            for (let i in data) {
                if (keysToOmit.includes(i)) {
                    continue
                }
                if (rest[i]) {
                    restPropsToUpdate += `${i} = "${data[i]}", `
                } else {
                    propsToUpdate += `${i} = "${data[i]}", `
                }
            }
            restPropsToUpdate = restPropsToUpdate.slice(0, -2)
            propsToUpdate = propsToUpdate.slice(0, -2)
            if (propsToUpdate) {
                sql = `UPDATE products SET ${propsToUpdate} WHERE product_id = ${prId}`
                await db.query(sql)
            }
            if (restPropsToUpdate) {
                sql = `UPDATE ${catName} SET ${restPropsToUpdate} WHERE product_id = ${prId}`
                await db.query(sql)
            }
            if (deleted_imgs.length) {
                sql = `DELETE FROM imgs WHERE product_id = ${prId} AND img IN(`
                deleted_imgs.forEach((item) => {
                    sql += `"${item}", `
                    const pathName = path.resolve(
                        __dirname,
                        '..',
                        'static',
                        item
                    )
                    if (fs.existsSync(pathName)) {
                        fs.unlinkSync(pathName)
                    }
                })
                sql = sql.slice(0, -2)
                sql += ')'
                await db.query(sql)
            }

            if (imgs.length) {
                const fileNames = []
                imgs?.forEach((img) => {
                    const fileName = `${uuid.v4()}.${
                        img.mimetype.split('/')[1]
                    }`
                    img.mv(path.resolve(__dirname, '..', 'static', fileName))
                    fileNames.push(fileName)
                })
                const imgValues = fileNames.map((imgItem) => [imgItem, prId])

                sql = `INSERT INTO imgs (img, product_id) VALUES ?`

                await db.query(sql, [imgValues])
            }
            sql = `SELECT * FROM imgs WHERE product_id = ${prId}`
            let updateMsterImgSql = ''
            const productImgs = await db.query(sql)
            if (productImgs?.[0].length) {
                productImgs?.[0].forEach((imgItem, index) => {
                    if (index == img_master) {
                        updateMsterImgSql = `update imgs set master = case when img = "${imgItem.img}" then 1 when img != "${imgItem.img}" then 0 end where product_id = ${prId}`
                    }
                })
                if (updateMsterImgSql) {
                    await db.query(updateMsterImgSql)
                }
            }
        } catch (err) {
            console.log({ err })
            throw ApiError.BadRequest(err.message)
        }
    }

    async deleteProduct(data) {
        const { category_name, product_id } = data
        try {
            let sql = `SELECT * FROM imgs WHERE product_id = "${product_id}"`
            const res = await db.query(sql)
            if (res?.[0].length) {
                res?.[0].forEach((productItem) => {
                    const pathToImg = path.resolve(
                        __dirname,
                        '..',
                        'static',
                        productItem.img
                    )
                    if (fs.existsSync(pathToImg)) {
                        fs.unlinkSync(pathToImg)
                    }
                })
            }
            sql = `DELETE FROM products WHERE category_name = "${category_name}" && product_id = ${product_id}`
            await db.query(sql)
            return true
        } catch (err) {
            throw ApiError.BadRequest(err.message)
        }
    }

    async deleteRef({ product_id, refs }) {
        try {
            let refsToRemove = refs.reduce((acc, item) => {
                acc += `"${item}", `
                return acc
            }, '(')
            refsToRemove = refsToRemove.slice(0, -2)
            refsToRemove += ")";

            let sql = `DELETE FROM refs WHERE product_id = ${product_id} AND ref_num IN ${refsToRemove}`
            await db.query(sql)
        } catch (err) {
            throw ApiError.ServerError(err.message)
        }
    }

    async deleteOem({ product_id, oems }) {
        try {
            let oemsToRemove = oems.reduce((acc, item) => {
                acc += `"${item}", `
                return acc
            }, '(')
            oemsToRemove = oemsToRemove.slice(0, -2)
            oemsToRemove += ")";

            let sql = `DELETE FROM oems WHERE product_id = ${product_id} AND oem IN ${oemsToRemove}`
            await db.query(sql)
        } catch (err) {
            throw ApiError.ServerError(err.message)
        }
    }

    async deleteImg({ product_id, img }) {
        try {
            let sql = `DELETE FROM imgs WHERE product_id = ${product_id} AND img = "${img}"`
            await db.query(sql)
                        if(nextImg){
                sql = `UPDATE imgs SET master = 1 WHERE img = "${nextImg}"`
                await db.query(sql)
            }
            const imgPath = path.resolve(__dirname, '..', 'static', img)
            if (fs.existsSync(imgPath)) {
                fs.unlinkSync(imgPath)
            }
        } catch (err) {
            throw ApiError.ServerError(err.message)
        }
    }

    async getSparkPlugReferences(sparkPlug_id) {
        try {
            let sql = `SELECT * FROM products t1 INNER JOIN spark_plugs t2 ON t1.product_id = t2.product_id WHERE t1.product_id = ${sparkPlug_id} && t1.category_name = "spark_plugs"`
            let result = await db.query(sql)
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
            result = await db.query(sql)
            return result[0]
        } catch (err) {
            throw ApiError.BadRequest(err.message)
        }
    }

    async searchProduct(searchData) {
        try{
            let sql
            let resultsToReturn = []
            const searchDataWithoutChars = searchData.split(' ').join('').split('-').join('')

            sql = `SELECT DISTINCT p.*, i.img FROM products p INNER JOIN imgs i ON i.product_id = p.product_id 
                WHERE (REPLACE(REPLACE(p.model, '-', ''), ' ', '') = '${searchDataWithoutChars}' 
                OR REPLACE(REPLACE(p.detail_number, '-', ''), ' ', '') = '${searchDataWithoutChars}')
                AND i.master = '1'    
               `

            let trialResult = await db.query(sql)
            resultsToReturn = trialResult[0]

            if(resultsToReturn.length){
                return resultsToReturn
            }

            sql = `SELECT DISTINCT p.*, i.img FROM oems o INNER JOIN products p ON o.product_id = p.product_id
                    INNER JOIN imgs i ON i.product_id = o.product_id
                    WHERE REPLACE(REPLACE(o.oem, '-', ''), ' ', '') = '${searchDataWithoutChars}' 
                    AND i.master = '1'    
               `

            trialResult = await db.query(sql)
            resultsToReturn = trialResult[0]

            if(resultsToReturn.length){
                return resultsToReturn
            }

            sql = `SELECT DISTINCT p.*, i.img FROM refs r INNER JOIN products p ON r.product_id = p.product_id
                    INNER JOIN imgs i ON i.product_id = r.product_id
                    WHERE REPLACE(REPLACE(r.ref_num, '-', ''), ' ', '') = '${searchDataWithoutChars}' 
                    AND i.master = '1'    
               `

            trialResult = await db.query(sql)
            resultsToReturn = trialResult[0]

            if(resultsToReturn.length){
                return resultsToReturn
            }
            return null
        }catch(err){
            console.log({err})
        }
    }
}

module.exports = new ProductService()
