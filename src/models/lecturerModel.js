const mongoose = require("mongoose");

const lecturerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  availability: [
    {
      day: {
        type: String,
        enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        required: true,
      },
      slots: {
        type: [
          {
            startTime: {
              type: String,
              required: true,
            },
            endTime: {
              type: String,
              required: true,
            },
            maxStudents: {
              type: Number,
              required: true,
            },
          },
        ],
        default: [],
      },
    },
  ],
});

const Lecturer = mongoose.model("Lecturer", lecturerSchema);

module.exports = Lecturer;
