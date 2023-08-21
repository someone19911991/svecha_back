const router = require('express').Router()
const CategoryController = require('../controllers/CategoryController')
const AuthMiddleware = require('../middlewares/AuthMiddleware')

router.post('/', CategoryController.createCategory)
router.patch('/:id', CategoryController.updateCategory)
router.delete('/:id', CategoryController.deleteCategory)
router.get('/:id', CategoryController.getCategory)
// router.get('/',  CategoryController.getCategories)
router.get('/', CategoryController.getCategories)

module.exports = router
