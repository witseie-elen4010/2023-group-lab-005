const express = require('express');
const studentRouter = require('./routes/studentRouter')

const app = express();
const port = process.env.PORT || 5000;

app.use('/public/', express.static('./public'));

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('LandingPage');
});


// This tells the server to include the student router 
app.use('/',studentRouter)

app.listen(port, () => {
  console.log(`server at http://localhost:${port}`);
});
