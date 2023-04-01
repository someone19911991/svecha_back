const router = require('express').Router()
const ProductController = require('../controllers/ProductController')
const {
    createSparkPlugs,
    createIgnitionCoils,
    createTrainPillows,
    createCrankshaftCamshaftSensors,
    createIgnitionCoilMouthpieces,
    updateIgnitionCoilMouthpieces,
    updateCrankshaftCamshaftSensors,
    updateSparkPlugs,
    updateIgnitionCoils,
    updateTrainPillows
} = require('../request_validation/product')

router.get(
    '/spark-plugs/:sparkPlug_id',
    ProductController.getSparkPlugReferences
)
router.get('/search/:search_data', ProductController.searchProduct)
router.get('/:category_name', ProductController.getProducts)
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
    '/train_pillows',
    ...createTrainPillows,
    ProductController.createProduct
)
router.post(
    '/crankshaft_camshaft_sensors',
    ...createCrankshaftCamshaftSensors,
    ProductController.createProduct
)
router.post(
    '/ignition_coil_mouthpieces',
    ...createIgnitionCoilMouthpieces,
    ProductController.createProduct
)
router.patch('/ignition_coil_mouthpieces/:product_id', ...updateIgnitionCoilMouthpieces, ProductController.updateProduct)
router.patch('/crankshaft_camshaft_sensors/:product_id', ...updateCrankshaftCamshaftSensors, ProductController.updateProduct)
router.patch('/spark_plugs/:product_id', ...updateSparkPlugs, ProductController.updateProduct)
router.patch('/ignition_coils/:product_id', ...updateIgnitionCoils, ProductController.updateProduct)
router.patch('/train_pillows/:product_id', ...updateTrainPillows, ProductController.updateProduct)
router.delete('/:category_name/:product_id', ProductController.deleteProduct)

module.exports = router
