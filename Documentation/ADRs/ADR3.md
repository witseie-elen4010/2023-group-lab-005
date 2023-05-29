# ADR: Use of Node Mailer for Sending Emails
Date: 2023-05-23

## Status
Accepted

## Context
We are developing a consultation web application that serves as a platform for scheduling and managing consultations between students and lecturers. As part of the application's functionality, we need to send emails for various purposes, such as appointment notifications, reminders, and updates.

## Decision
We will use Node Mailer for sending emails in our application.

## Explanation
Node Mailer is a popular and widely-used email sending library for Node.js, providing a simple and convenient way to send emails from server-side applications. The decision to use Node Mailer is based on the following reasons:

Feature-Rich: Node Mailer offers a comprehensive set of features and capabilities that meet our email sending requirements. It supports different email transport methods, including SMTP, sendmail, and more. Additionally, it provides support for email templates, attachments, HTML content, and other essential email functionalities.

Community Support: Node Mailer has a large and active community. This ensures that the library is well-maintained, frequently updated, and has reliable documentation. The active community also provides access to additional resources, plugins, and community-driven solutions to common email sending challenges.

Integration with Node.js: Since our application is built on Node.js, using Node Mailer allows us to leverage the power and flexibility of Node.js for email sending. It provides seamless integration with our existing Node.js codebase, allowing us to send emails efficiently and effectively.

## Consequences
The decision to use Node Mailer for sending emails has the following consequences:

Learning Curve: Developers who are not familiar with Node Mailer may need to invest time in understanding its API and best practices for effective usage. Training or documentation resources may be required to ensure proper implementation.

Development Effort: Depending on the complexity of our email sending requirements, there might be additional development effort involved in setting up and configuring Node Mailer effectively. This includes integrating it into our existing application architecture and implementing the necessary logic for email composition and sending.

Performance Overhead: The performance of the email sending process may be impacted by factors such as network latency and the chosen email transport method. Proper optimization and configuration may be necessary to mitigate any performance issues.

Maintenance: Regular maintenance and updates might be required to keep Node Mailer and its dependencies up to date. This ensures compatibility with newer versions of Node.js and other related libraries, as well as addressing any security vulnerabilities or bug fixes.

## References
Node Mailer: https://nodemailer.com/
npm: Node Mailer package: https://www.npmjs.com/package/nodemailer
GitHub Repository: Node Mailer on GitHub: https://github.com/nodemailer/nodemailer