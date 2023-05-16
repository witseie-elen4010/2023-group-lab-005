const express = require("express");
const lecturerController = require("../controllers/auth/lecturerController.js");

const lecturerRouter = express.Router();

lecturerRouter.get("/register-lecturer", lecturerController.getSignUp);

// Handle the sign-up form submission
lecturerRouter.post("/register-lecturer", lecturerController.postSignUp);

module.exports = lecturerRouter;