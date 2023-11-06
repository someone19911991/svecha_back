const uuid = require("uuid");
const path = require("path");
const ApiError = require("../exceptions/ApiError");
const db = require('../db')
const fs = require("fs");

class ModelService{
    async getModels(){
        try{
            const sql = `SELECT * FROM models`
            const result = await db.query(sql)
            return result[0]
        }catch(err){
            throw ApiError.BadRequest(err)
        }
    }
    async getModelsByName(model){
        try{
            const sql = `SELECT DISTINCT o.product_id, p.brand, p.detail_number, p.model, p.category_name, p.price_original,
                                         p.price_copy, p.count_original, p.count_copy, p.discount, i.img
                         FROM products p INNER JOIN oems o ON p.product_id = o.product_id
                                         INNER JOIN imgs i ON i.product_id = p.product_id WHERE o.model = '${model}' AND i.master = 1`
            const result = await db.query(sql)
            return result[0]
        }catch(err){
            throw ApiError.BadRequest(err.message)
        }
    }

    async createModel(data){
        try{
            const {name, img} = data
            const fileName = `${uuid.v4()}.${img.mimetype.split('/')[1]}`
            await img.mv(path.resolve(__dirname, '..', 'static', fileName))
            await db.query(`INSERT INTO models(name, img) VALUES ("${name}", "${fileName}");`)

            return {name, fileName}
        }catch(err){
            throw ApiError.BadRequest(err.message)
        }
    }

    async updateModel(data){
        try{
            const {name, img, id, oldImgName} = data
            if(img){
                const fileName = `${uuid.v4()}.${img.mimetype.split('/')[1]}`
                await img.mv(path.resolve(__dirname, '..', 'static', fileName))
                await db.query(`UPDATE models SET name = "${name}", img = "${fileName}" WHERE id = "${id}";`)
                const pathToImg = path.resolve(
                    __dirname,
                    '..',
                    'static',
                    oldImgName
                )
                if (fs.existsSync(pathToImg)) {
                    fs.unlinkSync(pathToImg)
                }
            }else{
                await db.query(`UPDATE models SET name = "${name}" WHERE id = "${id}";`)
            }


            return true
        }catch(err){
            throw ApiError.BadRequest(err.message)
        }
    }

    async deleteModel(modelId){
        try{
            const sql = `DELETE FROM models WHERE id = "${modelId}"`
            await db.query(sql)
        }catch(err){
            throw ApiError.BadRequest(err.message)
        }
    }

}

module.exports = new ModelService()