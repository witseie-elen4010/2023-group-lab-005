const jwt = require("jsonwebtoken");
const Lecturer = require("../../models/lecturerModel");
let user = {
  name:'',
  userType:'lecturer',
  loginAction:"/login-lecturer"
}

// Render the sign-up form
exports.getSignUp = (req, res) => {
  res.render("../views/lecturerRegister");
};

// Handle sign-up form submission
exports.postSignUp = async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;

  // Check if the provided password matches the confirm password
  if (password !== confirmPassword) {
    req.flash("error", "Passwords do not match");
    return res.redirect("register-lecturer");
  }

  try {
    // Check if a lecturer with the provided email already exists
    const existingLecturer = await Lecturer.findOne({ email });
    if (existingLecturer) {
      req.flash("error", "An account with this email already exists");
      return res.redirect("register-lecturer");
    }

    // Create a new lecturer with the provided details
    const lecturer = new Lecturer({ name, email, password });
    await lecturer.save();

    // Generate JWT token and set it as a cookie
    const token = jwt.sign(
      { lecturerId: lecturer._id },
      process.env.JWT_SECRET
    );
    res.cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });

    // Redirect to the dashboard page
    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.status(500).render("error", { errorMessage: "Server error" });
  }
};

// Render the sign-in form
exports.getLogin = (req, res) => {
  res.render("./lecturerSignIn",{userInfo: user});
};

// Handle sign-in form submission
exports.postLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user with provided email exists
    const lecturer = await Lecturer.findOne({ email });

    if (!lecturer) {
      req.flash("error", "Invalid email or password");
      return res.status(401).redirect("/login-lecturer");
    }
    
    // Check if provided password is correct
    const isPasswordValid = password === lecturer.password;
    if (!isPasswordValid) {
      req.flash("error", "Invalid email or password");
      return res.status(401).redirect("/login-lecturer");
    }

    if(lecturer.password===password)
    {
      user.name = lecturer.name
      return res.redirect('dashboard-lecturer')
    }

    // Generate JWT token and set it as a cookie
    const token = jwt.sign(
      { lecturerId: lecturer._id },
      process.env.JWT_SECRET
    );
    res.cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });

    // Redirect to the dashboard page
    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.status(500).render("error", { errorMessage: "Server error" });
  }
};

exports.getLecturerDashboard = (req, res) =>{
  res.render('./lecturerDashboard',{userInfo:user})
}


