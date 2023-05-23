const mongoose = require("mongoose");

const logSchema = new mongoose.Schema({
  timestamp: {
    type: Date,
    default: Date.now,
  },
  action: {
    type: String,
    required: true,
  },
  initiator: {
    type: String,
    required: true,
  },
});

const Log = mongoose.model("Log", logSchema);

module.exports = Log;