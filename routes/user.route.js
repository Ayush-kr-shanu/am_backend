const express = require('express')
const { userController } = require("../controller")
const {authenticateToken} = require("../middlewares/auth")

const router = express.Router()

router.post('/signup', userController.signup)

router.post('/login', userController.login)

router.use(authenticateToken)
router.patch('/update/:id', userController.updateUserDetail)
router.get('/user/:id', userController.getUserById)

module.exports = router