# ADR: Using bcrypt.js for Hashing Passwords

Date: 2023-05-28

## Status
Accepted

## Context
When developing an application that involves user authentication, it is essential to ensure the security of user passwords. Storing passwords in plain text is highly insecure and can lead to significant vulnerabilities if the password data is compromised. Therefore, it is crucial to use a robust and industry-standard algorithm for hashing passwords to protect user accounts.

## Decision
We have decided to use bcrypt.js as the library for hashing passwords in our application. bcrypt.js is a widely used and trusted library that provides a secure and computationally expensive algorithm for password hashing. It uses the bcrypt hashing function, which incorporates a salt and multiple rounds of hashing to increase the security of the hashed passwords.

## Consequences
- *Security*: By using bcrypt.js, we enhance the security of user passwords by applying a strong hashing algorithm. This ensures that even if the hashed passwords are exposed, they are computationally difficult to reverse-engineer back to the original passwords.
- *Compatibility*: bcrypt.js is compatible with various programming languages and platforms, making it easy to integrate into our application regardless of the technology stack we are using.
- *Performance*: The computational cost of bcrypt.js can be relatively higher compared to other hashing algorithms. However, since password hashing is typically a one-time operation during user registration or password change, the performance impact is negligible for most practical scenarios.
- *Maintenance*: bcrypt.js is a well-maintained library with active community support. It ensures that any security vulnerabilities or updates to the hashing algorithm are addressed promptly.
- *Integration*: We need to ensure that bcrypt.js is correctly integrated into our application's user authentication system. This involves securely storing and comparing the hashed passwords during login and registration processes.

## Alternatives Considered
1. *bcrypt*: bcrypt is another popular library for password hashing. It is a native module in many programming languages, which provides a direct interface to the bcrypt hashing algorithm. However, in the context of our application, we opted for bcrypt.js because it offers better compatibility across different platforms.
2. *Argon2*: Argon2 is a newer password hashing algorithm that offers increased resistance against various types of attacks, including GPU-based attacks. While Argon2 is a highly secure option, it may not be as widely supported as bcrypt.js across different platforms and programming languages.

## References
- [bcrypt.js GitHub Repository](https://github.com/dcodeIO/bcrypt.js)
- [bcrypt Documentation](https://en.wikipedia.org/wiki/Bcrypt)
- [Argon2](https://en.wikipedia.org/wiki/Argon2)
