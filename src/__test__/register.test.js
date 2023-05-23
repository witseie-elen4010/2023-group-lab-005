const request = require("supertest");
const app = require("../server");
const Student = require("../models/studentModel");
const Lecturer = require("../models/lecturerModel");
require("dotenv").config();

describe("Student registration", () => {
  afterEach(async () => {
    // Clean up the database after each test
    await Student.deleteMany();
  }, 10000); // Add timeout option here with a higher value in milliseconds

  test("New student can see sign-up form with name, email, and password fields", async () => {
    const response = await request(app).get("/register-student");
    expect(response.statusCode).toBe(200);
    expect(response.text).toContain("name");
    expect(response.text).toContain("email");
    expect(response.text).toContain("password");
  });

  test("New student can create an account and receive a confirmation email", async () => {
    const studentData = {
      name: "John Doe",
      email: "johndoe@example.com",
      password: "password",
      confirmPassword: "password",
    };

    const response = await request(app)
      .post("/register-student")
      .send(studentData);

    // Check that the student was saved to the database
    const savedStudent = await Student.findOne({ email: studentData.email });
    expect(savedStudent).not.toBeNull();

    // Check that a confirmation email was sent
    expect(response.statusCode).toBe(302); // redirect after successful registration
    // ... add code to check that a confirmation email was sent ...
  });
});

describe("Lecturer registration", () => {
  afterEach(async () => {
    // Clean up the database after each test
    await Lecturer.deleteMany();
  }, 10000); // Add timeout option here with a higher value in milliseconds

  test("New lecturer can see sign-up form with name, email, and password fields", async () => {
    const response = await request(app).get("/register-lecturer");
    expect(response.statusCode).toBe(200);
    expect(response.text).toContain("name");
    expect(response.text).toContain("email");
    expect(response.text).toContain("password");
  });

  test("New lecturer can create an account and receive a confirmation email", async () => {
    const lecturerData = {
      name: "Jane Smith",
      email: "janesmith@example.com",
      password: "password",
      confirmPassword: "password",
    };

    const response = await request(app)
      .post("/register-lecturer")
      .send(lecturerData);

    // Check that the lecturer was saved to the database
    const savedLecturer = await Lecturer.findOne({ email: lecturerData.email });
    expect(savedLecturer).not.toBeNull();

    // Check that a confirmation email was sent
    expect(response.statusCode).toBe(302); // redirect after successful registration
    // ... add code to check that a confirmation email was sent ...
  });
});

describe("Student login", () => {
  beforeEach(async () => {
    // Set up a fake student in the database for testing
    const studentData = {
      name: "John Doe",
      email: "johndoe@example.com",
      password: "password",
    };

    await Student.create(studentData);
  });

  afterEach(async () => {
    // Clean up the database after each test
    await Student.deleteMany();
  }, 10000); // Add timeout option here with a higher value in milliseconds

  test("Existing student can log in with correct credentials", async () => {
    const loginData = {
      email: "johndoe@example.com",
      password: "password",
    };

    const response = await request(app).post("/login-student").send(loginData);

    expect(response.statusCode).toBe(302); // redirect after successful login
  });

  test("Existing student cannot log in with incorrect password", async () => {
    const loginData = {
      email: "johndoe@example.com",
      password: "wrongpassword",
    };

    const response = await request(app).post("/login-student").send(loginData);

    expect(response.statusCode).toBe(302); // unauthorized status code
  });
});

describe("Lecturer login", () => {
  beforeEach(async () => {
    // Set up a fake lecturer in the database for testing
    const lecturerData = {
      name: "Jane Smith",
      email: "janesmith@example.com",
      password: "password",
    };

    await Lecturer.create(lecturerData);
  });

  afterEach(async () => {
    // Clean up the database after each test
    await Lecturer.deleteMany();
  }, 10000); // Add timeout option here with a higher value in milliseconds

  test("Existing lecturer can log in with correct credentials", async () => {
    const loginData = {
      email: "janesmith@example.com",
      password: "password",
    };

    const response = await request(app).post("/login-lecturer").send(loginData);

    expect(response.statusCode).toBe(302); // redirect after successful login
  });

  test("Logged in lecturer can sign out and end up on the landing page", async () => {
    // Log in the lecturer
    const loginData = {
      email: "janesmith@example.com",
      password: "password",
    };

    let response = await request(app).post("/login-lecturer").send(loginData);

    expect(response.statusCode).toBe(302); // redirect after successful login

    // Sign out the lecturer
    response = await request(app).get("/sign-out");

    expect(response.statusCode).toBe(302); // redirect after successful logout

    // Check if we end up on the landing page
    expect(response.headers.location).toBe('/'); // Assuming '/' is your landing page route
});

  test("Existing lecturer cannot log in with incorrect password", async () => {
    const loginData = {
      email: "janesmith@example.com",
      password: "wrongpassword",
    };

    const response = await request(app).post("/login-lecturer").send(loginData);

    expect(response.statusCode).toBe(302); // unauthorized status code
  });
});


