const ApiError = require('../exceptions/ApiError')
const db = require('../db')

class BrandService{
    async getBrands(){
        try{
            let sql = `SELECT * FROM brands`
           const result = await db.promise().query(sql)
           return result[0]
        }catch(err){
            throw ApiError.ServerError(err.message)
        }
    }
}

module.exports = new BrandService()