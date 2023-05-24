const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const studentAuthRoutes = require("./routes/studentRouter");
const lecturerAuthRoutes = require("./routes/lecturerRouter");
const studentLogRoutes = require("./routes/logRouter");
const consultationRoutes = require("./routes/consultationRouter");
const connectDB = require("./db");
const flash = require("express-flash");
const session = require("express-session");

app.use("/public/", express.static("./public"));

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  session({
    secret: "mysecretkey", // a secret key used to sign the session ID cookie
    resave: false, // don't save the session if it wasn't modified
    saveUninitialized: false, // don't create a session until something is stored
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // the maximum age (in milliseconds) of the session ID cookie
    },
  })
);
app.use(flash());

connectDB();

//  route for index page
app.get("/", function (req, res) {
  res.render("LandingPage");
});

app.get("/dashboard", function (req, res) {
  res.render("studentDashboard");
});
app.use(studentAuthRoutes);
app.use(lecturerAuthRoutes);
app.use(studentLogRoutes);
app.use(consultationRoutes);
app.listen(port, () => {
  console.log(`server at http://localhost:${port}`);
});

module.exports = app;
