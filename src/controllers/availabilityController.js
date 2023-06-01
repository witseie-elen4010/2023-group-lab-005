const Lecturer = require("../models/lecturerModel");
const logger = require("../controllers/logController");

// Render the lecturer availability form
exports.getLecturerAvailabilityForm = (req, res) => {
  res.render("SetLecturerAvailability", { title: "Lecturer Availability" });
};// Handle the lecturer availability form submission// Handle the lecturer availability form submission// Handle the lecturer availability form submission
exports.postLecturerAvailabilityForm = async (req, res) => {
  const { day, start, end, maxStudents } = req.body;
  const { token, lecturerId, email } = req.session;

  try {
    const lecturer = await Lecturer.findById(lecturerId);

    let daySlots = lecturer.availability.find((slot) => slot.day === day);

    const newSlot = {
      startTime: start[0],
      endTime: end[0],
      maxStudents: parseInt(maxStudents[0]),
    };

    if (!daySlots) {
      daySlots = {
        day: day,
        slots: [newSlot],
      };
      lecturer.availability.push(daySlots);
    } else {
      // Check for overlapping slots
      const overlappingSlot = daySlots.slots.find((slot) => {
        return (
          (start[0] >= slot.startTime && start[0] < slot.endTime) ||
          (end[0] > slot.startTime && end[0] <= slot.endTime)
        );
      });

      // If there is an overlapping slot, return an error
      if (overlappingSlot) {
        req.flash("error", "The selected slot overlaps with an existing slot");
        return res.redirect("/set-lecturer-availability");
      }

      // Add the new slot to the day's slots array
      daySlots.slots.push(newSlot);
    }

    await lecturer.save();
    logger.logAction("Availability setting", lecturer.name)
    res.redirect("/set-lecturer-availability");
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
exports.bookSlot = async (req, res) => {
  const { lecturerId, slotId } = req.body;

  // Find the lecturer and update their availability
  const lecturer = await Lecturer.findById(lecturerId);
  const slot = lecturer.availability.id(slotId);
  slot.booked = true;
  await lecturer.save();

  res.redirect("/lecturer-availability");
};
