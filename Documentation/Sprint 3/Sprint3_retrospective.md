# Sprint Three Retrospective - Project Completion
 
## Executive Summary
 
Sprint Three marked our final sprint and culminated in an impressive success. Our team tackled and accomplished a total of 11 user stories, including 2 tied to an epic, which facilitated the project's completion as a fully functional website primed for deployment. The sprint saw the successful integration of test coverage using Coveralls and the implementation of end-to-end testing with Playwright. Despite the complexities and truncated timeline, our team made notable strides, demonstrating exceptional collaboration and work ethic.
Initially, 9 user stories were allocated for this sprint, and 2 were added during the course of sprint 3 after the team members had a discussion and added a new feature, making a total of 11 stories. We managed to complete all stories. Our estimated velocity was 41/3 (story points of stories delivered/ total number of sprints) which is 13.7.
 
## Achievements
 
### User Stories
 
We successfully completed all 11 user stories assigned for this sprint, evidencing our team's commitment to delivering on our promises and meeting project requirements. Two of these stories were tied to an epic, contributing to the broader progress of the overall project.
 
### Test Coverage and End-to-End Testing
 
- **Test Coverage**: Test coverage was introduced using Coveralls, which ensured that our code was meticulously tested, thereby reducing the risk of regressions.
- **End-to-End Testing**: With the integration of Playwright, we carried out end-to-end testing. This strategy validated the application's functionality from a user's perspective, boosting overall quality assurance.
 
### Key Features Implemented
 
- **User Signup and Login**: Both lecturers and students can now create accounts, sign in, and access their respective dashboards.
- **Admin Activity Log**: Administrators can view the activity log of users, which provides insights and aids in monitoring and accountability.
- **Lecturer Availability Management**: Lecturers can specify their availability for consultations, enabling students to book available slots.
- **Consultation Booking and Management**: Students can book consultation slots with available lecturers, and both parties can manage the booked sessions.
- **Flexible Session Editing**: Lecturers can edit the duration and date of booked sessions, allowing for adaptability and scheduling adjustments.
- **Cancellation Functionality**: Students can cancel their booked consultations, while lecturers can cancel entire slots, in both cases removing all students and notifying them accordingly.
- **Notification System**: Students and lecturers receive notifications regarding changes, cancellations, and reminders related to their booked consultations.
 
### Additional Functionality Implemented From Other Sprints
 
- **Student Consultation Creation**: Students can create new consultation events with specific lecturers, providing the event title, time, and the organizer's name.
- **Student Consultations Dashboard**: A consultation dashboard was developed for students, displaying all upcoming consultations scheduled with lecturers. Students can join an upcoming consultation if slots are available. When a consultation is canceled by the organizer, it is reflected on both the student and lecturer dashboards.
- **Lecturer Availability Management**: Lecturers have an interface to specify their availability during the work week. They can set the maximum number of students they are willing to meet during a consultation, the duration of each consultation, and the maximum number of consultation events that can be booked in a day.
- **Lecturer Dashboard**: A lecturer's dashboard provides an overview of all upcoming consultations, including the event title, date and time, organizer's name, and names of attending students. Lecturers can cancel upcoming consultations, and the cancellation is reflected on the student dashboard.
- **Business Rule Enforcement**: Our application ensures the enforcement of various business rules, including:
  - No consultations are booked outside of the lecturer's available times.
  - Avoidance of overlapping consultations.
  - Enforcement of the maximum number of students per consultation.
  - Limiting the maximum number of consultations per day.
- **Action Log**: The application includes a log accessible from the website, capturing all actions performed by students and lecturers. Each log entry includes the date and time of the action, the nature of the action, and identifies the initiator of the action.

 
## Successes
 
- **Completion of the Project**: The culmination of our team's work is a fully functional and ready-to-deploy website. This achievement demonstrates the capabilities and effort of the team.
- **Effective Collaboration**: Team members were supportive of each other throughout the project. If someone encountered a roadblock, there was always another member ready to assist.
- **Test Coverage and Quality Assurance**: With Coveralls for test coverage and Playwright for end-to-end testing, we ensured the application's reliability and quality.
 
## Areas for Improvement
 
- **Documentation**: While we concentrated on feature development, we realize the need for more comprehensive documentation to facilitate future development and maintenance efforts.
- **Refactoring and Code Quality**: As the project evolved, some areas of the codebase would benefit from refactoring to improve readability, maintainability, and adherence to coding standards. In future projects, a systematic approach towards this can significantly improve code quality.
- **Change Management**: The process of integrating new user stories mid-sprint needs to be streamlined for smoother transitions and integration into the work plan.
 
## Conclusion
 
Sprint Three brought our project to a successful completion. Our application now offers a comprehensive suite of functionalities, enabling students and lecturers to manage consultations effectively. The experiences and lessons drawn from this sprint will serve as invaluable guides for our future projects. Our team's dedication throughout the project has yielded a product that meets the core requirements and offers comprehensive functionality. We are proud of our accomplishments, and we are eager to take on future challenges with the same vigor.
 
---
