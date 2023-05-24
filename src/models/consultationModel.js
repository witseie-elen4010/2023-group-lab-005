const mongoose = require("mongoose");

const consultationSchema = new mongoose.Schema({
  attendees: {
    type: [String],
    required: true,
  },
  lecturerEmail: {
    type: String,
    required: true,
  },
  maxStudents: {
    type: Number,
    required: true,
  },
  day: {
    type: String,
    required: true,
  },
  startTime: {
    type: String,
    required: true,
  },
  endTime: {
    type: String,
    required: true,
  },
});

const Consultation = mongoose.model("Consultation", consultationSchema);

module.exports = Consultation;
