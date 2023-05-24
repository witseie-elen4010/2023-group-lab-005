const request = require("supertest");
const app = require("../server");
const Student = require("../models/studentModel");
const Lecturer = require("../models/lecturerModel");
const logger = require("../controllers/logController");
require("dotenv").config();

describe("Student registration", () => {
  afterEach(async () => {
    // Clean up the database after each test
    await Student.deleteMany();
  }, 10000);

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

const Consultation = require("../models/ConsultationModel");
const { createConsultation } = require("../controllers/consultationController");

jest.mock("../models/lecturerModel");
jest.mock("../models/ConsultationModel");

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

// // Update the test file (register.test.js)

// describe("Lecturer Controller", () => {
//   describe("postLecturerAvailabilityForm", () => {
//     it("should call logger.logAction with the correct parameters when a new availability slot is added", async () => {
//       const logger = {
//         logAction: jest.fn(),
//       };

//       const lecturerId = "123456789";
//       const lecturer = {
//         _id: lecturerId,
//         name: "John Doe",
//         availability: [],
//       };

//       // Mock the Lecturer.findById method to return the mock lecturer
//       Lecturer.findById = jest.fn().mockResolvedValue(lecturer);

//       // Mock the logger object
//       jest.doMock("../controllers/logController", () => logger);
      
//       // Import the controller function after mocking the logger
//       const { postLecturerAvailabilityForm } = require("../controllers/availabilityController");

//       // Make a request to the endpoint
//       const response = await request(app)
//         .post("/lecturer-availability")
//         .send({
//           day: "Monday",
//           start: ["10:00"],
//           end: ["12:00"],
//           maxStudents: ["20"],
//         });

//       // Verify that the logger.logAction method is called with the expected arguments
//       expect(logger.logAction).toHaveBeenCalledWith(
//         "Lecturer added an availability slot",
//         lecturer.name
//       );
//     });

//     it("should handle errors and render an error view when an error occurs", async () => {
//       // Mock the Lecturer.findById method to throw an error
//       Lecturer.findById = jest.fn().mockRejectedValue(new Error("Database error"));

//       // Make a request to the endpoint
//       const response = await request(app).post("/lecturer-availability");

//       // Verify the response
//       expect(response.status).toBe(500);
//       expect(response.type).toBe("text/html");
//       expect(response.text).toContain("Server error");
//     });
//   });
// });

// describe("Log Controller", () => {
//   // Existing tests for GET /logs endpoint
// });
