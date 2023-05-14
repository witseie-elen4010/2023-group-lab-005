const express = require('express');

//This is a library that will allow our program to parse html/ejs content as json objects
const bodyParser = require('body-parser')

const studentRouter = require('./routes/studentRouter')

const app = express();
const port = process.env.PORT || 5000;

app.use('/public/', express.static('./public'));

//instruct our app to use json bodyu parser 
app.use(bodyParser.json()).use(bodyParser.urlencoded({extended:true}))

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('LandingPage');
});

// This tells the server to include the student router 
app.use('/',studentRouter)


app.listen(port, () => {
  console.log(`server at http://localhost:${port}`);
});
