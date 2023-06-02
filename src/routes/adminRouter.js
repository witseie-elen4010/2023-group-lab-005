// Admin router
const express = require("express");
const adminController = require("../controllers/auth/adminController");

const router = express.Router();
//
router.get("/generate-password", adminController.getGeneratePassword);

// Route for generating a password
router.post("/generate-password", adminController.generatePassword);

// Render the admin sign-in form
router.get("/login-admin", adminController.getAdminSignIn);

// Handle the admin sign-in form submission
router.post("/login-admin", adminController.postAdminSignIn);

// Get the admin dashboard
router.get("/admin-dashboard", adminController.getDashboard);

// Delete a lecturer
router.delete("/lecturer/:id", adminController.deleteLecturer);

// Delete a student
router.delete("/student/:id", adminController.deleteStudent);

module.exports = router;