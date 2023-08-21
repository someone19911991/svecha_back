const ClientsCountController = require('../controllers/ClientsCountController')
const router = require('express').Router()

router.get('/', ClientsCountController.getClientsCount)

module.exports = router