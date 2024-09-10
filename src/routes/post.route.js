const express = require('express')
const { postController } = require("../controller")
const {authenticateToken} = require("../middlewares/auth")

const router = express.Router()

router.use(authenticateToken)

router.post('/', postController.addPost)
router.get('/', postController.getAllPosts)
router.get('/:userId', postController.getPostByUserId)
router.get('/id/:id', postController.getPostById)
router.patch('/:id', postController.updatePost)
router.delete('/:id', postController.deletePost)

module.exports = router