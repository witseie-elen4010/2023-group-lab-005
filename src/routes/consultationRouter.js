const express = require("express");
const router = express.Router();

// Import the consultation controller
const consultationController = require("../controllers/consultationController.js");

// Route for rendering the consultation setup view
router.get("/consultation", consultationController.renderConsultationSetup);

// Route for handling the submission of the consultation setup form
router.post("/consultation", consultationController.createConsultation);

module.exports = router;
