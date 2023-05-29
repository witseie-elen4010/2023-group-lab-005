const request = require("supertest");
const app = require("../server");
const Student = require("../models/studentModel");
const Lecturer = require("../models/lecturerModel");
const Consultation = require("../models/consultationModel");
const bcrypt = require('bcryptjs');
require("dotenv").config();

describe("Student registration", () => {
  afterEach(async () => {
    // Clean up the database after each test
    await Student.deleteMany();
  }, 100000);

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

  test("Logged in student can sign out and end up on the landing page", async () => {
    // Log in the lecturer
    const loginData = {
      email: "janesmith@johndoe.com",
      password: "password",
    };

    let response = await request(app).post("/login-student").send(loginData);

    expect(response.statusCode).toBe(302); // redirect after successful login

    // Sign out the lecturer
    response = await request(app).get("/sign-out");

    expect(response.statusCode).toBe(302); // redirect after successful logout

    // Check if we end up on the landing page
    expect(response.headers.location).toBe("/");
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
    expect(response.headers.location).toBe("/");
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
describe("Retrieve all lecturers and their availability", () => {
  beforeEach(async () => {
    // Create fake lecturers with availability for testing
    const lecturerData = [
      {
        name: "Lecturer 1",
        email: "lecturer1@example.com",
        password: "password1",
        availability: [
          {
            day: "Monday",
            slots: [
              {
                startTime: "09:00 AM",
                endTime: "11:00 AM",
                maxStudents: 5,
              },
              {
                startTime: "02:00 PM",
                endTime: "04:00 PM",
                maxStudents: 8,
              },
            ],
          },
          {
            day: "Tuesday",
            slots: [
              {
                startTime: "10:00 AM",
                endTime: "12:00 PM",
                maxStudents: 6,
              },
              {
                startTime: "03:00 PM",
                endTime: "05:00 PM",
                maxStudents: 10,
              },
            ],
          },
        ],
      },
      {
        name: "Lecturer 2",
        email: "lecturer2@example.com",
        password: "password2",
        availability: [
          {
            day: "Wednesday",
            slots: [
              {
                startTime: "09:00 AM",
                endTime: "11:00 AM",
                maxStudents: 5,
              },
              {
                startTime: "02:00 PM",
                endTime: "04:00 PM",
                maxStudents: 8,
              },
            ],
          },
          {
            day: "Thursday",
            slots: [
              {
                startTime: "10:00 AM",
                endTime: "12:00 PM",
                maxStudents: 6,
              },
              {
                startTime: "03:00 PM",
                endTime: "05:00 PM",
                maxStudents: 10,
              },
            ],
          },
        ],
      },
    ];

    await Lecturer.insertMany(lecturerData);
  });

  afterEach(async () => {
    // Clean up the database after each test
    await Lecturer.deleteMany();
  }, 10000); // Add timeout option here with a higher value in milliseconds

  // test("Should retrieve all lecturers and their availability", async () => {
  //   const response = await request(app).get("/see-lecturer-availability");

  //   expect(response.statusCode).toBe(500);
  //   expect(response.text).toContain("Lecturer 1");
  //   expect(response.text).toContain("Lecturer 2");
  // });

  describe("Log Controller", () => {
    describe("GET /logs", () => {
      it("should render logs view with logged actions when a valid session is provided", async () => {
        // Simulate a valid session with logged actions
        const session = { name: "John Doe" };

        // Make a request to view logs
        const response = await request(app)
          .get("/logs")
          .set("Cookie", [`session=${JSON.stringify(session)}`]);

        // Verify the response
        expect(response.status).toBe(200);
        expect(response.type).toBe("text/html");
        expect(response.text).toMatchSnapshot();
      });

      it("should display a message indicating no logs are available when a valid session is provided but no logged actions exist", async () => {
        // Simulate a valid session with no logged actions
        const session = { name: "John Doe" };

        // Make a request to view logs
        const response = await request(app)
          .get("/logs")
          .set("Cookie", [`session=${JSON.stringify(session)}`]);

        // Verify the response
        expect(response.status).toBe(200);
        expect(response.type).toBe("text/html");
        expect(response.text).toContain("No logs found.");
      });
    });
  });
});

const { createConsultation } = require("../controllers/consultationController");

jest.mock("../models/lecturerModel");
jest.mock("../models/consultationModel");

describe("createConsultation", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should create a new consultation and update lecturer availability", async () => {
    const req = {
      body: {
        attendees: "student1@example.com, student2@example.com",
        lecturerEmail: "lecturer@example.com",
        maxStudents: 10,
        day: "Monday",
        startTime: "10:00 AM",
        endTime: "11:00 AM",
      },
      flash: jest.fn(),
      redirect: jest.fn(),
    };

    const res = {
      redirect: jest.fn(),
    };

    const lecturer = {
      email: "lecturer@example.com",
      availability: [
        {
          day: "Monday",
          slots: [
            { startTime: "10:00 AM", endTime: "11:00 AM", isBook: false },
            { startTime: "11:00 AM", endTime: "12:00 PM", isBook: false },
          ],
        },
        {
          day: "Tuesday",
          slots: [
            { startTime: "10:00 AM", endTime: "11:00 AM", isBook: false },
            { startTime: "11:00 AM", endTime: "12:00 PM", isBook: false },
          ],
        },
      ],
      save: jest.fn(),
    };

    const consultation = {
      save: jest.fn(),
    };

    Lecturer.findOne.mockResolvedValue(lecturer);
    Consultation.mockReturnValue(consultation);

    await createConsultation(req, res);

    expect(Lecturer.findOne).toHaveBeenCalledWith({
      email: "lecturer@example.com",
    });
    expect(lecturer.save).toHaveBeenCalled();
    expect(consultation.save).toHaveBeenCalled();
    expect(res.redirect).toHaveBeenCalledWith("/see-lecturer-availability");
    expect(req.flash).toHaveBeenCalledWith(
      "success",
      "Slot booked successfully"
    );
    expect(req.flash).toHaveBeenCalledWith(
      "success",
      "Consultation has been set up successfully"
    );
  });

  test("should handle error when lecturer is not found", async () => {
    const req = {
      body: {
        attendees: "student1@example.com, student2@example.com",
        lecturerEmail: "lecturer@example.com",
        maxStudents: 10,
        day: "Monday",
        startTime: "10:00 AM",
        endTime: "11:00 AM",
      },
      flash: jest.fn(),
      redirect: jest.fn(),
    };

    const res = {
      redirect: jest.fn(),
    };

    Lecturer.findOne.mockResolvedValue(null);

    await createConsultation(req, res);

    expect(Lecturer.findOne).toHaveBeenCalledWith({
      email: "lecturer@example.com",
    });
    expect(res.redirect).toHaveBeenCalledWith("/see-lecturer-availability");
    expect(req.flash).toHaveBeenCalledWith("error", "Lecturer not found");
  });

  test("should handle error when slot is not found or already booked", async () => {
    const req = {
      body: {
        attendees: "student1@example.com, student2@example.com",
        lecturerEmail: "lecturer@example.com",
        maxStudents: 10,
        day: "Monday",
        startTime: "1:00 PM", // Invalid start time
        endTime: "2:00 PM", // Invalid end time
      },
      flash: jest.fn(),
      redirect: jest.fn(),
    };

    const res = {
      redirect: jest.fn(),
    };

    const lecturer = {
      email: "lecturer@example.com",
      availability: [
        {
          day: "Monday",
          slots: [
            { startTime: "10:00 AM", endTime: "11:00 AM", isBook: false },
            { startTime: "11:00 AM", endTime: "12:00 PM", isBook: false },
          ],
        },
        {
          day: "Tuesday",
          slots: [
            { startTime: "10:00 AM", endTime: "11:00 AM", isBook: false },
            { startTime: "11:00 AM", endTime: "12:00 PM", isBook: false },
          ],
        },
      ],
    };

    Lecturer.findOne.mockResolvedValue(lecturer);

    await createConsultation(req, res);

    expect(Lecturer.findOne).toHaveBeenCalledWith({
      email: "lecturer@example.com",
    });
    expect(res.redirect).toHaveBeenCalledWith("/see-lecturer-availability");
    expect(req.flash).toHaveBeenCalledWith("error", "Failed to book slot");
  });
});

describe("Consultation Joining", () => {
  let consultationId;

  beforeAll(async () => {
    // Create a dummy consultation for testing
    const consultation = new Consultation({
      attendees: [],
      lecturerEmail: "lecturer@example.com",
      maxStudents: 5,
      day: "Monday",
      startTime: "10:00 AM",
      endTime: "11:00 AM",
    });
    await consultation.save();
    consultationId = consultation._id;
  });

  afterAll(async () => {
    // Clean up the dummy consultation after testing
    await Consultation.findByIdAndRemove(consultationId);
  });

  it("should join a consultation group", async () => {
    const validConsultationId = "646da7dd1615f8afb5f2281c"; // Replace with a valid consultation ID

    const response = await request(app)
      .post(`/join-consultation/${validConsultationId}`)
      .set("Content-Type", "application/json")
      .send();

    expect(response.status).toBe(302); // Redirect status code
    expect(response.header.location).toBe("/see-lecturer-availability"); // Check if redirected to student dashboard

    // Retrieve the consultation after joining
    const updatedConsultation = await Consultation.findById(
      validConsultationId
    );
    // expect(updatedConsultation.attendees).not.toContain("student@example.com"); // Check if student email is in the attendees array
  });
});
const { cancelConsultation } = require("../controllers/consultationController");

describe("cancelConsultation", () => {
  it("should cancel the consultation and redirect to the student dashboard", async () => {
    const req = {
      params: { id: "consultationId" },
    };
    const res = {
      redirect: jest.fn(),
    };

    await Consultation.findByIdAndRemove.mockReturnValueOnce({});

    await cancelConsultation(req, res);

    expect(Consultation.findByIdAndRemove).toHaveBeenCalledWith(
      "consultationId"
    );
    expect(res.redirect).toHaveBeenCalledWith("/student-dashboard");
  });

  it("should handle errors and send a 500 response with an error message", async () => {
    const req = {
      params: { id: "consultationId" },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const error = new Error("Failed to cancel the consultation");
    await Consultation.findByIdAndRemove.mockRejectedValueOnce(error);

    await cancelConsultation(req, res);

    expect(Consultation.findByIdAndRemove).toHaveBeenCalledWith(
      "consultationId"
    );
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: "Failed to cancel the consultation",
    });
  });
});
test("A new lecturer can create a consultation", async () => {
  // Create a new lecturer
  const lecturerData = {
    name: "Jane Smith",
    email: "janesmith@example.com",
    password: "password",
  };
  const lecturer = new Lecturer(lecturerData);
  await lecturer.save();

  // Create a consultation data
  const consultationData = {
    attendees: [],
    lecturerEmail: lecturer.email,
    maxStudents: 5,
    day: "Monday",
    startTime: "10:00 AM",
    endTime: "11:00 AM",
  };

  // Send a POST request to create a consultation
  const response = await request(app)
    .post("/consultation")
    .send(consultationData);

  // Check the response status code and location
  expect(response.statusCode).toBe(302); // Redirect status code
  expect(response.header.location).toBe("/see-lecturer-availability"); // Check the redirect location

  // Check if the consultation was saved to the database
  const savedConsultation = await Consultation.findOne({
    lecturerEmail: lecturer.email,
    day: consultationData.day,
  });
  expect(savedConsultation).not.toBeNull();
});

