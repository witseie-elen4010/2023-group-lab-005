const Consultation = require("../models/consultationModel");
const Lecturer = require("../models/lecturerModel");
const Student = require("../models/studentModel");
const mailer = require("../controllers/emailerController");
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

    // Filter consultations where the student is an attendee
    const attendedConsultations = consultations.filter((consultation) => {
      return consultation.attendees.includes(studentEmail);
    });

    // Fetch lecturer names for attended consultations
    const attendedLecturerEmails = attendedConsultations.map(
      (consultation) => consultation.lecturerEmail
    );
    const attendedLecturers = await Lecturer.find({
      email: { $in: attendedLecturerEmails },
    });

    // Create a map of lecturer emails to names for attended consultations
    const attendedLecturerMap = {};
    attendedLecturers.forEach((lecturer) => {
      attendedLecturerMap[lecturer.email] = lecturer.name;
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
      attendedConsultations,
      notAttendedConsultations,
      lecturerMap,
      attendedLecturerMap,
      notAttendedLecturerMap,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch consultations" });
  }
};

// Controller for consultation cancellation
exports.cancelConsultation = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the consultation by ID and remove it
    await Consultation.findByIdAndRemove(id);

    mailer.sendEmail(consultation.lecturerEmail, message);

    // Redirect to the student dashboard or any other desired page
    res.redirect("/student-dashboard");
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to cancel the consultation" });
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

exports.getUpcomingConsultations = async (req, res) => {
  try {
    // Get the lecturer's email from the session
    const lecturerEmail = req.session.email;

    // Find all consultations where the lecturer's email matches
    const upcomingConsultations = await Consultation.find({
      lecturerEmail,
    }).sort({ startTime: 1 }); // Sort consultations by ascending start time

    // Get the names of the attendees for each consultation
    const consultationsWithAttendeeNames = await Promise.all(
      upcomingConsultations.map(async (consultation) => {
        const attendees = consultation.attendees;
        const attendeeNames = await Student.find(
          { email: { $in: attendees } },
          "name"
        ).lean();
        const names = attendeeNames.map((attendee) => attendee.name);
        return { ...consultation.toObject(), attendeeNames: names };
      })
    );

    res.render("lecturerDashboard", {
      upcomingConsultations: consultationsWithAttendeeNames,
      title: "All Consultations",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch consultations" });
  }
};

exports.editConsultation = async (req, res) => {
  try {
    const { consultationId } = req.params;
    const { day, startTime, endTime } = req.body;

    // Find the consultation by ID
    const consultation = await Consultation.findById(consultationId);

    if (!consultation) {
      return res.status(404).json({ error: "Consultation not found" });
    }

    // Update consultation details
    consultation.day = day;
    consultation.startTime = startTime;
    consultation.endTime = endTime;

    // Save the updated consultation
    await consultation.save();

    res.status(200).json({ message: "Consultation updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update consultation" });
  }
};

// Controller for consultation cancellation
exports.cancelConsultationLec = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the consultation by ID and remove it
    await Consultation.findByIdAndRemove(id);


    // Redirect to the student dashboard or any other desired page
    res.redirect("/lecturer-dashboard");
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to cancel the consultation" });
  }
};