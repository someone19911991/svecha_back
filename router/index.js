const router = require("express").Router()
const authRouter = require('./auth')
const productRouter = require('./product')
const categoryRouter = require("./category")
const referenceRouter = require("./reference")
const oemRouter = require("./oem")

router.use('/auth', authRouter)
router.use('/product', productRouter)
router.use('/category', categoryRouter)
router.use('/refs', referenceRouter)
router.use('/oems', oemRouter)

module.exports = router