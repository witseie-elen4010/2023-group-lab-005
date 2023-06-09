const jwt = require("jsonwebtoken");
const Student = require("../../models/studentModel");
const logger = require("../../controllers/logController");
const bcrypt = require('bcryptjs')
const mailer = require("../../controllers/emailController");


// Render the sign-up form
exports.getSignUp = (req, res) => {
  res.render("./auth/student/register");
};

// Handle sign-up form submission
exports.postSignUp = async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;

  // Check if the provided password matches the confirm password
  if (password !== confirmPassword) {
    req.flash("error", "Passwords do not match");
    return res.redirect("register-student");
  }

  const passwordRegEx = /^(?=.*[A-Z])(?=.*[!@#$&*]).{8,}$/;
  if (!passwordRegEx.test(password)) {
    req.flash("error", "Password must be at least 8 characters, have at least 1 capital letter and 1 special character");
    return res.redirect("register-lecturer");
  }

  try {
    // Check if a user with the provided email already exists
    const existingStudent = await Student.findOne({ email });
    if (existingStudent) {
      req.flash("error", "An account with this email already exists");
      return res.redirect("register-student");
    }

    // Create a new user with the provided details
    const student = new Student({ name, email, password: bcrypt.hashSync(password) });
    await student.save();

     // Generate JWT token
     const token = jwt.sign(
      { studentId: student._id, email: student.email },
      process.env.JWT_SECRET
    );

    // Store the token, ID, and email in the session
    req.session.token = token;
    req.session.studentId = student._id;
    req.session.email = student.email;
    logger.logAction("Student registration", name)

    // Redirect to the dashboard page
    res.redirect("/student-dashboard");
  } catch (err) {
    console.error(err);
    res.status(500).render("error", { errorMessage: "Server error" });
  }
};

// Render the sign-in form
exports.getSignIn = (req, res) => {
  res.render("./auth/student/signin");
};

// Handle sign-in form submission
exports.postSignIn = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user with provided email exists
    const student = await Student.findOne({ email });

    if (!student) {
      req.flash("error", "Invalid email or password");
      return res.status(401).redirect("/login-student");
    }

    // Check if provided password is correct
    
    if (!(bcrypt.compareSync(password, student.password))) {
      req.flash("error", "Invalid email or password");
      return res.status(401).redirect("/login-student");
    }

    // // Generate JWT token and set it as a cookie
    // const token = jwt.sign({ studentId: student._id }, process.env.JWT_SECRET);
    // res.cookie("jwt", token, {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === "production",
    // });
  // Generate JWT token
  const token = jwt.sign(
    { studentId: student._id, email: student.email },
    process.env.JWT_SECRET
  );

  // Store the token, ID, and email in the session
  req.session.token = token;
  req.session.studentId = student._id;
  req.session.email = student.email;
  req.session.name = student.name;
  logger.logAction("Student signin", student.name)
    // Redirect to the dashboard page
    res.redirect("/student-dashboard");
  } catch (err) {
    console.error(err);
    res.status(500).render("error", { errorMessage: "Server error" });
  }
};
exports.bookConsultation = async (req, res) => {
  const { studentId, lecturerId, slotId } = req.body;

  // Find the student and update their booked consultations
  const student = await Student.findById(studentId);
  student.bookedConsultations.push({ lecturerId, slotId });
  await student.save();

  res.redirect("/student-dashboard");
};

exports.getResetForm = (req, res) => {
  res.render("./auth/student/resetPassword");
};
exports.resetPassword = async (req, res) => {
  const { email } = req.body;

  // Check if user with provided email exists
  const student = await Student.findOne({ email });

  if (!student) {
    req.flash("error", "User with this email does not exist");
    return res.status(401).redirect("/reset-password-student");
  }
  const message =
    "Follow the link to reset password: " +
    `https://consultify.azurewebsites.net/resetpassword-student/${student._id}`;
  mailer.sendEmail(email, message);
  req.flash("Success", "Check your email to reset password");
  return res.status(200).redirect("/reset-password-student");
};

exports.resetPasswordForm = async (req, res) => {
  const userId = req.params.userId;
  res.render("./auth/student/newPassword", { userId });
};

exports.newPassword = async (req, res) => {
  const { userId } = req.params;
  const { password, confirmPassword } = req.body;

  // Validate if the passwords match
  if (password !== confirmPassword) {
    req.flash("error", "Passwords do not match");
    return res.redirect(`/resetpassword-student/${userId}`);
  }

  const passwordRegEx = /^(?=.*[A-Z])(?=.*[!@#$&*]).{8,}$/;
  if (!passwordRegEx.test(password)) {
    req.flash(
      "error",
      "Password must be at least 8 characters, have at least 1 capital letter and 1 special character"
    );
    return res.redirect(`/resetpassword-student/${userId}`);
  }

  try {
    // Find the user by their ID
    const student = await Student.findById(userId);

    if (!student) {
      req.flash("error", "Invalid reset link");
      return res.redirect("/reset-password-student");
    }

    // Set the new password
    student.password = bcrypt.hashSync(password);
    await student.save();

    req.flash("success", "Password reset successfully");
    return res.redirect("/login-student");

  } catch (err) {
    console.error("Error resetting password:", err);
    req.flash("error", "Failed to reset password");
    return res.redirect(`/reset-password-student/${userId}`);
  }
};
