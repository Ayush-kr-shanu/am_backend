const express = require('express')
const multer = require('multer');
const path = require('path');
const { fileController } = require("../controller")
const {authenticateToken} = require("../middlewares/auth")

const router = express.Router()

router.use(authenticateToken)

const upload = multer({ dest: path.join(__dirname, '../uploads') });

router.post('/', upload.single('file'),fileController.uploadFile)

module.exports = router