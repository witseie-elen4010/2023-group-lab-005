const jwt = require("jsonwebtoken");
const Lecturer = require("../../models/lecturerModel");
const logger = require("../../controllers/logController");
const bcrypt = require('bcryptjs')

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

  const passwordRegEx = /^(?=.*[A-Z])(?=.*[!@#$&*]).{8,}$/;
  if (!passwordRegEx.test(password)) {
    req.flash("error", "Password must be at least 8 characters, have at least 1 capital letter and 1 special character");
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
    const lecturer = new Lecturer({ name, email, password: bcrypt.hashSync(password) });
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
    
    if (!(bcrypt.compareSync(password, lecturer.password))) {
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

exports.getResetForm = (req, res) => {
  res.render("./auth/lecturer/resetPassword");
};
exports.resetPassword = async (req, res) => {
  const { email } = req.body;

  // Check if user with provided email exists
  const lecturer = await lecturer.findOne({ email });

  if (!lecturer) {
    req.flash("error", "User with this email does not exist");
    return res.status(401).redirect("/reset-password");
  }
  const message =
    "Follow the link to reset password: " +
    `https://consultify.azurewebsites.net/passwordreset${lecturer._id}`;
  mailer.sendEmail(email, message);
  req.flash("Success", "Check your email to reset password");
  return res.status(200).redirect("/reset-password");
};

exports.resetPasswordForm = async (req, res) => {
  const userId = req.params.userId;
  res.render("./auth/lecturer/newPassword", { userId });
};

exports.newPassword = async (req, res) => {
  const { userId } = req.params;
  const { password, confirmPassword } = req.body;

  // Validate if the passwords match
  if (password !== confirmPassword) {
    req.flash("error", "Passwords do not match");
    return res.redirect(`/resetpassword/${userId}`);
  }

  const passwordRegEx = /^(?=.*[A-Z])(?=.*[!@#$&*]).{8,}$/;
  if (!passwordRegEx.test(password)) {
    req.flash(
      "error",
      "Password must be at least 8 characters, have at least 1 capital letter and 1 special character"
    );
    return res.redirect(`/resetpassword/${userId}`);
  }

  try {
    // Find the user by their ID
    const lecturer = await lecturer.findById(userId);

    if (!lecturer) {
      req.flash("error", "Invalid reset link");
      return res.redirect("/reset-password");
    }

    // Set the new password
    lecturer.password = bcrypt.hashSync(password);
    await lecturer.save();

    req.flash("success", "Password reset successfully");
    return res.redirect("/lecturer-login");
  } catch (err) {
    console.error("Error resetting password:", err);
    req.flash("error", "Failed to reset password");
    return res.redirect(`/reset-password/${userId}`);
  }
};
