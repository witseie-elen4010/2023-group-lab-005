// Student router

const express = require('express')

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

    //instruct the page to return the student loging page when its done executing 
    res.redirect(req.baseUrl + '/login-student')
})

module.exports = studentRouter