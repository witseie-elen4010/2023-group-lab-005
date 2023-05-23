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

// Request the deletion of the lecturer consultation slot
router.delete(
  "/delete-consultation-slot",
  availabilityController.deleteConsultationSlot
);



module.exports = router;

// Render the sign-up form
