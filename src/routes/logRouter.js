// routes.js

const express = require("express");
const router = express.Router();
const logController = require("../controllers/logController");

// Route to view logs
router.get("/logs", logController.viewLogs);

module.exports = router;
