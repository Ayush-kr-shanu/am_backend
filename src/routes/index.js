const express = require('express')
const userRoute = require("./user.route")
const fileRoute = require("./file.route")
const postRoute = require("./post.route")

const router = express.Router()

router.use("/auth", userRoute)
router.use("/file", fileRoute)
router.use("/post", postRoute)

module.exports = router