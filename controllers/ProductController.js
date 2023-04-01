const ProductService = require('../services/ProductService')
const { validationResult } = require('express-validator')
const ApiError = require('../exceptions/ApiError')

class ProductController {
    async getProduct(req, res, next) {
        try {
            const { category_name, product_id } = req.params
            const result = await ProductService.getProduct(
                category_name,
                product_id
            )
            return res.json(result)
        } catch (err) {
            next(err)
        }
    }

    async getProducts(req, res, next) {
        try {
            const result = await ProductService.getProducts(
                req.params.category_name
            )
            return res.json(result)
        } catch (err) {
            next(err)
        }
    }

    async createProduct(req, res, next) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                const errorsToShow = {}
                errors.array().forEach((item) => {
                    errorsToShow[item.param] = item.msg
                })
                return next(
                    ApiError.BadRequest(
                        'Invalid credentials specified',
                        errorsToShow
                    )
                )
            }
            return errors.array()
            await ProductService.createProduct(req.body)
            return res.json({ message: 'Product successfully created' })
        } catch (err) {
            next(err)
        }
    }

    async updateProduct(req, res, next) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                const errorsToShow = {}
                errors.array().forEach((item) => {
                    errorsToShow[item.param] = item.msg
                })

                return next(
                    ApiError.BadRequest(
                        'Invalid credentials specified',
                        errorsToShow
                    )
                )
            }

            const { product_id, category_name } = req.params
            await ProductService.updateProduct({
                product_id,
                category_name,
                ...req.body,
            })
            return res.json({ message: 'Product successfully updated' })
        } catch (err) {
            next(err)
        }
    }

    async deleteProduct(req, res, next) {
        try {
            const { product_id, category_name } = req.params
            await ProductService.deleteProduct({
                product_id,
                category_name,
            })
            return res.json({ message: 'Product successfully deleted' })
        } catch (err) {
            next(err)
        }
    }

    async getSparkPlugReferences(req, res, next) {
        try {
            const { sparkPlug_id } = req.params
            const result = await ProductService.getSparkPlugReferences(
                sparkPlug_id
            )
            return res.json(result)
        } catch (err) {
            next(err)
        }
    }

    async searchProduct(req, res, next) {
        try {
            const { search_data } = req.params
            const result = await ProductService.searchProduct(search_data)
            return res.json(result)
        } catch (err) {
            next(err)
        }
    }
}

module.exports = new ProductController()
