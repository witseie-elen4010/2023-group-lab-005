const Consultation = require("../models/consultationModel");
const Lecturer = require("../models/lecturerModel");
// Controller method for rendering the consultation setup view
exports.renderConsultationSetup = (req, res) => {
  // Render the consultation setup view
  res.render("consultationSetup", { title: "Consultation Setup" });
};