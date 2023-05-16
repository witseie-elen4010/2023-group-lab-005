// Student model
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  }
})

// Define the comparePassword method
studentSchema.methods.comparePassword = async function (candidatePassword) {
  const isMatch = await bcrypt.compare(candidatePassword, this.password)
  return isMatch
}

const Student = mongoose.model('Student', studentSchema)

module.exports = Student
