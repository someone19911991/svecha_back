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

    async getAllProducts(req, res, next) {
        try {
            const result = await ProductService.getAllProducts()
            return res.json(result)
        } catch (err) {
            next(err)
        }
    }

    async createProduct(req, res, next) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                let errorsToShow = ''
                errors.array().forEach((item) => {
                    errorsToShow += `${item.msg}, `
                })
                errorsToShow = errorsToShow.slice(0, -2)
                return next(ApiError.BadRequest(errorsToShow))
            }

            let { oems, refs } = req.body
            oems = JSON.parse(oems)
            refs = JSON.parse(refs)

            let imgs = req?.files?.imgs
            if(!Array.isArray(imgs)){
                imgs = [imgs]
            }
            const dataToPass = { ...req.body, oems, refs, imgs }
            await ProductService.createProduct(dataToPass)
            return res.json({ message: 'Product successfully created' })
        } catch (err) {
            console.log({ err })
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

            const { product_id } = req.params
            const { category_name } = req.body
            const response = await ProductService.updateProduct({
                product_id,
                category_name,
                ...req.body,
                imgs: req.files?.imgs
                    ? Array.isArray(req.files?.imgs)
                        ? req.files?.imgs
                        : [req.files?.imgs]
                    : [],
            })
            return res.json(response)
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

    async deleteRef(req, res, next) {
        try {
            const { product_id } = req.params
            const { refs } = req.body
            await ProductService.deleteRef({ product_id, refs })
            return res.json({ message: 'Reference/s successfully deleted' })
        } catch (err) {
            next(err)
        }
    }

    async deleteOem(req, res, next) {
        try {
            const { product_id } = req.params
            const { oems } = req.body
            await ProductService.deleteOem({ product_id, oems })
            return res.json({ message: 'Oem/s successfully deleted' })
        } catch (err) {
            next(err)
        }
    }

    async deleteImg(req, res, next) {
        try {
            const { product_id, img } = req.params
            await ProductService.deleteImg({ product_id, img })
            return res.json({ message: 'Img successfully deleted' })
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
