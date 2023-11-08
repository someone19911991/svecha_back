const TopSellersController = require('../controllers/TopSellersController')
const router = require('express').Router()

router.post('/', TopSellersController.checkIdentity)

module.exports = router