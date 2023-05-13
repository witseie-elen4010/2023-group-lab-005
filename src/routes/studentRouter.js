// Student router

const express = require('express')
const studentRouter = express.Router()

//Where the page must go to if the login button is pressed 
studentRouter.get('/login-student', (req,res)=>{
    res.render('studentSignIn')
})

module.exports = studentRouter