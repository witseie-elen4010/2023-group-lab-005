//This is a model to handle all the logic related to emails

const response = {
    error: false,
    errorMessage: ''
}


//function for checking whether an email is valid or not
const validateEmail = function(email){
    if (/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email) === false){
        //this will be executed if the email is not valid 
        response.error=true
        response.errorMessage = 'Invalid email address' 
    }
    else{
        response.error=false
        response.errorMessage = '' 
    }
    return response
}

module.exports = {validateEmail}
