const router = require("express").Router()
const authRouter = require('./auth')
const productRouter = require('./product')
const categoryRouter = require("./category")
const brandRouter = require("./brand")
const orderRouter = require("./order")
const clientsCountRouter = require("./clients_count")
const modelsController = require('./models')

router.use('/auth', authRouter)
router.use('/product', productRouter)
router.use('/category', categoryRouter)
router.use('/brand', brandRouter)
router.use('/order', orderRouter)
router.use('/clients-count', clientsCountRouter)
router.use('/models', modelsController)

module.exports = router