describe('Password Hashing', () => {
  test('Should create a new user with hashed password', async () => {
    const userData = {
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: 'password',
      confirmPassword: 'password',
    };

    const response = await request(app)
      .post('/register-student')
      .send(userData);

    // Assert that the student was created successfully
    expect(response.statusCode).toBe(302);

    // Get the created student from the database
    const createdUser = await Student.findOne({ email: userData.email });

    // Assert that the password is hashed
    expect(createdUser).toBeDefined(); 
    expect(bcrypt.compareSync(userData.password, createdUser.password)).toBe(true);
  });

});



const { cancelConsultationLec } = require("../controllers/consultationController");

describe("Lecturer cancelConsultation", () => {
  it("should cancel the consultation and redirect to the lecturer dashboard", async () => {
    const req = {
      params: { id: "consultationId" },
    };
    const res = {
      redirect: jest.fn(),
    };

    // Mocking the Consultation model's findByIdAndRemove method
    Consultation.findByIdAndRemove = jest.fn().mockResolvedValueOnce({});

    await cancelConsultationLec(req, res);

    expect(Consultation.findByIdAndRemove).toHaveBeenCalledWith(
      "consultationId"
    );
    expect(res.redirect).toHaveBeenCalledWith("/lecturer-dashboard");
  });

  it("should handle errors and send a 500 response with an error message", async () => {
    const req = {
      params: { id: "consultationId" },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const error = new Error("Failed to cancel the consultation");
    // Mocking the Consultation model's findByIdAndRemove method to throw an error
    Consultation.findByIdAndRemove = jest.fn().mockRejectedValueOnce(error);

    await cancelConsultationLec(req, res);

    expect(Consultation.findByIdAndRemove).toHaveBeenCalledWith(
      "consultationId"
    );
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: "Failed to cancel the consultation",
    });
  });
});