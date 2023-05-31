const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const studentAuthRoutes = require('./routes/studentRouter');
const lecturerAuthRoutes = require('./routes/lecturerRouter');
const studentLogRoutes = require('./routes/logRouter');
const consultationRoutes = require('./routes/consultationRouter');
const adminRoutes = require('./routes/adminRouter'); // Import the admin router
const connectDB = require('./db');
const flash = require('express-flash');
const session = require('express-session');
const studentAuthRoutes = require("./routes/studentRouter");
const lecturerAuthRoutes = require("./routes/lecturerRouter");
const studentLogRoutes = require("./routes/logRouter");
const consultationRoutes = require("./routes/consultationRouter");
const connectDB = require("./db");
const flash = require("express-flash");
const session = require("express-session");
const Agenda = require("agenda"); 
const mailer = require("./controllers/emailController");
const Consultation = require("./models/consultationModel");


app.use('/public/', express.static('./public'));

app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  session({
    secret: 'mysecretkey',
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);
app.use(flash());

connectDB();

app.get('/', function (req, res) {
  res.render('LandingPage');
});

app.use(studentAuthRoutes);
app.use(lecturerAuthRoutes);
app.use(studentLogRoutes);
app.use(consultationRoutes);
app.use(adminRoutes); // Mount the admin router



// Start Agenda
const agenda = new Agenda({
  db: { 
    address: process.env.MONGO_URI,
    collection: "jobs",
  },
});

 // Define the send email job
 agenda.define("send email", async (job) => {
  const recipientEmail = job.attrs.data.recipientEmail;
  const message = job.attrs.data.message;

  try {
    await mailer.sendEmail(recipientEmail, message);
  } catch (err) {
    console.error("Error sending email:", err);
  }
});

// Start agenda process every two hours
agenda.processEvery("2 hours");


// Start agenda and schedule the consultation email job
agenda.start().then(() => {
  console.log("Agenda is running");
  sendConsultationEmails(); // Schedule consultation email job
});

const sendConsultationEmails = async () => {
  try {
    // Get the current day
    const currentDay = new Date().toLocaleDateString("en-US", { weekday: "long" });

    // Find consultations with the same day as the current day
    const consultations = await Consultation.find({ day: currentDay });

    // Iterate over each consultation
    for (const consultation of consultations) {
      const lecturerEmail = consultation.lecturerEmail;
      const attendees = consultation.attendees;
      const message = "Hello, This is a reminder of a meeting at " + consultation.startTime

      // Send email to lecturer
      await mailer.sendEmail(lecturerEmail, message);

      // Send email to attendees
      for (const attendee of attendees) {
        await mailer.sendEmail(attendee, message);
      }
    }
    

  } catch (err) {
    console.error("Error sending emails:", err);
  }
};


app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

module.exports = app;

