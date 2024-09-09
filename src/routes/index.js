const express = require('express')
const userRoute = require("./user.route")

const router = express.Router()

router.use("/auth", userRoute)

module.exports = router