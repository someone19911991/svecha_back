const router = require('express').Router()
const AuthController = require('../controllers/AuthController')
const { signup } = require('../request_validation/auth')

router.get('/activate-email/:activation_link', AuthController.activateAccount)
router.post('/signup', ...signup, AuthController.signup)
router.post('/sign-in', AuthController.signIn)
router.post('/logout', AuthController.logout)
router.post('/refresh', AuthController.refresh)

module.exports = router
