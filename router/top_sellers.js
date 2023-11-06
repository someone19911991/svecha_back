const IdentityController = require('../controllers/TopSellersController')
const router = require('express').Router()

router.post('/', IdentityController.checkIdentity)

module.exports = router