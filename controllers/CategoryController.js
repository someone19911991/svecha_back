const CategoryService = require('../services/CategoryService')

class CategoryController{
    async createCategory(req, res, next){
        try{
            await CategoryService.createCategory(req.body)
            return res.json({message: 'Category successfully created'})
        }catch(err){
            next(err)
        }

    }
}

module.exports = new CategoryController()