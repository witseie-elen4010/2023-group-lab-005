// Student model

const emailsModel = require('./emailsModel.js')
const databaseModel = require('./databaseModels.js')

// function to check that entered login details are valid 
const validateLogins = function(logings){
    const emailRes = emailsModel.validateEmail(logings.email)

    if(emailRes.error === true )
    {
        // there was an error with the email address entered 
        return emailRes
    }

    //Check if the entered student exists within the list of registed students 
    const userList = databaseModel.selectAll(databaseModel.DatabaseCollectionsNames.users)

    console.log(userList)

    //This will check if the user details entered exist in our list of users .
    //if auser does not exist, the filter will return an empty list 
    filteredList = userList.filter(usersFilter(logings.email, logings.password))

    if(filteredList.length === 0)
    {
        return{error:true, errorMessage: 'Invalid User'}
    }

    else {
    return{error: false, errorMessage: '', username: filteredList[0].name }
}
}

//callback function to be used for filtering the list of users
const usersFilter = function(email_,password_){
    return function(user)
    {
        return user.email === email_ && user.password ===password_
    }
      
}

module.exports = {validateLogins}