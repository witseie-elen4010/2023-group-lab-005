const express = require("express");
const lecturerController = require("../controllers/auth/lecturerController.js");
const availabilityController = require("../controllers/availabilityController");
const router = express.Router();

router.get("/register-lecturer", lecturerController.getSignUp);

// Handle the sign-up form submission
router.post("/register-lecturer", lecturerController.postSignUp);

// Render the sign-in form
router.get("/login-lecturer", lecturerController.getSignIn);

// Handle the sign-in form submission
router.post("/login-lecturer", lecturerController.postSignIn);

// Handle sign-out
router.get("/sign-out", lecturerController.signOut);

// GET request for lecturer availability form
router.get(
  "/lecturer-availability",
  availabilityController.getLecturerAvailabilityForm
);

// POST request for lecturer availability form submission
router.post(
  "/lecturer-availability",
  availabilityController.postLecturerAvailabilityForm
);

router.get(
  "/set-lecturer-availability",
  availabilityController.getLecturerById
);




router.get(
  "/see-lecturer-availability",
  availabilityController.getAllLecturers
);


module.exports = router;

// Render the sign-up form

//Render password reset form
router.get("/reset-password-lecturer", lecturerController.getResetForm);

// Handle the password reset form submission
router.post("/reset-password-lecturer", lecturerController.resetPassword);

router.get("/resetpassword-lecturer/:userId", lecturerController.resetPasswordForm);

router.post("/resetpassword-lecturer/:userId", lecturerController.newPassword);