const router = require('express').Router()
const BrandController = require('../controllers/BrandController')

router.get('/', BrandController.getBrands)

module.exports = router