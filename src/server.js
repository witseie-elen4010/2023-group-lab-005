const express = require('express');

//This is a library that will allow our program to parse html/ejs content as json objects
const bodyParser = require('body-parser')

const studentAuthRoutes = require('./routes/studentRouter')
const lecturerAuthRoutes = require('./routes/lecturerRouter')

const app = express();
const port = process.env.PORT || 5000;

const connectDB = require('./db')
const flash = require('express-flash')
const session = require('express-session')

//instruct our app to use json bodyu parser 
app.use(bodyParser.json()).use(bodyParser.urlencoded({extended:true}))

app.set('view engine', 'ejs');
app.use('/public/', express.static('./public'))

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use(
  session({
    secret: 'mysecretkey', // a secret key used to sign the session ID cookie
    resave: false, // don't save the session if it wasn't modified
    saveUninitialized: false, // don't create a session until something is stored
    cookie: {
      maxAge: 24 * 60 * 60 * 1000 // the maximum age (in milliseconds) of the session ID cookie
    }
  })
)
app.use(flash())

connectDB()

//  route for index page
app.get('/', function (req, res) {
  res.render('LandingPage')
})

app.use(studentAuthRoutes)
app.use(lecturerAuthRoutes)

// This tells the server to include the student router 
app.use('/',studentAuthRoutes)

// This tells the server to include the lecturer router 
app.use('/',lecturerAuthRoutes)


app.listen(port, () => {
  console.log(`server at http://localhost:${port}`)
})

module.exports = app
