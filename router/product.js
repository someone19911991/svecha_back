const router = require('express').Router()
const ProductController = require('../controllers/ProductController')
const {
    createSparkPlugs,
    createIgnitionCoils,
    createAirbagCables,
    createCrankshaftCamshaftSensors,
    createIgnitionCoilMouthpieces,
    updateIgnitionCoilMouthpieces,
    updateCrankshaftCamshaftSensors,
    updateSparkPlugs,
    updateIgnitionCoils,
    updateAirbagCabels
} = require('../request_validation/product')
const AuthMiddleware = require('../middlewares/AuthMiddleware')

router.get('/', ProductController.getAllProducts)
router.get(
    '/spark-plugs/:sparkPlug_id',
    ProductController.getSparkPlugReferences
)
router.get('/search/:search_data', ProductController.searchProduct)
router.get('/:category_name',  AuthMiddleware, ProductController.getProducts)
router.get('/:category_name/:product_id', ProductController.getProduct)
router.post(
    '/ignition_coils',
    ...createIgnitionCoils,
    ProductController.createProduct
)
router.post(
    '/spark_plugs',
    ...createSparkPlugs,
    ProductController.createProduct
)
router.post(
    '/airbag_cables',
    ...createAirbagCables,
    ProductController.createProduct
)
router.post(
    '/crankshaft_sensors',
    ...createCrankshaftCamshaftSensors,
    ProductController.createProduct
)
router.post(
    '/camshaft_sensors',
    ...createCrankshaftCamshaftSensors,
    ProductController.createProduct
)
router.post(
    '/ignition_coil_mouthpieces',
    ...createIgnitionCoilMouthpieces,
    ProductController.createProduct
)
router.patch('/ignition_coil_mouthpieces/:product_id', ...updateIgnitionCoilMouthpieces, ProductController.updateProduct)
router.patch('/crankshaft_sensors/:product_id', ...updateCrankshaftCamshaftSensors, ProductController.updateProduct)
router.patch('/camshaft_sensors/:product_id', ...updateCrankshaftCamshaftSensors, ProductController.updateProduct)
router.patch('/spark_plugs/:product_id', ...updateSparkPlugs, ProductController.updateProduct)
router.patch('/airbag_cables/:product_id', ...updateAirbagCabels, ProductController.updateProduct)
router.patch('/ignition_coils/:product_id', ...updateIgnitionCoils, ProductController.updateProduct)
router.patch('/train_pillows/:product_id', ...updateAirbagCabels, ProductController.updateProduct)
router.delete('/refs/:product_id', ProductController.deleteRef)
router.delete('/oems/:product_id', ProductController.deleteOem)
router.delete('/imgs/:product_id/:img', ProductController.deleteImg)
router.delete('/:category_name/:product_id', ProductController.deleteProduct)

module.exports = router
