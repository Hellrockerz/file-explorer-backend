const router = require('express').Router()
const user = require('../controller/userController')

// const r = require('../r')
router.post('/login', user.login)
router.post('/signup', user.signup)

module.exports = router