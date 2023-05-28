const jwt = require("jsonwebtoken");
const Lecturer = require("../../models/lecturerModel");
const logger = require("../../controllers/logController");

// Render the sign-up form
exports.getSignUp = (req, res) => {
  res.render("./auth/lecturer/register");
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

   
    // Store the token, ID, and email in the session
    req.session.token = token;
    req.session.lecturerId = lecturer._id;
    req.session.email = lecturer.email;
    req.session.name = lecturer.name;

    logger.logAction("Lecturer registration", lecturer.name)
    // Redirect to the dashboard page
    res.redirect("/lecturer-dashboard");
  } catch (err) {
    console.error(err);
    res.status(500).render("error", { errorMessage: "Server error" });
  }
};

// Render the sign-in form
exports.getSignIn = (req, res) => {
  res.render("./auth/lecturer/signin");
};

// Handle sign-in form submission
exports.postSignIn = async (req, res) => {
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

    // Generate JWT token
    const token = jwt.sign(
      { lecturerId: lecturer._id, email: lecturer.email },
      process.env.JWT_SECRET
    );

    // Store the token, ID, and email in the session
    req.session.token = token;
    req.session.lecturerId = lecturer._id;
    req.session.email = lecturer.email;
    req.session.name = lecturer.name;
    logger.logAction("Lecturer sign-in", lecturer.name)
    // Redirect to the dashboard page
    res.redirect("/lecturer-dashboard");
  } catch (err) {
    console.error(err);
    res.status(500).render("error", { errorMessage: "Server error" });
  }
};

exports.signOut = (req, res) => {
  res.redirect("/");
};
