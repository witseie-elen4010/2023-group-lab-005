const path = require('path') // used later in the exercise
const express = require('express')
const app = express()

app.get('/', function (req, res) {
res.sendFile(path.join(__dirname,'../views','index.html'))
})

app.listen(3000)
console.log('Express server running on port 3000')
