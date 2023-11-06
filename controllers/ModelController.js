const modelsService = require('../services/ModelService')

class ModelController{
    async getModels(req, res, next){
        try{
            const result = await modelsService.getModels()
            return res.json(result)
        }catch(err){
            next(err)
        }
    }
    async getModelsByName(req, res, next){
        try{
            const { model } = req.params
            const result = await modelsService.getModelsByName(model)
            return res.json(result)
        }catch(err){
            next(err)
        }
    }
    async createModel(req, res, next){
        try{
            const {name} = req.body
            let img = req?.files?.img

            await modelsService.createModel({name, img})
            return res.json({message: 'Success'})
        }catch(err){
            next(err)
        }
    }
    async updateModel(req, res, next){
        try{
            const {name, id, oldImgName} = req.body
            let img = req?.files?.img

            await modelsService.updateModel({name, img, id, oldImgName})
            return res.json({message: 'Success'})
        }catch(err){
            next(err)
        }
    }
    async deleteModel(req, res, next){
        try{
            const {id} = req.params
            await modelsService.deleteModel(id)

            return res.json({message: 'Success'})
        }catch(err){
            next(err)
        }
    }
}

module.exports = new ModelController()