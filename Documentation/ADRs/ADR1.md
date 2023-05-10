# ADR: Use of Model-View-Controller (MVC) Architecture for Consultation Web Application

Date: 2023-05-09

## Status

Accepted

## Context

We are developing a consultation web application that will serve as a platform for scheduling and managing consultations between students and lecturers. To ensure that the code is organized and easy to maintain, we need to choose an appropriate architecture for the application.

## Decision

We will use the Model-View-Controller (MVC) architecture for our consultation web application.

### Explanation

MVC is a design pattern that separates the application logic into three interconnected components: the Model, the View, and the Controller. The Model represents the data and the business logic of the application, the View represents the presentation layer, and the Controller handles the communication between the Model and the View.

By using the MVC architecture, we can achieve the following benefits:

- Separation of Concerns: The MVC architecture helps us to separate the different concerns of the application, making it easier to maintain and modify the code. For example, if we need to change the presentation layer of the application, we can do so without affecting the business logic.

- Reusability: The components in the MVC architecture are loosely coupled, which means that they can be reused in other parts of the application or even in other applications.

- Testability: Since the components are separated, it is easier to test them individually, which helps us to identify and fix bugs more easily.

- Scalability: The MVC architecture makes it easier to scale the application by adding more components or servers.

### Consequences

- There will be an initial overhead in developing the application using the MVC architecture.

- The MVC architecture requires developers to have a good understanding of the design pattern to implement it effectively.

- The MVC architecture may not be suitable for smaller applications that do not have complex business logic.

## References

- https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller
- https://docs.microsoft.com/en-us/aspnet/core/mvc/overview?view=aspnetcore-5.0
