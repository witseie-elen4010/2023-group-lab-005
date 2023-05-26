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

exports.getAllConsultations = async (req, res) => {
  try {
    // Get the student's email from the session
    const studentEmail = req.session.email;

    // Find all consultations
    const consultations = await Consultation.find();

    // Fetch lecturer names based on email
    const lecturerEmails = consultations.map(
      (consultation) => consultation.lecturerEmail
    );
    const lecturers = await Lecturer.find({ email: { $in: lecturerEmails } });

    // Create a map of lecturer emails to names
    const lecturerMap = {};
    lecturers.forEach((lecturer) => {
      lecturerMap[lecturer.email] = lecturer.name;
    });



    // Filter consultations where the student is not an attendee and attendees are less than maxStudents
    const notAttendedConsultations = consultations.filter((consultation) => {
      return (
        !consultation.attendees.includes(studentEmail) &&
        consultation.attendees.length < consultation.maxStudents
      );
    });

    // Fetch lecturer names for not attended consultations
    const notAttendedLecturerEmails = notAttendedConsultations.map(
      (consultation) => consultation.lecturerEmail
    );
    const notAttendedLecturers = await Lecturer.find({
      email: { $in: notAttendedLecturerEmails },
    });

    // Create a map of lecturer emails to names for not attended consultations
    const notAttendedLecturerMap = {};
    notAttendedLecturers.forEach((lecturer) => {
      notAttendedLecturerMap[lecturer.email] = lecturer.name;
    });

    res.render("studentDashboard", {

      notAttendedConsultations,
      lecturerMap,
      notAttendedLecturerMap,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch consultations" });
  }
};

//Get other consultations

// Get a single consultation by ID
exports.getConsultationById = async (req, res) => {
  const { id } = req.params;

  try {
    const consultation = await Consultation.findById(id);
    if (!consultation) {
      return res.status(404).json({ error: "Consultation not found" });
    }
    res.json(consultation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch consultation" });
  }
};

// Join consultation
exports.joinConsultation = async (req, res) => {
  try {
    const { id } = req.params;
    const userEmail = req.session.email;

    // Find the consultation by ID
    const consultation = await Consultation.findById(id);

    if (!consultation) {
      console.log("Error: Consultation not found");
      req.flash("error", "Consultation not found");
      return res.redirect("/see-lecturer-availability");
    }

    // Check if the user's email is already in the attendees array
    if (consultation.attendees.includes(userEmail)) {
      console.log("Error: User is already attending the consultation");
      req.flash("error", "You are already attending this consultation");
      return res.redirect("/see-lecturer-availability");
    }

    // Check if the consultation has reached the maximum number of attendees
    if (consultation.attendees.length >= consultation.maxStudents) {
      console.log("Error: Maximum number of attendees reached");
      req.flash("error", "Maximum number of attendees reached");
      return res.redirect("/see-lecturer-availability");
    }

    // Append the user's email to the attendees array
    consultation.attendees.push(userEmail);

    // Save the updated consultation
    await consultation.save();
    console.log("User joined the consultation successfully");
    req.flash("success", "You have joined the consultation successfully");

    res.redirect("/see-lecturer-availability");
  } catch (err) {
    console.log("Error: Failed to join consultation", err);
    req.flash("error", "Failed to join consultation");
    res.redirect("/see-lecturer-availability");
  }
};