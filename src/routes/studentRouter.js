// Student router

const express = require('express')
const usersController = require('../controllers/auth/studentController')
const studentModel = require('../models/studentModel.js')
const studentRouter = express.Router()

//An object to dynamically interact with some of the EJS elements during rendering
/*
const LoginInfo = {
    userType: 'Student',
    errorText: '' ,  //This will contain error texts to communicate wtih page during login
    loginMessage: ''
}

const userInfo = {
    name: ''
}
*/
//Where the page must go to if the login button is pressed 
/*
studentRouter.get('/login-student', (req,res)=>{
    res.render('studentSignIn', {signininfo: LoginInfo})
})
*/

/*
//Where a student will be taken after logging in
studentRouter.get('/dashboard-student', (req,res)=>{
    res.render('studentDashboard',{user: userInfo})
})

// Add a post method for recieving data from the login page
studentRouter.post('/login', function(req,res){
    //console.log(req.body.email)


    
const logins = {
    email: req.body.email,
    password: req.body.password
}
*/
/*
const response = studentModel.validateLogins(logins)

if(response.error ===true)
{
    //if user login gives an error 
    LoginInfo.errorText=response.errorMessage
    LoginInfo.loginMessage = ''
     //instruct the page to return the student loging page when its done executing 
     res.redirect(req.baseUrl + '/login-student')
}
else{
    //if user login doesnt have an error
    LoginInfo.errorText = ''
    userInfo.name = response.username
    LoginInfo.loginMessage = 'Succesfully Logged in'
    res.redirect(req.baseUrl + '/dashboard-student')
}

   
})
*/

// Render the sign-up form
studentRouter.get('/register-student', usersController.getSignUp)

// Handle the sign-up form submission
studentRouter.post('/register-student', usersController.postSignUp)


studentRouter.get('/login-student', usersController.getLogin);
studentRouter.post('/login-student', usersController.postLogin);

module.exports = studentRouter

