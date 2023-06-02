const Consultation = require("../models/consultationModel");
const Lecturer = require("../models/lecturerModel");
const Student = require("../models/studentModel");
const mailer = require("./emailController");
const logger = require("../controllers/logController");
// Controller method for rendering the consultation setup view
exports.renderConsultationSetup = (req, res) => {
  // Render the consultation setup view
  res.render("consultationSetup", { title: "Consultation Setup" });
};

// Controller method for handling the submission of the consultation setup form
exports.createConsultation = async (req, res) => {
  try {
    const { attendees, lecturerEmail, maxStudents, day, startTime, endTime, eventTittle } = req.body;

    // Find the lecturer and update their availability
    const lecturer = await Lecturer.findOne({ email: lecturerEmail });

    if (!lecturer) {
      console.log("Error: Lecturer not found");
      req.flash("error", "Lecturer not found");
      return res.redirect("/see-lecturer-availability");
    }

    // Check if there is any overlapping consultation for the same day and time
    const overlappingConsultation = await Consultation.findOne({
      day,
      $or: [
        { $and: [{ startTime: { $lte: startTime } }, { endTime: { $gte: startTime } }] },
        { $and: [{ startTime: { $lte: endTime } }, { endTime: { $gte: endTime } }] },
        { $and: [{ startTime: { $gte: startTime } }, { endTime: { $lte: endTime } }] }
      ],
      attendees: { $in: attendees.split(",").map((email) => email.trim()) }
    });

    if (overlappingConsultation) {
      console.log("Error: Overlapping consultation found for one of the attendees");
      req.flash("error", "One of the attendees is already attending an overlapping consultation on the same day");
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

    const attendeesArray = attendees.split(",").map((email) => email.trim());

    const consultation = new Consultation({
      attendees: attendeesArray,
      lecturerEmail,
      maxStudents,
      day,
      startTime,
      endTime,
      eventTittle
    });

    await consultation.save();
    logger.logAction("Consultation creation", lecturerEmail)
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
    const studentEmail = req.session.email;

    // Find all consultations
    const consultations = await Consultation.find();

    // Fetch lecturer names based on email
    const lecturerEmails = consultations.map((consultation) => consultation.lecturerEmail);
    const lecturers = await Lecturer.find({ email: { $in: lecturerEmails } });

    // Create a map of lecturer emails to names
    const lecturerMap = {};
    lecturers.forEach((lecturer) => {
      lecturerMap[lecturer.email] = lecturer.name;
    });

    // Find overlapping consultations for the student
    const overlappingConsultations = await Consultation.find({
      day: { $in: consultations.map((consultation) => consultation.day) },
      $or: [
        { startTime: { $lte: consultations.map((consultation) => consultation.startTime)[0] }, endTime: { $gte: consultations.map((consultation) => consultation.startTime)[0] } },
        { startTime: { $lte: consultations.map((consultation) => consultation.endTime)[0] }, endTime: { $gte: consultations.map((consultation) => consultation.endTime)[0] } },
        { startTime: { $gte: consultations.map((consultation) => consultation.startTime)[0] }, endTime: { $lte: consultations.map((consultation) => consultation.endTime)[0] } }
      ],
      attendees: studentEmail
    });
    
    

    // Filter consultations where the student is an attendee and not part of overlapping consultations
    const attendedConsultations = consultations.filter((consultation) => {
      return (
        consultation.attendees.includes(studentEmail) &&
        !overlappingConsultations.includes(consultation)
      );
    });

    // Fetch lecturer names for attended consultations
    const attendedLecturerEmails = attendedConsultations.map((consultation) => consultation.lecturerEmail);
    const attendedLecturers = await Lecturer.find({ email: { $in: attendedLecturerEmails } });

    // Create a map of lecturer emails to names for attended consultations
    const attendedLecturerMap = {};
    attendedLecturers.forEach((lecturer) => {
      attendedLecturerMap[lecturer.email] = lecturer.name;
    });

    // Filter consultations where the student is not an attendee, attendees are less than maxStudents, and not part of overlapping consultations
    const notAttendedConsultations = consultations.filter((consultation) => {
      return (
        !consultation.attendees.includes(studentEmail) &&
        consultation.attendees.length < consultation.maxStudents &&
        !overlappingConsultations.includes(consultation)
      );
    });

    // Fetch lecturer names for not attended consultations
    const notAttendedLecturerEmails = notAttendedConsultations.map((consultation) => consultation.lecturerEmail);
    const notAttendedLecturers = await Lecturer.find({ email: { $in: notAttendedLecturerEmails } });

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
    const consultation = await Consultation.findById(id);
    const lecturer = consultation.lecturerEmail
    const studentEmail = req.session.email;
    

    const student = await Student.findOne({ email: studentEmail });

    const name= student.name
    const oldTime = consultation.startTime;
    const day = consultation.day;
   

    // Find the consultation by ID and remove it
    await Consultation.findByIdAndRemove(id);

    const message = `Your consultation on ${day} at ${oldTime} has been cancelled`;

   
    await mailer.sendEmail(lecturer, message);
    logger.logAction("Consultation cancellation", name)

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

    const studentEmail = req.session.email;
    

    const student = await Student.findOne({ email: studentEmail });

    const name= student.name

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
    logger.logAction("Consultation joining", name)
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



// Controller method for updating consultation information
exports.editConsultation = async (req, res) => {
  try {
    const { id } = req.params;
    const { day, startTime, endTime } = req.body;

    // Find the consultation by ID
    const consultation = await Consultation.findById(id);

    if (!consultation) {
      return res.status(404).json({ error: "Consultation not found" });
    }
    const oldTime = consultation.startTime 
    const message = 'Your consultation on ' + consultation.day + ' at ' + oldTime + ' has been changed. Login to check new date and time'

    // Update consultation details
    consultation.day = day;
    consultation.startTime = startTime;
    consultation.endTime = endTime;

   
    
    // Save the updated consultation
    await consultation.save();

    logger.logAction("Consultation reschedule", consultation.lecturerEmail)

    for(i =0; i < consultation.attendees.length; i++){
      mailer.sendEmail(consultation.attendees[i], message);
    }

    // Redirect to lecturer dashboard
    return res.redirect("/lecturer-dashboard");
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to update consultation" });
  }
};
// Controller for consultation cancellation
// Controller for consultation cancellation
exports.cancelConsultationLec = async (req, res) => {
  try {
    const { id } = req.params;
    const consultation = await Consultation.findById(id);

    const oldTime = consultation.startTime;
    const day = consultation.day;
    const students = consultation.attendees;

    // Find the consultation by ID and remove it
    await Consultation.findByIdAndRemove(id);

    const message = `Your consultation on ${day} at ${oldTime} has been cancelled`;

    for (let i = 0; i < students.length; i++) {
      await mailer.sendEmail(students[i], message);
    }
    logger.logAction("Consultation Cancellation", consultation.lecturerEmail)
    // Redirect to the student dashboard or any other desired page
    res.redirect("/lecturer-dashboard");
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to cancel the consultation" });
  }
};
