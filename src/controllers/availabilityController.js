const Lecturer = require("../models/lecturerModel");
const logger = require("../controllers/logController");

// Render the lecturer availability form
exports.getLecturerAvailabilityForm = (req, res) => {
  res.render("SetLecturerAvailability", { title: "Lecturer Availability" });
};
// Handle the lecturer availability form submission
exports.postLecturerAvailabilityForm = async (req, res) => {
  const { day, start, end, maxStudents } = req.body;
  // Retrieve the token, ID, and email from the session
  const { token, lecturerId, email } = req.session;

  try {
    // Find the lecturer by their ID
    const lecturer = await Lecturer.findById(lecturerId);
    console.log(lecturer);

    if (!lecturer) {
      console.error(`No lecturer found with the id: ${lecturerId}`);
      return res.status(500).render("error", { errorMessage: "No lecturer found" });
    }
    
    // Make sure the lecturer has an 'availability' property
    if (!lecturer.availability) {
      console.error(`Lecturer with the id: ${lecturerId} has no 'availability' property`);
      return res.status(500).render("error", { errorMessage: "Lecturer has no 'availability' property" });
    }

    // Find the slots for the desired day
    const daySlots = lecturer.availability.find((slot) => slot.day === day);

    // Create a new slot object
    const newSlot = {
      startTime: start[0], // Get the first element of the array
      endTime: end[0], // Get the first element of the array
      maxStudents: parseInt(maxStudents[0]), // Convert the first element of the array to a number
    };

    // If slots for the day already exist, append the new slot; otherwise, create a new array with the slot
    if (daySlots) {
      daySlots.slots.push(newSlot);
    } else {
      const newAvailability = {
        day: day,
        slots: [newSlot],
      };
      lecturer.availability.push(newAvailability);
    }

    // Save the changes to the database
    await lecturer.save();
    logger.logAction("Lecturer added an availability slot", lecturer.name)
    // Redirect back to the dashboard
    res.redirect("/set-lecturer-availability");
    // }
  } catch (err) {
    console.error(err);
    res.status(500).render("error", { errorMessage: "Server error" });
  }
};

// Retrieve all lecturers and their availability
exports.getAllLecturers = async (req, res) => {
  try {
    // Find all lecturers
    const lecturers = await Lecturer.find();

    // Render the view with the lecturers data
    res.render("lecturerAvailability", { lecturers });
  } catch (err) {
    console.error(err);
    res.status(500).render("error", { errorMessage: "Server error" });
  }
};
exports.getLecturerById = async (req, res) => {
  const { token, lecturerId, email } = req.session;

  try {
    const lecturer = await Lecturer.findById(lecturerId);
    res.render("SetLecturerAvailability", { lecturer });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving lecturer");
  }
};
<<<<<<< HEAD

exports.deleteConsultationSlot = async (req, res) => {
  try {
    const { lecturerId, slotId } = req.body;
    // Retrieve lecturer document
    const lecturer = await Lecturer.findById(lecturerId);

    if (!lecturer) {
      console.error(`No lecturer found with the id: ${lecturerId}`);
      return res.status(500).json({ message: "No lecturer found" });
    }

    if (!lecturer.availability) {
      console.error(`Lecturer with the id: ${lecturerId} has no 'availability' property`);
      return res.status(500).json({ message: "Lecturer has no 'availability' property" });
    }

    // Filter out the deleted slot
    lecturer.availability = lecturer.availability.map(day => {
      day.slots = day.slots.filter(slot => slot._id != slotId);
      return day;
    });
    // Save the lecturer document
    await lecturer.save();
    res.status(200).json({ message: 'Consultation slot deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting consultation slot' });
  }
};

=======
exports.bookSlot = async (req, res) => {
  const { lecturerId, slotId } = req.body;

  // Find the lecturer and update their availability
  const lecturer = await Lecturer.findById(lecturerId);
  const slot = lecturer.availability.id(slotId);
  slot.booked = true;
  await lecturer.save();

  res.redirect("/lecturer-availability");
};
>>>>>>> main
