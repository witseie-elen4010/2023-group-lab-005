# Code Review Guide

#### All pull requests should pass the following in order to be accepted into production

1. Code style: The code should follow the established coding guidelines and standards. It should be well-formatted and easy to read. Any changes made should not cause issues with the existing codebase.

2. Unit tests: The code should pass all the relevant unit tests. Any new code added should have accompanying unit tests to ensure proper functionality.
   Test coverage: The unit tests should have good coverage and cover all the important functionality. Any new code added should have unit tests that cover all possible use cases.

3. Functionality: Merging the code should not cause any issues with the existing functionality of the application. Any conflicts or issues should be addressed before the merge.

4. Comments: The code should have comments where necessary to explain the reasoning behind certain decisions, any potential issues, or anything else that is not immediately apparent in the code.

5. Maintainability and Extensibility: The code should be maintainable and extensible. It should be easy for other developers to read, understand, and modify as needed.

6. Commits: The commits should be clearly labeled and well-structured. Each commit should address a specific issue or change and should have a clear and concise message.

7. Rebasing: Feature branches should be rebased to main before merging. This ensures that any conflicts are resolved before the merge and makes it easier to merge the code into the main branch.

8. Fulfillment of user story: The pull request should fulfill a single user story or feature. This ensures that each pull request is focused and makes it easier to review and merge the code.
