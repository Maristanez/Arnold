---
name: tdd
description: Implement a feature using strict Test-Driven Development with red-green-refactor cycles
user_invocable: true
---

# Test-Driven Development

Implement the requested feature or fix using strict Test-Driven Development. Follow the red-green-refactor loop for every behavior.

## Philosophy

- **Red**: Write a failing test that defines the desired behavior.
- **Green**: Write the minimum code to make the test pass.
- **Refactor**: Clean up the code while keeping all tests green.

### On Mocking
Prefer real implementations over mocks. Only mock at true system boundaries (network, filesystem, external services). If you need a mock to test something, consider whether the design could be improved to make it testable without mocks.

### On Deep Modules
Favor deep modules — modules that provide powerful functionality behind simple interfaces. Many small, shallow modules create complexity through the sheer number of interfaces. Consolidate related functionality into deeper modules with thin interfaces.

## Workflow

1. **Confirm interface changes** — Before writing any code, confirm with the user what interface or behavior changes are needed. Understand the contract the code must fulfill.

2. **Confirm which behaviors to test** — List the specific behaviors that need test coverage and confirm with the user.

3. **Design interfaces for testability** — Ensure the interfaces are designed so behaviors can be tested cleanly without excessive mocking.

4. **Write one test at a time** — For each behavior:
   a. **RED** — Write a single failing test that describes the expected behavior.
   b. Run the test to confirm it fails (and fails for the right reason).
   c. **GREEN** — Write the simplest code to make the test pass.
   d. Run the test to confirm it passes.
   e. **REFACTOR** — Look for refactoring opportunities: duplication, unclear naming, deep module consolidation.
   f. Run all tests to confirm nothing broke.

5. **Repeat** — Continue the red-green-refactor loop until all behaviors are covered.

6. **Final review** — Run the full test suite. Look for any remaining refactoring candidates. Ensure the code is clean and all tests pass.
