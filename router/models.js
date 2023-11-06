const ModelController = require('../controllers/ModelController')
const router = require('express').Router()
const AuthMiddleware = require('../middlewares/AuthMiddleware')

router.get('/', ModelController.getModels)
router.get('/:model', ModelController.getModelsByName)
router.post('/', AuthMiddleware, ModelController.createModel)
router.patch('/', AuthMiddleware, ModelController.updateModel)
router.delete('/:id', AuthMiddleware, ModelController.deleteModel)


module.exports = router