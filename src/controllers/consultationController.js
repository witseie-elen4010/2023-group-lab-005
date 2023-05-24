const Consultation = require("../models/consultationModel");
const Lecturer = require("../models/lecturerModel");
// Controller method for rendering the consultation setup view
exports.renderConsultationSetup = (req, res) => {
  // Render the consultation setup view
  res.render("consultationSetup", { title: "Consultation Setup" });
};

// Controller method for handling the submission of the consultation setup form
exports.createConsultation = async (req, res) => {
  try {
    // Retrieve form data from the request body
    const { attendees, lecturerEmail, maxStudents, day, startTime, endTime } =
      req.body;

    // Find the lecturer and update their availability
    const lecturer = await Lecturer.findOne({ email: lecturerEmail });

    if (!lecturer) {
      console.log("Error: Lecturer not found");
      req.flash("error", "Lecturer not found");
      return res.redirect("/see-lecturer-availability");
    }

    let slotFound = false;

    lecturer.availability.forEach((availability) => {
      if (availability.day === day) {
        console.log("day found");
        availability.slots.forEach((slot) => {
          console.log(slot.startTime);
          if (slot.startTime === startTime && slot.endTime === endTime) {
            slot.isBook = true;
            slotFound = true;
          }
        });
      }
    });

    if (!slotFound) {
      console.log("Error: Slot not found or already booked");
      req.flash("error", "Failed to book slot");
      return res.redirect("/see-lecturer-availability");
    }

    await lecturer.save();
    console.log("Slot booked successfully");
    req.flash("success", "Slot booked successfully");

    // Split the attendees string into an array of email addresses
    const attendeesArray = attendees.split(",").map((email) => email.trim());

    // Create a new consultation object
    const consultation = new Consultation({
      attendees: attendeesArray,
      lecturerEmail,
      maxStudents,
      day,
      startTime,
      endTime,
    });

    // Save the consultation to the database
    await consultation.save();
    console.log("Consultation has been set up successfully");
    req.flash("success", "Consultation has been set up successfully");
  } catch (err) {
    console.log("Error: Failed to set up consultation", err);
    req.flash("error", "Failed to set up consultation");
  }

  res.redirect("/see-lecturer-availability");
};