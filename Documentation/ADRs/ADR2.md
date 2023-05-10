# ADR: Use of EJS as a Template Engine

Date: 2023-05-09

## Status

Accepted

## Context

We are developing a consultation web application that will serve as a platform for scheduling and managing consultations between students and lecturers. To render dynamic content, we need to choose an appropriate template engine for the application.

## Decision

We will use EJS as the template engine for our consultation web application.

## Explanation

EJS (Embedded JavaScript) is a simple templating language that lets you generate HTML markup with plain JavaScript. It offers the following benefits:

- Simplified Syntax: EJS uses simple and familiar syntax similar to plain HTML and JavaScript, making it easy for developers to get started.

- Dynamic Content: EJS allows you to easily inject dynamic content into your HTML markup using JavaScript, making it easy to render dynamic pages.

- Partials and Layouts: EJS provides support for partials and layouts, which makes it easy to reuse code and build consistent UI elements.
  Active Community: EJS has a large and active community, which means that it is well-maintained, and there are many resources and plugins available.

## Consequences

- There will be a learning curve for developers who are not familiar with EJS.
- EJS may not be suitable for larger applications that require more advanced features and functionality.
- There may be some performance overhead due to the dynamic nature of EJS.
  References

https://ejs.co/
https://www.npmjs.com/package/ejs
https://github.com/mde/ejs