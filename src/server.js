const express = require('express')
const app = express()
const port = process.env.PORT || 5000

app.use('/public/', express.static('./public'))

app.set('view engine', 'ejs')

app.get('/', (req, res) => {
  res.render('LandingPage')
})

app.listen(port, () => {
  console.log(`server at http://localhost:${port}`)
})
