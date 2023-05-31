// routes.js

const express = require("express");
const router = express.Router();
const logController = require("../controllers/logController");

// Route to view logs
router.get("/logs", logController.viewLogs);
// Route to view logs
router.get("/logs-lec", logController.viewLogsLec);

// Route to view logs
router.get("/all-logs", logController.viewAllLogs);

module.exports = router;
