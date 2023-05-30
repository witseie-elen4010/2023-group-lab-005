// Student router
const express = require("express");
const studentController = require("../controllers/auth/studentController");

const router = express.Router();

// Render the sign-up form
router.get("/register-student", studentController.getSignUp);

// Handle the sign-up form submission
router.post("/register-student", studentController.postSignUp);

// Render the sign-in form
router.get("/login-student", studentController.getSignIn);

// Handle the sign-in form submission
router.post("/login-student", studentController.postSignIn);

module.exports = router;

//Render password reset form
router.get("/reset-password", studentController.getResetForm);

// Handle the password reset form submission
router.post("/reset-password", studentController.resetPassword);

router.get("/resetpassword-student/:userId", studentController.resetPasswordForm);

router.post("/resetpassword-student/:userId", studentController.newPassword);