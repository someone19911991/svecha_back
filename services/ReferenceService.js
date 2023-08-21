const db = require('../db')
const ApiError = require('../exceptions/ApiError')

class ReferenceService{
    async updateReference(data){
        try{
            const {ref_id, ...rest} = data
            let propsToUpdate = ``
            for(let i in rest){
                propsToUpdate += `${i} = "${rest[i]}", `
            }
            propsToUpdate = propsToUpdate.slice(0, -2)
            let sql = `UPDATE refs SET ${propsToUpdate} WHERE ref_id = ${ref_id}`
            await db.query(sql)
            return true
        }catch(err){
            throw ApiError.BadRequest(err.message)
        }
    }
    async deleteReference(ref_id){
        try{
            let sql = `DELETE FROM refs WHERE ref_id = ${ref_id}`
            await db.query(sql)
            return true
        }catch(err){
            throw ApiError.BadRequest(err.message)
        }
    }
}

module.exports = new ReferenceService()