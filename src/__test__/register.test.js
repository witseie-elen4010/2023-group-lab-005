const request = require('supertest')
const app = require('../server')
const Student = require('../models/studentModel')
const Lecturer = require('../models/lecturerModel')
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
    // ... add code to check that a confirmation email was sent ...
  })

})


describe('Student sign-in page', () => {
  test('User cannot sign in with incorrect email or password', async () => {
    const signInData = {
      email: 'wrongemail@example.com',
      password: 'wrongpassword',
    };

    const response = await request(app)
      .post('/login-student')
      .send(signInData);

    expect(response.statusCode).toBe(302); // Expecting a redirect after unsuccessful sign-in
    expect(response.headers.location).toBe('login-student'); // Expecting a redirect back to the login page
  });

  test('Student can sign in with correct email and password', async () => {
    // Create a test student in the database
    const testStudent = new Student({
      name: 'Test User',
      email: 'testuser@example.com',
      password: 'testpassword'
    })

    await testStudent.save()

    const signInData = {
      email: 'testuser@example.com',
      password: 'testpassword'
    }

    const response = await request(app)
      .post('/login-student')
      .send(signInData);

    expect(response.statusCode).toBe(302); // Expecting a redirect after successful sign-in
    expect(response.headers.location).toBe('dashboard-student'); // Expecting a redirect to the dashboard page
    // You can also check for additional things like a successful cookie being set, etc.
  });
})

describe('Lecturer registration', () => {
  afterEach(async () => {
    // Clean up the database after each test
    await Lecturer.deleteMany()
  }, 100000) // Add timeout option here with a higher value in milliseconds

  test('New lecturer can see sign-up form with name, email, and password fields', async () => {
    const response = await request(app).get('/register-lecturer')
    expect(response.statusCode).toBe(200)
    expect(response.text).toContain('name')
    expect(response.text).toContain('email')
    expect(response.text).toContain('password')
  })

  test('New lecturer can create an account and receive a confirmation email', async () => {
    const lecturerData = {
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: 'password',
      confirmPassword: 'password'
    }
    const server = app.listen() // start the server and get the server instance
    const response = await request(server)
      .post('/register-lecturer')
      .send(lecturerData)

    // Check that the student was saved to the database
    const savedLecturer = await Lecturer.findOne({ email: lecturerData.email })
    expect(savedLecturer).not.toBeNull()

    // Check that a confirmation email was sent
    expect(response.statusCode).toBe(302) // redirect after successful registration
    // ... add code to check that a confirmation email was sent ...
  })

})

describe('Lecturer sign-in page', () => {
  test('User cannot sign in with incorrect email or password', async () => {
    const signInData = {
      email: 'wrongemail@example.com',
      password: 'wrongpassword',
    };

    const response = await request(app)
      .post('/login-lecturer')
      .send(signInData);

    expect(response.statusCode).toBe(302); // Expecting a redirect after unsuccessful sign-in
    expect(response.headers.location).toBe('/login-lecturer'); // Expecting a redirect back to the login page
  });

  test('Lecturer can sign in with correct email and password', async () => {
    // Create a test lecturer in the database
    const testLecturer = new Lecturer({
      name: 'Test User',
      email: 'testuser@example.com',
      password: 'testpassword'
    })

    await testLecturer.save()

    const signInData = {
      email: 'testuser@example.com',
      password: 'testpassword'
    }

    const response = await request(app)
      .post('/login-lecturer')
      .send(signInData);

    expect(response.statusCode).toBe(302); // Expecting a redirect after successful sign-in
    expect(response.headers.location).toBe('dashboard-lecturer'); // Expecting a redirect to the dashboard page
    // You can also check for additional things like a successful cookie being set, etc.
  });
})
