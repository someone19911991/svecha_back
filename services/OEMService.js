const db = require("../db")
const ApiError = require('../exceptions/ApiError')

class OEMService{
    async updateOEM(data){
        try{
            const {oem_id, ...rest} = data
            let propsToUpdate = ``
            for(let i in rest){
                propsToUpdate += `${i} = "${rest[i]}", `
            }
            propsToUpdate = propsToUpdate.slice(0, -2)
            let sql = `UPDATE oems SET ${propsToUpdate} WHERE oem_id = ${oem_id}`
            await db.promise().query(sql)
            return true
        }catch(err){
            throw ApiError.BadRequest(err.message)
        }
    }
    async deleteOEM(oem_id){
        try{
            let sql = `DELETE FROM oems WHERE oem_id = ${oem_id}`
            await db.promise().query(sql)
            return true
        }catch(err){
            throw ApiError.BadRequest(err.message)
        }
    }
}

module.exports = new OEMService()