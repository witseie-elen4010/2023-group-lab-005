const jwt = require('jsonwebtoken')
const StudentModel = require('../../models/studentModel')
let user = {
  name:''
}


// Render the sign-up form
exports.getSignUp = (req, res) => {
  res.render('./studentRegister')
}

// Handle sign-up form submission
exports.postSignUp = async (req, res) => {
  const { name, email, password, confirmPassword } = req.body

  // Check if the provided password matches the confirm password
  if (password !== confirmPassword) {
    req.flash('error', 'Passwords do not match')
    return res.redirect('register-student')
  }

  try {
    // Check if a user with the provided email already exists
    const existingStudent = await StudentModel.findOne({ email })
    if (existingStudent) {
      req.flash('error', 'An account with this email already exists')
      return res.redirect('register-student')
    }

    // Create a new user with the provided details
    const student = new StudentModel({ name, email, password })
    await student.save()

    // Generate JWT token and set it as a cookie
    const token = jwt.sign({ studentId: student._id }, process.env.JWT_SECRET)
    res.cookie('jwt', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production'
    })

    // Redirect to the dashboard page
    res.redirect('/')
  } catch (err) {
    console.error(err)
    res.status(500).render('error', { errorMessage: 'Server error' })
  }
}

//Login authentication

// Render the login form
exports.getLogin = (req, res) => {
  res.render('./studentSignin')
}

// Handle login form submission
exports.postLogin = async (req, res) => {
  const { email, password } = req.body

  try {
    // Check if a student with the provided email exists
    const student = await StudentModel.findOne({ email })
    if (!student) {
      req.flash('error', 'Invalid email or password')
      return res.redirect('login-student')
    }

    // Compare the provided password with the stored hashed password
    /*
    const passwordMatch = await bcrypt.compare(password, student.password)
    if (!passwordMatch) {
      req.flash('error', 'Invalid email or password')
      return res.redirect('login-student')
      
    }
    
*/
  
    if(student.password===password)
    {
      user.name = student.name
      return res.redirect('dashboard-student')
    }

    // Generate JWT token and set it as a cookie
    const token = jwt.sign({ studentId: student._id }, process.env.JWT_SECRET)
    res.cookie('jwt', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    });

    // Redirect to the dashboard page
    res.redirect('/')
  } catch (err) {
    console.error(err)
    res.status(500).render('error', { errorMessage: 'Server error' })
  }
}

exports.getStudentDashboard = (req, res) =>{
  res.render('./studentDashboard',{userInfo:user})
}
