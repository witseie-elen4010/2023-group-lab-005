// Admin router
const express = require("express");
const adminController = require("../controllers/auth/adminController");

const router = express.Router();

// Render the admin sign-in form
router.get("/login-admin", adminController.getAdminSignIn);

// Handle the admin sign-in form submission
router.post("/login-admin", adminController.postAdminSignIn);

// Get the admin dashboard
router.get("/admin-dashboard", adminController.getDashboard);

module.exports = router;
