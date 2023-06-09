const express = require("express");
const router = express.Router();

// Import the consultation controller
const consultationController = require("../controllers/consultationController");

// Route for rendering the consultation setup view
router.get("/consultation", consultationController.renderConsultationSetup);

// Route for handling the submission of the consultation setup form
router.post("/consultation", consultationController.createConsultation);

// Route for joining a consultation
router.post("/join-consultation/:id", consultationController.joinConsultation);

// Route for rendering the student dashboard and fetching all consultations
router.get("/student-dashboard", consultationController.getAllConsultations);

// Route for consultation cancellation
router.post(
  "/cancel-consultation/:id",
  consultationController.cancelConsultation
);


// Route to handle the POST request for updating the consultation
router.post("/edit-consultation/:id", consultationController.editConsultation);

router.get("/lecturer-dashboard", consultationController.getUpcomingConsultations)

// Route for consultation cancellation
router.post(
  "/cancel-consultationLec/:id",
  consultationController.cancelConsultationLec
);

module.exports = router;
