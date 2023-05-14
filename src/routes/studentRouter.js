// Student router

const express = require('express')
const studentModel = require('../models/studentModel.js')
const studentRouter = express.Router()

//An object to dynamically interact with some of the EJS elements during rendering
const LoginInfo = {
    userType: 'Student',
    errorText: ''   //This will contain error texts to communicate wtih page during login
}

//Where the page must go to if the login button is pressed 
studentRouter.get('/login-student', (req,res)=>{
    res.render('studentSignIn', {signininfo: LoginInfo})
})

// Add a post method for recieving data from the login page
studentRouter.post('/login', function(req,res){
    console.log(req.body.email)


const logins = {
    email: req.body.email,
    password: req.body.password
}

const response = studentModel.validateLogins(logins)

if(response.error ===true)
{
    LoginInfo.errorText=response.errorMessage
}
else{
    LoginInfo.errorText = ''
}

    //instruct the page to return the student loging page when its done executing 
    res.redirect(req.baseUrl + '/login-student')
})

module.exports = studentRouter