const db = require('../db')
const ApiError = require("../exceptions/ApiError");
const uuid = require("uuid");

class TopSellersService {
    async checkIdentity(data){
        try{
            let { cookie, ls, product_id} = data
            let sql = `SELECT * FROM top_sellers WHERE product_id = "${product_id}" 
                            AND 
                              (cookie = "${cookie}" OR ls = "${ls}")`
            const result = await db.query(sql)

            if(!result[0].length){
                ls = uuid.v4()
                cookie = uuid.v4()
                sql = `INSERT INTO top_sellers(ls, cookie, product_id) VALUES("${ls}", "${cookie}", "${product_id}")`
            }else{
                cookie = data.cookie
                ls = data.ls
            }

            await db.query(sql)
            return {ls, cookie}
        }catch(err){
            throw ApiError.BadRequest(err.message)
        }
    }
}

module.exports = new TopSellersService()