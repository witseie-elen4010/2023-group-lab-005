// Update the logger.js file

const Log = require("../models/logModel");

// Log an action
exports.logAction = async (action, initiator) => {
  try {
    const logEntry = new Log({
      action,
      initiator,
    });

    await logEntry.save();
    console.log("Log entry saved successfully");
  } catch (err) {
    console.error("Failed to save log entry:", err);
  }
};

exports.viewLogs = async (req, res) => {
  try {
    const { name } = req.session;

    // Fetch logs with the specified name as the initiator
    const logs = await Log.find({ initiator: name }).sort({ timestamp: -1 });

    // Render the view with the logs data
    res.render("view", { logs });
  } catch (err) {
    console.error(err);
    res.status(500).render("error", { errorMessage: "Server error" });
  }
};


exports.viewAllLogs = async (req, res) => {
  try {
    const { name } = req.session;

    // Fetch logs with the specified name as the initiator
    const logs = await Log.find();

    // Render the view with the logs data
    res.render("allLogs", { logs });
  } catch (err) {
    console.error(err);
    res.status(500).render("error", { errorMessage: "Server error" });
  }
};
