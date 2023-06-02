const jwt = require("jsonwebtoken");
const Admin = require("../../models/adminModel");
const mailer = require("../emailController");
const Lecturer = require("../../models/lecturerModel");
const Student = require("../../models/studentModel");
const bcrypt = require("bcryptjs");
let generatedPassword = "";
// Render the admin sign-in form
exports.getAdminSignIn = (req, res) => {
  res.render("./auth/admin/signin");
};

// Generate a random password
function generateRandomPassword(length) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let password = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    password += characters[randomIndex];
  }
  return password;
}
// Controller for generating a password
exports.generatePassword = async (req, res) => {
  const { email } = req.body;

  try {
    // Check if the submitted email matches the specific admin email
    if (email !== "itchiraira@gmail.com") {
      req.flash("error", "Invalid email");
      return res.status(401).redirect("/generate-password");
    }

    // Generate a random password
    const length = 10; // Adjust the length of the generated password as needed
    generatedPassword = generateRandomPassword(length);

    // Send the generated password via email
    await mailer.sendEmail(email, generatedPassword);

    // Hash the generated password
    const hashedPassword = await bcrypt.hash(generatedPassword, 10);

    // Redirect to the normal sign-in page with a success message and the generated password as a query parameter
    req.flash("success", "A generated password has been sent to your email");
    res.redirect(`/login-admin`);
  } catch (err) {
    console.error(err);
    res.status(500).render("error", { errorMessage: "Server error" });
  }
};

// Controller for signing in
exports.postAdminSignIn = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (password !== generatedPassword) {
      req.flash("error", "Invalid email or password");
      return res.status(401).redirect("/login-admin");
    }

    // Authentication successful
    req.flash("success", "Sign-in successful");
    res.redirect("/admin-dashboard");
  } catch (err) {
    console.error(err);
    res.status(500).render("error", { errorMessage: "Server error" });
  }
};

exports.getGeneratePassword = (req, res) => {
  res.render("./auth/admin/generatePassword");
};

exports.getDashboard = async (req, res) => {
  try {
    const lecturers = await Lecturer.find({});
    const students = await Student.find({});

    res.render("adminDashboard", { lecturers, students });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

exports.deleteLecturer = async (req, res) => {
  try {
    const result = await Lecturer.deleteOne({ _id: req.params.id });

    if (result.deletedCount === 0) {
      return res.status(404).json({ msg: "Lecturer not found" });
    }

    res.json({ msg: "Lecturer removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

exports.deleteStudent = async (req, res) => {
  try {
    const result = await Student.deleteOne({ _id: req.params.id });

    if (result.deletedCount === 0) {
      return res.status(404).json({ msg: "Student not found" });
    }

    res.json({ msg: "Student removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};