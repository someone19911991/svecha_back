const router = require('express').Router()
const CategoryController = require('../controllers/CategoryController')

router.post('/', CategoryController.createCategory)

module.exports = router
