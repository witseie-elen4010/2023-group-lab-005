// Student model

const emailsModel = require('./emailsModel.js')

// function to check that entered login details are valid 
const validateLogins = function(logings){
    const emailRes = emailsModel.validateEmail(logings.email)

    if(emailRes.error === true )
    {
        // there was an error with the email address entered 
        return emailRes
    }


    return{error: false, errorMessage: ''}
}

module.exports = {validateLogins}