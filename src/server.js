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

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

module.exports = app;
