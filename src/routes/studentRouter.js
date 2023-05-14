// Student router
const express = require('express')
const usersController = require('../controllers/auth/studentController')

const router = express.Router()

// Render the sign-up form
router.get('/register-student', usersController.getSignUp)

// Handle the sign-up form submission
router.post('/register-student', usersController.postSignUp)

module.exports = router
