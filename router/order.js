const OrderController = require('../controllers/OrderController')
const router = require('express').Router()
const AuthMiddleware = require('../middlewares/AuthMiddleware')

router.post('/', OrderController.orderProduct)
router.post('/on-order',  OrderController.onOrder)
router.get('/notifications/:status', AuthMiddleware, OrderController.getNotifications)
router.get('/messages/:status', AuthMiddleware, OrderController.getMessages)
router.post('/sold', AuthMiddleware, OrderController.markAsSold)
router.post('/accepted', AuthMiddleware, OrderController.markAsAccepted)
router.post('/analytic', AuthMiddleware, OrderController.getAnalytic)

module.exports = router