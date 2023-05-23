const Log = require("../models/logModel");

// Log an action
exports.logAction = (action, initiator) => {
  const logEntry = new Log({
    action,
    initiator,
  });

  logEntry
    .save()
    .then(() => {
      console.log("Log entry saved successfully");
    })
    .catch((err) => {
      console.error("Failed to save log entry:", err);
    });
};

exports.viewLogs = async (req, res) => {
  try {
    
    const name = req.session.name; 
    console.log(name)

    // Fetch logs with the specified name as the initiator
    const logs = await Log.find({ initiator: name }).sort({ timestamp: -1 });


    // Render the view with the logs data
    res.render("view", { logs });
  } catch (err) {
    console.error(err);
    res.status(500).render("error", { errorMessage: "Server error" });
  }
};
