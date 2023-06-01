const CategoryService = require('../services/CategoryService')
const uuid = require("uuid")
const path = require('path')
const fs = require('fs')

class CategoryController{
    async createCategory(req, res, next){
        try{
            const img = req.files?.img
            await CategoryService.createCategory({...req.body, img})
            return res.json({message: 'Category successfully created'})
        }catch(err){
            next(err)
        }
    }

    async deleteCategory(req, res, next){
        try{
            const {id} = req.params
            await CategoryService.deleteCategory(id)
            return res.json({message: 'Category successfully deleted'})
        }catch(err){
            next(err)
        }
    }

    async getCategory(req, res, next){
        try{
            const {id} = req.params
            const category = await CategoryService.getCategory(id)
            return res.json(category)
        }catch(err){
            next(err)
        }
    }

    async updateCategory(req, res, next){
        try{
            console.log(req.params);
            return res.json('All right')
            const {id: category_id} = req.params
            const dataToPass = {category_id, ...req.body}
            const {img} = req.files
            if(img){
                dataToPass.img = img
            }
            const result = await CategoryService.updateCategory(dataToPass)
            return res.json(result)
        }catch(err){
            next(err)
        }
    }

    async getCategories(req, res, next){
        try{
            const categories = await CategoryService.getCategories()
            return res.json(categories)
        }catch(err){
            next(err)
        }
    }
}

module.exports = new CategoryController()