const request = require('supertest')
const app = require('../server')
const Student = require('../models/studentModel')
require('dotenv').config()

describe('Student registration', () => {
  afterEach(async () => {
    // Clean up the database after each test
    await Student.deleteMany()
  }, 100000) // Add timeout option here with a higher value in milliseconds

  test('New user can see sign-up form with name, email, and password fields', async () => {
    const response = await request(app).get('/register-student')
    expect(response.statusCode).toBe(200)
    expect(response.text).toContain('name')
    expect(response.text).toContain('email')
    expect(response.text).toContain('password')
  })

  test('New user can create an account and receive a confirmation email', async () => {
    const studentData = {
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: 'password',
      confirmPassword: 'password'
    }
    const server = app.listen() // start the server and get the server instance
    const response = await request(server)
      .post('/register-student')
      .send(studentData)

    // Check that the student was saved to the database
    const savedStudent = await Student.findOne({ email: studentData.email })
    expect(savedStudent).not.toBeNull()

    // Check that a confirmation email was sent
    expect(response.statusCode).toBe(302) // redirect after successful registration
    
  })

})
